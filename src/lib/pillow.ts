import { pillow, validQuantity } from '../data/sublimya-visco';
import { addCatalogQuantity } from './client';
let quantity = 1,
  index = 0;
const fields = [
  ...document.querySelectorAll<HTMLInputElement>('[data-pillow-quantity]'),
];
const state = document.querySelector<HTMLElement>('[data-pillow-state]')!;
function sync(value: number) {
  quantity = validQuantity(value, pillow.stock);
  fields.forEach((el) => {
    el.value = String(quantity);
    el.max = String(pillow.stock === null ? 99 : Math.min(99, pillow.stock));
  });
  document
    .querySelectorAll<HTMLButtonElement>('[data-pillow-minus]')
    .forEach((b) => (b.disabled = quantity <= 1));
  document
    .querySelectorAll<HTMLButtonElement>('[data-pillow-plus]')
    .forEach((b) => (b.disabled = quantity >= (pillow.stock ?? 99)));
  document
    .querySelectorAll<HTMLButtonElement>('[data-pillow-buy]')
    .forEach((b) => (b.disabled = quantity === 0));
  document
    .querySelectorAll<HTMLButtonElement>('[data-pillow-contact]')
    .forEach(
      (b) =>
        (b.dataset.contact = `Bonjour, je souhaite des informations sur ${pillow.name}, quantité : ${quantity}. Merci de confirmer le prix, le contenu vendu et la disponibilité.`),
    );
}
fields.forEach((el) =>
  el.addEventListener('change', () => sync(Number(el.value))),
);
document
  .querySelectorAll('[data-pillow-minus]')
  .forEach((b) => b.addEventListener('click', () => sync(quantity - 1)));
document
  .querySelectorAll('[data-pillow-plus]')
  .forEach((b) => b.addEventListener('click', () => sync(quantity + 1)));
function purchase() {
  sync(Number(fields[0].value));
  if (!pillow.product || pillow.product.priceMAD === undefined) {
    document.querySelector<HTMLButtonElement>('[data-pillow-contact]')!.click();
    return;
  }
  try {
    addCatalogQuantity(pillow.id, quantity, pillow.stock ?? undefined);
    state.textContent =
      'تزادت الوسادة للسلة المحلية. الأداء والطلب النهائي مازال ما مربوطينش.';
  } catch (e) {
    state.textContent = (e as Error).message;
  }
}
document
  .querySelectorAll('[data-pillow-buy]')
  .forEach((b) => b.addEventListener('click', purchase));
const sticky = document.querySelector<HTMLElement>('.pillow-sticky')!;
let pastHero = false;
function stickyState() {
  sticky.hidden = !(innerWidth < 768 && pastHero);
}
new IntersectionObserver(([entry]) => {
  pastHero = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
  stickyState();
}).observe(document.querySelector('#pillow-hero-buy')!);
window.addEventListener('resize', stickyState);
const zoom = document.querySelector<HTMLDialogElement>('.pillow-zoom')!;
let opener: HTMLElement | null = null;
function renderImage(n: number) {
  if (!pillow.media.length) return;
  index = (n + pillow.media.length) % pillow.media.length;
  const img = zoom.querySelector('img')!;
  img.src = pillow.media[index].src;
  img.alt = pillow.media[index].alt;
}
document
  .querySelectorAll<HTMLButtonElement>('[data-pillow-image]')
  .forEach((b) =>
    b.addEventListener('click', () => {
      opener = b;
      renderImage(Number(b.dataset.pillowImage));
      zoom.showModal();
    }),
  );
zoom
  .querySelector('[data-pillow-zoom-close]')!
  .addEventListener('click', () => zoom.close());
zoom.addEventListener('close', () => opener?.focus());
zoom
  .querySelector('[data-pillow-image-prev]')!
  .addEventListener('click', () => renderImage(index - 1));
zoom
  .querySelector('[data-pillow-image-next]')!
  .addEventListener('click', () => renderImage(index + 1));
zoom.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') renderImage(index + 1);
  if (e.key === 'ArrowLeft') renderImage(index - 1);
});
let touch = 0;
zoom.addEventListener('touchstart', (e) => (touch = e.touches[0].clientX), {
  passive: true,
});
zoom.addEventListener(
  'touchend',
  (e) => {
    const delta = e.changedTouches[0].clientX - touch;
    if (Math.abs(delta) > 45) renderImage(index + (delta < 0 ? 1 : -1));
  },
  { passive: true },
);
for (const [selector, dir] of [
  ['[data-pillow-reviews-prev]', -1],
  ['[data-pillow-reviews-next]', 1],
] as const)
  document.querySelector(selector)?.addEventListener('click', () => {
    const track = document.querySelector<HTMLElement>('.pillow-reviews')!;
    track.scrollBy({
      left: dir * track.clientWidth,
      behavior: matchMedia('(prefers-reduced-motion:reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  });
sync(1);
