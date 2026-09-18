import { destinations, helpLinks } from '../data/navigation';
import { site } from '../data/site';
import { products } from '../data/catalog';
import {
  addToCart,
  restoreCart,
  whatsappUrl,
  recommendations,
  type CartItem,
} from './commerce';
const $ = <T extends Element = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
const dialog = $<HTMLDialogElement>('#service-dialog');
const body = $('#dialog-body');
const searchDialog = $<HTMLDialogElement>('#search-dialog');
let contextMessage = '';
let cart: CartItem[] = [];
try {
  cart = restoreCart(localStorage.getItem('moul-pounj:cart:v1'), products);
} catch {
  /* Private browsing: in-memory cart remains available. */
}
function updateCart() {
  document
    .querySelectorAll('[data-cart-count]')
    .forEach(
      (el) =>
        (el.textContent = String(cart.reduce((n, i) => n + i.quantity, 0))),
    );
}
updateCart();
function open(title: string, description: string) {
  $('#dialog-title').textContent = title;
  $('#dialog-description').textContent = description;
  body.replaceChildren();
  if (!dialog.open) dialog.showModal();
}
function button(text: string, action: () => void, className = 'button') {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.textContent = text;
  el.addEventListener('click', action);
  return el;
}
function contact(message: string) {
  contextMessage = message;
  const url = whatsappUrl(site.whatsappNumber, message);
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  open(site.messages.whatsapp.title, site.messages.whatsapp.body);
  const label = document.createElement('label');
  label.htmlFor = 'contact-draft';
  label.textContent = 'Votre demande (modifiable)';
  const input = document.createElement('textarea');
  input.id = 'contact-draft';
  input.value = contextMessage;
  const state = document.createElement('p');
  state.setAttribute('role', 'status');
  const copy = button('Copier ma demande', async () => {
    try {
      await navigator.clipboard.writeText(input.value);
      state.textContent = 'Demande copiée. Aucun message n’a été envoyé.';
    } catch {
      state.textContent =
        'Copie indisponible. Sélectionnez et copiez le texte manuellement.';
      input.focus();
      input.select();
    }
  });
  body.append(label, input, copy, state);
}
function showCart() { window.location.assign('/panier'); }
export function getLocalCart() { return cart.map(item => ({ ...item })); }
export function setLocalCart(items: CartItem[]) { cart = restoreCart(JSON.stringify(items), products); saveCart(); }

function saveCart() {
  updateCart();
  try {
    localStorage.setItem('moul-pounj:cart:v1', JSON.stringify(cart));
  } catch {
    const note = document.createElement('p');
    note.textContent =
      'Le stockage local est indisponible : le panier sera perdu en fermant cette page.';
    body.append(note);
  }
}
function showProduct(id: string) {
  const p = products.find((p) => p.id === id);
  if (!p) return;
  window.location.assign(`/produit/${p.id}`);
}

function filter(category: string) {
  if (!document.querySelector('#catalog-status')) return;
  document
    .querySelectorAll<HTMLButtonElement>('[data-filter]')
    .forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.filter === category)),
    );
  let visible = 0;
  document
    .querySelectorAll<HTMLElement>('[data-product-category]')
    .forEach((card) => {
      card.hidden =
        category !== 'all' && card.dataset.productCategory !== category;
      if (!card.hidden) visible++;
    });
  $('#catalog-status').textContent = products.length
    ? `${visible} produit${visible > 1 ? 's' : ''} dans cette sélection.`
    : `${visible} emplacement${visible > 1 ? 's' : ''} en aperçu. Catalogue validé en attente ; aucun produit disponible à la vente.`;
}
const menu = $('#mobile-menu');
const menuToggle = $<HTMLButtonElement>('.menu-toggle');
function closeMenu() {
  menu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menu.hidden = expanded;
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute(
    'aria-label',
    expanded ? 'Ouvrir le menu' : 'Fermer le menu',
  );
});
document.addEventListener('click', (event) => {
  if (!menu.hidden && !(event.target as Element).closest('.header')) closeMenu();
});
document.addEventListener('focusin', (event) => {
  if (!menu.hidden && !(event.target as Element).closest('.header')) closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menu.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});
matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
  if (e.matches) closeMenu();
});
document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>('button,a');
  if (!el) return;
  if (el.closest('#mobile-menu') && el.matches('a,button')) closeMenu();
  if (el.dataset.filter) filter(el.dataset.filter);
  if (el.dataset.categoryLink) filter(el.dataset.categoryLink);
  if (el.dataset.destination) {
    const destination = destinations[el.dataset.destination];
    if (destination) {
      open(destination.title, destination.body);
      if (el.dataset.destination === 'aide') {
        helpLinks.forEach((item) =>
          body.append(
            button(
              item.label,
              () => {
                if ('contact' in item) contact(item.contact!);
                else if ('destination' in item) {
                  const detail = destinations[item.destination!];
                  open(detail.title, detail.body);
                }
              },
              'search-result',
            ),
          ),
        );
      }
    }
  }
  if (el.dataset.contact) contact(el.dataset.contact);
  if (el.dataset.product) showProduct(el.dataset.product);
  if (el.hasAttribute('data-close')) el.closest('dialog')?.close();
  if (el.dataset.dialog) {
    const key = el.dataset.dialog;
    if (key === 'search') {
      searchDialog.showModal();
      return;
    }
    if (key === 'cart') {
      showCart();
      return;
    }
    if (key in site.messages) {
      const m = site.messages[key as keyof typeof site.messages];
      open(m.title, m.body);
    }
  }
});
for (const modal of [dialog, searchDialog])
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      const r = modal.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        modal.close();
    }
  });
$('#choice-guide')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.currentTarget as HTMLFormElement;
  const data = new FormData(form);
  const comfort = String(data.get('comfort') ?? '');
  const budget = String(data.get('budget') ?? '');
  const dimension = String(data.get('dimension') ?? '');
  const usage = String(data.get('usage') ?? '');
  const matches = recommendations(products, {
    comfort,
    budget: Number(budget) || undefined,
    dimension,
    usage,
  });
  const result = $('#guide-result');
  result.hidden = false;
  result.replaceChildren();
  const text = document.createElement('p');
  text.textContent = matches.length
    ? 'Voici les produits correspondant aux critères disponibles.'
    : 'Les données du catalogue ne permettent pas encore de proposer un produit adapté. Préparons votre demande pour un conseiller.';
  result.append(text);
  if (matches.length)
    matches.forEach((p) =>
      result.append(button(p.name, () => showProduct(p.id), 'text-link')),
    );
  else
    result.append(
      button(
        'Contacter un conseiller',
        () =>
          contact(
            `Bonjour, je souhaite un conseil Moul Pounj. Confort : ${comfort || 'à définir'}. Budget : ${budget ? `${budget} MAD` : 'à définir'}. Dimensions : ${dimension || 'à définir'}. Usage : ${usage || 'à définir'}.`,
          ),
        'text-link',
      ),
    );
});
function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase('fr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[×*]/g, 'x')
    .replace(/\s+/g, '');
}
$('#product-search').addEventListener('input', (e) => {
  const query = normalizeSearch((e.target as HTMLInputElement).value);
  const result = $('#search-results');
  result.replaceChildren();
  if (!products.length) {
    result.textContent =
      'Le catalogue validé n’est pas encore disponible. Aucun résultat ne peut être confirmé.';
    return;
  }
  const found = products.filter((p) =>
    normalizeSearch(
      `${p.name} ${p.category} ${p.dimensions.join(' ')}`,
    ).includes(query),
  );
  if (!found.length) {
    result.textContent =
      'Aucun produit correspondant. Essayez un autre modèle ou une dimension.';
    return;
  }
  found.forEach((p) =>
    result.append(
      button(
        p.name,
        () => {
          searchDialog.close();
          showProduct(p.id);
        },
        'search-result',
      ),
    ),
  );
});

/** Shared catalog cart entry point used by product landing pages. */
export function addCatalogQuantity(
  id: string,
  quantity: number,
  stock?: number,
) {
  const product = products.find((p) => p.id === id);
  if (!product)
    throw new Error('Produit non disponible dans le catalogue validé.');
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99)
    throw new Error('Quantité invalide.');
  if (
    stock !== undefined &&
    quantity +
      cart
        .filter((i) => i.productId === id)
        .reduce((n, i) => n + i.quantity, 0) >
      stock
  )
    throw new Error('Quantité supérieure au stock disponible.');
  let next = cart;
  for (let i = 0; i < quantity; i++) next = addToCart(next, product);
  cart = next;
  saveCart();
  showCart();
}
