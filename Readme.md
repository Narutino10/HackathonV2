# 💼 services.ceo

**Plateforme intelligente de mise en relation** entre clients ayant des besoins (site web, marketing, tech, etc.) et des prestataires humains (freelancers, agences) ou des solutions IA concurrentes.  
> 🔎 L’objectif : simplifier la recherche grâce à l’intelligence artificielle plutôt que des filtres complexes.

---

## 🚀 Fonctionnalités principales

- 🧑‍💼 Formulaire intelligent pour exprimer un besoin (site, stratégie, etc.)
- 👨‍💻 Mise en relation avec :
  - des prestataires humains pertinents
  - des solutions IA alternatives (site généré par IA, analyse marketing, etc.)
- 📊 Recommandation intelligente via moteur IA (à venir)
- 🗂 Tableau de bord utilisateur (suivi de projets, messages, etc.)
- 💬 Messagerie intégrée entre client et prestataire
- 🔐 Authentification et gestion des rôles (client / prestataire / admin)

---

## 🧱 Stack technique

| Partie     | Technologie           |
|------------|------------------------|
| Frontend   | React + Vite + TypeScript |
| Backend    | NestJS + TypeORM + JWT |
| Base de données | PostgreSQL        |
| Auth       | JWT                   |
| IA (à venir) | OpenAI / IA locale (Ollama, etc.) |
| DevOps     | Docker + docker-compose |
| Admin DB   | pgAdmin (via http://localhost:5050) |

---

## 🛠️ Lancer le projet en local

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/services-ceo.git
cd services-ceo
````

### 2. Configurer les variables d’environnement

Crée un fichier `.env` dans le dossier `backend/` :

```env
DATABASE_URL=postgres://user:pass@postgres:5432/servicesceo
JWT_SECRET=super-secret-key
OPENAI_API_KEY=dummy-placeholder
```

### 3. Lancer tous les services

```bash
docker-compose up --build
```

Accès :

* Frontend : [http://localhost:3000](http://localhost:3000)
* Backend API : [http://localhost:5000](http://localhost:5000)
* pgAdmin : [http://localhost:5050](http://localhost:5050) (`admin@admin.com` / `admin`)

---

## 🧪 Structure du projet

```
services-ceo/
├── backend/        # NestJS API
│   ├── src/
│   │   ├── entities/
│   │   ├── modules/
│   │   └── main.ts, app.module.ts, etc.
│   └── Dockerfile
├── frontend/       # React + Vite frontend
│   └── Dockerfile
├── database/       # (facultatif) scripts SQL init
├── docker-compose.yml
└── README.md
```

---

## 🧠 Fonction IA (à venir)

> Le moteur d’IA proposera automatiquement les meilleures solutions :

* Freelance pertinent selon le besoin exprimé
* Outils IA capables de générer des résultats équivalents
* Classement par pertinence + score IA

---

## 📦 À venir

* [ ] 🔄 Système de paiement (Stripe)
* [ ] 🔔 Notifications en temps réel
* [ ] 📅 Planification d'appel entre client et prestataire
* [ ] 🤖 Intégration IA gratuite ou auto-hébergée (LLM local)

---

## 🤝 Contribuer

Tu peux contribuer à l’amélioration de cette plateforme :

* Proposer des améliorations
* Ajouter des modules
* Intégrer un modèle IA libre (LLaMA3, Ollama, etc.)

---

## 🧑‍💻 Auteur

Projet porté par Ibrahim OUAHABI — ESGI 5IW3 

---

## 📝 Licence

Ce projet est open source — sous licence MIT.
