# @dazdav/components-library

Une bibliothèque de composants Vue.js avec un CLI intégré pour faciliter leur gestion.

## Installation

```bash
npm install @dazdav/components-library
```

## Utilisation du CLI

Le CLI permet de gérer les composants dans votre projet Vue.js ou Nuxt.js.

### Commandes disponibles

#### Lister les composants
Affiche tous les composants disponibles avec leurs dépendances.

```bash
npx @dazdav/components-library list
```

#### Ajouter un composant
Copie un composant dans votre projet et installe ses dépendances.

```bash
npx @dazdav/components-library add <componentName>
```

Exemple :
```bash
npx @dazdav/components-library add Slideshow
```

#### Supprimer un composant
Supprime un composant de votre projet et désinstalle ses dépendances si elles ne sont plus utilisées.

```bash
npx @dazdav/components-library remove <componentName>
```

Exemple :
```bash
npx @dazdav/components-library remove Slideshow
```

## Structure des projets supportés

Le CLI détecte automatiquement le type de projet :

- Pour un projet Vue.js, les composants sont installés dans `src/components/`
- Pour un projet Nuxt.js, les composants sont installés dans `components/`

## Composants disponibles

- **Slideshow** : Un carrousel basé sur Swiper.js
  - Dépendances : swiper
- **HelloWorld** : Un composant de démonstration
  - Dépendances : aucune

## Note importante

Assurez-vous d'avoir un package.json valide à la racine de votre projet. Le CLI l'utilise pour détecter le type de projet et gérer les dépendances.