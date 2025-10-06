#!/bin/bash

# Script de build pour l'extension Epitech Enhanced
# Usage: ./build.sh [chrome|firefox|all]

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier si le répertoire dist existe
if [ ! -d "dist" ]; then
    log "Création du répertoire dist..."
    mkdir -p dist
fi

# Fonction pour construire l'extension Chrome
build_chrome() {
    log "Construction de l'extension Chrome..."
    
    # Créer un répertoire temporaire pour Chrome
    mkdir -p dist/chrome-temp
    
    # Copier les fichiers nécessaires
    cp -r styles/ dist/chrome-temp/
    cp -r img/ dist/chrome-temp/ 2>/dev/null || true
    cp content.js background.js popup.html popup.js utils.js dist/chrome-temp/
    cp manifest.chrome.json dist/chrome-temp/manifest.json
    cp icon*.png dist/chrome-temp/ 2>/dev/null || true
    
    # Créer l'archive Chrome
    cd dist/chrome-temp
    zip -r ../chrome-extension.zip . -x "*.git*" "*.DS_Store"
    cd ../..
    rm -rf dist/chrome-temp
    
    success "Extension Chrome construite: dist/chrome-extension.zip"
}

# Fonction pour construire l'extension Firefox
build_firefox() {
    log "Construction de l'extension Firefox..."
    
    # Créer un répertoire temporaire pour Firefox
    mkdir -p dist/firefox-temp
    
    # Copier les fichiers nécessaires
    cp -r styles/ dist/firefox-temp/
    cp -r img/ dist/firefox-temp/ 2>/dev/null || true
    cp content.js background.firefox.js popup.html popup.js utils.js dist/firefox-temp/
    cp manifest.firefox.json dist/firefox-temp/manifest.json
    cp icon*.png dist/firefox-temp/ 2>/dev/null || true
    
    # Créer l'archive Firefox
    cd dist/firefox-temp
    zip -r ../firefox-extension.zip . -x "*.git*" "*.DS_Store"
    cd ../..
    rm -rf dist/firefox-temp
    
    success "Extension Firefox construite: dist/firefox-extension.zip"
}

# Fonction pour construire l'extension Edge
build_edge() {
    log "Construction de l'extension Edge..."
    
    # Créer un répertoire temporaire pour Edge
    mkdir -p dist/edge-temp
    
    # Copier les fichiers nécessaires
    cp -r styles/ dist/edge-temp/
    cp -r img/ dist/edge-temp/ 2>/dev/null || true
    cp content.js background.js popup.html popup.js utils.js dist/edge-temp/
    cp manifest.edge.json dist/edge-temp/manifest.json
    cp icon*.png dist/edge-temp/ 2>/dev/null || true
    
    # Créer l'archive Edge
    cd dist/edge-temp
    zip -r ../edge-extension.zip . -x "*.git*" "*.DS_Store"
    cd ../..
    rm -rf dist/edge-temp
    
    success "Extension Edge construite: dist/edge-extension.zip"
}

# Fonction pour construire toutes les extensions
build_all() {
    log "Construction de toutes les extensions..."
    build_chrome
    build_firefox
    build_edge
    success "Toutes les extensions ont été construites avec succès!"
}

# Fonction pour nettoyer
clean() {
    log "Nettoyage des fichiers de build..."
    rm -rf dist/
    rm -f manifest.chrome.json manifest.firefox.json
    success "Nettoyage terminé!"
}

# Fonction pour afficher l'aide
show_help() {
    echo "Usage: $0 [chrome|firefox|edge|all|clean|help]"
    echo ""
    echo "Options:"
    echo "  chrome   - Construire l'extension Chrome"
    echo "  firefox  - Construire l'extension Firefox"
    echo "  edge     - Construire l'extension Edge"
    echo "  all      - Construire toutes les extensions"
    echo "  clean    - Nettoyer les fichiers de build"
    echo "  help     - Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 chrome    # Construire seulement Chrome"
    echo "  $0 firefox   # Construire seulement Firefox"
    echo "  $0 edge      # Construire seulement Edge"
    echo "  $0 all       # Construire toutes les extensions"
    echo "  $0 clean     # Nettoyer les fichiers"
}

# Vérifier les arguments
case "${1:-all}" in
    chrome)
        build_chrome
        ;;
    firefox)
        build_firefox
        ;;
    edge)
        build_edge
        ;;
    all)
        build_all
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        error "Option invalide: $1"
        show_help
        exit 1
        ;;
esac

log "Script terminé avec succès!"
