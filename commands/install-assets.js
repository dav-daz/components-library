#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { getDirPathFromUrl } from '#utils/paths.js';
import { detectProjectType } from '#utils/project-type.js';
import { copyDir, installDependencies } from '#utils/component-checker.js';

const __dirname = getDirPathFromUrl(import.meta.url);

// Liste des dépendances requises pour les assets
const assetsDependencies = [
    'postcss-html',
    'postcss-scss',
    'sass',
    'sass-loader',
    'stylelint',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue'
];

async function installAssets() {
    try {
        // Détermination du type de projet et des chemins
        const projectType = detectProjectType();
        const destPath = projectType === 'nuxt' 
            ? path.resolve(process.cwd(), 'assets')
            : path.resolve(process.cwd(), 'src', 'assets');
        const sourcePath = path.resolve(__dirname, '..', 'src', 'assets');

        // Copie du dossier assets
        console.log('\nInstallation du dossier assets...');
        await copyDir(sourcePath, destPath);
        console.log(`Le dossier assets a été installé avec succès dans ${path.relative(process.cwd(), destPath)}`);

        // Installation des dépendances
        console.log('\nInstallation des dépendances nécessaires...');
        await installDependencies(assetsDependencies);
  
        // Message final avec lien vers le README
        const readmePath = path.join(destPath, 'README.md');
        const relativeReadmePath = path.relative(process.cwd(), readmePath);
        
        console.log('\nInstallation complète !');
        console.log(`\nPour finaliser la configuration des styles pour votre application ${projectType.toUpperCase()},`);
        console.log(`veuillez consulter le fichier de configuration dans:`);
        console.log(`${relativeReadmePath}`);

        return true;
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.error('Erreur : Le dossier source des assets est introuvable');
        } else {
            console.error('Erreur lors de l\'installation :', err.message);
        }
        return false;
    }
}

// Exécution de l'installation
try {
    const success = await installAssets();
    process.exit(success ? 0 : 1);
} catch (err) {
    console.error('❌ Erreur inattendue :', err);
    process.exit(1);
}