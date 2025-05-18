#!/usr/bin/env node

import { loadComponents } from '../utils/components.js';

const components = loadComponents();

console.log('Liste des composants disponibles :');
Object.entries(components).forEach(([name, info]) => {
  console.log(`\n${name}:`);
  console.log(`  Path: ${info.path}`);
  console.log(`  Dependencies: ${info.dependencies.length ? info.dependencies.join(', ') : 'Aucune'}`);
});
