---
title: Accueil
description: Documentation officielle de InfraViz
icon: material/home
---

# Documentation InfraViz

Bienvenue sur la documentation officielle de **InfraViz**, l'outil SaaS qui transforme votre code Terraform en diagrammes d'architecture interactifs et esthétiques.

## 🚀 Qu'est-ce que InfraViz ?

InfraViz est un outil conçu pour les développeurs afin de simplifier la visualisation d'infrastructure. En téléchargeant simplement votre fichier `main.tf`, InfraViz analyse votre code HCL et génère instantanément un graphe visuel de vos ressources AWS et de leurs relations.

## 📚 Sections de la Documentation

- **[Installation](./getting-started.md)** : Configurez le projet localement et commencez à développer.
- **[Architecture](./architecture.md)** : Plongez dans la stack technique, la logique de parsing et le moteur de visualisation.
- **[Fonctionnalités](./features.md)** : Découvrez les capacités clés d'InfraViz.

## 🎯 Fonctionnalités Clés

- **Parsing Instantané** : Glissez-déposez vos fichiers Terraform pour un traitement immédiat.
- **Graphes Interactifs** : Zoomez, déplacez et explorez vos nœuds d'infrastructure.
- **Relations Intelligentes** : Détecte et visualise automatiquement les dépendances entre les ressources (ex: EC2 -> Subnet).
- **Prêt pour l'Export** : Téléchargez vos diagrammes en PNG haute qualité pour votre documentation ou vos présentations.

## 🛠 Stack Technique

Construit avec des technologies web modernes :
- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS
- **Visualisation** : React Flow
- **Icônes** : Lucide React
