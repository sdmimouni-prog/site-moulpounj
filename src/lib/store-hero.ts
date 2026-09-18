const hero = document.querySelector<HTMLElement>('.locator-hero')!;
const slides = [...hero.querySelectorAll<HTMLElement>('.locator-slide')];
const dots = [
  ...hero.querySelectorAll<HTMLButtonElement>('[data-store-slide]'),
];
const pause = hero.querySelector<HTMLButtonElement>(
  '[data-store-slide-pause]',
)!;
const reduced = matchMedia('(prefers-reduced-motion:reduce)');
let index = 0,
  paused = reduced.matches,
  hover = false,
  focused = false,
  visible = true,
  timer: ReturnType<typeof setInterval> | undefined;
function show(n: number) {
  index = (n + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === index);
    slide.setAttribute('aria-hidden', String(i !== index));
  });
  dots.forEach((dot, i) =>
    dot.setAttribute('aria-pressed', String(i === index)),
  );
}
function schedule() {
  clearInterval(timer);
  if (
    !paused &&
    !hover &&
    !focused &&
    visible &&
    !document.hidden &&
    !reduced.matches
  )
    timer = setInterval(() => show(index + 1), 3000);
}
function pauseLabel() {
  pause.setAttribute('aria-pressed', String(paused));
  pause.setAttribute(
    'aria-label',
    paused ? 'Reprendre le diaporama' : 'Mettre le diaporama en pause',
  );
  pause.querySelector('i')!.className = `ph ph-${paused ? 'play' : 'pause'}`;
}
hero.querySelector('[data-store-slide-prev]')!.addEventListener('click', () => {
  show(index - 1);
  schedule();
});
hero.querySelector('[data-store-slide-next]')!.addEventListener('click', () => {
  show(index + 1);
  schedule();
});
dots.forEach((dot, i) =>
  dot.addEventListener('click', () => {
    show(i);
    schedule();
  }),
);
pause.addEventListener('click', () => {
  paused = !paused;
  pauseLabel();
  schedule();
});
hero.addEventListener('pointerenter', (e) => {
  if (e.pointerType === 'mouse') {
    hover = true;
    schedule();
  }
});
hero.addEventListener('pointerleave', () => {
  hover = false;
  schedule();
});
hero.addEventListener('focusin', () => {
  focused = true;
  schedule();
});
hero.addEventListener('focusout', (e) => {
  if (!hero.contains(e.relatedTarget as Node)) {
    focused = false;
    schedule();
  }
});
hero
  .querySelector('.locator-slide-controls')!
  .addEventListener('keydown', (event) => {
    const e = event as KeyboardEvent;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      show(index + (e.key === 'ArrowRight' ? 1 : -1));
      dots[index].focus();
    }
  });
let touchX = 0,
  touchY = 0;
const imagery = hero.querySelector<HTMLElement>('.locator-slides')!;
imagery.addEventListener(
  'touchstart',
  (e) => {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  },
  { passive: true },
);
imagery.addEventListener(
  'touchend',
  (e) => {
    const dx = e.changedTouches[0].clientX - touchX,
      dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      show(index + (dx < 0 ? 1 : -1));
      schedule();
    }
  },
  { passive: true },
);
new IntersectionObserver(
  ([entry]) => {
    visible = entry.isIntersecting;
    schedule();
  },
  { threshold: 0.1 },
).observe(hero);
document.addEventListener('visibilitychange', schedule);
reduced.addEventListener('change', () => {
  paused = reduced.matches;
  pauseLabel();
  schedule();
});
pauseLabel();
schedule();
export {};
