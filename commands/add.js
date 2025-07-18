#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { getDirPathFromUrl } from '#utils/paths.js';
import { getComponentsPath } from '#utils/project-type.js';
import { parseComponentArgs } from '#utils/args-parser.js';
import { loadComponents, findComponentInDir, askInstallPath, installRequiredComponent, isDirectory, copyDir, installDependencies } from '#utils/component-checker.js';

// Configuration du chemin pour ES modules
const __dirname = getDirPathFromUrl(import.meta.url);

// Récupération du chemin par défaut pour les composants
// Ce chemin est déterminé en fonction du type de projet (Vue, Nuxt, etc.)
const componentsDir = getComponentsPath();

// Récupération et traitement des arguments
const { componentName, customPath } = parseComponentArgs(process.argv.slice(2), 'add');

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

// Vérification si le composant existe déjà
const defaultSearchDir = path.resolve(process.cwd(), getComponentsPath());
const componentExists = await findComponentInDir(componentName, defaultSearchDir);
if (componentExists) {
    console.error(`Info : Le composant "${componentName}" existe déjà dans le dossier ${path.relative(process.cwd(), defaultSearchDir)} ou ses sous-dossiers`);
    process.exit(1);
}

// Vérification des composants requis avant l'installation
const requiredComponent = components[componentName];
if (requiredComponent.required_components?.length) {
    const defaultSearchDir = path.resolve(process.cwd(), getComponentsPath());
    
    for (const requiredComp of requiredComponent.required_components) {
        const exists = await findComponentInDir(requiredComp, defaultSearchDir);
        
        if (exists) {
            console.log(`Info : Le composant requis "${requiredComp}" est déjà installé`);
        } else {
            console.log(`\nVérification des dépendances : ${requiredComp} est requis.`);
            const customInstallPath = await askInstallPath(requiredComp);
            
            const success = await installRequiredComponent(requiredComp, components, customInstallPath);
            if (!success) {
                console.error(`Installation annulée : impossible d'installer le composant requis ${requiredComp}`);
                process.exit(1);
            }
        }
    }
}

// Extraction des informations du composant
const { path: componentPath, dependencies } = requiredComponent;

// Vérifier si c'est un dossier ou un fichier
const isDir = isDirectory(componentPath);

// Construction des chemins source et destination
// sourcePath : chemin vers le composant dans le package
// destPath : chemin où le composant sera copié dans le projet cible
const sourcePath = path.resolve(__dirname, '..', componentPath);
const targetDir = customPath 
    ? path.resolve(process.cwd(), customPath)
    : path.resolve(process.cwd(), componentsDir);
const destPath = isDir
    ? path.resolve(targetDir, componentName)
    : path.resolve(targetDir, `${componentName}.vue`);

// Création du dossier de destination s'il n'existe pas
fs.mkdirSync(path.dirname(destPath), { recursive: true });

// Copie selon le type (dossier ou fichier)
if (isDir) {
    try {
        await copyDir(sourcePath, destPath);
        console.log(`Le dossier ${componentName} a été installé avec succès dans ${path.relative(process.cwd(), destPath)}`);
        await installDependencies(dependencies);
    } catch (err) {
        console.error('Erreur lors de la copie du dossier :', err);
        process.exit(1);
    }
} else {
    try {
        await fs.promises.copyFile(sourcePath, destPath);
        console.log(`Le composant ${componentName} a été installé avec succès dans ${path.relative(process.cwd(), destPath)}`);
        await installDependencies(dependencies);
    } catch (err) {
        console.error('Erreur lors de la copie du composant :', err);
        process.exit(1);
    }
}