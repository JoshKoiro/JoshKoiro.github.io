# joshkoiro.github.io

My personal site: **https://joshkoiro.github.io**. A single page that points to my projects,
experience and the places to find me. Same flat, minimal style as the
[typewriter collection](https://joshkoiro.github.io/typewriters/).

## Editing the content

All the words live in `_data/`. You never need to touch the HTML to update the site.

| File | What it controls |
|------|------------------|
| `_data/profile.yml` | Name, role line, the big opening statement, the About paragraphs, the signature |
| `_data/projects.yml` | The Projects list, in order. `show: false` hides an entry without deleting it. |
| `_data/experience.yml` | Jobs and education, newest first |
| `_data/skills.yml` | Skill groups |
| `_data/links.yml` | GitHub, LinkedIn, Medium... `header: true` also puts it in the footer bar |
| `_data/fonts.yml` | Typography (same file format as the typewriter site) |

Text fields accept Markdown: `**bold**`, `*italic*`, `[link text](https://...)`.
Long text uses `>-`, which lets it run over several lines in the file:

```yaml
description: >-
  This can wrap over
  as many lines as you like.
```

## Commands

Requires Node.js 20.9+ and Ruby (same setup as the typewriter repo).

| Command | What it does |
|---------|--------------|
| `npm run setup` | Installs everything (run once after cloning) |
| `npm run serve` | Preview at http://localhost:4000 with live reload |
| `npm run build` | Builds into `_site/` |
| `npm run check` | Checks the data, then builds. Run before publishing. |
| `npm run deploy` | Runs `check`, then `git push` if it passes. **Commit first.** |

`check` stops a deploy when something would break or look wrong on the live site: a YAML
mistake, a project or link with no URL, a missing signature image, or a folder that would
hide one of your project sites. It only warns about leftover TODOs, blank experience periods
and uncommitted changes.

Publishing:

```
git add .
git commit -m "Update projects"
npm run deploy
```

GitHub Pages rebuilds the live site 1–2 minutes after each push to `main`.

## Look and feel

- **Fonts:** `_data/fonts.yml`
- **Colours, sizes, letter spacing, layout widths:** the variables at the top of `assets/css/style.css`
- **Light/dark mode:** follows the visitor's system until they click the toggle
- **Signature:** `assets/img/signature.png`, black on transparent. Dark mode inverts it to white.
  Remove the `signature:` line in `profile.yml` to hide it.

## Printed résumé

The page doubles as a one-page résumé. Click **Print résumé** in the header (or File > Print),
then **Save as PDF**. The print version:

- uses the name and contact line as a masthead, with the opening statement as a summary
- puts Experience first, then Projects (with their URLs written out), then Skills
- leaves out About, Elsewhere, the signature, the navigation and the colours
- prints in light mode even when the site is in dark mode

Settings in `_data/profile.yml`:
- `print_contact`: extra lines under your name, on paper only (a city, an email...). The
  file is public on GitHub, so only put things there you're fine being public.
- `print_about: true` includes the About section.

To fine-tune it, edit the `@media print` block at the bottom of `assets/css/style.css`.
Keep it to one page: preview it in the print dialog after big content changes.

## How this relates to the other repos

GitHub serves this repo at the root (`joshkoiro.github.io`), and each project repo with Pages
turned on at its own sub-path (`joshkoiro.github.io/typewriters/`). So **never create a folder
here with the same name as a project repo** (for example `typewriters/`), or it will shadow
that project's site.
