import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validQuantity} from '../src/data/sublimya-visco';
test('quantité entière positive, bornée par le stock connu',()=>{
 assert.equal(validQuantity(-5,null),1);
 assert.equal(validQuantity(2.9,null),2);
 assert.equal(validQuantity(NaN,null),1);
 assert.equal(validQuantity(150,null),99);
 assert.equal(validQuantity(8,3),3);
 assert.equal(validQuantity(1,0),0);
});
