import { products, type Product } from '../data/catalog';
import { getLocalCart, setLocalCart } from './client';
import { site } from '../data/site';
import {whatsappUrl,unitPrice} from './commerce';
const root=document.querySelector('.cart-page');
if(root){
 const $=<T extends HTMLElement=HTMLElement>(s:string)=>document.querySelector<T>(s)!;
 let items=getLocalCart(),demo=false;
 const demoProducts:Product[]=[{id:'demo-premium',name:'Matelas Premium 35',category:'matelas',image:'/images/reference/category-matelas.webp',priceMAD:5940,requiresDimension:true,dimensions:['140 × 190','160 × 200']},{id:'demo-visco',name:'Sublimya Visco',category:'oreillers',image:'/images/hero/pillows.webp',priceMAD:299,requiresDimension:false,dimensions:[]}];
 const catalog=()=>demo?demoProducts:products;
 const isolate=(value:string)=>`\u2066${value}\u2069`;
 const money=(n:number)=>`${new Intl.NumberFormat('fr-MA').format(n)} درهم`;
 const total=()=>items.reduce((sum,item)=>sum+(unitPrice(catalog().find(p=>p.id===item.productId)!,item.dimension)||0)*item.quantity,0);
 const drawer=$<HTMLDialogElement>('#checkout-drawer');const form=$<HTMLFormElement>('#checkout-form');
 const text=(tag:string,value:string,className='')=>{const el=document.createElement(tag);el.textContent=value;el.className=className;return el;};
 function save(){
  const active=document.activeElement as HTMLElement;
  const row=active.closest('.cart-item');
  const index=row?[...document.querySelectorAll('.cart-item')].indexOf(row):-1;
  const control=active.tagName==='SELECT'?'select':active.classList.contains('cart-remove')?'.cart-remove':active.textContent==='+'?'.cart-quantity button:last-child':'.cart-quantity button:first-child';
  if(!demo)setLocalCart(items);
  render();
  if(index>=0){
   const rows=[...document.querySelectorAll('.cart-item')];
   const target=rows[Math.min(index,rows.length-1)];
   const preferred=target?.querySelector<HTMLElement>(control);
   (preferred && !(preferred as HTMLButtonElement).disabled ? preferred : target?.querySelector<HTMLElement>('select,button:not(:disabled)') || document.querySelector<HTMLElement>('#cart-empty a'))?.focus();
  }
  $('#cart-status').textContent=`تم تحديث السلة. المجموع بدون توصيل: ${money(total())}`;
 }
 function render(){
 const container=$('#cart-items');container.replaceChildren();$('#cart-empty').hidden=!!items.length;$('#cart-line-count').textContent=`(${items.length})`;$('#cart-demo-note').hidden=!demo;$<HTMLButtonElement>('#open-checkout').disabled=!items.length;
 items.forEach((item,index)=>{const p=catalog().find(p=>p.id===item.productId)!;const row=document.createElement('article');row.className='cart-item';const image=document.createElement('img');image.src=p.image;image.alt=p.name;const info=document.createElement('div');info.className='cart-item-info';info.append(text('h3',p.name));if(item.dimension)info.append(text('p',`القياس: ${isolate(item.dimension)} سم`));if(p.requiresDimension){const select=document.createElement('select');select.setAttribute('aria-label',`Dimension — ${p.name}`);p.dimensions.filter(d=>unitPrice(p,d)!==undefined).forEach(d=>select.add(new Option(d,d)));select.value=item.dimension||'';select.addEventListener('change',()=>{const existing=items.find((other,j)=>j!==index&&other.productId===item.productId&&other.dimension===select.value);if(existing){if(existing.quantity+item.quantity>99){select.value=item.dimension||'';$('#cart-status').textContent='الكمية القصوى هي 99.';return;}existing.quantity+=item.quantity;items.splice(index,1);}else item.dimension=select.value;save();});info.append(select);}const controls=document.createElement('div');controls.className='cart-quantity';const minus=document.createElement('button');minus.textContent='−';minus.setAttribute('aria-label',`Réduire la quantité de ${p.name}`);minus.disabled=item.quantity<=1;minus.addEventListener('click',()=>{item.quantity--;save();});const count=text('span',String(item.quantity));const plus=document.createElement('button');plus.textContent='+';plus.setAttribute('aria-label',`Augmenter la quantité de ${p.name}`);plus.disabled=item.quantity>=99;plus.addEventListener('click',()=>{item.quantity++;save();});controls.append(minus,count,plus);const remove=document.createElement('button');remove.className='cart-remove';remove.textContent='حذف';remove.setAttribute('aria-label',`Retirer ${p.name}`);remove.addEventListener('click',()=>{items.splice(index,1);save();$('#cart-status').textContent=`تم حذف ${p.name}`;});const price=text('div',money(unitPrice(p,item.dimension)!*item.quantity),'cart-line-price');price.append(text('small',`${money(unitPrice(p,item.dimension)!)} للوحدة`));row.append(image,info,remove,controls,price);container.append(row);});
 document.querySelectorAll('[data-cart-subtotal]').forEach(el=>el.textContent=money(total()));
 }
 $('#cart-load-demo')?.addEventListener('click',()=>{demo=true;items=[{productId:'demo-premium',dimension:'160 × 200',quantity:1},{productId:'demo-visco',quantity:2}];render();});
 let opener:HTMLElement|null=null;
 $('#open-checkout').addEventListener('click',()=>{if(!items.length)return;opener=document.activeElement as HTMLElement;$('#checkout-items').replaceChildren(...items.map(i=>text('p',`${catalog().find(p=>p.id===i.productId)!.name}${i.dimension?' · '+isolate(i.dimension):''} × ${i.quantity}`)));$('#checkout-review').hidden=true;form.hidden=false;drawer.showModal();document.documentElement.classList.add('checkout-open');});
 drawer.addEventListener('close',()=>{document.documentElement.classList.remove('checkout-open');opener?.focus();});$('#close-checkout').addEventListener('click',()=>drawer.close());drawer.addEventListener('click',e=>{if(e.target===drawer){const r=drawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)drawer.close();}});
 const phone=$<HTMLInputElement>('#order-phone');phone.addEventListener('input',()=>phone.setCustomValidity(''));
 form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);const number=String(data.get('phone')||'').replace(/[\s().-]/g,'');phone.setCustomValidity(/^\+?\d{8,15}$/.test(number)?'':'دخل رقم هاتف صحيح');if(!form.reportValidity())return;for(const name of ['name','city','address']){const field=form.elements.namedItem(name) as HTMLInputElement;const trimmed=field.value.trim();if(trimmed.length<Math.max(1,field.minLength)){field.setCustomValidity(trimmed?'دخل معلومات كاملة، بلا مسافات زائدة':'عمر هاد الخانة');field.reportValidity();field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});return;}}
 const lines=items.map(i=>{const p=catalog().find(p=>p.id===i.productId)!;return `${p.name}${i.dimension?' / '+isolate(i.dimension):''} × ${i.quantity} — ${money(unitPrice(p,i.dimension)!*i.quantity)}`;});const message=[demo?'معاينة فقط — طلب تجريبي، ماشي طلب حقيقي':'طلب معلومات وتأكيد سلة Moul Pounj',...lines,`المجموع بدون توصيل: ${money(total())}`,`الاسم: ${String(data.get('name')).trim()}`,`الهاتف: ${number}`,`المدينة: ${String(data.get('city')).trim()}`,`العنوان: ${String(data.get('address')).trim()}`,data.get('notes')?`ملاحظة: ${String(data.get('notes')).trim()}`:'','الثمن النهائي، التوفر ومصاريف التوصيل خاصها التأكيد.'].filter(Boolean).join('\n');$<HTMLTextAreaElement>('#checkout-message').value=message;const url=demo?null:whatsappUrl(site.whatsappNumber,message);const send=$<HTMLAnchorElement>('#checkout-send');send.hidden=!url;if(url)send.href=url;else send.removeAttribute('href');$('#checkout-review-note').textContent=demo?'هاد السلة للتجربة فقط. ما غادي يتسيفط حتى طلب.':url?'واتساب غادي يتحل برسالة جاهزة. راجعها وسيفطها بنفسك؛ الطلب مازال ما تأكدش.':'رقم واتساب مازال ما تربطش. تقدر تنسخ الطلب؛ ما تسيفط والو.';$('#checkout-state').textContent='';form.hidden=true;$('#checkout-review').hidden=false;$('#checkout-success').focus();});
 $('#checkout-edit').addEventListener('click',()=>{form.hidden=false;$('#checkout-review').hidden=true;$('#order-name').focus();});$('#checkout-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($<HTMLTextAreaElement>('#checkout-message').value);$('#checkout-state').textContent='تم نسخ الملخص. ما تسيفط حتى طلب.';}catch{const message=$<HTMLTextAreaElement>('#checkout-message');message.focus();message.select();$('#checkout-state').textContent='حدد النص وانسخو يدوياً.';}});
 render();
}
export {};
