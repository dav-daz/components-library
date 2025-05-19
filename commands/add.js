#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { loadComponents } from '../utils/components.js';
import { getComponentsPath } from '../utils/project-type.js';

// Configuration du chemin pour ES modules
// Nécessaire car __dirname n'est pas disponible par défaut dans les modules ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Récupération du chemin par défaut pour les composants
// Ce chemin est déterminé en fonction du type de projet (Vue, Nuxt, etc.)
const componentsDir = getComponentsPath();

// Récupération des arguments de la ligne de commande
// process.argv[0] est node
// process.argv[1] est le chemin du script
// on commence donc à partir de l'index 2
const args = process.argv.slice(2);
let componentName = null;
let customPath = null;

// Parcourir les arguments pour extraire :
// - le nom du composant (premier argument qui n'est pas une option)
// - le chemin personnalisé (valeur après --path)
for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path') {
        customPath = args[i + 1];
        i++; // Sauter le prochain argument car c'est la valeur de l'option
    } else if (!componentName) {
        componentName = args[i];
    }
}

// Vérification de la présence du nom du composant
// Affichage de l'aide si aucun composant n'est spécifié
if (!componentName) {
    console.error('Usage: npx add <componentName> [--path <customPath>]');
    console.error('Example: npx add Slideshow');
    console.error('Example with custom path: npx add Slideshow --path ./src/components/ui');
    process.exit(1);
}

// Chargement de la liste des composants disponibles
// Cette liste est définie dans un fichier de configuration
const components = loadComponents();

// Vérification de l'existence du composant demandé
if (!components[componentName]) {
    console.error(`Erreur : Composant non trouvé. Composants disponibles : ${Object.keys(components).join(', ')}`);
    process.exit(1);
}

// Extraction des informations du composant
const { path: componentPath, dependencies } = components[componentName];

// Construction des chemins source et destination
// sourcePath : chemin vers le composant dans le package
// destPath : chemin où le composant sera copié dans le projet cible
const sourcePath = path.resolve(__dirname, '..', componentPath);
const targetDir = customPath 
    ? path.resolve(process.cwd(), customPath)
    : path.resolve(process.cwd(), componentsDir);
const destPath = path.resolve(targetDir, `${componentName}.vue`);

// Création du dossier de destination s'il n'existe pas
fs.mkdirSync(path.dirname(destPath), { recursive: true });

// Copie du fichier du composant
fs.copyFile(sourcePath, destPath, (err) => {
    if (err) {
        console.error('Erreur lors de la copie du composant :', err);
        process.exit(1);
    }
    // Affichage du succès avec le chemin relatif pour plus de clarté
    console.log(`Le composant ${componentName} a été installé avec succès dans ${path.relative(process.cwd(), destPath)}`);

    // Installation des dépendances si le composant en a
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