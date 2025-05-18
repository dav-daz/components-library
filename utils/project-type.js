import fs from 'fs';
import path from 'path';

export function detectProjectType() {
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // Vérifie si nuxt est présent dans les dépendances
    const hasNuxt = packageJson.dependencies?.nuxt || packageJson.devDependencies?.nuxt;

    return hasNuxt ? 'nuxt' : 'vue';
  } catch (error) {
    console.warn('Impossible de détecter le type de projet, utilisation de Vue.js par défaut');
    return 'vue';
  }
}

export function getComponentsPath() {
  const projectType = detectProjectType();
  return projectType === 'nuxt' ? './components' : './src/components';
}
