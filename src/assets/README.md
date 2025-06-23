# Configuration des styles

Ce dossier contient les styles globaux et utilitaires pour votre application.

## Configuration pour Vue.js (vite.config.ts)

Pour utiliser correctement les styles dans une application Vue.js, ajoutez la configuration suivante dans votre `vite.config.ts` :

```typescript
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // ...autres configurations...
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@helpers': fileURLToPath(new URL('./src/assets/styles/helpers', import.meta.url)),
      '@var': fileURLToPath(new URL('./src/assets/styles/helpers/var', import.meta.url)),
      '@function': fileURLToPath(
        new URL('./src/assets/styles/helpers/_function.scss', import.meta.url),
      ),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern',
        additionalData: '@use "@/assets/styles/helpers/index.scss" as *;',
      },
    },
    devSourcemap: true,
  },
})
```
Dans `src\main.ts`, ajouter:
```typescript
import '@/assets/styles/main.scss'
```

## Configuration pour Nuxt.js (nuxt.config.ts)

Pour une application Nuxt.js, utilisez cette configuration dans votre `nuxt.config.ts` :

```typescript
export default defineNuxtConfig({
  // ...autres configurations...
  css: [
    '@/assets/styles/main.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/helpers/index.scss" as *;'
        }
      },
      devSourcemap: true
    }
  },
  alias: {
    '@helpers': '~/assets/styles/helpers',
    '@var': '~/assets/styles/helpers/var',
    '@function': '~/assets/styles/helpers/_function.scss'
  }
})
```

Cette configuration :
- Définit des alias pour faciliter l'import des styles
- Configure SASS/SCSS avec l'API moderne
- Inclut automatiquement le fichier `index.scss` dans tous les composants
- Active les sourcemaps pour le débogage

## Utilisation

Une fois configuré, vous pouvez utiliser les styles dans vos composants :

```vue
<style lang="scss">
// Les variables et mixins sont automatiquement disponibles
.my-component {
  padding: var(--gutter-20);
  @include my-mixin;
}
</style>
```