import { salon } from '../data/salon';
const dialog = document.querySelector<HTMLDialogElement>('#service-dialog')!;
const title = document.querySelector<HTMLElement>('#dialog-title')!;
const body = document.querySelector<HTMLElement>('#dialog-body')!;
function open(heading: string, description: string) {
  title.textContent = heading;
  document.querySelector('#dialog-description')!.textContent = description;
  body.replaceChildren();
  dialog.dir = 'rtl';
  if (!dialog.open) dialog.showModal();
}
document
  .querySelector('[data-salon-guide]')
  ?.addEventListener('click', () =>
    open(
      'دليل القياسات',
      salon.guide.content ||
        'الدليل الرسمي لقياسات البانكيطات باقي ما توفرش. ما تعتمدش على صورة الصالون باش تحدد القياسات. طلب القياسات الدقيقة ديال المرجع اللي اخترتي من المستشار.',
    ),
  );
const gallery = document.querySelector<HTMLElement>('.salon-gallery')!;
const slides = [...gallery.querySelectorAll('figure')];
let current = 0;
function move(direction: number) {
  current = Math.max(0, Math.min(slides.length - 1, current + direction));
  const step =
    slides[0].getBoundingClientRect().width +
    parseFloat(getComputedStyle(gallery).gap);
  gallery.scrollTo({
    left: -current * step,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth',
  });
}
document
  .querySelectorAll<HTMLButtonElement>('[data-gallery-direction]')
  .forEach((button) =>
    button.addEventListener('click', () =>
      move(Number(button.dataset.galleryDirection)),
    ),
  );
gallery.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    move(event.key === 'ArrowLeft' ? 1 : -1);
  }
});
const previous = document.querySelector<HTMLButtonElement>('[data-gallery-direction="-1"]')!;
const next = document.querySelector<HTMLButtonElement>('[data-gallery-direction="1"]')!;
function updateGallery() {
  const distance = Math.abs(gallery.scrollLeft);
  const maximum = gallery.scrollWidth - gallery.clientWidth;
  const step = slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(gallery).gap);
  current = Math.round(distance / step);
  previous.disabled = distance <= 4;
  next.disabled = distance >= maximum - 4;
  document.querySelector('[data-gallery-position]')!.textContent =
    `${next.disabled ? slides.length : current + 1} / ${slides.length}`;
}
gallery.addEventListener('scroll', updateGallery, { passive: true });
const galleryControls = document.querySelector<HTMLElement>('.salon-gallery-controls')!;
new ResizeObserver(() => {
  galleryControls.hidden = gallery.scrollWidth <= gallery.clientWidth + 2;
  updateGallery();
}).observe(gallery);
