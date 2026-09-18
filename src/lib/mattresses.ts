import {mattresses,mattressPrice,technologyLabel} from '../data/mattresses';
const root=document.querySelector('.mattress-catalog');
if(root){
 const form=root.querySelector<HTMLFormElement>('#mc-filters')!;
 const grid=root.querySelector<HTMLElement>('.mc-grid')!;
 const cards=[...grid.querySelectorAll<HTMLElement>('[data-mc-id]')];
 const tabs=[...root.querySelectorAll<HTMLButtonElement>('[data-mc-tab]')];
 const selected=new Set<string>();
 const budget=form.elements.namedItem('budget') as HTMLInputElement;
 const read=(name:string)=>[...form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`)].map(el=>el.value);
 function filter(){
  const dimensions=read('dimension'),comfort=read('comfort'),technology=read('technology'),height=read('height');
  cards.forEach(card=>{const p=mattresses.find(p=>p.id===card.dataset.mcId)!;card.hidden=!(p.price<=Number(budget.value)&&(!dimensions.length||dimensions.some(d=>p.dimensions.includes(d)))&&(!comfort.length||comfort.some(c=>(p.comfort||'').split(',').map(v=>v.trim()).includes(c)))&&(!technology.length||technology.includes(p.technology||''))&&(!height.length||height.includes(String(p.height))));});
  const count=cards.filter(c=>!c.hidden).length;
  root!.querySelector('#mc-count')!.textContent=`${count} modèle${count>1?'s':''}`;
  (root!.querySelector('#mc-empty') as HTMLElement).hidden=count>0;
  root!.querySelector('#mc-budget-value')!.textContent=`${mattressPrice(Number(budget.value))} DH`;
  tabs.forEach(t=>t.setAttribute('aria-pressed',String(technology.length===1?t.dataset.mcTab===technology[0]:t.dataset.mcTab==='all')));
  const url=new URL(location.href);if(technology.length===1)url.searchParams.set('technologie',technology[0]);else url.searchParams.delete('technologie');history.replaceState(null,'',url);
 }
 const query=new URLSearchParams(location.search).get('technologie');
 if(query==='mousse'||query==='ressorts')(form.querySelector(`input[name="technology"][value="${query}"]`) as HTMLInputElement).checked=true;
 form.addEventListener('input',filter);form.addEventListener('reset',()=>setTimeout(filter,0));
 root.querySelector('#mc-reset-empty')!.addEventListener('click',()=>form.reset());
 tabs.forEach(t=>t.addEventListener('click',()=>{form.querySelectorAll<HTMLInputElement>('input[name="technology"]').forEach(i=>i.checked=i.value===t.dataset.mcTab);filter();}));
 root.querySelector('#mc-sort')!.addEventListener('change',e=>{const value=(e.target as HTMLSelectElement).value;[...cards].sort((a,b)=>{const pa=mattresses.find(p=>p.id===a.dataset.mcId)!,pb=mattresses.find(p=>p.id===b.dataset.mcId)!;return value==='ascending'?pa.price-pb.price:value==='descending'?pb.price-pa.price:value==='name'?pa.name.localeCompare(pb.name):Number(a.dataset.mcOrder)-Number(b.dataset.mcOrder);}).forEach(c=>grid.append(c));});
 const mobile=root.querySelector<HTMLButtonElement>('.mc-mobile-filters')!;mobile.addEventListener('click',()=>{const expanded=mobile.getAttribute('aria-expanded')!=='true';mobile.setAttribute('aria-expanded',String(expanded));root.querySelector('#mc-filter-panel')!.classList.toggle('is-open',expanded);});
 const compareButton=root.querySelector<HTMLButtonElement>('#mc-open-compare')!,slots=root.querySelector('#mc-compare-slots')!,status=root.querySelector('#mc-compare-status')!;
 function updateCompare(){
  const panel=root!.querySelector<HTMLElement>('#mc-comparison')!;
  panel.hidden=true;compareButton.setAttribute('aria-expanded','false');
  slots.replaceChildren();
  [...selected].forEach(id=>{const p=mattresses.find(p=>p.id===id)!;const button=document.createElement('button');button.type='button';button.textContent=`${p.name} ×`;button.setAttribute('aria-label',`Retirer ${p.name} de la comparaison`);button.addEventListener('click',()=>{selected.delete(id);updateCompare();});slots.append(button);});
  for(let i=selected.size;i<3;i++){const button=document.createElement('button');button.type='button';button.textContent='+ Ajouter un matelas';button.className='mc-slot-empty';button.addEventListener('click',()=>{const checkbox=root!.querySelector<HTMLInputElement>('.mc-card:not([hidden]) [data-mc-compare]:not(:checked)');checkbox?.focus();checkbox?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});slots.append(button);}
  root!.querySelectorAll<HTMLInputElement>('[data-mc-compare]').forEach(i=>{i.checked=selected.has(i.dataset.mcCompare!);});compareButton.disabled=selected.size<2;compareButton.textContent=`Comparer (${selected.size}/3)`;
 }
 root.querySelectorAll<HTMLInputElement>('[data-mc-compare]').forEach(i=>i.addEventListener('change',()=>{status.textContent='';if(i.checked&&selected.size>=3){i.checked=false;status.textContent='Vous pouvez comparer trois matelas maximum. Retirez un modèle pour en ajouter un autre.';return;}if(i.checked)selected.add(i.dataset.mcCompare!);else selected.delete(i.dataset.mcCompare!);updateCompare();}));
 const comparison=root.querySelector<HTMLElement>('#mc-comparison')!,common=root.querySelector<HTMLSelectElement>('#mc-common-size')!;
 function renderComparison(){const items=mattresses.filter(p=>selected.has(p.id));const table=root!.querySelector('#mc-comparison-table')!;table.replaceChildren();const header=document.createElement('thead'),row=document.createElement('tr');['Caractéristique',...items.map(p=>p.name)].forEach(text=>{const th=document.createElement('th');th.scope='col';th.textContent=text;row.append(th);});header.append(row);table.append(header);const body=document.createElement('tbody');const rows=[['Technologie',...items.map(p=>technologyLabel(p.technology))],['Confort',...items.map(p=>p.comfort||'À confirmer')],['Hauteur',...items.map(p=>p.height?`${p.height} cm`:'À confirmer')],['Dimension',...items.map(()=>common.value||'Pas de dimension commune')],['Prix dans cette dimension',...items.map(p=>p.variantPrices[common.value]!==undefined?`${mattressPrice(p.variantPrices[common.value])} DH`:'À confirmer')],['À partir de',...items.map(p=>`${mattressPrice(p.price)} DH`)]];rows.forEach(values=>{const tr=document.createElement('tr');values.forEach((text,index)=>{const cell=document.createElement(index===0?'th':'td');if(index===0)cell.setAttribute('scope','row');cell.textContent=text;tr.append(cell);});body.append(tr);});table.append(body);}
 compareButton.addEventListener('click',()=>{const items=mattresses.filter(p=>selected.has(p.id));const sizes=items[0].dimensions.filter(d=>items.every(p=>p.dimensions.includes(d)));common.replaceChildren(...sizes.map(d=>new Option(d,d)));common.disabled=!sizes.length;root!.querySelector('#mc-comparison-note')!.textContent=sizes.length?'Les modèles ci-dessous sont comparés dans la même dimension.':'Aucune dimension commune dans le catalogue récupéré.';const filtered=read('dimension').find(d=>sizes.includes(d));if(filtered)common.value=filtered;renderComparison();comparison.hidden=false;compareButton.setAttribute('aria-expanded','true');comparison.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});comparison.querySelector<HTMLElement>('h2')!.focus({preventScroll:true});});common.addEventListener('change',renderComparison);
 function closeComparison(){comparison.hidden=true;compareButton.setAttribute('aria-expanded','false');compareButton.focus();}
 comparison.querySelector('.mc-close')!.addEventListener('click',closeComparison);
 comparison.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeComparison();}});
 updateCompare();filter();
}
export {};
