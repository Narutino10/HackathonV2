#!/bin/bash

echo "🚀 Démarrage du projet avec Docker..."

# Arrêter les conteneurs existants
echo "⏹️ Arrêt des conteneurs existants..."
docker-compose down

# Supprimer les volumes pour repartir de zéro (optionnel)
echo "🗑️ Nettoyage des volumes (optionnel)..."
# docker-compose down -v

# Construire et démarrer les services
echo "🏗️ Construction et démarrage des services..."
docker-compose up --build -d

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
