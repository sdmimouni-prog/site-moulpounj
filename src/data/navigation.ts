export interface NavigationLink {
  label: string;
  href?: string;
  category?: string;
  destination?: string;
  contact?: string;
}
const preview = (label: string, destination: string): NavigationLink => ({
  label,
  destination,
});
const category = (label: string, value: string): NavigationLink => ({
  label,
  href: '#selection',
  category: value,
});
export const destinations: Record<string, { title: string; body: string }> = {
  surmesure: {
    title: 'Sur mesure',
    body: 'La disponibilité de ce service reste à confirmer. Aucun devis ni commande ne peut être envoyé depuis cet aperçu.',
  },
  tissus: {
    title: 'Styles et tissus',
    body: 'Les styles, tissus et options disponibles restent à valider.',
  },
  mousse: {
    title: 'Matelas en mousse',
    body: 'Cette famille sera accessible dès la validation des technologies et des références du catalogue.',
  },
  ressorts: {
    title: 'Matelas à ressorts ensachés',
    body: 'Les modèles et caractéristiques de cette famille sont en cours de validation.',
  },
  comparer: {
    title: 'Comparer les modèles',
    body: 'Le comparateur sera disponible avec les caractéristiques validées des matelas. Aucune comparaison commerciale n’est encore proposée.',
  },
  dimensions: {
    title: 'Guide des dimensions',
    body: 'Le guide détaillé est en préparation. Vous pouvez déjà préciser vos dimensions dans l’aide au choix.',
  },
  gammes: {
    title: 'Les gammes de salon marocain',
    body: 'Les gammes et leurs caractéristiques seront présentées après validation du catalogue.',
  },
  mesures: {
    title: 'Bien prendre ses dimensions',
    body: 'Le guide de prise de mesures du salon marocain est en préparation.',
  },
  sublimya: {
    title: 'Oreiller Sublimya Visco',
    body: 'La fiche de cet oreiller est en préparation. Photo produit, caractéristiques, prix et disponibilité restent à valider ; aucun achat n’est encore possible.',
  },
  offres: {
    title: 'Offres',
    body: 'Aucune offre commerciale active n’a encore été renseignée dans cet aperçu.',
  },
  technologies: {
    title: 'Comprendre les technologies',
    body: 'Le contenu de ce guide est en préparation.',
  },
  entretien: {
    title: 'Entretenir sa literie',
    body: 'Le guide d’entretien est en préparation. Les conseils seront adaptés aux produits validés.',
  },
  apropos: {
    title: 'À propos de Moul Pounj',
    body: 'La présentation officielle de Moul Pounj est en préparation.',
  },
  franchise: {
    title: 'Devenir franchisé',
    body: 'La présentation du programme et le formulaire de candidature ne sont pas encore disponibles. Aucune candidature n’est envoyée depuis cet aperçu.',
  },
  aide: {
    title: 'Aide & contact',
    body: 'Retrouvez les rubriques d’aide ci-dessous. Les services non raccordés sont signalés dans chaque rubrique.',
  },
  suivi: {
    title: 'Suivre ma commande',
    body: 'Le suivi de commande n’est pas connecté. Aucun statut de commande ne peut être consulté dans cet aperçu.',
  },
  livraison: {
    title: 'Livraison',
    body: 'Les zones, tarifs et délais de livraison officiels restent à renseigner.',
  },
  retours: {
    title: 'Retours & garanties',
    body: 'Les conditions officielles de retour et de garantie restent à renseigner.',
  },
  faq: {
    title: 'FAQ',
    body: 'Les réponses aux questions fréquentes sont en préparation.',
  },
  cgv: {
    title: 'Conditions générales de vente',
    body: 'Les conditions générales de vente validées ne sont pas encore disponibles. La commande et le paiement ne sont pas connectés.',
  },
  confidentialite: {
    title: 'Confidentialité',
    body: 'La politique de confidentialité validée reste à intégrer.',
  },
  cookies: {
    title: 'Gestion des cookies',
    body: 'Aucun outil publicitaire ou de mesure d’audience n’est intégré à cet aperçu. Le panier utilise le stockage local de votre navigateur. Le gestionnaire de consentement de la future version reste à raccorder.',
  },
  mentions: {
    title: 'Mentions légales',
    body: 'Les informations légales de l’éditeur restent à renseigner et à valider.',
  },
};
export const adviceLinks = [
  { label: 'Bien choisir son matelas', href: '/conseils/comment-choisir-son-matelas' },
  { label: 'Comprendre les technologies', href: '/conseils#technologies' },
  { label: 'Choisir ses dimensions', href: '/conseils#dimensions' },
  { label: 'Entretenir sa literie', href: '/conseils#care' },
];
export const directLinks = [
  { label: 'Oreillers', href: '/produit/oreiller-sublimya-visco' },
  { label: 'Nos magasins', href: '#magasins' },
  { label: 'Offres', href: '/offres' },
];
export const secondaryLinks = [
  { label: 'À propos de Moul Pounj', href: '/a-propos' },
  preview('Devenir franchisé', 'franchise'),
  preview('Aide & contact', 'aide'),
];
export const helpLinks = [
  {
    label: 'Nous contacter',
    contact: 'Bonjour, je souhaite contacter Moul Pounj.',
  },
  preview('Suivre ma commande', 'suivi'),
  preview('Livraison', 'livraison'),
  preview('Retours & garanties', 'retours'),
  preview('FAQ', 'faq'),
];
export const footerGroups = [
  {
    title: 'Nos produits',
    links: [
      category('Matelas', 'matelas'),
      category('Salon marocain', 'salon'),
      directLinks[0],
      directLinks[2],
    ],
  },
  {
    title: 'Moul Pounj',
    links: [
      { label: 'À propos', href: '/a-propos' },
      directLinks[1],
      secondaryLinks[1],
      { label: 'Conseils', href: '#conseils' },
    ],
  },
  { title: 'Besoin d’aide ?', links: helpLinks },
  {
    title: 'Informations',
    links: [
      preview('Conditions générales de vente', 'cgv'),
      preview('Confidentialité', 'confidentialite'),
      preview('Gestion des cookies', 'cookies'),
      preview('Mentions légales', 'mentions'),
    ],
  },
];
