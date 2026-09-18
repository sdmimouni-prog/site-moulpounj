// One update per animation frame; no pointer animation on touch or reduced motion.
const motionAllowed = matchMedia(
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
);
document
  .querySelectorAll<HTMLElement>('.category-card, .product-card')
  .forEach((card) => {
    let frame = 0;
    let bounds: DOMRect | undefined;
    let x = 0.5,
      y = 0.5;
    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      bounds = undefined;
      card.classList.remove('is-exploring');
      [
        '--card-rx',
        '--card-ry',
        '--photo-x',
        '--photo-y',
        '--light-x',
        '--light-y',
      ].forEach((property) => card.style.removeProperty(property));
    }
    card.addEventListener('pointerenter', (event) => {
      if (!motionAllowed.matches || event.pointerType !== 'mouse') return;
      bounds = card.getBoundingClientRect();
      card.classList.add('is-exploring');
    });
    card.addEventListener('pointermove', (event) => {
      if (!bounds || !motionAllowed.matches) return;
      x = Math.max(
        0,
        Math.min(1, (event.clientX - bounds.left) / bounds.width),
      );
      y = Math.max(
        0,
        Math.min(1, (event.clientY - bounds.top) / bounds.height),
      );
      if (frame) return;
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--card-rx', `${(0.5 - y) * 5}deg`);
        card.style.setProperty('--card-ry', `${(x - 0.5) * 6}deg`);
        card.style.setProperty('--photo-x', `${(x - 0.5) * 9}px`);
        card.style.setProperty('--photo-y', `${(y - 0.5) * 7}px`);
        card.style.setProperty('--light-x', `${x * 100}%`);
        card.style.setProperty('--light-y', `${y * 100}%`);
        frame = 0;
      });
    });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    motionAllowed.addEventListener('change', reset);
    window.addEventListener('blur', reset);
  });

export {};
