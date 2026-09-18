const triggers = [
  ...document.querySelectorAll<HTMLElement>('[data-nav-trigger]'),
];
const header = document.querySelector<HTMLElement>('.header')!;
const backdrop = document.querySelector<HTMLElement>('.nav-backdrop')!;
const desktop = matchMedia('(min-width:1024px)');
const hover = matchMedia('(hover:hover) and (pointer:fine)');
let openTimer: ReturnType<typeof setTimeout> | undefined;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
let active: HTMLElement | undefined;
function clearTimers() {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
}
function positionBackdrop() {
  const owner = active?.closest<HTMLElement>('.nav-disclosure');
  if (owner) owner.style.setProperty('--panel-offset', `${header.getBoundingClientRect().bottom - owner.getBoundingClientRect().bottom}px`);
  header.style.setProperty(
    '--nav-bottom',
    `${header.getBoundingClientRect().bottom}px`,
  );
}
function closeAll(restoreFocus = false) {
  clearTimers();
  const previous = active;
  triggers.forEach((trigger) => {
    trigger.setAttribute('aria-expanded', 'false');
    document.getElementById(trigger.getAttribute('aria-controls')!)!.hidden =
      true;
  });
  document.querySelectorAll('[data-menu-toggle]').forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
  active = undefined;
  backdrop.hidden = true;
  header.classList.remove('has-open-menu');
  if (restoreFocus) previous?.focus();
}
function openMenu(trigger: HTMLElement) {
  if (!desktop.matches) return;
  clearTimers();
  if (active === trigger) return;
  closeAll();
  active = trigger;
  trigger.setAttribute('aria-expanded', 'true');
  document.querySelector(`[data-menu-toggle="${trigger.id}"]`)?.setAttribute('aria-expanded', 'true');
  document.getElementById(trigger.getAttribute('aria-controls')!)!.hidden =
    false;
  backdrop.hidden = false;
  header.classList.add('has-open-menu');
  positionBackdrop();
}
document.querySelectorAll<HTMLButtonElement>('[data-menu-toggle]').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const trigger = document.getElementById(toggle.dataset.menuToggle!)!;
    if (active === trigger) closeAll();
    else openMenu(trigger);
  });
});
triggers.forEach((trigger) => {
  const owner = trigger.closest<HTMLElement>('.nav-disclosure')!;
  const panel = document.getElementById(
    trigger.getAttribute('aria-controls')!,
  )!;
  owner.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse' || !hover.matches) return;
    clearTimers();
    if (active === trigger) return;
    openTimer = setTimeout(() => openMenu(trigger), 160);
  });
  owner.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    clearTimers();
    closeTimer = setTimeout(() => {
      if (active === trigger) closeAll();
    }, 220);
  });
  trigger.addEventListener('click', () => {
    if (trigger instanceof HTMLAnchorElement) { closeAll(); return; }
    clearTimers();
    if (active === trigger) closeAll();
    else openMenu(trigger);
  });
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(trigger);
      const links = [...panel.querySelectorAll<HTMLElement>('a,button')];
      (event.key === 'ArrowDown' ? links[0] : links.at(-1))?.focus();
    }
  });
  panel.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const links = [...panel.querySelectorAll<HTMLElement>('a,button')];
    const index = links.indexOf(document.activeElement as HTMLElement);
    if (index < 0) return;
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? links.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) %
            links.length;
    links[next]?.focus();
  });
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && active) {
    event.preventDefault();
    closeAll(true);
  }
});
document.addEventListener('click', (event) => {
  const target = event.target as Element;
  if (
    !target.closest('.nav-disclosure') ||
    target.closest('.nav-panel a,.nav-panel button')
  )
    closeAll();
});
document.addEventListener('focusin', (event) => {
  clearTimers();
  if (
    active &&
    !(event.target as Element).closest('.nav-disclosure')?.contains(active)
  )
    closeAll();
});
window.addEventListener(
  'scroll',
  () => {
    if (active) positionBackdrop();
  },
  { passive: true },
);
window.addEventListener('resize', () => {
  if (active) positionBackdrop();
});
desktop.addEventListener('change', () => closeAll());
