#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { loadComponents } from '../utils/components.js';
import { getComponentsPath } from '../utils/project-type.js';
import { parseComponentArgs } from '../utils/args-parser.js';

// Récupération et traitement des arguments
const { componentName, customPath } = parseComponentArgs(process.argv.slice(2), 'add');

// Vérification de la présence du nom du composant
if (!componentName) {
    console.error('Usage: npx remove <componentName> [--path <customPath>]');
    console.error('Example: npx remove Slideshow');
    console.error('Example with custom path: npx remove Slideshow --path ./src/components/ui');
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

// Utiliser le chemin personnalisé ou le chemin par défaut
const componentsDir = customPath || getComponentsPath();
const targetDir = path.resolve(process.cwd(), componentsDir);
const componentPath = path.resolve(targetDir, `${componentName}.vue`);

// Vérification de l'existence du fichier avant suppression
if (!fs.existsSync(componentPath)) {
    console.error(`Erreur : Le composant n'existe pas dans ${path.relative(process.cwd(), componentPath)}`);
    process.exit(1);
}

const { dependencies } = components[componentName];

fs.unlink(componentPath, (err) => {
    if (err) {
        console.error('Erreur lors de la suppression du composant :', err);
        process.exit(1);
    }
    
    // Affichage du succès avec le chemin relatif pour plus de clarté
    console.log(`Le composant ${componentName} a été supprimé avec succès de ${path.relative(process.cwd(), componentPath)}`);

    // Gestion des dépendances
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