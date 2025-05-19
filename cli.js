#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';

// Recréer __dirname dans un module ES
// Nécessaire car les modules ES n'ont pas accès à __dirname par défaut
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire les fichiers du dossier commands et créer le tableau des commandes disponibles
// Cela permet d'avoir une liste dynamique des commandes basée sur les fichiers présents
const commandsDir = path.join(__dirname, 'commands');
const validCommands = fs.readdirSync(commandsDir)
  .filter(file => file.endsWith('.js'))  // Ne garder que les fichiers JavaScript
  .map(file => path.basename(file, '.js'));  // Enlever l'extension .js

// Récupérer la commande et les arguments bruts depuis la ligne de commande
const [command, ...rawArgs] = process.argv.slice(2);

// Traitement des arguments et des options
// Sépare les arguments normaux des options (--path)
const args = [];
const options = {};

// Parcourir tous les arguments pour extraire les options
for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i] === '--path') {
        // Si on trouve --path, la valeur est l'argument suivant
        options.path = rawArgs[i + 1] || '';
        i++; // Sauter le prochain argument car c'est la valeur de l'option
    } else {
        // Si ce n'est pas une option, c'est un argument normal
        args.push(rawArgs[i]);
    }
}

// Vérifier si une commande a été fournie
// Si non, afficher l'aide et quitter
if (!command) {
    console.error('Usage : npx @dazdav/components-library <command> [options]');
    console.error('Commandes disponibles :');
    validCommands.forEach(cmd => {
        console.error(`  - ${cmd}`);
    });
    process.exit(1);
}

// Vérifier si la commande fournie est valide
// Si non, afficher l'erreur et les commandes disponibles
if (!validCommands.includes(command)) {
    console.error(`Erreur : Commande "${command}" non reconnue`);
    console.error('Commandes disponibles : ' + validCommands.join(', '));
    process.exit(1);
}

// Construire le chemin complet vers le fichier de commande
const commandPath = path.resolve(__dirname, 'commands', `${command}.js`);

// Exécuter la commande dans un processus enfant
try {
    // Préparer les arguments en incluant les options avec leur format --key value
    const processArgs = [
        commandPath,
        ...args,
        ...Object.entries(options).flatMap(([key, value]) => [`--${key}`, value])
    ];

    // spawn crée un nouveau processus
    // stdio: 'inherit' permet de rediriger les entrées/sorties vers le processus parent
    const child = spawn('node', processArgs, { stdio: 'inherit' });
    
    // Quand le processus enfant se termine, terminer le processus parent avec le même code
    child.on('exit', (code) => process.exit(code));
} catch (err) {
    console.error(`Erreur : La commande "${command}" est introuvable.`);
    process.exit(1);
}