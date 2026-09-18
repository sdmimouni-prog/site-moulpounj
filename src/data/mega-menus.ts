import type { NavigationLink } from './navigation';
export const homeLink: NavigationLink = { label: 'Accueil', href: '#accueil' };
export interface MegaItem extends NavigationLink {
  description: string;
  image?: string;
  icon?: string;
  enabled?: boolean;
}
export interface MegaMenu {
  id: string;
  label: string;
  heading: string;
  discover: MegaItem[];
  advice: MegaItem[];
  visual: {
    image: string;
    alt: string;
    title: string;
    accent: string;
    arabic?: boolean;
    description: string;
    cta: NavigationLink;
  };
}
// Catalogue technology filters; commercial values remain demonstration data.
export const mattressRoutes: {
  all: string | null;
  foam: string | null;
  pocketSprings: string | null;
} = { all: '/matelas', foam: '/matelas?technologie=mousse', pocketSprings: '/matelas?technologie=ressorts' };
export const salonFeatures = { madeToMeasure: false, stylesAndFabrics: false };
const mattressThumb = '/images/navigation/mattress-thumbnail.webp';
const salonThumb = '/images/reference/category-salon.webp';
export const megaMenus: MegaMenu[] = [
  {
    id: 'matelas',
    label: 'Matelas',
    heading: 'Découvrir nos matelas',
    discover: [
      {
        label: 'Tous les matelas',
        description: 'Voir toute la collection',
        image: mattressThumb,
        href: mattressRoutes.all ?? '#selection',
        category: 'matelas',
      },
      {
        label: 'Matelas en mousse',
        description: 'Découvrir cette technologie',
        image: mattressThumb,
        ...(mattressRoutes.foam
          ? { href: mattressRoutes.foam }
          : { destination: 'mousse' }),
      },
      {
        label: 'Matelas à ressorts ensachés',
        description: 'Explorer les modèles',
        image: mattressThumb,
        ...(mattressRoutes.pocketSprings
          ? { href: mattressRoutes.pocketSprings }
          : { destination: 'ressorts' }),
      },
    ],
    advice: [
      {
        label: 'Guide d’achat',
        description: 'Nos conseils pour bien choisir',
        icon: 'book-open',
        href: '/conseils/comment-choisir-son-matelas',
      },
      {
        label: 'Comparer les modèles',
        description: 'Trouver le matelas adapté',
        icon: 'scales',
        destination: 'comparer',
      },
      {
        label: 'Guide des dimensions',
        description: 'Trouver la taille idéale',
        icon: 'ruler',
        destination: 'dimensions',
      },
      {
        label: 'Demander conseil',
        description: 'Parlons de votre confort',
        icon: 'chat-circle',
        contact:
          'Bonjour, je souhaite être conseillé pour choisir mon matelas.',
      },
    ],
    visual: {
      image: '/images/navigation/mattress-room.webp',
      alt: 'Chambre et matelas — illustration de navigation',
      title: 'نعاسك على',
      accent: 'قياسك.',
      arabic: true,
      description: 'Des matelas de qualité pour un meilleur quotidien.',
      cta: { label: 'Trouver mon matelas', href: '#conseils' },
    },
  },
  {
    id: 'salon',
    label: 'Salon marocain',
    heading: 'Découvrir nos salons marocains',
    discover: [
      {
        label: 'Toutes les banquettes',
        description: 'Découvrez nos modèles',
        image: salonThumb,
        href: '#selection',
        category: 'salon',
      },
      {
        label: 'Nos gammes',
        description: 'Explorez les collections',
        image: '/images/reference/product-4.webp',
        destination: 'gammes',
      },
      {
        label: 'Sur mesure',
        description: 'Un salon à votre image',
        image: salonThumb,
        destination: 'surmesure',
        enabled: salonFeatures.madeToMeasure,
      },
    ],
    advice: [
      {
        label: 'Guide d’achat',
        description: 'Nos conseils et astuces',
        icon: 'couch',
        href: '#conseils',
      },
      {
        label: 'Bien prendre ses dimensions',
        description: 'Préparez votre projet',
        icon: 'ruler',
        destination: 'mesures',
      },
      {
        label: 'Styles et tissus',
        description: 'Des finitions qui vous ressemblent',
        icon: 'palette',
        destination: 'tissus',
        enabled: salonFeatures.stylesAndFabrics,
      },
      {
        label: 'Demander conseil',
        description: 'Parlons de votre salon',
        icon: 'chat-circle',
        contact: 'Bonjour, je souhaite être conseillé pour mon salon marocain.',
      },
    ],
    visual: {
      image: salonThumb,
      alt: 'Salon marocain — photo de la référence',
      title: 'L’art du salon marocain,',
      accent: 'chez vous.',
      description: 'Élégance, confort et savoir-faire marocain.',
      cta: {
        label: 'Découvrir nos salons',
        href: '#selection',
        category: 'salon',
      },
    },
  },
];
