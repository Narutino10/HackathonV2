@echo off
echo 🚀 Démarrage du projet avec Docker...

REM Arrêter les conteneurs existants et nettoyer
echo ⏹️ Arrêt des conteneurs existants...
docker-compose down

REM Nettoyer les images pour forcer la reconstruction
echo 🧹 Nettoyage des images existantes...
docker-compose build --no-cache

REM Démarrer les services avec les nouvelles images
echo 🏗️ Démarrage des services...
docker-compose up -d

REM Attendre que la base de données soit prête
echo ⏳ Attente de la base de données...
timeout /t 15 /nobreak >nul

REM Exécuter le seeding
echo 🌱 Exécution du seeding...
docker-compose exec backend npm run seed:new
docker-compose exec backend npm run seed:update

echo ✅ Projet démarré avec succès!
echo 📱 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:5000
echo 🗄️ Base de données: localhost:5432

echo.
echo 🎉 Nouvelles fonctionnalités disponibles :
echo 📋 Recherche IA de prestataires
echo 💳 Réservation et contact direct
echo 📊 Gestion des projets et paiements
echo.
echo 📝 Pour tester l'API AI, vous pouvez utiliser:
echo POST http://localhost:5000/ai/suggest-prestataire
echo Body: { "prompt": "Je cherche un développeur web" }

pause
