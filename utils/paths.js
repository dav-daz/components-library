import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Obtient le chemin du répertoire pour un module ES
 * @param {string} importMetaUrl - import.meta.url du module appelant
 * @returns {string} Le chemin du répertoire
 */
export function getDirPathFromUrl(importMetaUrl) {
    const __filename = fileURLToPath(importMetaUrl);
    return path.dirname(__filename);
}