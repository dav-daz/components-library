#!/usr/bin/env node

import { loadComponents } from '../utils/component-checker.js';

const components = loadComponents();

console.log('Liste des composants disponibles :');
Object.entries(components).forEach(([name, info]) => {
  console.log(`\n${name}:`);
  console.log(`  Path: ${info.path}`);
  console.log(`  Dependencies: ${info.dependencies.length ? info.dependencies.join(', ') : 'Aucune'}`);
  console.log(`  Required components: ${info.required_components?.length ? info.required_components.join(', ') : 'Aucun'}`);
});
