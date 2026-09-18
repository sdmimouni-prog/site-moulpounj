/** Préférences de recherche, sans indication de disponibilité au catalogue. */
export const choiceFields = [
  {
    id: 'comfort',
    icon: 'bed',
    title: 'مستوى الراحة',
    question: 'شنو كتحب؟',
    label: 'Confort souhaité',
    options: [
      { value: 'Souple', label: 'ناعم · Souple' },
      { value: 'Équilibré', label: 'متوازن · Équilibré' },
      { value: 'Ferme', label: 'قاصح · Ferme' },
      { value: 'À définir ensemble', label: 'نختارو مع بعضنا' },
    ],
  },
  {
    id: 'budget',
    icon: 'coins',
    title: 'الميزانية',
    question: 'شحال الميزانية ديالك؟',
    label: 'Budget maximum en MAD',
    options: [
      { value: '1000', label: 'حتى 1 000 MAD' },
      { value: '3000', label: 'حتى 3 000 MAD' },
      { value: '5000', label: 'حتى 5 000 MAD' },
      { value: 'custom', label: 'ميزانية أخرى · Autre' },
    ],
  },
  {
    id: 'dimension',
    icon: 'bounding-box',
    title: 'القياس',
    question: 'شنو المقاس؟',
    label: 'Dimensions souhaitées en centimètres',
    options: [
      { value: '90 × 190', label: '90 × 190 cm' },
      { value: '140 × 190', label: '140 × 190 cm' },
      { value: '160 × 200', label: '160 × 200 cm' },
      { value: '180 × 200', label: '180 × 200 cm' },
      { value: 'custom', label: 'قياس آخر · Sur mesure' },
      { value: 'À définir ensemble', label: 'باقي ما عارفش' },
    ],
  },
  {
    id: 'usage',
    icon: 'house',
    title: 'الاستعمال',
    question: 'فين غادي تستعملو؟',
    label: 'Usage prévu',
    options: [
      { value: 'Quotidien', label: 'كل نهار · Quotidien' },
      { value: 'Occasionnel', label: 'مرة مرة · Occasionnel' },
      { value: 'Chambre d’amis', label: 'بيت الضياف' },
      { value: 'Salon', label: 'الصالون · Salon' },
    ],
  },
];
