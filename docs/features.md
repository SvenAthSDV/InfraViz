---
title: Fonctionnalités
description: Découvrez ce que InfraViz peut faire pour vous
icon: material/star-face
---

# Fonctionnalités

InfraViz regorge de fonctionnalités pour vous aider à mieux comprendre votre infrastructure.

## 1. Upload par Glisser-Déposer
- **Interface Simple** : Glissez simplement votre fichier `main.tf` dans la barre latérale ou cliquez pour sélectionner.
- **Feedback Instantané** : Le fichier est analysé immédiatement dans le navigateur — aucune donnée ne quitte votre machine (confidentialité avant tout !).

## 2. Visualisation Intelligente
- **Mise en page Automatique** : Les nœuds sont arrangés automatiquement pour minimiser le désordre.
- **Icônes de Ressources** : Les ressources AWS reconnues (EC2, S3, RDS, VPC, etc.) sont affichées avec des icônes intuitives.
- **Ressources Inconnues** : Même les ressources personnalisées ou moins courantes sont visualisées avec des nœuds génériques, pour que rien ne manque.

## 3. Cartographie des Relations
- **Suivi des Dépendances** : InfraViz analyse votre code HCL pour trouver les références entre les ressources.
- **Liens Visuels** : Les dépendances sont dessinées sous forme de courbes fluides et animées connectant les nœuds.
- **Flux Directionnel** : Des flèches indiquent la direction de la dépendance (ex: A dépend de B).

## 4. Canevas Interactif
- **Zoom & Pan** : Naviguez dans de grandes infrastructures facilement avec les contrôles de la souris.
- **Inspection des Nœuds** : Cliquez sur un nœud pour voir plus de détails sur ses attributs (Bientôt disponible).

## 5. Options d'Export
- **Export PNG** : Téléchargez une image haute résolution de votre vue actuelle pour la partager avec votre équipe ou l'inclure dans la documentation.

## Ressources Supportées (Liste Partielle)
- `aws_instance`
- `aws_s3_bucket`
- `aws_vpc`
- `aws_subnet`
- `aws_security_group`
- `aws_db_instance`
- ...et bien plus !
