#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';

// Recréer __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lire les fichiers du dossier commands et créer le tableau des commandes disponibles
const commandsDir = path.join(__dirname, 'commands');
const validCommands = fs.readdirSync(commandsDir)
  .filter(file => file.endsWith('.js'))
  .map(file => path.basename(file, '.js'));

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error('Usage : npx @dazdav/components-library <command> [options]');
  console.error('Commandes disponibles :');
  validCommands.forEach(cmd => {
    console.error(`  - ${cmd}`);
  });
  process.exit(1);
}

if (!validCommands.includes(command)) {
  console.error(`Erreur : Commande "${command}" non reconnue`);
  console.error('Commandes disponibles : ' + validCommands.join(', '));
  process.exit(1);
}

const commandPath = path.resolve(__dirname, 'commands', `${command}.js`);

try {
  const child = spawn('node', [commandPath, ...args], { stdio: 'inherit' });
  child.on('exit', (code) => process.exit(code));
} catch (err) {
  console.error(`Erreur : La commande "${command}" est introuvable.`);
  process.exit(1);
}