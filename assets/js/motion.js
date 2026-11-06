// Subtle scroll animations: each section's rule draws in from the left, then its items
// fade up one after another. (The page-load animation of the opening statement and the
// illustration is pure CSS; see the MOTION section of style.css.)
//
// The "motion" class on <html> (set in the page head) switches the hidden starting states
// on. If the visitor's system asks for reduced motion, "reduce-motion" is added too and
// the CSS turns everything into simple fades. Only this script marks section items to be
// animated, so if it fails to load, nothing in the sections is hidden.
(function () {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;

  const STAGGER = 70;      // ms between items in the same section
  const MAX_STAGGER = 6;   // after this many items, the rest come in together

  const reveal = (el, delay) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${delay}ms`);
  };

  // ---------- Sections ----------
  const blocks = Array.from(document.querySelectorAll('.block'));
  blocks.forEach(block => {
    const items = block.querySelectorAll(
      '.block-label, .project, .entry, .skill-group, .elsewhere li, .prose > *'
    );
    items.forEach((el, i) => reveal(el, 150 + Math.min(i, MAX_STAGGER) * STAGGER));
  });

  // Elements that are visible get the "in" class, which plays their transition
  const show = el => {
    el.classList.add('in');
    el.querySelectorAll('.reveal').forEach(r => r.classList.add('in'));
  };

  if (!('IntersectionObserver' in window)) {
    blocks.forEach(show);
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        show(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  blocks.forEach(b => observer.observe(b));

  // Before printing, show everything that hasn't animated in yet
  window.addEventListener('beforeprint', () => blocks.forEach(show));
})();
