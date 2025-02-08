# 🚀 Extension Améliorée pour Epitech

> Transformez votre expérience Epitech avec une analyse intelligente des tests et un suivi des projets

![Aperçu de l'extension](https://raw.githubusercontent.com/naingui/epitech-enhanced/main/assets/preview.gif)

## ✨ Fonctionnalités

### 🔍 Analyse Intelligente des Tests
- **Visualiseur de Différences Intelligent**
  - Comprenez instantanément les échecs des tests
  - Obtenez des conseils clairs pour résoudre les problèmes
  - Voyez les différences exactes au niveau des caractères
  - Copiez la sortie attendue en un clic

### 📊 Suivi de Progression des Projets
- **Barres de Progression en Temps Réel**
  - Suivi visuel pour tous les projets
  - Indicateurs de statut en couleur
  - Métriques de progression en pourcentage
  - Mises à jour automatiques

### 🌓 Mode Sombre
- **Changement de Thème Intelligent**
  - Détection automatique du thème système
  - Basculement manuel du thème
  - Transitions fluides
  - Support du contraste élevé

## 🎯 Démarrage Rapide

1. Installez l'extension depuis votre magasin d'applications :
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/epitech-enhanced/...)
   - [Firefox Add-ons](https://addons.mozilla.org/fr/firefox/addon/epitech-enhanced/)

2. Visitez [my.epitech.eu](https://my.epitech.eu)
   - Les barres de progression apparaîtront automatiquement
   - Les différences de tests seront automatiquement améliorées

3. Cliquez sur le bouton de thème en haut à droite pour basculer entre les modes clair et sombre

## 🛠 Détails des Fonctionnalités

### Analyse Intelligente des Tests

#### Visualiseur de Différences Intelligent
- **Analyse Contextuelle**
  - Détecte automatiquement les problèmes courants :
    - Différences d'espaces
    - Sensibilité à la casse
    - Contenu manquant/supplémentaire
    - Différences de caractères
  - Fournit des explications et solutions claires

#### Fonctionnalités Interactives
- **Analyse Ligne par Ligne**
  - Indices au survol montrant les différences exactes
  - Copie rapide de la sortie attendue
  - Basculement vue détaillée/compacte
  - Résumé des différences clés

#### Aides Visuelles
- **Visualisation Améliorée**
  - Changements en couleur
  - Statistiques claires
  - Icônes intuitives
  - Design responsive

### Suivi de Progression des Projets

#### Barres de Progression en Temps Réel
- **Progression Visuelle**
  - Pourcentage de complétion
  - Statut en couleur
  - Mises à jour automatiques
  - Animations fluides

#### Statistiques des Projets
- **Métriques Détaillées**
  - Tests réussis/échoués
  - Progression des compétences
  - Complétion globale

## 🎨 Personnalisation

### Options de Thème
```javascript
// Activer manuellement le mode sombre
localStorage.setItem('etd-dark-mode', 'true');

// Utiliser les préférences système
localStorage.removeItem('etd-dark-mode');
```

### Préférences d'Affichage
```javascript
// Définir le mode d'affichage par défaut
localStorage.setItem('etd-diff-view-mode', 'compact');
```

## ⌨️ Raccourcis Clavier

| Action | Raccourci |
|--------|-----------|
| Changer de Thème | `Ctrl/Cmd + Shift + T` |
| Copier Attendu | `Ctrl/Cmd + Shift + C` |
| Changer Mode Vue | `Ctrl/Cmd + Shift + V` |

## 🔒 Confidentialité & Sécurité

- **Aucune Collecte de Données**
  - Tout le traitement est local
  - Aucun service externe utilisé
  - Pas de tracking ni d'analytics

- **Permissions Utilisées**
  - `tabs` : Pour accéder aux résultats des tests
  - `storage` : Pour les préférences de thème
  - Permissions d'hôte :
    - `my.epitech.eu` : Plateforme principale
    - `api.epitest.eu` : Données des projets

## 🤝 Contribuer

1. Forkez le dépôt
2. Créez votre branche de fonctionnalité
   ```bash
   git checkout -b feature/super-fonctionnalite
   ```
3. Committez vos changements
   ```bash
   git commit -m 'Ajout super fonctionnalité'
   ```
4. Poussez vers la branche
   ```bash
   git push origin feature/super-fonctionnalite
   ```
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
**Merci a @Sigmanificient pour m'avoir donné l'inspiration de la feature diff view test**
## 🙏 Remerciements

- Merci à tous les étudiants Epitech pour leurs retours
- Remerciements spéciaux aux contributeurs
- Inspiré par les besoins de la communauté Epitech

## 🐛 Dépannage

### Problèmes Courants

1. **Les barres de progression n'apparaissent pas**
   - Rafraîchissez la page
   - Vérifiez que vous êtes connecté
   - Videz le cache du navigateur

2. **Le mode sombre ne fonctionne pas**
   - Vérifiez les paramètres du thème système
   - Essayez de basculer manuellement
   - Videz le stockage local

3. **Le visualiseur de différences n'apparaît pas**
   - Cliquez à nouveau sur le résultat du test
   - Rafraîchissez la page
   - Vérifiez la console pour les erreurs

### Obtenir de l'Aide

- Ouvrez une issue sur GitHub
- Contactez via [Discord](smokoxren)
- Email support : support@epitech-enhanced.dev

## 🚀 Plans Futurs

- [ ] Analyse des tests par IA
- [ ] Recommandations de projets
- [ ] Analyses de performance
- [ ] Fonctionnalités de collaboration d'équipe
- [ ] Application mobile compagnon

Restez à l'écoute pour plus de fonctionnalités incroyables !