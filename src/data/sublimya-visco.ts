import source from './catalogue-source.json';
const original=source.find(p=>p.id===12346)!;
import { products } from './catalog';
export interface PillowMedia {
  src: string;
  alt: string;
  label: string;
}
export const pillow = {
  id: 'oreiller-sublimya-visco',
  name: 'Sublimya Visco',
  product: products.find((p) => p.id === 'oreiller-sublimya-visco'),
  stock: null as number | null,
  contents: null as string | null,
  description:
    'اكتشف وسادة Sublimya Visco. تواصل مع المستشار باش تتأكد من التفاصيل قبل الطلب.',
  media: original.images.filter(i=>i.role==='gallery').map((i,n)=>({src:i.src,alt:original.name,label:`Photo ${n+1}`})) as PillowMedia[],
  video: { src: '', poster: '' },
  testimonials: [] as {
    id: string;
    name: string;
    text: string;
    rating?: number;
  }[],
  specifications: [
    { icon: 'stack', label: 'المادة', value: null },
    { icon: 'square', label: 'الشكل', value: null },
    { icon: 'ruler', label: 'الأبعاد', value: null },
    { icon: 'pillow', label: 'الغطاء', value: null },
    { icon: 'washing-machine', label: 'العناية', value: null },
    { icon: 'package', label: 'محتوى الشراء', value: null },
  ] as { icon: string; label: string; value: string | null }[],
  faq: [
    {
      q: 'شنو هي أبعاد الوسادة؟',
      a: 'الأبعاد الدقيقة باقي خاصها التأكيد فالبطاقة التقنية ديال المنتج. سول المستشار قبل الطلب.',
    },
    {
      q: 'شنو كيشمل الثمن؟',
      a: 'الثمن ومحتوى الشراء وعدد الوسادات المشمولة باقي ما تأكدوش. ما يمكنش نعتمدو على عدد الوسادات فالصور.',
    },
    {
      q: 'كيفاش نعتاني بالوسادة؟',
      a: 'تعليمات العناية والغسيل مازال ما توفراتش. خاص الرجوع لبطاقة المنتج؛ ما نفترضوش أن الغطاء قابل للنزع أو الغسيل.',
    },
    {
      q: 'شنو هي شروط التوصيل والضمان؟',
      a: 'الشروط والمصاريف والمدة كتحتاج تأكيد من المستشار قبل الشراء.',
    },
  ],
  preview: import.meta.env?.DEV ?? false,
};
export function validQuantity(value: number, stock: number | null) {
  const limit =
    stock === null ? 99 : Math.min(99, Math.max(0, Math.floor(stock)));
  return limit === 0
    ? 0
    : Math.max(
        1,
        Math.min(limit, Number.isFinite(value) ? Math.floor(value) : 1),
      );
}
