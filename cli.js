#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

// Obtenir le chemin actuel en utilisant import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les composants depuis le fichier JSON
const componentsPath = path.resolve(__dirname, './components.json');
const components = JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));

// Récupérer le nom du composant depuis les arguments de la commande
const args = process.argv.slice(2);
const componentName = args[1]; // Le nom du composant spécifié

if (!componentName || !components[componentName]) {
  console.error(`Erreur : Veuillez spécifier un composant valide parmi : ${Object.keys(components).join(', ')}`);
  process.exit(1);
}

// Récupérer les informations du composant
const { path: componentPath, dependencies } = components[componentName];

// Chemin source et destination
const sourcePath = path.resolve(__dirname, componentPath);
const destPath = path.resolve(process.cwd(), `src/components/${componentName}.vue`);

// Copier le fichier du composant
fs.copyFile(sourcePath, destPath, (err) => {
  if (err) {
    console.error('Erreur lors de la copie du composant :', err);
    process.exit(1);
  }
  console.log(`Le composant ${componentName} a été installé avec succès dans src/components/${componentName}.vue`);

  // Installer les dépendances nécessaires
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