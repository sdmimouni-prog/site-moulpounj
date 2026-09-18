import { premium35 as p } from '../data/premium35';
import { site } from '../data/site';
import { products, type Product } from '../data/catalog';
import { addToCart, restoreCart, whatsappUrl } from './commerce';
const feedback = document.querySelector<HTMLElement>('#product-inline-feedback')!;
const body = document.querySelector<HTMLElement>('#product-feedback-body')!;
const title = document.querySelector<HTMLElement>('#product-feedback-title')!;
let selected = '';
let catalog: Product[] = products;
// Do not convert a starting price into a price for every variant.
const price = (dimension: string) =>
  p.dimensionsConfirmed ? p.variantPrices[dimension] : undefined;
function variant(dimension: string): Product | undefined {
  const amount = price(dimension);
  return amount === undefined
    ? undefined
    : {
        id: `${p.id}:${dimension}`,
        name: `${p.name} · ${dimension}`,
        category: 'matelas',
        image: p.images.hero,
        priceMAD: amount,
        requiresDimension: true,
        dimensions: [dimension],
      };
}
catalog = [
  ...products,
  ...p.dimensions.map(variant).filter((v): v is Product => !!v),
];
let cart = restoreCart(null, catalog);
try {
  cart = restoreCart(localStorage.getItem('moul-pounj:cart:v1'), catalog);
} catch {}
function updateCount() {
  document.querySelectorAll('[data-cart-count]').forEach((badge) => badge.textContent = String(
    cart.reduce((sum, item) => sum + item.quantity, 0),
  ));
}
function open(heading: string, message: string) {
  title.textContent = heading;
  body.replaceChildren();
  const text = document.createElement('p');
  text.textContent = message;
  body.append(text);
  feedback.hidden = false;
  feedback.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  feedback.focus({ preventScroll: true });
}
function action(label: string, fn: () => void) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button';
  button.textContent = label;
  button.addEventListener('click', fn);
  body.append(button);
}
function contact() {
  const message = `السلام عليكم، بغيت معلومات على مرتبة ${p.name}. القياس: ${selected || 'باقي ما اخترتش'} سم. بغيت نتأكد من الثمن النهائي والتوفر.`;
  const url = whatsappUrl(site.whatsappNumber, message);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  open(
    'تواصل على واتساب',
    'رقم واتساب الرسمي باقي ما تربطش. تقدر تنسخ الرسالة، ما ترسل حتى طلب.',
  );
  const label = document.createElement('label');
  label.textContent = 'الرسالة';
  label.htmlFor = 'product-message';
  const draft = document.createElement('textarea');
  draft.id = 'product-message';
  draft.value = message;
  body.append(label, draft);
  action('نسخ الرسالة', () => {
    void navigator.clipboard
      .writeText(draft.value)
      .then(() => {
        const result = document.createElement('p');
        result.setAttribute('role', 'status');
        result.textContent = 'تنسخات الرسالة. ما ترسل والو.';
        body.append(result);
      })
      .catch(() => {
        draft.focus();
        draft.select();
      });
  });
}
document
  .querySelectorAll<HTMLButtonElement>('[data-dimension]')
  .forEach((button) =>
    button.addEventListener('click', () => {
      selected = button.dataset.dimension!;
      feedback.hidden = true;
      document
        .querySelectorAll<HTMLButtonElement>('[data-dimension]')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      document.querySelector('[data-selection-status]')!.textContent =
        `القياس المختار: ${selected} سم`;
      const amount = price(selected);
      if (amount !== undefined)
        document.querySelector('.product-price')!.textContent =
          `${amount.toLocaleString('fr-MA')} درهم`;
    }),
  );
document
  .querySelectorAll('[data-product-contact]')
  .forEach((button) => button.addEventListener('click', contact));
document.querySelectorAll('[data-product-order]').forEach((button) =>
  button.addEventListener('click', () => {
    if (!selected) {
      feedback.hidden = true;
      document.querySelector('[data-selection-status]')!.textContent = 'اختار القياس اللي باغي باش نكملو طلبك.';
      const dimension = document.querySelector<HTMLButtonElement>('[data-dimension]')!;
      dimension.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      dimension.focus({ preventScroll: true });
      return;
    }
    const product = products.find(item=>item.id===`${p.id}:${selected}`);
    if (!product) {
      open(`Premium 35 · ${selected} سم`, `${price(selected)?.toLocaleString('fr-MA')} درهم — الثمن منشور فالموقع الأصلي. تأكد من التوفر والتوصيل مع المستشار قبل الطلب.`);
      action('تأكد مع المستشار', contact);
      return;
    }
    try {
      cart = addToCart(cart, product, selected);
      try {
        localStorage.setItem('moul-pounj:cart:v1', JSON.stringify(cart));
      } catch {}
      updateCount();
      open('تزاد المنتج للسلة', 'السلة محلية. الطلب والأداء مازال ما تربطوش.');
    } catch (error) {
      open('السلة', String(error));
    }
  }),
);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
if (!reduced.matches && 'IntersectionObserver' in window) {
  const blocks = [
    ...document.querySelectorAll<HTMLElement>('.product-section'),
  ];
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.replace(
            'product-reveal-pending',
            'product-reveal-visible',
          );
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.08 },
  );
  blocks.forEach((block) => {
    block.classList.add('product-reveal-pending');
    observer.observe(block);
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      observer.disconnect();
      blocks.forEach((block) =>
        block.classList.remove(
          'product-reveal-pending',
          'product-reveal-visible',
        ),
      );
    }
  });
}
