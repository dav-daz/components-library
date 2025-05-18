#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { loadComponents } from '../utils/components.js';
import { getComponentsPath } from '../utils/project-type.js';

const args = process.argv.slice(2);
const componentName = args[0];

if (!componentName) {
  console.error('Usage: npx add <componentName>');
  console.error('Example: npx add Slideshow');
  process.exit(1);
}

const components = loadComponents();

if (!components[componentName]) {
  console.error(`Erreur : Composant non trouvé. Composants disponibles : ${Object.keys(components).join(', ')}`);
  process.exit(1);
}

const { path: componentPath, dependencies } = components[componentName];
const sourcePath = path.resolve(process.cwd(), componentPath);
const componentsDir = getComponentsPath();
const destPath = path.resolve(process.cwd(), `${componentsDir}/${componentName}.vue`);

// Créer le dossier components s'il n'existe pas
fs.mkdirSync(path.dirname(destPath), { recursive: true });

fs.copyFile(sourcePath, destPath, (err) => {
  if (err) {
    console.error('Erreur lors de la copie du composant :', err);
    process.exit(1);
  }
  console.log(`Le composant ${componentName} a été installé avec succès dans ${componentsDir}/${componentName}.vue`);

  if (dependencies && dependencies.length > 0) {
    console.log(`Installation des dépendances : ${dependencies.join(', ')}`);
    exec(`npm install ${dependencies.join(' ')}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Erreur lors de l\'installation des dépendances :', stderr);
        process.exit(1);
      }
      console.log(stdout);
      console.log('Dépendances installées avec succès.');
    });
  }
});
