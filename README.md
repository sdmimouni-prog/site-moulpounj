> Mise à jour : extraction des photos autorisée par l’utilisateur. Onze recadrages photographiques sont désormais intégrés (hero, catégories, produits, magasin, bannière), exportés en WebP. Les textes et contrôles restent en HTML. Les petits visuels produit sont limités par la résolution de la maquette. Les remarques ci-dessous sur les emplacements photo décrivent l’état initial, remplacé par cette mise à jour. Les données commerciales restent à valider.

# Moul Pounj — nouvelle homepage locale

## Démarrage

Stack reprise de la version récente `../richmedia-astro` : Astro 7, TypeScript strict, Tailwind CSS 4. CSS de marque indépendant, composants Astro, interactions TypeScript côté navigateur. Aucun backend ajouté.

```sh
cd "/Users/salaheddinemimouni/Documents/New project/moul-pounj-home"
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:4325. Node >=22.12 et <27. Dans Astro 7, `astro dev` peut s’exécuter comme service local ; `npx astro dev stop` permet de l’arrêter.

```sh
npm run verify # TypeScript/Astro, tests métier et compilation statique
npm run build
npm run preview
```

## Organisation

- `src/pages/index.astro` : composition des huit blocs demandés.
- `src/components/` : header, hero, catégories, produits, aide au choix, réassurance, magasins, avis, footer, media et fenêtres modales.
- `src/layouts/Layout.astro` : métadonnées et polices locales.
- `src/data/site.ts` : textes éditoriaux, navigation, catégories, configuration des visuels et numéro WhatsApp.
- `src/data/catalog.ts` : types de produits et magasins, collections validées actuellement vides, emplacements d’aperçu séparés.
- `src/lib/commerce.ts` : validation des variantes, panier, restauration, filtrage des recommandations et URL WhatsApp.
- `src/lib/client.ts` : interactions locales et messages d’état.
- `src/styles/global.css` : palette, typographie, composants et breakpoints.
- `src/assets/logo.png` : logo original conservé, dérivés WebP et srcset générés par Astro.
- `verification/` : captures navigateur et comparaisons avec les références, exclusivement pour la recette.

Les futures pages catalogue, produit et magasins pourront réutiliser les composants, données et layout. Aucune page future ni maquette n’a été inventée. Les liens existants pointent vers les sections de la homepage.

## Assets et données à fournir

Les huit exports de maquette et le logo ont été fournis. Aucun fichier photo distinct ni inventaire produit validé n’a été joint à cette demande. Une ancienne copie locale `../moul-pounj-site` contient d’autres images et des données : elles n’ont pas été réutilisées, leur conformité à ce nouveau lot n’étant pas confirmée.

À fournir :

1. Photo originale du hero, quatre photos de catégories, quatre photos de produits, photo magasin, photo de la bannière finale et éventuel visuel de carte sans points de vente inventés.
2. Catalogue validé : identifiants, noms, catégories, descriptions, dimensions réellement disponibles, prix, attributs de confort et usages. Les prix et avis figurant dans les maquettes ne constituent pas des données commerciales validées.
3. Liste officielle des magasins, coordonnées, horaires et liens de carte.
4. Avis authentiques autorisés et engagements de service validés.
5. Numéro public WhatsApp officiel ; renseigner `PUBLIC_WHATSAPP_NUMBER` dans `.env` en format international sans `+` ni espaces. Recompiler/redémarrer après changement. Cette valeur est publique, jamais un secret.

Les emplacements affichent clairement leur état d’attente. Les maquettes ne sont ni affichées comme page ni découpées en photos de substitution. Les textes restent sélectionnables et les contrôles sont natifs.

## Fonctionnement et limites

- Menu responsive avec Escape, ancrages, filtres, recherche catalogue et recherche magasins.
- Fenêtres `dialog` natives : confinement du focus, fermeture Escape et retour du focus au déclencheur.
- L’aide au choix reprend les préférences dans une demande de conseil. Aucune recommandation sans données suffisantes.
- WhatsApp utilise un message contextualisé. Sans numéro, un brouillon modifiable et copiable est présenté, sans envoi.
- Les cartes d’aperçu ne sont pas achetables. Le mécanisme de panier est prêt pour les données validées : variante obligatoire, validation des références restaurées, persistance locale avec repli en mémoire. Son parcours avec produits réels reste à vérifier une fois le catalogue fourni.
- Compte, paiement, commande, livraison et CRM non raccordés. Aucune fausse confirmation, collecte distante, secret ou déploiement.
- Polices Nunito Sans / Noto Sans Arabic auto-hébergées. Icônes Phosphor. Les fichiers de polices exacts de la maquette n’étant pas fournis, une correspondance typographique stricte ne peut pas être certifiée.

## Vérification

Voir `design-qa.md`. Vérifications fonctionnelles et responsive réalisées dans le navigateur intégré aux largeurs 1440, 768 et 390 px. La recette de fidélité finale reste bloquée par l’absence des photos originales et des données validées ; cet aperçu ne doit pas être présenté comme une reproduction finale de la maquette.

## Hero animé — nouveau lot

Le hero reprend la composition de la capture du 17/09 à 20:40 : accroche noire/orange, chambre terracotta, transition crème, deux CTA et quatre repères. Trois fonds d’ambiance ont été générés à partir des références et exportés en WebP dans `public/images/hero/`. Ce sont des visuels d’ambiance, pas des fiches produit validées.

- Données : `src/data/hero.ts` ; styles : `src/styles/hero.css` ; comportement : `src/lib/carousel.ts`.
- Trois slides : Matelas, Salon Marocain, Oreillers. CTA de chaque slide filtre la sélection correspondante.
- Fondu, léger zoom, apparition progressive des contenus ; intervalle 7 secondes.
- Flèches, pagination, clavier gauche/droite et swipe horizontal. Une navigation manuelle met la lecture en pause.
- Pause explicite, pause au survol/focus, onglet masqué et hero hors écran. `prefers-reduced-motion` désactive les animations et l’autoplay initial.
- Slides inactifs `inert` et `aria-hidden`, annonce discrète des changements manuels.
- Les chiffres et promesses non validés de la référence (+40 points de vente, livraison nationale, fabrication directe) n’ont pas été ajoutés.

### Navigation et footer

L’arborescence, les groupes de liens et les états des destinations sont centralisés dans `src/data/navigation.ts`. Le header utilise un méga-menu Matelas (deux colonnes et un visuel), un menu visuel Salon marocain et un déroulant Conseils. Oreillers ouvre directement l’état de préparation de la fiche Sublimya Visco. Nos magasins mène à la section réseau existante. Les destinations non intégrées ouvrent un état explicite, sans route cassée ni donnée commerciale inventée. Les photographies des menus sont les extraits de référence déjà autorisés ; les originaux restent à fournir.

La barre secondaire contient À propos, Devenir franchisé et Aide & contact. Pas de sélecteur de langue avant disponibilité des deux versions. Aucune accentuation promotionnelle sans offre validée. WhatsApp reste vert et dépend du paramètre central existant. Recherche par nom, catégorie et dimensions, avec normalisation des espaces, accents et séparateurs de dimensions.

Contrôle navigateur : menus desktop, fermeture Échap et retour du focus, accès direct Oreillers, aide Livraison, menu mobile et fermeture après navigation, filtre Matelas, footer et absence de débordement aux largeurs 1440, 768 et 390 px. Captures dans `verification/navigation-*.png` et `verification/footer-mobile-390.png`. Les résultats de recherche sur catalogue réel restent à valider lorsque les données seront disponibles.

### Bloc magasins — intégration revue

Composition en trois parties (texte, carte SVG illustrative, visuel de façade), repères de villes accessibles au clavier et connectés à la recherche existante. Les villes viennent de la maquette et ne prouvent pas l’existence de magasins ; les implantations et leur nombre restent à confirmer. Le badge +40 est donc remplacé par un accueil sans chiffre.

`public/images/reference/store-restored.webp` est une restauration générative de la photo présente dans la maquette, avec suppression du badge commercial intégré. C’est un visuel de présentation, pas une photographie contractuelle d’un magasin vérifié. La carte est schématique et non destinée à la navigation géographique.

Animations : entrée au premier passage dans l’écran, apparition décalée des repères, zoom/reflet sur la photo, badge et icônes au survol. Respect de prefers-reduced-motion. Vérifications : 1440/768/390 px sans débordement ; clic Casablanca transmet la ville au champ de recherche ; état catalogue magasins absent conservé. Captures `verification/stores-*.png`.

### Bannière finale et footer clair

Bannière HTML/CSS reconstruite d’après la référence : visuel restauré (`sleep-restored.webp`), voile orange, feuillage SVG, titre arabe sélectionnable, quatre icônes et CTA vers la sélection. Animation unique à l’entrée dans l’écran : révélation du voile par découpe elliptique, léger zoom photo, apparition décalée des textes et icônes, puis footer. Réduction des animations respectée. Footer clair conservant les quatre groupes de navigation validés ; aucun moyen de paiement ni réseau social non raccordé n’est présenté comme actif.

Contrôles : Astro check sans erreurs, build réussi, rendu 1440/768/390 px sans débordement, CTA vers #selection vérifié. Captures `verification/closing-*.png`. Écarts assumés à la référence : photo restaurée générativement, police manuscrite de substitution, textes sans promesses de santé non validées et navigation du footer précédemment validée. La reproduction n’est donc pas strictement pixel pour pixel.

### Carte du réseau (17 septembre 2026)

Leaflet affiche le fond OpenStreetMap avec attribution. Chargement à l’approche du bloc, zoom molette désactivé pour préserver le défilement. Le fond nécessite une connexion ; les fiches HTML et liens restent disponibles sans carte.

- Réseau annoncé par le propriétaire : 40 magasins.
- Source : https://moulpounj.ma/nos-magasins/ — **31 fiches publiées**, 17 villes ; 9 fiches manquent.
- `src/data/stores.json` : noms, adresses, horaires, téléphones, liens Maps publiés. `scripts/import-stores.py` permet de réimporter le HTML source.
- Un seul lien publié résout une position exacte : Agadir Hay Mohammadi, `30.4330811, -9.5532717`. Les 30 autres adresses sont représentées par 16 pins de ville portant leur nombre. Aucune coordonnée de boutique n’est déduite du centre de ville.
- `src/data/store-cities.json` : centres de ville issus du géocodage Open-Meteo/GeoNames, avec URL source par entrée ; Had Soualem vérifié séparément via Geodatos pour éviter un homonyme.
- Ajouter les fiches manquantes et les GPS vérifiés dans la configuration pour compléter les 40 positions exactes. Les liens d’itinéraire sont ceux de la source, souvent des recherches Google Maps.
- Fond : https://tile.openstreetmap.org/{z}/{x}/{y}.png. Respecter la politique https://operations.osmfoundation.org/policies/tiles/ et choisir un fournisseur adapté avant un usage de production important. Aucun secret/API key.

### Landing page Premium 35

Route locale : `/produit/matelas-premium-35`. Composants découplés dans `src/components/product/`, configuration dans `src/data/premium35.ts`, interactions dans `src/lib/product-landing.ts`, styles isolés dans `src/styles/product-landing.css`.

Prix de départ **1 490 MAD** fourni dans le brief, sans extrapolation par variante. Les trois dimensions sont des choix de présentation, non des disponibilités confirmées (`dimensionsConfirmed: false`). Tant que les prix de variante ne sont pas validés, le CTA ouvre une demande de confirmation ; aucune commande ni paiement n’est simulé. Le numéro WhatsApp reste `PUBLIC_WHATSAPP_NUMBER`.

À fournir : tarifs par variante, disponibilité des dimensions, caractéristiques produit, vidéo et durée, témoignages autorisés, modes de paiement et réseaux sociaux. Les visuels existants sont réutilisés comme illustrations : la photo exacte de chambre de la nouvelle maquette n’est pas un fichier photo autonome. Aucun avis ni avantage médical n’est présenté comme validé. Le lecteur vidéo affiche explicitement son absence de source.

Vérification : `npm run verify`. Lancement : `npm run dev`.

### Salon marocain / Banquettes

Route : `/salon-marocain`. Données dans `src/data/salon.ts`, composants dans `src/components/salon/`, styles dans `src/styles/salon.css`. Header, méga-menus, footer, logo, polices, dialogues et contact sont réutilisés. La homepage conserve ses ancres et son rendu par défaut ; les liens partagés sur la nouvelle route rejoignent les bons blocs de l’accueil.

Les quatre noms de références viennent du brief. Aucun JSON catalogue ni correspondance photo/modèle n’était joint ou présent dans le projet : `image`, `priceMAD`, `priceUnit`, `included` restent null et `characteristics` vide. Aucun prix ni service sur mesure n’est inventé. Ajouter les données validées ici ; une valeur de prix seule sans unité et périmètre n’est pas affichée. Les boutons ouvrent une fiche et préparent une demande reprenant le nom exact.

`salon.preview` est actif avec `astro dev`, ou explicitement `PUBLIC_SALON_PREVIEW=true`. En build public, les blocs vidéo et témoignages sans données sont masqués. La source vidéo accepte un fichier local ou une URL de média vidéo compatible HTML5. Pas de lecteur sans source, ni durée simulée. Guide officiel, détail des offres, vidéo, photos de détail, avis et numéro WhatsApp restent à fournir. Les photos d’ambiance disponibles ne sont pas associées à un modèle commercial ni présentées comme photos clients.

Tests : `npm run verify`. Les interactions et largeurs 390/430/768/1440 ont été contrôlées en navigateur. Le build public a été inspecté pour vérifier le masquage des sections vides.

### Localisateur `/nos-magasins`
- Données : `src/data/store-locator.ts` enrichit `stores.json`, sans créer de nouvelles implantations. 31 fiches importées sur le réseau de 40 annoncé ; un GPS exact (Agadir). Les centres de villes ne sont pas utilisés comme coordonnées de magasins.
- Recherche nom/adresse/ville, alias arabes disponibles, filtre combiné ; géolocalisation uniquement après clic, en mémoire, distances à vol d’oiseau uniquement pour GPS validés.
- Leaflet/OpenStreetMap existants, sans clé. Sur mobile chargement différé au premier accès à la carte. Liste autonome en cas de panne cartographique.
- À fournir : 9 fiches supplémentaires, GPS précis des 30 autres fiches, quartiers/alias arabes, photos associées, horaires hebdomadaires fiables et exceptions, services et éventuels WhatsApp propres aux magasins. Les horaires textuels ne déclenchent pas de statut ouvert/fermé.
- Le contact central utilise `PUBLIC_WHATSAPP_NUMBER` existant. Les liens cartographiques sans GPS sont les liens de recherche publiés par la source : vérifier la destination avant le déplacement.
- Géolocalisation : prévoir HTTPS hors localhost. Aucun stockage de la position. Test d’une localisation réelle et des permissions navigateur restant à effectuer.

Mise à jour de la carte du localisateur : mêmes repères que l’accueil (16 groupes par ville + 1 GPS précis). Un clic sur une fiche sans GPS centre sur sa ville et affiche son propre nom/adresse avec la mention « repère de ville ». Les filtres recalculent les groupes. Les distances restent calculées uniquement depuis les GPS précis, jamais depuis ces centres de villes. Vérifié : Sidi Maarouf → Bourgogne, filtre Marrakech (3 fiches / 1 repère), sélection mobile et chargement des 17 pins.

### Oreiller Sublimya Visco
Route `/produit/oreiller-sublimya-visco`, entrée Oreillers reliée et active. Header, méga-menus, footer, dialogue WhatsApp et panier communs réutilisés.
`src/data/sublimya-visco.ts` centralise médias, spécifications, FAQ, stock et contenu vendu. Le produit commercial doit être validé dans `catalog.ts` avec le même identifiant ; aucun tarif tiré de la maquette. Sans prix : contact conseiller contextualisé avec quantité. Sans stock connu : plafond technique de 99, sans promesse de disponibilité. Les CTA partagent la quantité et l’entrée du panier `addCatalogQuantity`.
Photos originales absentes : emplacements explicites, aucune photo générique attribuée à Sublimya Visco. Galerie/zoom/clavier/tactile prévus dès renseignement de `media`. Vidéo et témoignages absents masqués en build production, aperçus identifiés en développement. Pas de pack ni de prix inventé.
Vérifié : quantité minimale/entière/plafond/stock nul, synchronisation hero/barre fixe, demande WhatsApp avec quantité, FAQ, menu Oreillers actif, absence de débordement à 390/430/768/1440 px. Galerie/zoom et lecture vidéo non vérifiables sans médias ; vrai ajout produit non disponible sans entrée catalogue validée.
