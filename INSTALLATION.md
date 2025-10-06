# Guide d'Installation - Epitech Enhanced Extension

## 🌐 Compatibilité Navigateurs

L'extension Epitech Enhanced est compatible avec tous les navigateurs modernes :

| Navigateur | Version Minimale | Statut | Manifest |
|------------|------------------|--------|----------|
| **Chrome** | 88+ | ✅ Supporté | v3 |
| **Firefox** | 57+ | ✅ Supporté | v2 |
| **Edge** | 88+ | ✅ Supporté | v3 |
| **Safari** | 14+ | ⚠️ Limité | v2 |

## 📦 Installation

### 🟢 Google Chrome

1. **Télécharger l'extension**
   ```bash
   ./build.sh chrome
   ```
   Ou téléchargez `dist/chrome-extension.zip`

2. **Installer l'extension**
   - Ouvrez Chrome
   - Allez dans `chrome://extensions/`
   - Activez le "Mode développeur" (en haut à droite)
   - Cliquez sur "Charger l'extension non empaquetée"
   - Sélectionnez le dossier `chrome-extension` décompressé

3. **Vérifier l'installation**
   - L'icône de l'extension devrait apparaître dans la barre d'outils
   - Visitez `https://myresults.epitest.eu` pour tester

### 🦊 Mozilla Firefox

1. **Télécharger l'extension**
   ```bash
   ./build.sh firefox
   ```
   Ou téléchargez `dist/firefox-extension.zip`

2. **Installer l'extension**
   - Ouvrez Firefox
   - Allez dans `about:debugging`
   - Cliquez sur "Ce Firefox"
   - Cliquez sur "Charger un module temporaire"
   - Sélectionnez le fichier `manifest.json` dans le dossier décompressé

3. **Vérifier l'installation**
   - L'icône de l'extension devrait apparaître dans la barre d'outils
   - Visitez `https://myresults.epitest.eu` pour tester

### 🔵 Microsoft Edge

1. **Télécharger l'extension**
   ```bash
   ./build.sh edge
   ```
   Ou téléchargez `dist/edge-extension.zip`

2. **Installer l'extension**
   - Ouvrez Edge
   - Allez dans `edge://extensions/`
   - Activez le "Mode développeur" (en bas à gauche)
   - Cliquez sur "Charger décompressé"
   - Sélectionnez le dossier `edge-extension` décompressé

3. **Vérifier l'installation**
   - L'icône de l'extension devrait apparaître dans la barre d'outils
   - Visitez `https://myresults.epitest.eu` pour tester

## 🔧 Développement

### Construction de toutes les extensions

```bash
# Construire toutes les extensions
./build.sh all

# Construire une extension spécifique
./build.sh chrome
./build.sh firefox
./build.sh edge

# Nettoyer les fichiers de build
./build.sh clean
```

### Structure des fichiers générés

```
dist/
├── chrome-extension.zip    # Extension Chrome
├── firefox-extension.zip   # Extension Firefox
└── edge-extension.zip      # Extension Edge
```

## 🐛 Dépannage

### Problèmes courants

#### L'extension ne se charge pas
- Vérifiez que le mode développeur est activé
- Vérifiez que tous les fichiers sont présents
- Consultez la console du navigateur pour les erreurs

#### Les animations ne fonctionnent pas
- Vérifiez que JavaScript est activé
- Vérifiez que les permissions sont accordées
- Testez sur `https://myresults.epitest.eu`

#### Les raccourcis clavier ne fonctionnent pas
- Vérifiez que l'extension est active
- Vérifiez les conflits avec d'autres extensions
- Testez les raccourcis : `Ctrl+Shift+T`, `Ctrl+Shift+C`, `Ctrl+Shift+V`

### Logs et débogage

#### Chrome/Edge
1. Allez dans `chrome://extensions/` ou `edge://extensions/`
2. Cliquez sur "Détails" de l'extension
3. Cliquez sur "Inspecter les vues: service worker"
4. Consultez la console pour les erreurs

#### Firefox
1. Allez dans `about:debugging`
2. Cliquez sur "Inspecter" de l'extension
3. Consultez la console pour les erreurs

## 🔄 Mise à jour

### Mise à jour automatique
- Chrome/Edge : Mise à jour automatique via le Chrome Web Store
- Firefox : Mise à jour automatique via Firefox Add-ons

### Mise à jour manuelle
1. Téléchargez la nouvelle version
2. Désinstallez l'ancienne version
3. Installez la nouvelle version selon les instructions ci-dessus

## 📋 Fonctionnalités par navigateur

### ✅ Fonctionnalités supportées partout
- Barres de progression des projets
- Analyse des tests avec diff viewer
- Mode sombre/clair
- Interface popup
- Raccourcis clavier
- Animations de célébration

### ⚠️ Limitations par navigateur

#### Firefox
- API de notifications différente
- Manifest v2 (compatible)
- Background script au lieu de service worker

#### Safari
- Support limité des extensions web
- Nécessite une extension native
- Pas encore supporté officiellement

## 🆘 Support

### Obtenir de l'aide
- **GitHub Issues** : [Créer un ticket](https://github.com/naingui/epitech-enhanced-extension/issues)
- **Email** : support@epitech-enhanced.dev
- **Discord** : smokoxren

### Signaler un bug
1. Décrivez le problème
2. Indiquez votre navigateur et version
3. Incluez les logs de la console
4. Joignez des captures d'écran si possible

## 📚 Ressources

- [Documentation Chrome Extensions](https://developer.chrome.com/docs/extensions/)
- [Documentation Firefox Add-ons](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Documentation Edge Extensions](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/)
- [Guide de développement](DEVELOPMENT.md)
