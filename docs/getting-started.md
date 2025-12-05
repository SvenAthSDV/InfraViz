---
title: Démarrage
description: Installer et lancer InfraViz localement
icon: material/rocket-launch
---

# Guide de Démarrage

Suivez ce guide pour configurer InfraViz localement sur votre machine.

## Prérequis

Assurez-vous d'avoir installé :

- **Node.js** : Version 18.17 ou supérieure.
- **Gestionnaire de paquets** : npm, yarn, ou pnpm.

## Installation

1.  **Cloner le dépôt** :
    ```bash
    git clone https://github.com/votre-username/infraviz.git
    cd infraviz
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Configurer les Variables d'Environnement** (Optionnel) :
    Copiez le fichier d'exemple si nécessaire.
    ```bash
    cp .env.example .env.local
    ```

## Lancer le Serveur de Développement

Démarrez le serveur local :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## Construire pour la Production

Pour créer une build de production :

```bash
npm run build
npm start
```

## Structure du Projet

- `src/app` : Routes et pages de l'application.
- `src/components` : Composants UI réutilisables.
- `src/lib` : Fonctions utilitaires et logique de parsing.
