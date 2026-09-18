import test from 'node:test';
import assert from 'node:assert/strict';
import {productPages,productPageBySlug} from '../src/data/product-pages';
import source from '../src/data/catalogue-source.json';
test('chaque référence utilise son propre contenu, ses variantes et ses images',()=>{
 assert.equal(productPages.length,14);assert.equal(new Set(productPages.map(p=>p.slug)).size,14);
 for(const p of productPages){const original=source.find(s=>s.id===p.id)!;assert.equal(p.name,original.name);assert.equal(p.images[0].src,original.images[0].src);assert.equal(p.price,original.priceMAD);assert.equal(p.variants.length,original.variants.filter(v=>v.active&&v.visible&&v.dimension).length);assert.equal(p.reviews.length,0);assert.equal(p.video,undefined);}
});
test('les familles ne confondent pas oreiller, banquette et matelas',()=>{
 const pillow=productPageBySlug('oreiller-sublimya-visco')!;assert.equal(pillow.variants.length,0);assert.equal(pillow.price,250);assert.equal(pillow.choiceLabel,'الكمية');
 for(const p of productPages.filter(p=>p.category==='salon'))assert.match(p.choiceNote,/ماشي صالون كامل/);
 assert.equal(productPageBySlug('matelas-premium-35')!.variants.length,6);assert.equal(productPageBySlug('unknown'),undefined);
});
