import 'leaflet/dist/leaflet.css';
import {
  directoryStores,
  storeCities,
  storeNetwork,
  normalizeStoreQuery,
} from '../data/store-network';
const finder = document.querySelector<HTMLElement>('#store-finder')!;
const citySelect =
  document.querySelector<HTMLSelectElement>('#store-city-filter')!;
const search = document.querySelector<HTMLInputElement>('#store-search')!;
const toggle = document.querySelector<HTMLButtonElement>(
  '[data-store-toggle]',
)!;
const cards = [...document.querySelectorAll<HTMLElement>('[data-store-card]')];
const count = document.querySelector<HTMLElement>('#store-results-count')!;
function filterStores() {
  let total = 0;
  cards.forEach((card) => {
    card.hidden = !!(
      (citySelect.value && card.dataset.city !== citySelect.value) ||
      !normalizeStoreQuery(card.dataset.search || '').includes(
        normalizeStoreQuery(search.value),
      )
    );
    if (!card.hidden) total++;
  });
  count.textContent = `${total} magasin${total === 1 ? '' : 's'}`;
  document.querySelector<HTMLElement>('[data-store-empty]')!.hidden = total > 0;
}
function showCity(city: string) {
  finder.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
  citySelect.value = city;
  search.value = '';
  filterStores();
  finder.scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth',
    block: 'start',
  });
  citySelect.focus({ preventScroll: true });
}
toggle.addEventListener('click', () => {
  finder.hidden = !finder.hidden;
  toggle.setAttribute('aria-expanded', String(!finder.hidden));
  if (!finder.hidden) citySelect.focus({ preventScroll: true });
});
citySelect.addEventListener('change', filterStores);
search.addEventListener('input', filterStores);
const container = document.querySelector<HTMLElement>('#store-map')!;
const status = document.querySelector<HTMLElement>('.store-map-status')!;
async function initMap() {
  try {
    const leaflet = await import('leaflet');
    const L = leaflet.default || leaflet;
    const map = L.map(container, {
      scrollWheelZoom: false,
      zoomSnap: 0.25,
    }).setView([31.9, -7.8], 6);
    const tiles = L.tileLayer(storeNetwork.tiles, {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    let tileFailed = false;
    tiles.on('tileerror', () => {
      tileFailed = true;
      status.textContent =
        'Fond de carte indisponible. Les fiches et itinéraires restent accessibles.';
    });
    tiles.on('loading', () => {
      tileFailed = false;
    });
    tiles.on('load', () => {
      if (!tileFailed) status.textContent = '';
    });
    const hoverCard = document.createElement('div');
    hoverCard.className = 'store-hover-card';
    hoverCard.hidden = true;
    hoverCard.setAttribute('role', 'region');
    hoverCard.setAttribute('aria-label', 'Informations des magasins');
    container.append(hoverCard);
    L.DomEvent.disableClickPropagation(hoverCard);
    L.DomEvent.disableScrollPropagation(hoverCard);
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    const cancelClose = () => clearTimeout(closeTimer);
    let cardTrigger: HTMLElement | undefined;
    let restoringFocus = false;
    const closeCard = (restoreFocus = false) => {
      cancelClose();
      hoverCard.hidden = true;
      if (restoreFocus && cardTrigger) {
        restoringFocus = true;
        cardTrigger.focus({ preventScroll: true });
        restoringFocus = false;
      }
    };
    const scheduleClose = () => {
      cancelClose();
      closeTimer = setTimeout(() => {
        if (
          !hoverCard.matches(':hover') &&
          !hoverCard.contains(document.activeElement)
        )
          closeCard();
      }, 350);
    };
    hoverCard.addEventListener('mouseenter', cancelClose);
    hoverCard.addEventListener('mouseleave', scheduleClose);
    hoverCard.addEventListener('focusin', cancelClose);
    hoverCard.addEventListener('focusout', scheduleClose);
    container.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !hoverCard.hidden) {
        event.preventDefault();
        closeCard(true);
      }
    });
    map.on('click', () => closeCard());
    function pin(
      lat: number,
      lng: number,
      title: string,
      city: string,
      number: number,
      exact = false,
      address = '',
    ) {
      const icon = L.divIcon({
        className: `store-map-marker${exact ? ' exact' : ''}`,
        html: `<span><b>${exact ? '◆' : number}</b></span>`,
        iconSize: [36, 44],
        iconAnchor: [18, 40],
        popupAnchor: [0, -35],
      });
      const marker = L.marker([lat, lng], {
        icon,
        title,
        alt: title,
        keyboard: true,
      }).addTo(map);
      marker.getElement()?.setAttribute(
        'aria-label',
        `${title} — afficher la fiche ${exact ? 'du magasin' : 'des magasins'}`,
      );
      const showCard = () => {
        cancelClose();
        cardTrigger = marker.getElement();
        hoverCard.replaceChildren();
        const header = document.createElement('div');
        header.className = 'store-hover-heading';
        const heading = document.createElement('strong');
        heading.textContent = title;
        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'store-hover-close';
        close.textContent = '×';
        close.setAttribute('aria-label', 'Fermer la fiche magasin');
        close.addEventListener('click', () => {
          closeCard(true);
        });
        header.append(heading, close);
        const precision = document.createElement('p');
        precision.className = 'store-hover-precision';
        precision.textContent = exact
          ? 'Position GPS précise'
          : `${number} magasin${number > 1 ? 's' : ''} · Repère de ville`;
        const list = document.createElement('div');
        list.className = 'store-hover-list';
        const stores = directoryStores.filter(
          (store) =>
            store.city === city &&
            (exact
              ? store.address === address
              : store.coordinatePrecision !== 'exact'),
        );
        for (const store of stores) {
          const article = document.createElement('article');
          const name = document.createElement('h4');
          name.textContent = store.name;
          const location = document.createElement('p');
          location.textContent = store.address;
          const hours = document.createElement('p');
          hours.className = 'store-hover-hours';
          hours.textContent = store.hours;
          const actions = document.createElement('div');
          actions.className = 'store-hover-actions';
          const phone = document.createElement('a');
          phone.href = store.telephoneUrl;
          phone.textContent = store.phone;
          const route = document.createElement('a');
          route.href = store.mapUrl;
          route.textContent = 'Itinéraire ↗';
          route.target = '_blank';
          route.rel = 'noopener noreferrer';
          actions.append(phone, route);
          article.append(name, location, hours, actions);
          list.append(article);
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'store-hover-all';
        button.textContent = 'Voir dans la liste';
        button.addEventListener('click', () => {
          closeCard();
          showCity(city);
        });
        hoverCard.append(header, precision, list, button);
        hoverCard.hidden = false;
      };
      marker.on('mouseover', () => {
        if (matchMedia('(hover: hover)').matches) showCard();
      });
      marker.on('mouseout', scheduleClose);
      marker.on('click', showCard);
      marker.getElement()?.addEventListener('focus', () => {
        if (!restoringFocus) showCard();
      });
      marker.getElement()?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          event.stopPropagation();
          showCard();
          hoverCard.querySelector<HTMLButtonElement>('button')?.focus();
        }
      });
      marker.getElement()?.addEventListener('blur', scheduleClose);
    }
    for (const city of storeCities) {
      const group = directoryStores.filter(
        (store) =>
          store.city === city.city && store.coordinatePrecision !== 'exact',
      );
      if (group.length)
        pin(city.latitude, city.longitude, city.label, city.city, group.length);
    }
    for (const store of directoryStores)
      if (
        store.coordinatePrecision === 'exact' &&
        store.latitude !== undefined &&
        store.longitude !== undefined
      )
        pin(
          store.latitude,
          store.longitude,
          store.name,
          store.city,
          1,
          true,
          store.address,
        );
    const countryBounds: [[number, number], [number, number]] = [
      [20.7, -17.4],
      [36.2, -0.8],
    ];
    const reset = () =>
      map.fitBounds(countryBounds, {
        padding: [12, 12],
        maxZoom: 6,
        animate: !matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    reset();
    document
      .querySelector('[data-map-reset]')
      ?.addEventListener('click', reset);
    new ResizeObserver(() => {
      closeCard();
      map.invalidateSize({ pan: false });
      map.fitBounds(countryBounds, {
        padding: [12, 12],
        maxZoom: 6,
        animate: false,
      });
    }).observe(container);
  } catch (error) {
    console.error('Store map initialization failed', error);
    container.dataset.error = String(error);
    status.textContent =
      'La carte n’a pas pu charger. Consultez les adresses et itinéraires dans la liste des magasins.';
  }
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        void initMap();
      }
    },
    { rootMargin: '300px' },
  );
  observer.observe(container);
} else void initMap();
