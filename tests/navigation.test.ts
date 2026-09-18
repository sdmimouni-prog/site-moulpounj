import {test} from 'node:test';
import assert from 'node:assert/strict';
import {navigationHref} from '../src/lib/navigation-href';
test('la catégorie salon rejoint sa page depuis la homepage',()=>assert.equal(navigationHref('#selection','/','salon'),'/salon-marocain#banquettes'));
test('les ancres simples de la homepage restent inchangées',()=>assert.equal(navigationHref('#selection','/'),'#selection'));
test('les liens partagés des pages internes rejoignent leurs destinations',()=>{
 assert.equal(navigationHref('#selection','/salon-marocain','salon'),'/salon-marocain#banquettes');
 assert.equal(navigationHref('#magasins','/salon-marocain'),'/nos-magasins');
 assert.equal(navigationHref('/produit/matelas-premium-35','/salon-marocain'),'/produit/matelas-premium-35');
});
