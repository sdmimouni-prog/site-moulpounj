import {products} from '../data/catalog';
import {getLocalCart,setLocalCart} from './client';
import {addToCart} from './commerce';
import {site} from '../data/site';
import {whatsappUrl} from './commerce';
const root=document.querySelector<HTMLElement>('[data-product-page]');
if(root){
 const config=JSON.parse(root.querySelector('[data-product-config]')!.textContent!);
 const status=root.querySelector<HTMLElement>('[data-product-status]')!;
 const panel=root.querySelector<HTMLElement>('[data-request-panel]')!;
 const message=root.querySelector<HTMLTextAreaElement>('[data-request-message]')!;
 const link=root.querySelector<HTMLAnchorElement>('[data-send-request]')!;
 let option='',amount=config.price,available=config.inStock;
 const scroll=(el:HTMLElement)=>el.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 root.querySelectorAll<HTMLButtonElement>('[data-gallery-src]').forEach(button=>button.addEventListener('click',()=>{
  const img=root.querySelector<HTMLImageElement>('[data-main-photo]')!;img.src=button.dataset.gallerySrc!;img.alt=button.dataset.galleryAlt!;
  root.querySelectorAll('[data-gallery-src]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 }));
 root.querySelectorAll<HTMLButtonElement>('[data-variant]').forEach(button=>button.addEventListener('click',()=>{
  option=button.dataset.option!;amount=Number(button.dataset.price);available=button.dataset.available==='true';panel.hidden=true;
  root.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  root.querySelectorAll('[data-variant-price]').forEach(el=>el.textContent=amount.toLocaleString('fr-MA'));root.querySelectorAll<HTMLElement>('[data-starting-price]').forEach(el=>el.hidden=true);const mobileOption=root.querySelector('[data-mobile-option]');if(mobileOption)mobileOption.textContent=option;status.textContent=`\u2066${option}\u2069 — ${available?'التوفر الحالي خاصو التأكيد':'غير متوفر حسب بيانات الموقع الأصلي'}`;
 }));
 // A visible default variant keeps the displayed price and the cart choice in sync.
 if(config.hasVariants){
  const initial=root.querySelector<HTMLButtonElement>('[data-variant][data-available="true"]');
  initial?.click();
 }
 root.querySelectorAll('[data-add-product]').forEach(button=>button.addEventListener('click',()=>{
  if(config.hasVariants&&!option){status.textContent='اختار القياس اللي باغي أولا.';const first=root.querySelector<HTMLButtonElement>('[data-variant]')!;scroll(first);first.focus({preventScroll:true});return;}
  const product=products.find(p=>p.id===config.id)!;
  const input=root.querySelector<HTMLInputElement>('[data-quantity]');
  if(input&&!input.reportValidity())return;
  try {
   let next=getLocalCart();
   for(let n=0;n<(input?Number(input.value):1);n++)next=addToCart(next,product,option||undefined);
   setLocalCart(next);status.textContent='تزاد المنتج للسلة.';
   root.querySelector<HTMLElement>('[data-cart-link]')!.hidden=false;
   window.location.assign('/panier');
  }catch(error){status.textContent=(error as Error).message;const first=root.querySelector<HTMLButtonElement>('[data-variant]');if(!option&&first){scroll(first);first.focus({preventScroll:true});}}
 }));
 const mobileStatus=root.querySelector('[data-mobile-status]');
 if(mobileStatus)new MutationObserver(()=>{mobileStatus.textContent=status.textContent;}).observe(status,{childList:true,characterData:true,subtree:true});
 root.querySelector<HTMLInputElement>('[data-quantity]')?.addEventListener('input',()=>{panel.hidden=true;status.textContent='';});
 const updateLink=()=>{const url=whatsappUrl(site.whatsappNumber,message.value);link.hidden=!url;if(url)link.href=url;else link.removeAttribute('href');};
 message.addEventListener('input',updateLink);
 root.querySelectorAll('[data-request-product]').forEach(button=>button.addEventListener('click',()=>{
  if(config.hasVariants&&!option){status.textContent='اختار القياس اللي باغي أولا.';const first=root.querySelector<HTMLButtonElement>('[data-variant]')!;scroll(first);first.focus({preventScroll:true});return;}
  const input=root.querySelector<HTMLInputElement>('[data-quantity]');if(input&&!input.reportValidity())return;
  const quantity=input?Number(input.value):1;
  message.value=`السلام عليكم، بغيت نتأكد من الثمن والتوفر ديال ${config.name}.${option?'\nالخيار: \u2066'+option+'\u2069':''}\nالكمية: ${quantity}\nالثمن المنشور للوحدة: ${amount.toLocaleString('fr-MA')} MAD\nالمجموع بدون توصيل: ${(amount*quantity).toLocaleString('fr-MA')} MAD${config.category==='salon'?'\nبغيت نتأكد من وحدة البيع والقياسات النهائية.':''}\nبغيت تفاصيل التوصيل والشروط قبل تأكيد الطلب.`;
  updateLink();root.querySelector('[data-request-note]')!.textContent=link.hidden?'رقم واتساب مازال ما تربطش. تقدر تنسخ الرسالة. ما تسيفط حتى طلب.':'راجع الرسالة قبل ما تفتح واتساب. الطلب مازال ما تأكدش.';
  panel.hidden=false;scroll(panel);message.focus({preventScroll:true});
 }));
 root.querySelector('[data-copy-request]')!.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message.value);status.textContent='تنسخات الرسالة. ما تسيفط والو.';}catch{message.focus();message.select();status.textContent='نسخ الرسالة يدويا.';}});
}
