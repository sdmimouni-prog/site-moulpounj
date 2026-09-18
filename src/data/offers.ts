import catalogue from './catalogue-source.json';
import selection from './promotions-source.json';
export const offerCategories = [
  { id: 'all', label: 'كل العروض', icon: 'tag' },
  { id: 'matelas', label: 'الماتلات', icon: 'bed' },
  { id: 'salon', label: 'البانكيطات', icon: 'armchair' },
  { id: 'oreillers', label: 'الوسادات', icon: 'square' },
];

export const offers = selection.products.map(entry => {
  const product = catalogue.find(p => p.id === entry.id)!;
  const variant = product.variants.filter(v => v.active && v.visible && v.purchasable).sort((a,b) => a.priceMAD-b.priceMAD)[0];
  return {
    id: product.slug, category: product.category, name: product.name,
    description: product.category === 'salon' ? 'ثمن البانكيطة، ماشي صالون كامل' : 'اكتشف الخيارات وتفاصيل المنتج',
    image: product.images.find(image => image.role === 'gallery')!.src,
    oldPrice: variant?.regularPriceMAD ?? entry.regularPriceMAD ?? product.priceMAD,
    price: variant?.priceMAD ?? product.priceMAD,
    href: `/produit/${product.slug}`,
    dimensions: variant ? `${variant.dimension} · الثمن ديال هاد الخيار` : 'ثمن المنتج',
  };
});
export const featuredOffer = offers[0];
export const formatOfferPrice = (price: number) => new Intl.NumberFormat('fr-MA').format(price);
export const offerDiscount = (price: number, oldPrice: number) => Math.round((1 - price / oldPrice) * 100);
