# @dazdav/components-library

Une bibliothèque de composants Vue.js avec un CLI intégré pour faciliter leur gestion.

## Installation

```bash
npm install @dazdav/components-library
```

## Utilisation du CLI

Le CLI permet de gérer les composants dans votre projet Vue.js ou Nuxt.js.

### Installer les assets

Cette commande installe le dossier assets et ses dépendances dans votre projet.

```bash
npx @dazdav/components-library install-assets
```

Les fichiers seront copiés :
- Dans `./src/assets` pour un projet Vue.js
- Dans `./assets` pour un projet Nuxt.js

Les dépendances suivantes seront installées :
- postcss-html
- postcss-scss
- sass
- sass-loader
- stylelint
- stylelint-config-recommended-scss
- stylelint-config-recommended-vue

### Commandes disponibles

#### Lister les composants disponibles
Affiche tous les composants disponibles avec leurs dépendances.

```bash
npx @dazdav/components-library list
```

### Ajouter un composant ou un dossier

```bash
npx @dazdav/components-library add <componentName>
```

Options :
- `--path <customPath>` : Spécifie un chemin d'installation personnalisé pour le composant

Exemples :
```bash
# Installation dans le dossier par défaut
npx @dazdav/components-library add Slideshow

# Installation dans un dossier personnalisé
npx @dazdav/components-library add Slideshow --path ./src/components/ui
npx @dazdav/components-library add Slideshow --path src/components/ui

# Installation d'un dossier de composants
npx @dazdav/components-library add preview
npx @dazdav/components-library add preview --path ./src/components/shared
```

### Supprimer un composant ou un dossier

```bash
npx @dazdav/components-library remove <componentName>
```

Options :
- `--path <customPath>` : Spécifie le chemin où le composant a été installé

Exemples :
```bash
# Suppression d'un composant du dossier par défaut
npx @dazdav/components-library remove Slideshow

# Suppression d'un composant d'un dossier personnalisé
npx @dazdav/components-library remove Slideshow --path ./src/components/ui
npx @dazdav/components-library remove Slideshow --path src/components/ui

# Suppression d'un dossier de composants
npx @dazdav/components-library remove preview
npx @dazdav/components-library remove preview --path ./src/components/shared
```

## Structure des projets supportés

Le CLI détecte automatiquement le type de projet :

- Pour un projet Vue.js, les composants sont installés dans `src/components/`
- Pour un projet Nuxt.js, les composants sont installés dans `components/`

Pour installer un composant dans un autre dossier, utilisez l'option `--path`.

## Composants disponibles

- **Slideshow** : Un carrousel basé sur Swiper.js
  - Dépendances : swiper
  
- **DummyComponent** : Un composant d’exemple simple  
  - Dépendances : aucune

- **IconA11y** : Icône accessible pour l’accessibilité  
  - Dépendances : aucune

- **VQuote** : Bloc de citation avec auteur et image  
  - Dépendances : aucune  
  - Composants requis : IconA11y

## Note importante

Assurez-vous d'avoir un package.json valide à la racine de votre projet. Le CLI l'utilise pour détecter le type de projet et gérer les dépendances.