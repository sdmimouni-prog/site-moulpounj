const root = document.querySelector('.advice-page');
if (root) {
 const input = root.querySelector<HTMLInputElement>('#advice-search')!;
 const grid = root.querySelector<HTMLElement>('.advice-grid')!;
 const cards = [...root.querySelectorAll<HTMLElement>('.advice-card')];
 const filters = [...root.querySelectorAll<HTMLButtonElement>('[data-advice-filter]')];
 const normalize = (value:string) => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f]/g,'').replace(/[أإآ]/g,'ا');
 let category = 'all';
 function filter() {
   const query = normalize(input.value.trim());
   cards.forEach(card => { card.hidden = !(category === 'all' || card.dataset.category === category) || !normalize(card.dataset.search || '').includes(query); });
   const count = cards.filter(card=>!card.hidden).length;
   root!.querySelector('#advice-results')!.textContent = `${count} نصائح`;
   (root!.querySelector('#advice-empty') as HTMLElement).hidden = count !== 0;
 }
 filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.adviceFilter!;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter();}));
 input.addEventListener('input',filter);
 root.querySelector('#advice-search-form')!.addEventListener('submit',e=>{e.preventDefault();root.querySelector('#articles')!.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
 root.querySelector('#advice-sort')!.addEventListener('change',e=>{const byTitle=(e.target as HTMLSelectElement).value==='title';[...cards].sort((a,b)=>byTitle?a.dataset.title!.localeCompare(b.dataset.title!,'ar'):Number(a.dataset.order)-Number(b.dataset.order)).forEach(card=>grid.append(card));});
 const guides: {id:string;title:string;sections:string[][]}[] = JSON.parse(root.querySelector('#advice-content')!.textContent!);
 const dialog = root.querySelector<HTMLDialogElement>('#advice-reader')!;
 let trigger:HTMLElement|null=null;
 function openGuide(id:string, source:HTMLElement|null) {
   const guide=guides.find(g=>g.id===id);if(!guide)return;
   trigger=source;
   const content=root!.querySelector('#advice-reader-content')!;content.replaceChildren();
   const title=document.createElement('h2');title.id='advice-reader-title';title.textContent=guide.title;content.append(title);
   guide.sections.forEach(([heading,body])=>{const h=document.createElement('h3');h.textContent=heading;const p=document.createElement('p');p.textContent=body;content.append(h,p);});
   dialog.showModal();dialog.scrollTop=0;
 }
 root.querySelectorAll<HTMLElement>('[data-open-guide]').forEach(button=>button.addEventListener('click',()=>openGuide(button.dataset.openGuide!,button)));
 root.querySelector('.advice-reader-close')!.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>trigger?.focus());
 function openHash() { const hash=location.hash.slice(1); if(guides.some(g=>g.id===hash)) { if(dialog.open) dialog.close(); openGuide(hash,null); } }
 window.addEventListener('hashchange',openHash);
 openHash();
 filter();
}
export {};
