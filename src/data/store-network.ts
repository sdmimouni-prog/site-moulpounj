import records from './stores.json';
import cityRecords from './store-cities.json';
export const storeNetwork = {
  reportedTotal: 40,
  source: 'https://moulpounj.ma/nos-magasins/',
  importedAt: '2026-09-17',
  tiles: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
};
export const directoryStores = records.map((store) => ({
  ...store,
  ...(store.id === 'mp-31'
    ? {
        latitude: 30.4330811,
        longitude: -9.5532717,
        coordinatePrecision: 'exact',
        coordinateSource: 'https://maps.app.goo.gl/FA37iX2WCi6sW33QA',
      }
    : {}),
}));
export const storeCities = cityRecords
  .filter((city) => 'latitude' in city && 'longitude' in city)
  .map((city) => ({
    city: city.city,
    label: city.label,
    latitude: Number(city.latitude),
    longitude: Number(city.longitude),
  }));
export const normalizeStoreQuery = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .trim();
