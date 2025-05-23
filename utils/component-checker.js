import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { exec } from 'child_process';
import { getComponentsPath } from './project-type.js';
import { getDirPathFromUrl } from './paths.js';

/**
 * Recherche un composant dans un dossier et ses sous-dossiers
 * @param {string} componentName - Nom du composant à chercher
 * @param {string} searchDir - Dossier de recherche
 * @returns {Promise<boolean>} - true si le composant est trouvé
 */
export async function findComponentInDir(componentName, searchDir) {
  // await est utilisé car readdir retourne une Promise
    const files = await fs.promises.readdir(searchDir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(searchDir, file.name);
        
        if (file.isDirectory()) {
          // await est nécessaire car l'appel récursif est async
            const found = await findComponentInDir(componentName, fullPath);
            if (found) return true;
        } else if (file.isFile() && file.name === `${componentName}.vue`) {
            return true;
        }
    }
    return false;
}

/**
 * Demande à l'utilisateur un chemin d'installation personnalisé
 * @param {string} componentName - Nom du composant
 * @returns {Promise<string|null>} - Chemin personnalisé ou null pour le chemin par défaut
 */
export async function askInstallPath(componentName) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // On retourne une Promise qui se résout quand l'utilisateur répond
    return new Promise((resolve) => {
        rl.question(
            `Le composant requis "${componentName}" n'est pas installé.\n` +
            `Voulez-vous l'installer dans un chemin personnalisé ? (O/n) (n) `,
            (answer) => {
                if (answer.toLowerCase() === 'o' || answer === 'O') {
                    rl.question('Chemin d\'installation : ', (customPath) => {
                        rl.close();
                        resolve(customPath);
                    });
                } else {
                    rl.close();
                    resolve(null);
                }
            }
        );
    });
}

/**
 * Installe un composant requis
 * @param {string} componentName - Nom du composant à installer
 * @param {Object} components - Liste des composants disponibles
 * @param {string|null} customPath - Chemin d'installation personnalisé
 * @returns {Promise<boolean>} - true si l'installation réussit
 */
export async function installRequiredComponent(componentName, components, customPath = null) {
    if (!components[componentName]) {
        console.error(`Erreur : Composant requis "${componentName}" non trouvé dans la bibliothèque`);
        return false;
    }

    const { path: componentPath, dependencies } = components[componentName];
    // Utilisation de getDirPathFromUrl pour obtenir le chemin source correct
    const __dirname = getDirPathFromUrl(import.meta.url);
    const sourcePath = path.resolve(__dirname, '..', componentPath);
    const targetDir = customPath 
        ? path.resolve(process.cwd(), customPath)
        : path.resolve(process.cwd(), getComponentsPath());
    const destPath = path.resolve(targetDir, `${componentName}.vue`);

    try {
      // await nécessaire pour la création du dossier
        await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
        // await nécessaire pour la copie du fichier
        await fs.promises.copyFile(sourcePath, destPath);
        console.log(`Composant requis ${componentName} installé dans ${path.relative(process.cwd(), destPath)}`);

        if (dependencies?.length) {
            console.log(`Installation des dépendances pour ${componentName}...`);
            // await nécessaire pour l'installation des dépendances
            await new Promise((resolve, reject) => {
                exec(`npm install ${dependencies.join(' ')}`, (err, stdout) => {
                    if (err) reject(err);
                    else resolve(stdout);
                });
            });
        }
        return true;
    } catch (err) {
        console.error(`Erreur lors de l'installation du composant requis ${componentName}:`, err);
        return false;
    }
}