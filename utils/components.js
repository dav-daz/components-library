import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadComponents() {
  const componentsPath = path.resolve(__dirname, '../components.json');
  return JSON.parse(fs.readFileSync(componentsPath, 'utf-8'));
}
