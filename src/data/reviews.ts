/** Presentation slots only. Never publish mockup quotes as genuine reviews. */
export const reviewPreviews = [1, 2, 3, 4, 5].map((id) => ({
  id,
  portrait: `/images/reference/review-portrait-${((id - 1) % 3) + 1}.webp`,
  title: 'Avis à venir',
  location: 'Ville à renseigner',
  copy: 'تجربتكم كتهمنا. هنا غادي تلقاو آراء الزبناء من بعد التأكد منها والموافقة على نشرها.',
  note: 'Aperçu · portrait illustratif · aucun avis publié',
}));
