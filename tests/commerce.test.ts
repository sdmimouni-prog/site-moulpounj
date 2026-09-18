import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addToCart,
  restoreCart,
  whatsappUrl,
  recommendations,
} from '../src/lib/commerce';
import type { Product } from '../src/data/catalog';
// Fixtures synthétiques réservées aux tests, jamais livrées dans le catalogue.
const fixture: Product = {
  id: 'test-only',
  name: 'Test',
  category: 'matelas',
  image: '/test.webp',
  requiresDimension: true,
  dimensions: ['90x190'],
  priceMAD: 100,
  comfort: 'Ferme',
  usages: ['Quotidien'],
};
test('une variante exige une dimension validée avant tout ajout', () => {
  assert.throws(() => addToCart([], fixture), /dimension/);
  assert.throws(() => addToCart([], fixture, 'invented'), /dimension/);
  const cart = addToCart([], fixture, '90x190');
  assert.equal(cart[0].quantity, 1);
  assert.equal(addToCart(cart, fixture, '90x190')[0].quantity, 2);
});
test('un prix inconnu ne devient pas un produit gratuit', () => {
  assert.throws(
    () => addToCart([], { ...fixture, priceMAD: undefined }, '90x190'),
    /Prix/,
  );
});
test('restauration rejette données corrompues, anciennes références et dimensions invalides', () => {
  assert.deepEqual(restoreCart('{broken', [fixture]), []);
  assert.deepEqual(
    restoreCart(
      JSON.stringify([
        { productId: 'removed', quantity: 1 },
        { productId: fixture.id, quantity: 1, dimension: 'bad' },
        { productId: fixture.id, quantity: -1, dimension: '90x190' },
      ]),
      [fixture],
    ),
    [],
  );
  const cart = addToCart([], fixture, '90x190');
  assert.deepEqual(restoreCart(JSON.stringify(cart), [fixture]), cart);
});
test('WhatsApp reste déconnecté sans numéro et encode le contexte', () => {
  assert.equal(whatsappUrl('', 'Bonjour'), null);
  assert.equal(whatsappUrl('abc', 'Bonjour'), null);
  assert.equal(
    new URL(
      whatsappUrl('212600000000', 'سلام & dimensions 90×190')!,
    ).searchParams.get('text'),
    'سلام & dimensions 90×190',
  );
});
test('aucune recommandation sans catalogue ou critères suffisants', () => {
  assert.deepEqual(
    recommendations([], {
      comfort: 'Ferme',
      budget: 200,
      dimension: '90x190',
      usage: 'Quotidien',
    }),
    [],
  );
  assert.deepEqual(recommendations([fixture], { comfort: 'Ferme' }), []);
  assert.equal(
    recommendations([fixture], {
      comfort: 'Ferme',
      budget: 200,
      dimension: '90x190',
      usage: 'Quotidien',
    }).length,
    1,
  );
  assert.deepEqual(
    recommendations([fixture], {
      comfort: 'Ferme',
      budget: 50,
      dimension: '90x190',
      usage: 'Quotidien',
    }),
    [],
  );
});
