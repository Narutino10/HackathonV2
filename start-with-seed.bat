@echo off
echo 🚀 Démarrage du projet avec Docker...

REM Arrêter les conteneurs existants
echo ⏹️ Arrêt des conteneurs existants...
docker-compose down

REM Construire et démarrer les services
echo 🏗️ Construction et démarrage des services...
docker-compose up --build -d

REM Attendre que la base de données soit prête
echo ⏳ Attente de la base de données...
timeout /t 15 /nobreak >nul

REM Exécuter le seeding
echo 🌱 Exécution du seeding...
docker-compose exec backend npm run seed:new

echo ✅ Projet démarré avec succès!
echo 📱 Frontend: http://localhost:3000
echo 🔗 Backend: http://localhost:5000
echo 🗄️ Base de données: localhost:5432

echo.
echo 📝 Pour tester l'API AI, vous pouvez utiliser:
echo POST http://localhost:5000/ai/suggest-prestataire
echo Body: { "prompt": "Je cherche un développeur web" }

pause
