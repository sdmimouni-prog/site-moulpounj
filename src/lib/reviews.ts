const storyMotion = matchMedia('(prefers-reduced-motion: reduce)');
const storyEntries = [
  ...document.querySelectorAll<HTMLElement>('.story-entrance'),
];
if (!storyMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.replace('story-pending', 'story-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  storyEntries.forEach((entry) => {
    entry.classList.add('story-pending');
    observer.observe(entry);
  });
  storyMotion.addEventListener('change', () => {
    if (!storyMotion.matches) return;
    observer.disconnect();
    storyEntries.forEach((entry) =>
      entry.classList.remove('story-pending', 'story-visible'),
    );
  });
}

const track = document.querySelector<HTMLElement>('.stories-slider');
if (track) {
  const pause =
    document.querySelector<HTMLButtonElement>('[data-story-pause]')!;
  const position = document.querySelector<HTMLElement>(
    '[data-story-position]',
  )!;
  let paused = storyMotion.matches;
  let hovered = false;
  let focused = false;
  let visible = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  const metrics = () => {
    const card = track.firstElementChild as HTMLElement;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const shown = Math.max(1, Math.round((track.clientWidth + gap) / step));
    return {
      step,
      shown,
      max: Math.max(0, track.children.length - shown),
      index: Math.round(track.scrollLeft / step),
    };
  };
  const update = () => {
    const { index, shown } = metrics();
    position.textContent = `${index + 1}–${Math.min(track.children.length, index + shown)} / ${track.children.length}`;
  };
  const move = (direction: number) => {
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
      behavior: storyMotion.matches ? 'instant' : 'smooth',
    });
  };
  const schedule = () => {
    clearInterval(timer);
    if (
      !paused &&
      !storyMotion.matches &&
      !hovered &&
      !focused &&
      visible &&
      !document.hidden
    )
      timer = setInterval(() => move(1), 3000);
  };
  const renderPause = () => {
  pause.disabled = storyMotion.matches;
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute(
      'aria-label',
      storyMotion.matches ? 'Lecture automatique désactivée : animations réduites' : paused ? 'Reprendre les témoignages' : 'Mettre les témoignages en pause',
    );
    pause.querySelector('i')!.className = paused ? 'ph ph-play' : 'ph ph-pause';
  };
  pause.addEventListener('click', () => {
    paused = !paused;
    renderPause();
    schedule();
  });
  document.querySelector('[data-story-prev]')?.addEventListener('click', () => {
    move(-1);
    schedule();
  });
  document.querySelector('[data-story-next]')?.addEventListener('click', () => {
    move(1);
    schedule();
  });
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  const region = track.closest('.customer-stories')!;
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
  region.addEventListener('focusout', () => {
    setTimeout(() => {
      focused = region.contains(document.activeElement);
      schedule();
    }, 0);
  });
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
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      schedule();
    },
    { threshold: 0.2 },
  ).observe(track);
  document.addEventListener('visibilitychange', schedule);
  storyMotion.addEventListener('change', () => {
    if (storyMotion.matches) paused = true;
    renderPause();
    schedule();
  });
  update();
  renderPause();
}
