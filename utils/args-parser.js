// Liste des options valides pour les commandes
const valid_options = {
    'add': ['path'],
    'remove': ['path'],
    'list': []
};

//Vérifie si une option est valide pour une commande donnée
function isValidOption(command, option) {
    return valid_options[command]?.includes(option) || false;
}

/**
 * Parse les arguments de la ligne de commande
 * @param {string[]} args - Arguments bruts de la ligne de commande
 * @returns {{componentName: string|null, customPath: string|null}} Objet contenant le nom du composant et le chemin personnalisé
 */
export function parseComponentArgs(args, command) {
    let componentName = null;
    let customPath = null;

    // Parcourir les arguments pour extraire :
    // - le nom du composant (premier argument qui n'est pas une option)
    // - le chemin personnalisé (valeur après --path)
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const option = args[i].slice(2); // Enlever les --
            
            if (!isValidOption(command, option)) {
                console.error(`Erreur : Option non valide "${args[i]}"`);
                console.error(`Options valides pour ${command} : ${valid_options[command]?.map(opt => `--${opt}`).join(', ') || 'aucune'}`);
                process.exit(1);
            }

            if (option === 'path') {
                // Vérifier si un chemin est fourni après --path
                if (!args[i + 1] || args[i + 1].startsWith('--')) {
                    console.error('Erreur : Aucun chemin spécifié après --path');
                    console.error(`Usage: npx ${command} <componentName> --path <customPath>`);
                    process.exit(1);
                }
                customPath = args[i + 1];
                i++; // Sauter le prochain argument
            }
        } else if (!componentName) {
            componentName = args[i];
        }
    }

    return { componentName, customPath };
}