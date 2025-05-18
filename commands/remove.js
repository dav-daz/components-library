#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { loadComponents } from '../utils/components.js';
import { getComponentsPath } from '../utils/project-type.js';

const args = process.argv.slice(2);
const componentName = args[0];

if (!componentName) {
  console.error('Usage: npx remove <componentName>');
  console.error('Example: npx remove Slideshow');
  process.exit(1);
}

function isDependencyUsedElsewhere(components, dependency, excludeComponent) {
  return Object.entries(components).some(([name, info]) => {
    return name !== excludeComponent && info.dependencies.includes(dependency);
  });
}

const components = loadComponents();

if (!components[componentName]) {
  console.error(`Erreur : Composant non trouvé. Composants disponibles : ${Object.keys(components).join(', ')}`);
  process.exit(1);
}

const componentsDir = getComponentsPath();
const componentPath = path.resolve(process.cwd(), `${componentsDir}/${componentName}.vue`);
const { dependencies } = components[componentName];

fs.unlink(componentPath, (err) => {
  if (err) {
    console.error('Erreur lors de la suppression du composant :', err);
    process.exit(1);
  }
  console.log(`Le composant ${componentName} a été supprimé avec succès de ${componentsDir}/${componentName}.vue`);

  if (dependencies && dependencies.length > 0) {
    const depsToRemove = dependencies.filter(dep => !isDependencyUsedElsewhere(components, dep, componentName));

    if (depsToRemove.length > 0) {
      console.log(`Suppression des dépendances non utilisées : ${depsToRemove.join(', ')}`);
      exec(`npm uninstall ${depsToRemove.join(' ')}`, (err, stdout, stderr) => {
        if (err) {
          console.error('Erreur lors de la désinstallation des dépendances :', stderr);
          process.exit(1);
        }
        console.log(stdout);
        console.log('Dépendances désinstallées avec succès.');
      });
    }
  }
});
