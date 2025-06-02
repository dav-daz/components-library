#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { getComponentsPath } from '../utils/project-type.js';
import { parseComponentArgs } from '../utils/args-parser.js';
import { loadComponents, isDirectory, removeDependencies, removeDir } from '../utils/component-checker.js';

// Récupération et traitement des arguments
const { componentName, customPath } = parseComponentArgs(process.argv.slice(2), 'add');

// Vérification de la présence du nom du composant
if (!componentName) {
    console.error('Usage: npx remove <componentName> [--path <customPath>]');
    console.error('Example: npx remove Slideshow');
    console.error('Example with custom path: npx remove Slideshow --path ./src/components/ui');
    process.exit(1);
}

const components = loadComponents();

if (!components[componentName]) {
    console.error(`Erreur : Composant non trouvé. Composants disponibles : ${Object.keys(components).join(', ')}`);
    process.exit(1);
}

// Vérifier si c'est un dossier ou un fichier
const { path: componentPath, dependencies } = components[componentName];
const isDir = isDirectory(componentPath);

// Utiliser le chemin personnalisé ou le chemin par défaut
const componentsDir = customPath || getComponentsPath();
const targetDir = path.resolve(process.cwd(), componentsDir);
const itemPath = isDir
    ? path.resolve(targetDir, componentName)
    : path.resolve(targetDir, `${componentName}.vue`);

// Vérification de l'existence du fichier avant suppression
if (!fs.existsSync(itemPath)) {
    console.error(`Erreur : ${isDir ? 'Le dossier' : 'Le composant'} n'existe pas dans ${path.relative(process.cwd(), itemPath)}`);
    process.exit(1);
}

// Suppression selon le type
if (isDir) {
    try {
        await removeDir(itemPath);
        console.log(`Le dossier ${componentName} a été supprimé avec succès de ${path.relative(process.cwd(), itemPath)}`);
        await removeDependencies(dependencies, components, componentName);
    } catch (err) {
        console.error('Erreur lors de la suppression :', err);
        process.exit(1);
    }
} else {
    try {
        await fs.promises.unlink(itemPath);
        console.log(`Le composant ${componentName} a été supprimé avec succès de ${path.relative(process.cwd(), itemPath)}`);
        await removeDependencies(dependencies, components, componentName);
    } catch (err) {
        console.error('Erreur lors de la suppression :', err);
        process.exit(1);
    }
}