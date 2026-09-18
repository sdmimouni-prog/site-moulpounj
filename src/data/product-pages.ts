import source from './catalogue-source.json';
export type ProductPage = {
 id:number;slug:string;name:string;category:string;categoryLabel:string;categoryHref:string;
 headline:string;intro:string;sourceDescription?:string;choiceLabel:string;choiceNote:string;price:number;inStock:boolean;
 images:{src:string;alt:string}[];variants:{id:number;dimension:string;priceMAD:number;inStock:boolean;purchasable:boolean}[];
 specifications:{label:string;value:string}[];faq:{q:string;a:string}[];
 video?:{src:string;poster:string;title:string};reviews:{id:string;name:string;text:string;rating:number}[];
};
const families={
 matelas:{categoryLabel:'Matelas',categoryHref:'/matelas',headline:'نعاس هاني… وراحة كتستاهلها',intro:'اختار القياس اللي كيناسب غرفة نومك، وشوف الثمن ديالو قبل ما تتواصل مع المستشار.',choiceLabel:'اختار القياس بالسنتيمتر',choiceNote:'الثمن حسب القياس · التوفر والتوصيل خاصهم التأكيد',question:'كيفاش نختار القياس؟',answer:'قيس قاعدة السرير فالطول والعرض واختار نفس القياس من الخيارات المتوفرة.'},
 oreillers:{categoryLabel:'Oreillers',categoryHref:'/produit/oreiller-sublimya-visco',headline:'راحتك كتبدا من التفاصيل',intro:'تعرف على الوسادة وشوف صورها الأصلية. تواصل مع المستشار باش تتأكد من الأبعاد ومحتوى الشراء.',choiceLabel:'الكمية',choiceNote:'الثمن المنشور للمنتج · محتوى الشراء والتوفر خاصهم التأكيد',question:'شنو كيشمل الثمن؟',answer:'محتوى الشراء وعدد الوسادات خاصهم التأكيد مع المستشار. ما نعتمدوش على عدد الوسادات فالصور.'},
 salon:{categoryLabel:'Banquettes',categoryHref:'/salon-marocain',headline:'راحة على قياس صالونك',intro:'اختار خيار البانكيطة اللي كيناسب مشروعك. المستشار يعاونك تتأكد من القياسات وطريقة احتساب الثمن.',choiceLabel:'اختار خيار البانكيطة',choiceNote:'هاد الثمن ديال البانكيطة، ماشي صالون كامل. وحدة البيع والقياسات النهائية خاصها التأكيد.',question:'واش الثمن ديال صالون كامل؟',answer:'لا. المرجع ديال بانكيطة. خاص التأكد من وحدة البيع وطريقة احتساب الثمن، الطول، القياس والكسوة مع المستشار.'},
};
export const productPages:ProductPage[]=source.map(p=>{
 const family=families[p.category as keyof typeof families];
 return {id:p.id,slug:p.slug,name:p.name,category:p.category,...family,price:p.priceMAD,inStock:p.inStock,
 sourceDescription:p.category==='salon'?(p.shortDescription||p.description||undefined):undefined,
 images:p.images.filter(i=>i.role==='gallery').map((i,n)=>({src:i.src,alt:`${p.name} — photo ${n+1}`})),
 variants:p.variants.filter(v=>v.dimension&&v.active&&v.visible).map(v=>({...v,dimension:v.dimension!})),
 specifications:Object.entries(p.characteristics).filter((entry):entry is [string,string]=>typeof entry[1]==='string').map(([label,value])=>({label,value})),
 faq:[{q:family.question,a:family.answer},{q:'واش المنتج متوفر؟',a:p.inStock?'الموقع الأصلي كيشير أن المنتج متوفر وقت جمع البيانات. تأكد من التوفر الحالي مع المستشار.':'خاص التواصل مع المستشار للتأكد من التوفر.'},{q:'شنو هي آجال ومصاريف التوصيل؟',a:'المدة والمصاريف كتختلف حسب المدينة والطلب. تأكد منها قبل تأكيد الطلب.'},{q:'شنو هي شروط الضمان والإرجاع؟',a:'طلب الشروط المكتوبة اللي كتخص هاد المرجع من المستشار قبل الشراء.'}],reviews:[]};
});
export const productPageBySlug=(slug:string)=>productPages.find(p=>p.slug===slug);
