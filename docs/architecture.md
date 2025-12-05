---
title: Architecture
description: Conception technique et stack d'InfraViz
icon: material/server-network
---

# Architecture & Conception Technique

## Vue d'ensemble

InfraViz est une application orientée client construite avec **Next.js 14**. La logique principale tourne autour du parsing du HCL (HashiCorp Configuration Language) dans le navigateur (ou via une API serverless si nécessaire) et du mapping de ces données vers un graphe **React Flow**.

## 🏗 Stack Technique

| Composant | Technologie | Raison |
|-----------|------------|--------|
| **Framework** | Next.js 14 (App Router) | React Server Components, Routing, Performance. |
| **Langage** | TypeScript | Typage fort, meilleure expérience développeur (DX). |
| **Style** | Tailwind CSS | Développement UI rapide, support du mode sombre. |
| **Gestion d'État** | React Context / Zustand | Gestion des données parsées et de l'état du graphe. |
| **Visualisation** | React Flow | Librairie puissante pour les graphes basés sur des nœuds. |
| **Parsing** | `hcl-to-json` (ou custom) | Conversion du code Terraform en format JSON exploitable. |

## 🧠 Logique Cœur

### 1. Moteur de Parsing (`src/lib/parser.ts`)

Le moteur de parsing est le "cerveau" d'InfraViz. Il effectue les étapes suivantes :

1.  **Entrée** : Reçoit le contenu brut d'un fichier `main.tf`.
2.  **Tokenisation/Conversion** : Utilise une librairie pour convertir le HCL en objet JSON.
3.  **Extraction** : Itère à travers le JSON pour trouver les blocs `resource`.
4.  **Normalisation** : Standardise la structure de données pour le frontend.

```typescript
interface ParsedResource {
  type: string; // ex: "aws_instance"
  name: string; // ex: "web_server"
  attributes: Record<string, any>;
}
```

### 2. Détection des Relations

C'est la partie la plus critique pour générer des diagrammes utiles. Le moteur scanne les attributs des ressources à la recherche de références vers d'autres ressources.

*   **Motif** : Cherche des chaînes correspondant à `type_ressource.nom_ressource.attribut`.
*   **Exemple** : Si `aws_instance.web` contient `subnet_id = aws_subnet.main.id`, un lien est créé : `aws_subnet.main` -> `aws_instance.web`.

### 3. Mapping Visuel

Les ressources sont mappées vers des nœuds React Flow basés sur leur type :

*   **`aws_s3_bucket`** : Mappé vers un `StorageNode` (Icône : Base de données/Bucket).
*   **`aws_instance`** : Mappé vers un `ComputeNode` (Icône : Serveur).
*   **`aws_vpc`** : Mappé vers un `NetworkNode` (Icône : Nuage).
*   **Défaut** : Repli vers un `ResourceNode` générique.

## 📂 Structure du Projet

```
infraviz/
├── src/
│   ├── app/              # Pages Next.js App Router
│   ├── components/       # Composants UI
│   │   ├── ui/           # UI Générique (Boutons, Inputs)
│   │   ├── diagram/      # Composants spécifiques React Flow
│   │   └── layout/       # Sidebar, Header
│   ├── lib/              # Logique cœur (parser, helpers)
│   └── types/            # Définitions TypeScript
├── public/               # Assets statiques
└── docs/                 # Documentation
```
