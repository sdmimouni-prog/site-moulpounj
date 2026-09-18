import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import source from '../src/data/catalogue-source.json';
import {mattresses} from '../src/data/mattresses';
import {premium35} from '../src/data/premium35';
test('le catalogue nettoyé préserve 14 produits distincts et 80 variantes sources',()=>{
 assert.equal(source.length,14);const variants=source.flatMap(p=>p.variants);assert.equal(variants.length,80);assert.equal(new Set(variants.map(v=>v.id)).size,80);
 for(const p of source){assert.equal(p.stockQuantity,null);for(const im of p.images)assert.ok(existsSync(new URL('../public'+im.src,import.meta.url)));}
});
test('les matelas affichent uniquement dimensions et prix de variantes existantes',()=>{
 for(const p of mattresses){const original=source.find(s=>s.id===p.sourceId)!;assert.equal(p.image,original.images[0].src);for(const d of p.dimensions)assert.equal(p.variantPrices[d],original.variants.find(v=>v.dimension===d)!.priceMAD);assert.equal(p.height,null);}
 for(const p of mattresses.filter(p=>p.id.startsWith('ellipse'))) {assert.ok(p.dimensions.includes('90 × 190'));assert.ok(!p.dimensions.includes('200 × 200'));}
});
test('Premium 35 utilise les six prix source sans généraliser le prix de départ',()=>{
 assert.equal(premium35.dimensions.length,6);assert.equal(premium35.variantPrices['90 × 190'],1490);assert.ok(premium35.variantPrices['200 × 200']>1490);assert.ok(premium35.images.hero.startsWith('/images/catalogue/'));
});
