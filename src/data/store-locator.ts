import { directoryStores } from './store-network';
export interface StoreRecord {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  phone: string;
  telephoneUrl: string;
  hours: string;
  mapUrl: string;
  latitude?: number;
  longitude?: number;
  photos: string[];
  services: string[];
  weeklyHours: Record<string, string> | null;
  exceptions: Record<string, string> | null;
  whatsapp: string | null;
}
export const locatorStores: StoreRecord[] = directoryStores.map((s) => ({
  ...s,
  neighborhood: '',
  photos: [],
  services: [],
  weeklyHours: null,
  exceptions: null,
  whatsapp: null,
}));
export const cityArabic: Record<string, string> = {
  Casablanca: 'الدار البيضاء',
  Rabat: 'الرباط',
  Marrakech: 'مراكش',
  Agadir: 'أكادير',
  Tanger: 'طنجة',
  Fes: 'فاس',
  Fès: 'فاس',
  Meknès: 'مكناس',
  Meknes: 'مكناس',
  Témara: 'تمارة',
  Temara: 'تمارة',
  Salé: 'سلا',
  Sale: 'سلا',
  Kénitra: 'القنيطرة',
  Kenitra: 'القنيطرة',
  Tétouan: 'تطوان',
  Tetouan: 'تطوان',
  Safi: 'آسفي',
  'Beni Mellal': 'بني ملال',
  'El Jadida': 'الجديدة',
  'Had Soualem': 'حد السوالم',
  Deroua: 'الدروة',
  Mohammedia: 'المحمدية',
  Taza: 'تازة',
};
export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u064B-\u065F]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .toLowerCase()
    .trim();
export function filterStores(
  stores: StoreRecord[],
  query: string,
  city: string,
) {
  const q = normalize(query);
  return stores.filter(
    (s) =>
      (!city || s.city === city) &&
      normalize(
        `${s.name} ${s.city} ${cityArabic[s.city] || ''} ${s.neighborhood} ${s.address}`,
      ).includes(q),
  );
}
export function distanceKm(a: [number, number], b: [number, number]) {
  const rad = (v: number) => (v * Math.PI) / 180;
  const dlat = rad(b[0] - a[0]),
    dlon = rad(b[1] - a[1]);
  const h =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dlon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
