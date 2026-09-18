import {
  locatorStores,
  filterStores,
  distanceKm,
  type StoreRecord,
} from '../data/store-locator';
import { storeNetwork, storeCities } from '../data/store-network';
import type * as Leaflet from 'leaflet';
const query = document.querySelector<HTMLInputElement>('#locator-query')!;
const city = document.querySelector<HTMLSelectElement>('#locator-city')!;
const grid = document.querySelector<HTMLElement>('.locator-grid')!;
const cards = [...document.querySelectorAll<HTMLElement>('[data-store-id]')];
const status = document.querySelector<HTMLElement>('#locator-geo-status')!;
const mapStatus = document.querySelector<HTMLElement>('#locator-map-status')!;
let position: [number, number] | null = null,
  selected: StoreRecord | undefined,
  map: Leaflet.Map | undefined,
  L: typeof Leaflet | undefined;
let markers = new Map<string, Leaflet.Marker>(),
  loading = false;
let visible = locatorStores;
const groupPopups = new Map<Leaflet.Marker, HTMLElement>();
const defaultContact = document.querySelector<HTMLButtonElement>('.locator-whatsapp')!.dataset.contact!;
const dialog = document.querySelector<HTMLDialogElement>(
  '#store-detail-dialog',
)!;
let lastFocus: HTMLElement | null = null;
const exact = (s: StoreRecord) =>
  Number.isFinite(s.latitude) && Number.isFinite(s.longitude);
function selectStore(s: StoreRecord, fromMap = false) {
  selected = s;
  cards.forEach((c) =>
    c.classList.toggle('is-selected', c.dataset.storeId === s.id),
  );
  focusStoreOnMap(s);
  if (fromMap) {
    const card = cards.find((c) => c.dataset.storeId === s.id)!;
    if (innerWidth < 768) setView('list');
    card.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'nearest',
    });
    card.focus({ preventScroll: true });
  }
  document.querySelector<HTMLButtonElement>(
    '.locator-whatsapp',
  )!.dataset.contact =
    `Bonjour, je souhaite préparer ma visite au magasin ${s.name} (${s.city}) et vérifier les modèles et dimensions exposés.`;
}
function details(s: StoreRecord) {
  selectStore(s);
  lastFocus = document.activeElement as HTMLElement;
  const body = document.querySelector('#store-detail-body')!;
  body.replaceChildren();
  const text = (tag: string, value: string) => {
    const el = document.createElement(tag);
    el.textContent = value;
    body.append(el);
    return el;
  };
  const title = text('h2', s.name);
  title.id = 'store-detail-title';
  title.dir = 'auto';
  text('p', `${s.city} · ${s.address}`).dir = 'auto';
  text('p', s.hours || 'Horaires à confirmer').dir = 'auto';
  text('p', 'أوقات العمل والاستثناءات خاصها التأكيد قبل الزيارة.');
  text('p', 'صور المغازة والخدمات المفصلة مازال ما توفراتش.');
  if (!exact(s))
    text(
      'p',
      'رابط الخريطة كيقلب على اسم المغازة. تأكد من العنوان قبل الانطلاق؛ GPS الدقيق مازال ما تأكدش.',
    );
  const route = document.createElement('a');
  route.href = s.mapUrl;
  route.target = '_blank';
  route.rel = 'noopener noreferrer';
  route.textContent = 'كيفاش نوصل';
  body.append(route);
  const phone = document.createElement('a');
  phone.href = s.telephoneUrl;
  phone.textContent = s.phone;
  phone.dir = 'ltr';
  phone.setAttribute('aria-label', `Appeler ${s.name} : ${s.phone}`);
  body.append(phone);
  const contact = document.createElement('button');
  contact.textContent = 'تواصل مع المركز على واتساب';
  contact.dataset.contact = `Bonjour, je souhaite des informations sur le magasin ${s.name} (${s.city}).`;
  contact.addEventListener('click', () => dialog.close());
  body.append(contact);
  text('p', 'واتساب مركزي، ماشي رقم خاص بهاد المغازة.');
  dialog.showModal();
}
dialog.querySelector('button')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => lastFocus?.focus());
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
function storePopup(s: StoreRecord) {
  const pop = document.createElement('div');
  pop.className = 'locator-store-popup';
  const title = document.createElement('strong');
  title.textContent = s.name;
  pop.append(title);
  const address = document.createElement('p');
  address.textContent = s.address;
  pop.append(address);
  const precision = document.createElement('small');
  precision.textContent = exact(s)
    ? 'Position GPS précise'
    : `Repère de ville : ${s.city} · adresse exacte à confirmer sur l’itinéraire`;
  pop.append(precision);
  const button = document.createElement('button');
  button.textContent = 'تفاصيل أكثر';
  button.addEventListener('click', () => details(s));
  pop.append(button);
  return pop;
}
function focusStoreOnMap(s: StoreRecord) {
  const marker = markers.get(s.id);
  if (!marker || !map) return;
  new Set(markers.values()).forEach((m) =>
    m.getElement()?.classList.remove('is-selected'),
  );
  marker.getElement()?.classList.add('is-selected');
  marker.setPopupContent(storePopup(s));
  map.setView(marker.getLatLng(), exact(s) ? 13 : 10, { animate: false });
  marker.openPopup();
}
function syncMarkers() {
  if (!L || !map) return;
  new Set(markers.values()).forEach((m) => m.remove());
  markers.clear();
  groupPopups.clear();
  let cityCount = 0,
    preciseCount = 0;
  for (const c of storeCities) {
    const group = visible.filter((s) => s.city === c.city && !exact(s));
    if (!group.length) continue;
    cityCount++;
    const marker = L.marker([c.latitude, c.longitude], {
      icon: L.divIcon({
        className: 'locator-pin locator-city-pin',
        html: String(group.length),
        iconSize: [36, 36],
      }),
      title: `${c.city} : ${group.length} magasins (repère de ville)`,
      alt: `${c.city} : ${group.length} magasins (repère de ville)`,
    }).addTo(map);
    const popup = document.createElement('div');
    popup.className = 'locator-store-popup';
    const heading = document.createElement('strong');
    heading.textContent = `${c.city} · ${group.length} magasins`;
    popup.append(heading);
    const note = document.createElement('p');
    note.textContent =
      'Repère de ville, pas une adresse précise. Sélectionnez un magasin :';
    popup.append(note);
    group.forEach((s) => {
      const btn = document.createElement('button');
      btn.textContent = s.name;
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        selectStore(s, true);
      });
      popup.append(btn);
      markers.set(s.id, marker);
    });
    groupPopups.set(marker, popup);
    marker.bindPopup(popup, { maxHeight: 240, maxWidth: 300 });
    marker.getElement()?.setAttribute('aria-label', `${c.city} : ${group.length} magasins`);
    const openGroup = () => { marker.setPopupContent(groupPopups.get(marker)!); marker.openPopup(); };
    marker.on('click', () => {
      if (group.length === 1) selectStore(group[0], true);
      else openGroup();
    });
    marker.on('mouseover', openGroup);
    marker.getElement()?.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        openGroup();
        popup.querySelector<HTMLButtonElement>('button')?.focus();
      }
    });
  }
  visible.filter(exact).forEach((s) => {
    preciseCount++;
    const marker = L!
      .marker([s.latitude!, s.longitude!], {
        icon: L!.divIcon({
          className: 'locator-pin locator-exact-pin',
          html: '<i class="ph ph-storefront" aria-hidden="true"></i>',
          iconSize: [36, 36],
        }),
        title: s.name,
        alt: s.name,
      })
      .addTo(map!);
    marker.getElement()?.setAttribute('aria-label', s.name);
    marker.bindPopup(storePopup(s), { maxWidth: 300 });
    marker.on('click', () => selectStore(s, true));
    marker.on('mouseover', () => marker.openPopup());
    markers.set(s.id, marker);
  });
  mapStatus.textContent = `${cityCount} repères par ville · ${preciseCount} position GPS précise. Les nombres indiquent les magasins regroupés ; les repères de ville ne sont pas leurs adresses exactes.`;
  if (selected && visible.includes(selected)) focusStoreOnMap(selected);
  else if ((query.value || city.value) && markers.size)
    map.fitBounds(
      L.latLngBounds([...new Set(markers.values())].map((m) => m.getLatLng())),
      { padding: [45, 45], maxZoom: 10, animate: false },
    );
  else
    map.fitBounds(
      [
        [20.7, -17.4],
        [36.2, -0.8],
      ],
      { animate: false },
    );
}
async function initMap() {
  if (map) {
    map.invalidateSize();
    if (selected) focusStoreOnMap(selected);
    return;
  }
  if (loading) return;
  loading = true;
  try {
    L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');
    map = L.map('locator-map', {
      scrollWheelZoom: false,
      zoomControl: false,
      zoomSnap: 0.25,
    }).fitBounds([
      [20.7, -17.4],
      [36.2, -0.8],
    ]);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    const tiles = L.tileLayer(storeNetwork.tiles, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    tiles.on(
      'tileerror',
      () =>
        (mapStatus.textContent =
          'تعذر تحميل بعض أجزاء الخريطة. العناوين وأرقام التواصل متوفرة فاللائحة.'),
    );
    syncMarkers();
  } catch {
    mapStatus.textContent =
      'الخريطة غير متوفرة دابا. استعمل اللائحة للتواصل أو فتح العنوان.';
  } finally {
    loading = false;
  }
}
function setView(view: string) {
  grid.dataset.view = view;
  document
    .querySelectorAll<HTMLButtonElement>('[data-locator-view]')
    .forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.locatorView === view)),
    );
  if (view === 'map') void initMap();
}
function update() {
  visible = filterStores(locatorStores, query.value, city.value);
  if (position)
    visible.sort((a, b) => {
      const d = (s: StoreRecord) =>
        exact(s)
          ? distanceKm(position!, [s.latitude!, s.longitude!])
          : Infinity;
      return d(a) - d(b);
    });
  cards.forEach((c) => {
    c.hidden = !visible.some((s) => s.id === c.dataset.storeId);
  });
  visible.forEach((s) => {
    const card = cards.find((c) => c.dataset.storeId === s.id)!;
    document.querySelector('#locator-list')!.append(card);
    card.querySelector('[data-distance]')!.textContent =
      position && exact(s)
        ? ` · ≈ ${distanceKm(position, [s.latitude!, s.longitude!]).toFixed(1)} كم بخط مستقيم`
        : '';
  });
  document.querySelector('#locator-count')!.textContent =
    `${visible.length} مغازة`;
  (document.querySelector('#locator-empty') as HTMLElement).hidden =
    visible.length > 0;
  if (selected && !visible.includes(selected)) {
    selected = undefined;
    cards.forEach((c) => c.classList.remove('is-selected'));
    document.querySelector<HTMLButtonElement>('.locator-whatsapp')!.dataset.contact = defaultContact;
  }
  syncMarkers();
}
query.addEventListener('input', update);
city.addEventListener('change', update);
document.querySelector('#locator-reset')!.addEventListener('click', () => {
  query.value = '';
  city.value = '';
  selected = undefined;
  position = null;
  status.textContent = '';
  cards.forEach(c => c.classList.remove('is-selected'));
  document.querySelector<HTMLButtonElement>('.locator-whatsapp')!.dataset.contact = defaultContact;
  map?.closePopup();
  update();
  query.focus();
});
document
  .querySelectorAll<HTMLButtonElement>('[data-locator-view]')
  .forEach((b) =>
    b.addEventListener('click', () => setView(b.dataset.locatorView!)),
  );
cards.forEach((c) => {
  const s = locatorStores.find((s) => s.id === c.dataset.storeId)!;
  c.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('a,button')) {
      selectStore(s);
      if (innerWidth < 768) setView('map');
    }
  });
  c.addEventListener('keydown', (e) => {
    if (e.target === c && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      selectStore(s);
      if (innerWidth < 768) {
        setView('map');
        document.querySelector<HTMLElement>('#locator-map')!.focus();
      }
    }
  });
  c.querySelector('[data-store-detail]')!.addEventListener('click', () =>
    details(s),
  );
});
document
  .querySelector<HTMLButtonElement>('#locator-geolocate')!
  .addEventListener('click', (e) => {
    if (!navigator.geolocation) {
      status.textContent =
        'الموقع غير متوفر فهاد المتصفح. استعمل البحث بالمدينة.';
      return;
    }
    const button = e.currentTarget as HTMLButtonElement;
    button.disabled = true;
    status.textContent = 'كنقلبو على موقعك…';
    navigator.geolocation.getCurrentPosition(
      (p) => {
        position = [p.coords.latitude, p.coords.longitude];
        button.disabled = false;
        update();
        status.textContent =
          'ترتبات المغازات اللي عندها GPS حسب القرب. المسافات تقريبية بخط مستقيم؛ باقي المغازات بلا ترتيب جغرافي.';
      },
      (err) => {
        button.disabled = false;
        status.textContent =
          err.code === 1
            ? 'ما تسمحش الوصول للموقع. تقدر تستعمل البحث بالمدينة.'
            : err.code === 3
              ? 'سالـى وقت تحديد الموقع. عاود المحاولة أو استعمل البحث.'
              : 'تعذر تحديد الموقع. البحث بالمدينة باقي خدام.';
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
    );
  });
const desktop = matchMedia('(min-width:768px)');
if (desktop.matches) void initMap();
desktop.addEventListener('change', () => {
  if (desktop.matches) void initMap();
});
update();
