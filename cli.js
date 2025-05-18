#!/usr/bin/env node

import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

// Recréer __dirname dans un module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [command, ...args] = process.argv.slice(2);

if (!command) {
  console.error('Erreur : Veuillez spécifier une commande (add, list, remove).');
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