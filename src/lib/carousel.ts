const carousel = document.querySelector<HTMLElement>('[data-carousel]');
if (carousel) {
  const slides = [...carousel.querySelectorAll<HTMLElement>('[data-slide]')];
  const dots = [...carousel.querySelectorAll<HTMLButtonElement>('[data-goto]')];
  const pause = carousel.querySelector<HTMLButtonElement>('[data-pause]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0,
    paused = reduced.matches,
    hovered = false,
    focused = false,
    onscreen = true;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const duration = 3000;
  function sync() {
    clearTimeout(timer);
    const running =
      !paused && !reduced.matches && !hovered && !focused && onscreen && !document.hidden;
    carousel!.classList.toggle('is-playing', running);
    pause.disabled = reduced.matches;
    pause.setAttribute(
      'aria-label',
      reduced.matches ? 'Lecture automatique désactivée : animations réduites' : paused ? 'Reprendre le diaporama' : 'Mettre le diaporama en pause',
    );
    pause.querySelector('i')!.className = paused ? 'ph ph-play' : 'ph ph-pause';
    if (running) timer = setTimeout(() => go(current + 1, false), duration);
  }
  function go(index: number, manual = true) {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === current);
      s.inert = i !== current;
      s.setAttribute('aria-hidden', String(i !== current));
    });
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      if (i === current) d.setAttribute('aria-current', 'true');
      else d.removeAttribute('aria-current');
    });
    carousel!.querySelector('[data-current-slide]')!.textContent = String(
      current + 1,
    ).padStart(2, '0');
    if (manual) {
      paused = true;
      carousel!.querySelector('[data-carousel-status]')!.textContent =
        slides[current].getAttribute('aria-label');
    }
    sync();
  }
  carousel
    .querySelector('[data-prev]')!
    .addEventListener('click', () => go(current - 1));
  carousel
    .querySelector('[data-next]')!
    .addEventListener('click', () => go(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));
  pause.addEventListener('click', () => {
    paused = !paused;
    sync();
  });
  carousel.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'mouse') {
      hovered = true;
      sync();
    }
  });
  carousel.addEventListener('pointerleave', () => {
    hovered = false;
    sync();
  });
  carousel.addEventListener('focusin', () => {
    focused = true;
    sync();
  });
  carousel.addEventListener('focusout', () => {
    setTimeout(() => {
      focused = carousel!.contains(document.activeElement);
      sync();
    }, 0);
  });
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(current + 1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(current - 1);
    }
  });
  let startX = 0,
    startY = 0;
  carousel.addEventListener(
    'touchstart',
    (e) => {
      startX = e.changedTouches[0].clientX;
      startY = e.changedTouches[0].clientY;
    },
    { passive: true },
  );
  carousel.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - startX,
        dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5)
        go(current + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', () => {
    if (reduced.matches) paused = true;
    sync();
  });
  new IntersectionObserver(
    (entries) => {
      onscreen = entries[0].isIntersecting;
      sync();
    },
    { threshold: 0.25 },
  ).observe(carousel);
  sync();
}
