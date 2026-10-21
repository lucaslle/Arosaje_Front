# A'rosa-je — Front

Application web d'A'rosa-je : des particuliers confient leurs plantes à d'autres membres pendant leur absence et demandent conseil à des botanistes.

Ce dépôt contient l'interface (React). Elle a besoin de l'API du dépôt [Arosaje_Back](https://github.com/lucaslle/Arosaje_Back) pour fonctionner.

## Fonctionnalités

- **Compte** : inscription, connexion, déconnexion, modification du profil et du mot de passe, export de ses données (RGPD), suppression du compte.
- **Tableau de bord** : page d'arrivée avec ses chiffres clés, les actions à faire (offres reçues, avis à donner), les plantes que l'on garde et sa réputation de gardien.
- **Mes plantes** : ajout avec photo, modification, suppression, commentaires.
- **Garde** :
  - le propriétaire demande une garde avec des dates de début et de fin ;
  - les membres proposent leur garde ;
  - le propriétaire accepte ou refuse les offres ;
  - le propriétaire et le gardien échangent par une messagerie privée ;
  - le gardien tient un journal de garde avec photos ;
  - à la fin, le propriétaire note le gardien.
- **Plantes et Gardiennage** : liste des plantes de la communauté et des demandes de garde, avec recherche par nom ou lieu et chargement par pages.
- **Favoris** : enregistrer des plantes avec le cœur des cartes.
- **Botanistes** :
  - le propriétaire pose une question sur l'une de ses plantes ;
  - les botanistes validés y répondent depuis leur page « Conseils » ;
  - leurs réponses sont épinglées en tête des commentaires.
- **Administration** : validation des membres qui se déclarent botanistes (réservé aux administrateurs).
- **Langues** : français, anglais, espagnol, allemand, italien et portugais, au choix depuis le menu à drapeaux de l'en-tête.
- **Thème** : mode clair et mode sombre, qui suit par défaut le réglage du système.

## Technologies

- [React 18](https://react.dev) + TypeScript, construit avec [Vite](https://vitejs.dev)
- [Chakra UI 2](https://v2.chakra-ui.com) pour les composants et le thème
- [React Router 7](https://reactrouter.com) pour la navigation
- [Zustand](https://zustand-demo.pmnd.rs) pour l'état partagé (membre connecté, langue)
- [Vitest](https://vitest.dev) + Testing Library pour les tests
- Icônes [Font Awesome 6](https://fontawesome.com), polices Varela Round et Nunito Sans (chargées depuis un CDN dans `index.html`)

## Démarrage

Prérequis : Node.js 22 et l'API qui tourne (voir le README d'Arosaje_Back). L'API écoute par défaut sur `http://localhost:8000`.

```bash
npm ci
```

```bash
npm run dev
```

L'application est alors disponible sur http://localhost:5000.

L'adresse de l'API se règle dans `.env` :

```
VITE_API_URL=http://localhost:8000
```

L'API n'accepte que les origines listées dans son réglage `CORS_ORIGINS` (par défaut `http://localhost:5000`). Si tu changes le port du front, ajoute la nouvelle adresse dans ce réglage côté back.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement avec rechargement automatique |
| `npm test` | Lance tous les tests une fois |
| `npm run test:ui` | Interface de Vitest pour lancer les tests à la main |
| `npm run build` | Vérifie les types puis construit la version de production dans `dist/` |
| `npm run preview` | Sert localement la version construite |
| `npm run lint` | Analyse le code avec ESLint |

## Organisation du code

```
src/
├── api/            client HTTP (api, token, erreurs), types des données, hook favoris/offres
├── component/
│   ├── generic/    briques réutilisées : barre latérale, en-tête, cartes de plantes, préférences, drapeaux…
│   ├── specific/   fonctionnalités : connexion, garde (offres, messages, journal, notes), commentaires, paramètres…
│   └── test/       tests Vitest
├── i18n/           traductions (un fichier par langue) et hook useT
├── page/           une page par route (tableau de bord, mes plantes, gardiennage, paramètres…)
├── store/          état partagé : membre connecté, session
├── theme.tsx       couleurs, polices et styles des composants (clair et sombre)
└── App.tsx         routes et protection des pages réservées aux membres connectés
```

Les pages, sauf `/login`, sont réservées aux membres connectés. Sans token valide, ou sur une adresse inconnue, l'application renvoie vers `/login`.

## Traductions

Les textes sont dans `src/i18n/`, un fichier par langue (`fr.ts`, `en.ts`, …). Le français sert de référence.

Pour ajouter un texte :
1. ajoute la clé dans `fr.ts` ;
2. ajoute-la dans chacune des autres langues ;
3. utilise `const t = useT();` puis `t("ma.cle")` dans le composant.

Une variable s'écrit `{nom}` dans le texte, et se remplit avec `t("ma.cle", { nom: "Monstera" })`.

Pour ajouter une langue :
1. crée le fichier de la langue ;
2. déclare-la dans `LANGUAGES` et `dictionaries`, dans `src/i18n/index.ts` ;
3. dessine son drapeau dans `src/component/generic/flag.tsx`.

TypeScript refuse un fichier de langue auquel il manque une clé. Les tests vérifient aussi que les variables `{…}` sont conservées dans chaque langue.

La politique de confidentialité n'existe qu'en français. Dans les autres langues, un message le signale.

## Thème

Les couleurs sont des couleurs nommées (`bg.surface`, `text.muted`, `text.brand`…) définies une seule fois dans `src/theme.tsx`, avec une valeur pour le mode clair et une pour le mode sombre. Utilise ces noms dans les composants plutôt que des couleurs directes : ainsi, les deux modes restent lisibles.

## Tests et CI

```bash
npm test
```

La CI GitHub (`.github/workflows/test.yml`) lance `npm ci`, `npm test` et `npm run build` à chaque push.
