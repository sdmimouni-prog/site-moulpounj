import source from './catalogue-source.json';
import { directoryStores } from './store-network';
export type Category = 'matelas' | 'salon' | 'oreillers';
export interface Product {
  id: string;
  name: string;
  category: Category;
  image: string;
  description?: string;
  priceMAD?: number;
  requiresDimension: boolean;
  dimensions: string[];
  comfort?: string;
  usages?: string[];
  variantPrices?: Record<string,number>;
  unavailableDimensions?: string[];
  inStock?: boolean;
}
export interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  image?: string;
  mapUrl?: string;
}
// Seules des données validées doivent entrer dans ces collections.
export const products: Product[] = source.map(p=>({
 id:p.slug,name:p.name,category:p.category as Category,image:p.images[0].src,
 description:p.category==='salon'?'Banquette seule · unité de vente à confirmer.':'Prix publié · disponibilité à confirmer.',
 priceMAD:p.priceMAD,requiresDimension:p.variants.length>0,
 dimensions:p.variants.filter(v=>v.active&&v.visible&&v.dimension).map(v=>v.dimension!),
 variantPrices:p.variants.length?Object.fromEntries(p.variants.filter(v=>v.active&&v.visible&&v.dimension).map(v=>[v.dimension!,v.priceMAD])):undefined,
 unavailableDimensions:p.variants.filter(v=>!v.inStock||!v.purchasable).map(v=>v.dimension!),
 inStock:p.inStock,comfort:p.characteristics.Confort||undefined,
}));
export const stores: Store[] = directoryStores;
// Emplacements de présentation, jamais des produits achetables.
// Prix fictifs autorisés par le client pour la démonstration uniquement.
export const productSlots: {
  id: string;
  category: Category;
  label: string;
  image?: string;
  priceMAD?: number;
}[] = [
  {
    id: 'preview-1',
    priceMAD: 2490,
    category: 'matelas',
    label: 'Matelas · sélection à renseigner',
  },
  {
    id: 'preview-2',
    priceMAD: 3190,
    category: 'matelas',
    label: 'Matelas · sélection à renseigner',
  },
  {
    id: 'preview-3',
    priceMAD: 290,
    category: 'oreillers',
    label: 'Oreiller · sélection à renseigner',
  },
  {
    id: 'preview-4',
    priceMAD: 5900,
    category: 'salon',
    label: 'Salon marocain · sélection à renseigner',
  },
  {
    id: 'preview-5',
    category: 'matelas',
    label: 'Matelas · sélection à renseigner',
    priceMAD: 2790,
    image: '/images/reference/category-matelas.webp',
  },
  {
    id: 'preview-6',
    category: 'salon',
    label: 'Salon marocain · sélection à renseigner',
    priceMAD: 6500,
    image: '/images/reference/category-salon.webp',
  },
];
