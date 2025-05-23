import fs from 'fs';
import path from 'path';
import { getDirPathFromUrl } from './paths.js';

const __dirname = getDirPathFromUrl(import.meta.url);

export function loadComponents() {
  const componentsPath = path.resolve(__dirname, '../components.json');
  return JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));
}
