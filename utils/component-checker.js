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

/**
 * Détermine si le chemin correspond à un dossier ou un fichier
 * @param {string} path - Chemin à vérifier
 * @returns {boolean} - true si c'est un dossier
 */
export function isDirectory(path) {
    // On vérifie si le chemin se termine par une extension
    return !path.match(/\.[^/\\]+$/);
}

/**
 * Vérifie si un dossier existe dans le répertoire spécifié
 * @param {string} dirName - Nom du dossier à chercher
 * @param {string} searchDir - Dossier de recherche
 * @returns {Promise<boolean>} - true si le dossier est trouvé
 */
export async function findDirInDir(dirName, searchDir) {
    const files = await fs.promises.readdir(searchDir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(searchDir, file.name);
        
        if (file.isDirectory()) {
            if (file.name === dirName) return true;
            const found = await findDirInDir(dirName, fullPath);
            if (found) return true;
        }
    }
    return false;
}

/**
 * Copie récursivement un dossier
 * @param {string} src - Chemin source
 * @param {string} dest - Chemin destination
 */
export async function copyDir(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDir(srcPath, destPath);
        } else {
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
}

/**
 * Supprime récursivement un dossier et son contenu
 * @param {string} dirPath - Chemin du dossier à supprimer
 * @returns {Promise<void>}
 */
export async function removeDir(dirPath) {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            await removeDir(fullPath);
        } else {
            await fs.promises.unlink(fullPath);
        }
    }

    await fs.promises.rmdir(dirPath);
}

/**
 * Vérifie si une dépendance est utilisée par d'autres composants
 * @param {Object} components - Liste des composants
 * @param {string} dependency - Dépendance à vérifier
 * @param {string} excludeComponent - Composant à exclure de la vérification
 * @returns {boolean} - true si la dépendance est utilisée ailleurs
 */
function isDependencyUsedElsewhere(components, dependency, excludeComponent) {
    return Object.entries(components).some(([name, info]) => {
        return name !== excludeComponent && info.dependencies.includes(dependency);
    });
}

/**
 * Désinstalle les dépendances non utilisées
 * @param {string[]} dependencies - Liste des dépendances à vérifier
 * @param {Object} components - Liste des composants disponibles
 * @param {string} componentName - Nom du composant en cours de suppression
 * @returns {Promise<void>}
 */
export async function removeDependencies(dependencies, components, componentName) {
    if (!dependencies?.length) return;

    const depsToRemove = dependencies.filter(dep => 
        !isDependencyUsedElsewhere(components, dep, componentName)
    );

    if (depsToRemove.length > 0) {
        console.log(`Suppression des dépendances non utilisées : ${depsToRemove.join(', ')}`);
        return new Promise((resolve, reject) => {
            exec(`npm uninstall ${depsToRemove.join(' ')}`, (err, stdout) => {
                if (err) {
                    console.error('Erreur lors de la désinstallation des dépendances :', err);
                    reject(err);
                } else {
                    console.log(stdout);
                    console.log('Dépendances désinstallées avec succès.');
                    resolve();
                }
            });
        });
    }
}

/**
 * Installe les dépendances d'un composant
 * @param {string[]} dependencies - Liste des dépendances à installer
 * @returns {Promise<void>}
 */
export async function installDependencies(dependencies) {
    if (!dependencies?.length) return;

    console.log(`Installation des dépendances : ${dependencies.join(', ')}`);
    return new Promise((resolve, reject) => {
        exec(`npm install ${dependencies.join(' ')}`, (err, stdout, stderr) => {
            if (err) {
                console.error('Erreur lors de l\'installation des dépendances :', stderr);
                reject(err);
            } else {
                console.log(stdout);
                console.log('Dépendances installées avec succès.');
                resolve();
            }
        });
    });
}

