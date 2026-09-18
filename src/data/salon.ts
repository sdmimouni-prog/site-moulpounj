import source from './catalogue-source.json';
const sourceOrder = [5366, 5365, 5387, 5297];
export const banquettes = source.filter(p => p.category === 'salon').sort((a,b) => sourceOrder.indexOf(a.id)-sourceOrder.indexOf(b.id)).map(p => ({
  id: p.slug,
  name: p.name,
  image: p.images.find(image => image.role === 'gallery')?.src ?? null,
  href: `/produit/${p.slug}`,
  priceMAD: p.priceMAD,
  variantsCount: p.variants.filter(v => v.active && v.visible).length,
}));
export type Banquette = typeof banquettes[number];
export const salon = {
  preview:
    import.meta.env.PUBLIC_SALON_PREVIEW === 'true',
  hero: '/images/hero/salon.webp',
  ambiance: '/images/reference/category-salon.webp',
  video: { src: '', poster: '', duration: '' },
  details: [] as { src: string; alt: string }[],
  testimonials: [] as {
    name: string;
    city: string;
    rating: number;
    text: string;
  }[],
  inspirations: [
    {
      src: '/images/hero/salon.webp',
      alt: 'صالون مغربي بألوان دافئة — صورة أجواء توضيحية',
    },
    {
      src: '/images/reference/category-salon.webp',
      alt: 'تفاصيل صالون تقليدي — صورة أجواء توضيحية',
    },
    {
      src: '/images/reference/product-4.webp',
      alt: 'صالون بدرجات البرتقالي — صورة أجواء توضيحية',
    },
  ],
  guide: {
    title: 'القياس الصحيح… هو البداية',
    body: 'قبل الاختيار، حدد المساحة المتوفرة وطلب القياسات الرسمية ديال المرجع اللي عجبك. الصورة ديال الصالون ما كتحددش قياسات البانكيطة المباعة.',
    content: null as string | null,
  },
  advice: [
    {
      icon: 'ruler',
      title: 'حسب المساحة',
      text: 'حدد المساحة اللي عندك، وتأكد من القياسات المتوفرة ديال كل مرجع.',
    },
    {
      icon: 'armchair',
      title: 'حسب الراحة',
      text: 'سول على مواصفات الراحة والاستعمال قبل ما تختار. بيانات المقارنة باقي قيد الإضافة.',
    },
    {
      icon: 'coins',
      title: 'حسب الميزانية',
      text: 'تأكد شنو داخل فالعرض ووحدة الثمن باش تقارن بوضوح.',
    },
  ],
  reassurance: [
    {
      icon: 'armchair',
      title: 'اكتشف المراجع',
      text: 'أربع بانكيطات باش تتعرف عليها',
    },
    {
      icon: 'ruler',
      title: 'تأكد من القياس',
      text: 'حسب المرجع والمساحة ديالك',
    },
    {
      icon: 'headset',
      title: 'نعاونوك تختار',
      text: 'طلب المعلومات قبل الشراء',
    },
  ],
  faq: [
    {
      q: 'شنو كيشمل ثمن البانكيطة؟',
      a: 'محتوى العرض ووحدة الثمن خاصهم التأكيد لكل مرجع. صورة الصالون ما كتعنيش أن الخشب، الأثواب أو الإكسسوارات داخلين فالعرض.',
    },
    {
      q: 'شنو هي القياسات المتوفرة؟',
      a: 'الخيارات والثمن ديال كل قياس كاينين فصفحة المنتج. تأكد من الطول ووحدة البيع مع المستشار قبل الطلب.',
    },
    {
      q: 'شنو هي مدة التوصيل؟',
      a: 'مدة ومصاريف التوصيل كتحتاج تأكيد حسب العنوان والمرجع. تواصل معنا قبل الطلب.',
    },
    {
      q: 'واش كاين ضمان على المنتج؟',
      a: 'شروط الضمان مازال ما توفرتش فالمعلومات المعتمدة. طلب الشروط الرسمية قبل الشراء.',
    },
  ],
  contact:
    'السلام عليكم، بغيت مساعدة باش نختار بانكيطة للصالون المغربي. بغيت نتأكد من القياسات، الثمن وشنو داخل فالعرض.',
};
