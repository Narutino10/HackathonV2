#!/bin/bash

echo "🚀 Démarrage du projet avec Docker..."

# Arrêter les conteneurs existants et nettoyer
echo "⏹️ Arrêt des conteneurs existants..."
docker-compose down

# Nettoyer les images pour forcer la reconstruction
echo "🧹 Nettoyage des images existantes..."
docker-compose build --no-cache

# Démarrer les services avec les nouvelles images
echo "🏗️ Démarrage des services..."
docker-compose up -d

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 15

# Exécuter le seeding
echo "🌱 Exécution du seeding..."
docker-compose exec backend npm run seed:new

echo "✅ Projet démarré avec succès!"
echo "📱 Frontend: http://localhost:3000"
echo "🔗 Backend: http://localhost:5000"
echo "🗄️ Base de données: localhost:5432"

echo ""
echo "📝 Pour tester l'API AI, vous pouvez utiliser:"
echo "POST http://localhost:5000/ai/suggest-prestataire"
echo "Body: { \"prompt\": \"Je cherche un développeur web\" }"
