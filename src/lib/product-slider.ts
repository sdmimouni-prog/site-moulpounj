const track = document.querySelector<HTMLElement>('#product-track')!;
const controls = document.querySelector<HTMLElement>(
  '.product-slider-controls',
)!;
const pause = document.querySelector<HTMLButtonElement>(
  '[data-product-pause]',
)!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches,
  hovered = false,
  focused = false,
  visible = false;
let timer: ReturnType<typeof setInterval> | undefined;
function metrics() {
  const cards = [
    ...track.querySelectorAll<HTMLElement>('.product-card:not([hidden])'),
  ];
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step =
    (cards[0]?.getBoundingClientRect().width || track.clientWidth) + gap;
  const shown = Math.max(1, Math.round((track.clientWidth + gap) / step));
  return {
    total: cards.length,
    step,
    shown,
    index: Math.round(track.scrollLeft / step),
    max: Math.max(0, cards.length - shown),
  };
}
function update() {
  const { total, index, shown, max } = metrics();
  controls.hidden = max === 0;
  document.querySelector('[data-product-position]')!.textContent = total
    ? `${index + 1}–${Math.min(total, index + shown)} / ${total}`
    : '0 / 0';
}
function move(direction: number) {
  const { index, max, step } = metrics();
  const next =
    direction > 0
      ? index >= max
        ? 0
        : index + 1
      : index <= 0
        ? max
        : index - 1;
  track.scrollTo({
    left: next * step,
    behavior: reduced.matches ? 'instant' : 'smooth',
  });
}
function schedule() {
  clearInterval(timer);
  if (
    !paused &&
    !reduced.matches &&
    !hovered &&
    !focused &&
    visible &&
    !document.hidden &&
    metrics().max > 0
  )
    timer = setInterval(() => move(1), 3000);
}
function renderPause() {
  pause.disabled = reduced.matches;
  pause.setAttribute('aria-pressed', String(paused));
  pause.setAttribute(
    'aria-label',
    reduced.matches ? 'Lecture automatique désactivée : animations réduites' : paused ? 'Reprendre les produits' : 'Mettre les produits en pause',
  );
  pause.querySelector('i')!.className = paused ? 'ph ph-play' : 'ph ph-pause';
}
pause.addEventListener('click', () => {
  paused = !paused;
  renderPause();
  schedule();
});
document.querySelector('[data-product-prev]')!.addEventListener('click', () => {
  move(-1);
  schedule();
});
document.querySelector('[data-product-next]')!.addEventListener('click', () => {
  move(1);
  schedule();
});
track.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    move(e.key === 'ArrowRight' ? 1 : -1);
  }
});
const region = track.closest('.products')!;
region.addEventListener('mouseenter', () => {
  hovered = true;
  schedule();
});
region.addEventListener('mouseleave', () => {
  hovered = false;
  schedule();
});
region.addEventListener('focusin', () => {
  focused = true;
  schedule();
});
region.addEventListener('focusout', () =>
  setTimeout(() => {
    focused = region.contains(document.activeElement);
    schedule();
  }, 0),
);
track.addEventListener(
  'touchstart',
  () => {
    hovered = true;
    schedule();
  },
  { passive: true },
);
track.addEventListener(
  'touchend',
  () => {
    hovered = false;
    schedule();
  },
  { passive: true },
);
track.addEventListener(
  'touchcancel',
  () => {
    hovered = false;
    schedule();
  },
  { passive: true },
);
track.addEventListener('scroll', update, { passive: true });
new MutationObserver(() => {
  track.scrollTo({ left: 0, behavior: 'instant' });
  update();
  schedule();
}).observe(track, {
  subtree: true,
  attributes: true,
  attributeFilter: ['hidden'],
});
new ResizeObserver(() => {
  update();
  schedule();
}).observe(track);
new IntersectionObserver(
  (entries) => {
    visible = entries[0].isIntersecting;
    schedule();
  },
  { threshold: 0.2 },
).observe(track);
document.addEventListener('visibilitychange', schedule);
reduced.addEventListener('change', () => {
  if (reduced.matches) paused = true;
  renderPause();
  schedule();
});
update();
renderPause();

export {};
