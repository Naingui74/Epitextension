# Guide de Développement - Epitech Enhanced Extension

## 🚀 Démarrage Rapide

### Prérequis
- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Installation
```bash
# Cloner le repository
git clone https://github.com/naingui/epitech-enhanced-extension.git
cd epitech-enhanced-extension

# Installer les dépendances
npm install
```

## 🛠️ Scripts Disponibles

### Build
```bash
# Construire toutes les extensions
npm run build

# Construire seulement Chrome
npm run build:chrome

# Construire seulement Firefox
npm run build:firefox

# Utiliser le script bash
./build.sh all
```

### Développement
```bash
# Mode développement avec watch
npm run dev

# Linter
npm run lint

# Linter avec correction automatique
npm run lint:fix
```

## 📁 Structure du Projet

```
epitech-enhanced-extension/
├── content.js              # Script principal de l'extension
├── background.js           # Service Worker
├── popup.html              # Interface popup
├── popup.js                # Script de la popup
├── utils.js                # Fonctions utilitaires
├── manifest.json           # Manifest principal
├── manifest.chrome.json    # Manifest Chrome
├── manifest.firefox.json  # Manifest Firefox
├── styles/                 # Styles CSS modulaires
│   ├── variables.css
│   ├── progress.css
│   ├── dark-mode.css
│   ├── code.css
│   ├── components.css
│   ├── test-interface.css
│   └── main.css
├── img/                    # Images et icônes
├── dist/                   # Fichiers de build
├── package.json            # Configuration npm
├── .eslintrc.js           # Configuration ESLint
└── build.sh               # Script de build
```

## 🔧 Architecture

### Manifest v3
L'extension utilise Manifest v3 avec les composants suivants :

- **Content Scripts** : `content.js`, `utils.js`
- **Service Worker** : `background.js`
- **Action Popup** : `popup.html`, `popup.js`

### Communication
- **Content Script ↔ Background** : `chrome.runtime.sendMessage()`
- **Background ↔ Content Script** : `chrome.tabs.sendMessage()`
- **Storage** : `chrome.storage.local`

### Permissions
- `tabs` : Accès aux onglets
- `storage` : Stockage local
- `activeTab` : Onglet actif
- `scripting` : Injection de scripts

## 🎨 Styles

### Architecture CSS
Les styles sont organisés en modules :

- `variables.css` : Variables CSS globales
- `progress.css` : Styles des barres de progression
- `dark-mode.css` : Mode sombre
- `code.css` : Styles du code
- `components.css` : Composants réutilisables
- `test-interface.css` : Interface des tests
- `main.css` : Styles principaux

### Classes CSS
- `.etd-*` : Classes de l'extension
- `.test-dashboard` : Interface des tests
- `.etd-progress` : Barres de progression
- `.etd-dark-mode` : Mode sombre

## 🧪 Tests

### Tests Manuels
1. Installer l'extension en mode développeur
2. Naviguer vers `https://myresults.epitest.eu` (nouvelle URL)
3. Tester les fonctionnalités :
   - Barres de progression
   - Analyse des tests
   - Mode sombre/clair
   - Raccourcis clavier
   - Interface popup

### Tests Automatisés
```bash
# Lancer les tests (à implémenter)
npm test
```

## 📦 Déploiement

### Chrome Web Store
1. Construire l'extension : `npm run build:chrome`
2. Télécharger `dist/chrome-extension.zip`
3. Uploader sur le Chrome Web Store

### Firefox Add-ons
1. Construire l'extension : `npm run build:firefox`
2. Télécharger `dist/firefox-extension.zip`
3. Uploader sur Firefox Add-ons

## 🔍 Debug

### Console du Navigateur
- Ouvrir les outils de développement
- Aller dans l'onglet "Console"
- Vérifier les logs de l'extension

### Service Worker
- Aller dans `chrome://extensions/`
- Cliquer sur "Inspect views: background page"
- Vérifier les logs du Service Worker

### Content Script
- Ouvrir les outils de développement sur `myresults.epitest.eu`
- Vérifier les logs dans la console

## 🐛 Dépannage

### Problèmes Courants

#### L'extension ne se charge pas
- Vérifier le manifest.json
- Vérifier les permissions
- Vérifier les erreurs dans la console

#### Les styles ne s'appliquent pas
- Vérifier l'ordre des imports CSS
- Vérifier les sélecteurs CSS
- Vérifier les conflits avec le site

#### Les raccourcis clavier ne fonctionnent pas
- Vérifier la configuration des commands
- Vérifier les conflits avec d'autres extensions
- Vérifier les permissions

## 📝 Contribution

### Workflow
1. Fork le repository
2. Créer une branche feature
3. Faire les modifications
4. Tester les changements
5. Créer une Pull Request

### Standards de Code
- Utiliser ESLint
- Suivre les conventions de nommage
- Documenter le code
- Tester les modifications

### Commits
- Utiliser des messages clairs
- Suivre le format : `type: description`
- Exemples :
  - `feat: add new popup interface`
  - `fix: resolve keyboard shortcut issue`
  - `docs: update README`

## 🔄 Mise à Jour

### Versioning
- Suivre le Semantic Versioning
- Mettre à jour le CHANGELOG.md
- Taguer les releases

### Processus
1. Modifier la version dans `package.json`
2. Mettre à jour le `CHANGELOG.md`
3. Créer un commit de version
4. Créer un tag
5. Pousser les changements

## 📚 Ressources

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Firefox Add-ons Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Manifest v3 Migration](https://developer.chrome.com/docs/extensions/migrating/)
- [ESLint Configuration](https://eslint.org/docs/user-guide/configuring)
