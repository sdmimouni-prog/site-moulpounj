import test from 'node:test';
import assert from 'node:assert/strict';
import {products} from '../src/data/catalog';
import {unitPrice,addToCart,restoreCart} from '../src/lib/commerce';
test('panier et changement de dimension utilisent le tarif source de la variante',()=>{
 const p=products.find(p=>p.id==='matelas-premium-35')!;
 assert.equal(unitPrice(p,'90 × 190'),1490);assert.equal(unitPrice(p,'200 × 200'),3200);assert.equal(unitPrice(p),undefined);
 let cart=addToCart([],p,'200 × 200');cart=addToCart(cart,p,'200 × 200');assert.equal(cart[0].quantity,2);assert.equal(unitPrice(p,cart[0].dimension)!*cart[0].quantity,6400);
 assert.deepEqual(restoreCart(JSON.stringify(cart),products),cart);
 assert.equal(restoreCart(JSON.stringify([{productId:p.id,dimension:'99 × 99',quantity:1}]),products).length,0);
});
test('produit simple et disponibilité sont validés dans le panier',()=>{
 const pillow=products.find(p=>p.id==='oreiller-sublimya-visco')!;assert.equal(unitPrice(pillow),250);assert.equal(addToCart([],pillow)[0].quantity,1);
 assert.throws(()=>addToCart([],{...pillow,inStock:false}));
 const p=products.find(p=>p.id==='matelas-premium-35')!;assert.throws(()=>addToCart([],{...p,unavailableDimensions:['90 × 190']},'90 × 190'));
});

test('les 80 variantes et leurs totaux correspondent au catalogue source',()=>{
 let count=0;
 for(const p of products){
  if(p.variantPrices)for(const dimension of p.dimensions){
   const expected:number=p.variantPrices[dimension];count++;
   if(unitPrice(p,dimension)===undefined)continue;
   const cart=addToCart(addToCart([],p,dimension),p,dimension);
   assert.equal(unitPrice(p,cart[0].dimension)!*cart[0].quantity,expected*2);
  }
 }
 assert.equal(count,80);
});
