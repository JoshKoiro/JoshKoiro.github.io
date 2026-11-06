#!/usr/bin/env node
/**
 * Pre-publish check for the personal site. Part of `npm run check` and `npm run deploy`.
 *
 * FAILS (stops the deploy) when:
 *   - a _data file can't be read (usually a YAML indentation or quoting mistake)
 *   - the name or opening statement is missing
 *   - a visible project or link has no URL to point at
 *   - the signature or an illustration image is set but the file is missing
 *   - a folder here would hide one of your project sites (e.g. a typewriters/ folder
 *     would replace joshkoiro.github.io/typewriters/)
 *
 * WARNS (doesn't stop anything) about:
 *   - TODO notes and blank experience periods still in the data
 *   - uncommitted changes, which `git push` won't publish
 */
import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [], warnings = [];
const exists = p => access(path.join(root, p)).then(() => true, () => false);

async function load(name) {
  const file = `_data/${name}.yml`;
  try {
    const text = await readFile(path.join(root, file), 'utf8');
    if (/\bTODO\b/.test(text)) warnings.push(`${file} still contains a TODO note`);
    return YAML.parse(text);
  } catch (e) {
    errors.push(`${file} could not be read: ${e.message.split('\n')[0]}`);
    return null;
  }
}

const config = YAML.parse(await readFile(path.join(root, '_config.yml'), 'utf8'));
const siteUrl = (config.url || '').replace(/\/$/, '');
const profile = await load('profile');
const projects = await load('projects');
const experience = await load('experience');
const links = await load('links');
await load('skills');

// ---------- Profile ----------
if (profile) {
  if (!profile.name) errors.push('profile.yml: name is empty');
  if (!profile.intro) errors.push('profile.yml: intro (the opening statement) is empty');
  for (const key of ['signature', 'illustration', 'illustration_dark']) {
    if (profile[key] && !(await exists(profile[key].replace(/^\//, '')))) {
      errors.push(`profile.yml: ${key} image not found at ${profile[key]}`);
    }
  }
}

// ---------- Projects ----------
const visible = (projects || []).filter(p => p.show);
for (const p of visible) {
  const urls = (p.links || []).map(l => l.url).filter(Boolean);
  if (!urls.length) errors.push(`projects.yml: "${p.name}" is shown but has no link URL (add one, or set show: false)`);
  if (!p.description) warnings.push(`projects.yml: "${p.name}" has no description`);
}
if (projects && !visible.length) warnings.push('projects.yml: no projects are shown');

// Folders that would shadow project sites served at joshkoiro.github.io/<repo>/
const subPaths = new Set();
for (const p of projects || []) {
  for (const l of p.links || []) {
    if (siteUrl && l.url && l.url.startsWith(siteUrl + '/')) {
      const first = l.url.slice(siteUrl.length + 1).split('/')[0];
      if (first) subPaths.add(first);
    }
  }
}
for (const dir of subPaths) {
  if (await exists(dir)) errors.push(`a "${dir}/" folder here would replace your project site at ${siteUrl}/${dir}/. Rename or remove it.`);
}

// ---------- Experience ----------
for (const e of experience || []) {
  if (!e.period) warnings.push(`experience.yml: "${e.role}" has no period`);
}

// ---------- Links ----------
for (const l of (links || []).filter(l => l.show)) {
  if (!l.url) errors.push(`links.yml: "${l.label}" is shown but has no URL`);
}

// ---------- Git ----------
try {
  const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trimEnd();
  if (dirty) warnings.push(`uncommitted changes (they won't be published until you commit):\n      ${dirty.split('\n').join('\n      ')}`);
} catch {}

// ---------- Report ----------
warnings.forEach(w => console.log(`  WARN  ${w}`));
errors.forEach(e => console.log(`  FAIL  ${e}`));
console.log(`\n${errors.length} problem(s), ${warnings.length} warning(s).`);
if (errors.length) {
  console.log('Fix the problems above before publishing.');
  process.exit(1);
}
