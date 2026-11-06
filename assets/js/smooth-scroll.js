// Smooth, gliding scroll for mouse wheels (instead of the notched jumps), using Lenis
// (assets/lib/lenis). Trackpads and touch screens keep their own native feel, and
// the nav links (#projects, #about...) glide to their section.
//
// Not used when the visitor's system asks for reduced motion (Windows: Settings >
// Accessibility > Visual effects > Animation effects), since a gliding scroll is
// exactly the kind of motion that setting is meant to avoid.
(function () {
  // true: no smooth scrolling for visitors who ask their system for reduced motion (recommended).
  // false: smooth scrolling for everyone, regardless of that setting.
  const RESPECT_REDUCED_MOTION = true;

  if (typeof Lenis === 'undefined') return;                                   // library didn't load
  if (RESPECT_REDUCED_MOTION && document.documentElement.classList.contains('reduce-motion')) return;

  // Tuning:
  //   lerp: how quickly the page catches up to the wheel, from 0 to 1. Lower is
  //         smoother and floatier, higher is snappier. 0.1 is Lenis's default.
  //   wheelMultiplier: distance per wheel notch (1 = normal).
  new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    anchors: { offset: -24 },   // stop a little above each section when using the nav links
    autoRaf: true,
  });
})();
