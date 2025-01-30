# Extension Améliorée pour Epitech

![Logo de l'extension](icon128.png)

Une puissante extension de navigateur conçue pour améliorer l'expérience d'apprentissage à Epitech en fournissant des fonctionnalités avancées de visualisation des tests et de suivi des projets.

## 🎯 Fonctionnalités

### 1. Visualiseur Avancé de Différences de Tests
- **Affichage Interactif des Différences** : Cliquez sur n'importe quel test échoué pour voir une belle comparaison côte à côte
- **Coloration Syntaxique** : Distinction visuelle claire entre les lignes ajoutées, supprimées et inchangées
- **Numéros de Ligne** : Référence facile avec des numéros de ligne pour chaque différence
- **Copie dans le Presse-papiers** : Copie en un clic de toute la différence
- **Mode Sombre/Clair** : Basculez entre les thèmes pour une visualisation confortable dans tous les environnements

### 2. Suivi de Progression des Projets
- **Barres de Progression en Temps Réel** : Représentation visuelle des taux d'achèvement des projets
- **Statut en Couleur** : 
  - 🟢 Vert (≥75%) : Excellent progrès
  - 🟠 Orange (25-74%) : En cours
  - 🔴 Rouge (<25%) : Nécessite attention
- **Mises à Jour Automatiques** : Les barres de progression se mettent à jour automatiquement lors de la navigation

## 🚀 Installation

### Chrome Web Store (Recommandé)
1. Visitez le [Chrome Web Store](https://chrome.google.com/webstore)
2. Recherchez "Epitech Enhanced Extension"
3. Cliquez sur "Ajouter à Chrome"

### Installation Manuelle
1. Téléchargez ce dépôt en fichier ZIP
2. Décompressez le fichier sur votre ordinateur
3. Ouvrez Chrome et allez sur `chrome://extensions/`
4. Activez le "Mode développeur" en haut à droite
5. Cliquez sur "Charger l'extension non empaquetée"
6. Sélectionnez le dossier de l'extension décompressée

## 💡 Comment Utiliser

### Visualisation des Différences de Tests
1. Naviguez vers n'importe quelle page de test de projet sur my.epitech.eu
2. Quand un test échoue, cliquez sur les détails du test
3. Le visualiseur de différences apparaîtra, montrant les différences entre les sorties attendues et réelles
4. Utilisez le bouton de copie pour partager la différence ou le bouton de thème pour une meilleure visibilité

### Suivi de la Progression des Projets
1. Allez sur votre tableau de bord des projets sur my.epitech.eu
2. Les barres de progression apparaîtront automatiquement sous chaque carte de projet
3. Le pourcentage montre votre taux de réussite actuel pour le projet
4. Les couleurs indiquent votre statut de progression en un coup d'œil

## 🛠 Détails Techniques

### Permissions Utilisées
- `tabs` : Nécessaire pour accéder aux résultats des tests et aux informations des projets
- `storage` : Utilisé pour sauvegarder les préférences de thème
- Permissions d'hôte pour :
  - `my.epitech.eu` : Plateforme principale d'Epitech
  - `api.epitest.eu` : API de données des projets

### Confidentialité
- Aucune donnée n'est collectée ou partagée
- Tout le traitement se fait localement dans votre navigateur
- Aucun service externe n'est utilisé à l'exception des API d'Epitech

## 🤝 Contribution

Cette extension est ouverte aux contributions ! Si vous avez des idées d'améliorations ou de corrections de bugs :

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité
3. Faites vos modifications
4. Soumettez une pull request

## 🙏 Crédits

Créé par Aaron Groux (aaron.groux@epitech.eu)
Discord : smokoxren

Cette extension s'inspire et s'appuie sur le travail des extensions Epitech précédentes, visant à fournir une expérience moderne et améliorée aux étudiants.

### Inspiration
- Extension originale Epitech Test Display
- Divers outils et scripts communautaires

## 📝 Licence

Licence MIT - Libre d'utilisation, de modification et de distribution en conservant l'attribution.

## 🐛 Signalement de Bugs

Vous avez trouvé un bug ? Veuillez [ouvrir une issue](https://github.com/yourusername/epitech-enhanced-extension/issues) avec :

1. Description du problème
2. Étapes pour reproduire
3. Comportement attendu vs réel
4. Captures d'écran si applicable

Vous pouvez aussi me contacter directement sur Discord : smokoxren

## 🔄 Historique des Versions

### v2.1.0 (Actuelle)
- Ajout de barres de progression animées
- Amélioration du support du mode sombre
- Interface du visualiseur de différences améliorée
- Correction de divers bugs

### v2.0.0
- Refonte complète de l'interface
- Ajout du suivi de progression des projets
- Amélioration de la visualisation des différences de tests

### v1.0.0
- Version initiale
- Fonctionnalité de base de visualisation des différences de tests

## 🔮 Fonctionnalités Prévues

- [ ] Visualisation de la couverture des tests
- [ ] Tableau de bord des statistiques de projet
- [ ] Support des thèmes personnalisés
- [ ] Raccourcis clavier
- [ ] Export/import des paramètres

## ⚠️ Avertissement

Ceci est une extension non officielle créée par un étudiant pour les étudiants. Elle n'est pas officiellement affiliée ou approuvée par Epitech.