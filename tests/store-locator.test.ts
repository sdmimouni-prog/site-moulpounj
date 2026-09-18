import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterStores,locatorStores,distanceKm} from '../src/data/store-locator';
test('store search combines city and text, with Arabic city aliases',()=>{
 assert.ok(filterStores(locatorStores,'الدار البيضاء','Casablanca').length>0);
 assert.equal(filterStores(locatorStores,'الدار البيضاء','Agadir').length,0);
 assert.equal(filterStores(locatorStores,'zzzzzz','').length,0);
 assert.ok(filterStores(locatorStores,'sidi maarouf','').length>0);
});
test('distance is zero at origin and approximately 111 km per latitude degree',()=>{
 assert.equal(distanceKm([30,-9],[30,-9]),0);
 assert.ok(Math.abs(distanceKm([30,-9],[31,-9])-111.2)<0.1);
});
test('only independently verified stores have coordinates; no generated store photos',()=>{
 assert.equal(locatorStores.filter(s=>s.latitude!==undefined).length,1);
 assert.ok(locatorStores.every(s=>s.photos.length===0 && s.weeklyHours===null));
});

test('Arabic aliases cover source city spellings without accents',()=>{
 for (const [query, city] of [['فاس','Fes'],['مكناس','Meknes'],['القنيطرة','Kenitra'],['تمارة','Temara'],['تطوان','Tetouan'],['سلا','Sale'],['الجديدة','El Jadida']]) {
  assert.equal(filterStores(locatorStores,query,'').length, locatorStores.filter(s=>s.city===city).length);
  assert.ok(filterStores(locatorStores,query,'').length>0);
 }
});
