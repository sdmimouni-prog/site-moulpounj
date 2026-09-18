import source from './catalogue-source.json';
const original=source.find(p=>p.id===5344)!;
/** Editorial brief supplied by the owner. Variant prices and product specifications still require validation. */
export const premium35 = {
  id: 'matelas-premium-35',
  name: 'Premium 35',
  startingPriceMAD: 1490,
  dimensions: original.variants.filter(v=>v.active&&v.visible).map(v=>v.dimension!),
  variantPrices: Object.fromEntries(original.variants.filter(v=>v.dimension).map(v=>[v.dimension!,v.priceMAD])) as Record<string, number>,
  dimensionsConfirmed: true,
  video: { src: '', duration: '', poster: '/images/reference/hero.webp' },
  images: {
    hero: original.images[0].src,
    detail: original.images[1]?.src || original.images[0].src,
    lifestyle: '/images/reference/sleep-restored.webp',
  },
  benefits: [
    { icon: 'tag', title: 'ثمن معقول', text: 'اختار الراحة على قد ميزانيتك' },
    {
      icon: 'diamond',
      title: 'جودة زوينة',
      text: 'اكتشف تفاصيل المرتبة والتشطيب',
    },
    { icon: 'bed', title: 'دعم مريح للظهر', text: 'تعرف على الإحساس بالراحة' },
    { icon: 'leaf', title: 'راحة متوازنة', text: 'اختار الراحة اللي كتناسبك' },
  ],
  why: [
    {
      icon: 'bed',
      title: 'راحة متوازنة',
      text: 'شنو مستوى الراحة المناسب ليك؟',
    },
    {
      icon: 'person-simple',
      title: 'دعم للظهر',
      text: 'تأكد من الدعم اللي كتحتاج',
    },
    {
      icon: 'diamond',
      title: 'تشطيب عالي الجودة',
      text: 'شوف التفاصيل عن قرب',
    },
    {
      icon: 'house',
      title: 'للاستعمال اليومي',
      text: 'تعرف على الاستخدام المناسب',
    },
    {
      icon: 'factory',
      title: 'من المصنع مباشرة',
      text: 'معلومات المصدر قيد التأكيد',
    },
  ],
  faq: [
    {
      question: 'شنو هي آجال التوصيل ؟',
      answer:
        'المدة ومصاريف التوصيل باقي خاصها التأكيد حسب المدينة. تواصل مع المستشار قبل الطلب.',
    },
    {
      question: 'شنو هي المقاسات المتوفرة ؟',
      answer:
        'المقاسات المعروضة هي اختيارات أولية من التصميم. التوفر والثمن ديال كل قياس خاصهم التأكيد مع المستشار.',
    },
    {
      question: 'واش يمكن نخلص عند الاستلام ؟',
      answer:
        'طرق الأداء مازال ما تأكداتش. ما كاين حتى أداء أو طلب مؤكد من هاد الصفحة حالياً.',
    },
    {
      question: 'واش نقدر نجرب المرتبة فالمغازة ؟',
      answer:
        'شوف لائحة المغازات وتواصل مباشرة مع المتجر باش تتأكد واش هاد الموديل موجود للتجربة.',
    },
    {
      question: 'شنو الفرق بين Premium 35 والموديلات الأخرى ؟',
      answer:
        'المواصفات التقنية والمقارنة بين الموديلات باقي قيد التأكيد. المستشار يقدر يعاونك من بعد توفير المعلومات الرسمية.',
    },
  ],
  labels: {
    order: 'اطلب دابا',
    stores: 'شوف أقرب مغازة',
    whatsapp: 'تواصل على واتساب',
    preview: 'معاينة المنتج · الصور توضيحية والمواصفات قيد التأكيد',
    missingPrice:
      'الثمن النهائي والتوفر ديال القياس خاصهم التأكيد. ما تزاد حتى منتج للسلة وما تسجّل حتى طلب.',
  },
};
