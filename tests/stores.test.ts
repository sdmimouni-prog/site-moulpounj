import {test} from 'node:test';
import assert from 'node:assert/strict';
import {directoryStores,storeCities,storeNetwork,normalizeStoreQuery} from '../src/data/store-network';
test('les fiches officielles sont distinctes du total annoncé',()=>{
 assert.equal(directoryStores.length,31);assert.equal(storeNetwork.reportedTotal,40);
 assert.equal(new Set(directoryStores.map(s=>s.id)).size,31);
 for(const s of directoryStores){assert.ok(s.address);assert.ok(s.telephoneUrl.startsWith('tel:'));assert.ok(s.mapUrl.startsWith('https://'));assert.ok(storeCities.some(c=>c.city===s.city));}
});
test('les coordonnées de ville ne deviennent pas des GPS de boutiques',()=>{
 assert.equal(directoryStores.filter(s=>s.coordinatePrecision==='exact').length,1);
 assert.equal(directoryStores.filter(s=>s.latitude!==undefined).length,1);
 const soualem=storeCities.find(c=>c.city==='Had Soualem')!;assert.ok(soualem.latitude>33 && soualem.latitude<34);
});
test('la recherche ignore accents et casse',()=>assert.equal(normalizeStoreQuery('  TÉMARA '),'temara'));
