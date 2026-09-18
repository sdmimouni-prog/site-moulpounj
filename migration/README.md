# Dossier de validation avant migration

Statut : préparé en local, aucun déploiement ni changement de domaine. L’indexation reste désactivée (`noindex,nofollow`).

## Contrôles réalisés

- 22 tests automatisés réussis ; Astro check et build sans erreur.
- Les 80 variantes ont été parcourues : prix unitaires et totaux à quantité 2, restauration du panier, rejet des variantes invalides et indisponibles.
- Audit HTML des 22 pages construites : liens internes, ancres, images locales et attributs alt. Résultats chiffrés dans `validation.json`.
- Correction : identifiants HTML ajoutés aux articles Conseils ; leurs liens d’ancre dépendaient jusque-là du JavaScript.
- Navigateur mobile 390 px : galerie et sélection Premium 35, ajout panier sans pop-up, total 200 × 200 = 3 200 MAD ; changement en 90 × 190 puis quantité 2 = 2 980 MAD. Aucun débordement horizontal observé sur la fiche et le panier contrôlés.
- Oreiller : quantité 2 = 500 MAD dans le panier mobile, sans débordement. Articles de test retirés ensuite. Aucune commande envoyée.
- Ces tests ne constituent pas une certification tous appareils : contrôle final Safari/iOS et Android réels à prévoir. Les liens externes et la réception de commande ne sont pas validés par l’audit HTML.

## SEO préparé

14 titres et descriptions uniques sont désormais utilisés par les fiches, depuis `src/data/product-seo.json`. Les chemins canoniques sont préparés dans ce fichier, sans domaine de production imposé. Pas de données structurées de stock ou d’avis inventées.

Avant ouverture à l’indexation : confirmer le domaine final, définir les canoniques absolues et le sitemap, vérifier les pages publiques autorisées, puis retirer noindex uniquement après validation. Ne pas retirer noindex du panier ou des pages privées. Le guide article actuellement en préparation doit rester exclu tant qu’il n’est pas validé.

## URL et redirections

`url-map.json` associe les 14 anciennes URL produit aux fiches correspondantes. Leurs chemins sont conservés : pas de redirection vers la même adresse, ni de nouvelle page pour une dimension.

Deux règles 301 sont proposées dans `redirects-proposed.txt` pour les anciennes catégories mousse et ressorts vers les filtres du catalogue. Ce fichier est volontairement hors du dossier public et n’est pas activé. Vérifier, sur l’hébergeur retenu, la conservation de `?technologie=...`, la normalisation des slashs, HTTPS et www sans chaînes ni boucles.

Périmètre de la table : produits et catégories identifiés dans l’inventaire public. Avant bascule du site entier, compléter les anciennes pages/articles/taxonomies à partir du sitemap complet, de Search Console ou d’un export WordPress. Ne pas rediriger globalement les URL inconnues vers l’accueil.

## Points bloquants avant mise en production

1. Choisir le canal et le destinataire de réception des commandes : toujours non configurés. Tester une commande de bout en bout après connexion, puis valider sa réception réelle.
2. Confirmer les stocks, frais de livraison, unités de vente des banquettes, garanties et contenus commerciaux.
3. Terminer ou exclure les pages et promotions de démonstration restantes.
4. Valider l’hébergement, domaine, règles HTTP 301 et politique d’indexation.
5. Sauvegarder ancien site/base/médias et prévoir le retour arrière avant bascule.

Aucune modification du site moulpounj.ma n’a été effectuée.
