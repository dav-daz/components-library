#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Charger les composants depuis le fichier JSON
const components = require('./composants.json');

// Récupérer le nom du composant depuis les arguments de la commande
const componentName = process.argv[2];

if (!componentName || !components[componentName]) {
  console.error('Erreur : Veuillez spécifier un composant valide parmi :', Object.keys(components).join(', '));
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
  if (dependencies.length > 0) {
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