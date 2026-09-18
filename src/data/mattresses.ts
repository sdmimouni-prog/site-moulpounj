import source from './catalogue-source.json';
export const mattressDimensions = ['90 × 190','140 × 190','160 × 190','160 × 200','180 × 200','200 × 200'];
export type Mattress = {id:string;sourceId:number;name:string;price:number;technology:'mousse'|'ressorts'|null;comfort:string|null;height:number|null;image:string;position:string;dimensions:string[];variantPrices:Record<string,number>;sourceUrl:string;slug:string};
const ids:Record<number,string>={5344:'premium-35',5230:'touch-33',5244:'full-hr',5351:'relief-35',5255:'relief-33',5358:'relief-hr',5323:'etudiant',18848:'ellipse',17988:'ellipse-topper'};
const order=[5344,5230,5244,5351,5255,5358,5323,18848,17988];
export const mattresses:Mattress[]=order.map(id=>{
 const p=source.find(p=>p.id===id)!;
 const variants=p.variants.filter(v=>v.dimension&&v.active&&v.visible);
 return {id:ids[id],sourceId:id,name:p.name,price:p.priceMAD,technology:p.technology as Mattress['technology'],comfort:p.characteristics.Confort||null,height:p.heightCm,image:p.images[0].src,position:'center',dimensions:variants.map(v=>v.dimension!),variantPrices:Object.fromEntries(variants.map(v=>[v.dimension!,v.priceMAD])),sourceUrl:p.sourceUrl,slug:p.slug};
});
export const mattressPrice=(value:number)=>new Intl.NumberFormat('fr-FR').format(value);
export const technologyLabel=(value:string|null)=>value==='mousse'?'Mousse':value==='ressorts'?'Ressorts ensachés':'Technologie à confirmer';
