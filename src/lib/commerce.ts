import type { Product } from '../data/catalog';
export interface CartItem {
  productId: string;
  dimension?: string;
  quantity: number;
}
export function unitPrice(product:Product,dimension?:string):number|undefined {
 if(product.inStock===false||product.unavailableDimensions?.includes(dimension||''))return undefined;
 if(product.variantPrices)return dimension?product.variantPrices[dimension]:undefined;
 return product.priceMAD;
}
export function addToCart(
  items: CartItem[],
  product: Product,
  dimension?: string,
): CartItem[] {
  const amount=unitPrice(product,dimension);
  if (
    amount === undefined ||
    !Number.isFinite(amount) ||
    amount < 0
  )
    throw new Error('Prix non renseigné.');
  if (
    product.requiresDimension &&
    (!dimension || !product.dimensions.includes(dimension))
  )
    throw new Error('Choisissez une dimension disponible.');
  if (dimension && !product.dimensions.includes(dimension))
    throw new Error('Dimension non disponible.');
  const existing = items.find(
    (i) => i.productId === product.id && i.dimension === dimension,
  );
  if (existing && existing.quantity >= 99)
    throw new Error(
      'Quantité maximale atteinte (99). Désirez-vous contacter un conseiller ?',
    );
  return existing
    ? items.map((i) =>
        i === existing ? { ...i, quantity: i.quantity + 1 } : i,
      )
    : [...items, { productId: product.id, dimension, quantity: 1 }];
}
export function restoreCart(
  raw: string | null,
  catalog: Product[],
): CartItem[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is CartItem => {
      if (!item || typeof item !== 'object') return false;
      const p = catalog.find((p) => p.id === item.productId);
      return (
        !!p &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 99 &&
        unitPrice(p,item.dimension) !== undefined &&
        Number.isFinite(unitPrice(p,item.dimension)) &&
        unitPrice(p,item.dimension)! >= 0 &&
        (!p.requiresDimension || p.dimensions.includes(item.dimension)) &&
        (!item.dimension || p.dimensions.includes(item.dimension))
      );
    });
  } catch {
    return [];
  }
}
export function whatsappUrl(number: string, message: string): string | null {
  if (!/^[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export function recommendations(
  catalog: Product[],
  criteria: {
    comfort?: string;
    budget?: number;
    dimension?: string;
    usage?: string;
  },
): Product[] {
  if (
    !criteria.comfort ||
    !criteria.budget ||
    !criteria.dimension ||
    !criteria.usage
  )
    return [];
  return catalog.filter(
    (p) =>
      p.comfort === criteria.comfort &&
      p.priceMAD !== undefined &&
      p.priceMAD <= criteria.budget! &&
      p.dimensions.includes(criteria.dimension!) &&
      p.usages?.includes(criteria.usage!),
  );
}
