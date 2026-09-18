/** Contenu éditorial de la homepage. Les promesses commerciales restent à valider. */
export const site = {
  name: 'Moul Pounj',
  whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '',
  preview:
    'Aperçu — visuels d’ambiance ; catalogue et informations commerciales à valider.',
  hero: {
    eyebrow: 'MOUL POUNJ',
    title: 'الراحة لي كتستاهل',
    accent: 'كتستاهل',
    subtitle: 'راحة اليوم… لحياة أجمل غداً',
    description: 'ماتلا، صالون مغربي ووسادات… اكتشف عالم مول البونج.',
    primary: 'شوف الموديلات',
    secondary: 'لقى أقرب magasin',
  },
  headings: {
    categories: 'شنو باغي اليوم؟',
    products: 'Notre sélection pour votre confort',
    guide: 'ما عارفش آش تختار؟',
    trust: 'علاش تختار',
    stores: 'قريبين ليك',
    reviews: 'الناس آش كيقولو علينا',
    final: 'نعس هاني… وخلي ظهرك يرتاح',
  },
  nav: [
    { label: 'Matelas', category: 'matelas' },
    { label: 'Salon Marocain', category: 'salon' },
    { label: 'Oreillers', category: 'oreillers' },
  ],
  categories: [
    {
      id: 'matelas',
      name: 'Matelas',
      arabic: 'راحة بلا حدود لنوم أفضل',
      cta: 'شوف الماتلا',
      icon: 'bed',
      image: '/images/reference/category-matelas.webp',
    },
    {
      id: 'salon',
      name: 'Salon Marocain',
      arabic: 'بالأناقة ديالنا، وتقاليد مغربية',
      cta: 'شوف الكوليكسيون',
      icon: 'couch',
      image: '/images/reference/category-salon.webp',
    },
    {
      id: 'oreillers',
      name: 'Oreillers',
      arabic: 'راحة أكثر كل ليلة',
      cta: 'شوف الوسادات',
      icon: 'moon',
      image: '/images/reference/category-oreillers.webp',
    },
    {
      id: 'magasins',
      name: 'Nos Magasins',
      arabic: 'اكتشف أقرب متجر ليك',
      cta: 'شوف الماگازات',
      icon: 'storefront',
      image: '/images/reference/category-magasins.webp',
    },
  ],
  trust: [
    {
      icon: 'tag',
      title: 'الثمن',
      label: 'Des prix transparents',
      note: 'Tarifs à renseigner',
    },
    {
      icon: 'shield-check',
      title: 'الجودة',
      label: 'Le souci du confort',
      note: 'Engagements à valider',
    },
    {
      icon: 'storefront',
      title: 'المتاجر',
      label: 'Le réseau Moul Pounj',
      note: 'Adresses à confirmer',
    },
    {
      icon: 'headset',
      title: 'المواكبة',
      label: 'Un conseil pour vous',
      note: 'Contact à connecter',
    },
  ],
  guide: [
    {
      id: 'comfort',
      icon: 'bed',
      title: 'مستوى الراحة',
      label: 'Confort souhaité',
      options: ['Souple', 'Équilibré', 'Ferme', 'À définir ensemble'],
    },
    {
      id: 'budget',
      icon: 'coins',
      title: 'الميزانية',
      label: 'Budget souhaité',
      options: [],
    },
    {
      id: 'dimension',
      icon: 'ruler',
      title: 'القياس',
      label: 'Dimensions souhaitées',
      options: [],
    },
    {
      id: 'usage',
      icon: 'house',
      title: 'الاستعمال',
      label: 'Usage prévu',
      options: [
        'Quotidien',
        'Occasionnel',
        'Chambre d’amis',
        'Salon',
        'À définir ensemble',
      ],
    },
  ],
  messages: {
    account: {
      title: 'Mon compte',
      body: 'L’espace client n’est pas encore connecté. Aucune connexion ni création de compte n’est disponible dans cet aperçu.',
    },
    product: {
      title: 'Fiche produit en préparation',
      body: 'Le catalogue validé n’a pas encore été fourni. Le visuel est extrait de la maquette à titre d’aperçu. Le nom, les dimensions et le prix restent à renseigner. Aucun ajout au panier n’est possible pour cet emplacement.',
    },
    whatsapp: {
      title: 'Parlons de votre confort',
      body: 'Le numéro WhatsApp officiel n’est pas encore configuré. Aucun message n’a été envoyé. Vous pouvez préparer votre demande ci-dessous.',
    },
    cart: {
      title: 'Votre panier',
      body: 'Votre panier est vide. Les produits pourront être ajoutés après intégration du catalogue validé. La commande et le paiement ne sont pas connectés.',
    },
  },
};
export const media = {
  hero: '/images/reference/hero.webp',
  stores: '/images/reference/store.webp',
  banner: '/images/reference/banner.webp',
} as const;
