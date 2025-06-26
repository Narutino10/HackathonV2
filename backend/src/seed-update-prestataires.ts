import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function updatePrestataires() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  console.log('🔄 Mise à jour des données des prestataires...');

  // Mise à jour des prestataires existants avec leurs vraies données
  const prestatairesData = [
    {
      email: 'wordpress@agency.com',
      nom: 'Dupont',
      prenom: 'Marie',
      competences: 'WordPress, PHP, MySQL, CSS, JavaScript, Responsive Design',
      description: "Développeuse WordPress experte avec 5 ans d'expérience.",
      tarifHoraire: 45.0,
    },
    {
      email: 'shopify@expert.com',
      nom: 'Martin',
      prenom: 'Lucas',
      competences: 'Shopify, E-commerce, Liquid, JavaScript, CSS, API Shopify',
      description: 'Expert Shopify certifié pour créer des boutiques performantes.',
      tarifHoraire: 55.0,
    },
    {
      email: 'seo@guru.io',
      nom: 'Rousseau',
      prenom: 'Sophie',
      competences: 'SEO, Google Analytics, Google Search Console, Content Marketing',
      description: "Consultante SEO avec 7 ans d'expérience en optimisation.",
      tarifHoraire: 65.0,
    },
    {
      email: 'landing@designer.com',
      nom: 'Moreau',
      prenom: 'Alexandre',
      competences: 'Design UI/UX, Figma, Adobe Creative Suite, HTML, CSS, Landing Pages',
      description: 'Designer UI/UX spécialisé en landing pages qui convertissent.',
      tarifHoraire: 50.0,
    },
    {
      email: 'automation@ai-solutions.com',
      nom: 'Bernard',
      prenom: 'Emma',
      competences: 'Python, Machine Learning, Automation, API, Zapier, Intelligence Artificielle',
      description: 'Développeuse IA spécialisée en automatisation de processus.',
      tarifHoraire: 80.0,
    },
  ];

  for (const prestataireData of prestatairesData) {
    try {
      const user = await usersService.findByEmail(prestataireData.email);
      if (user) {
        await usersService.update(user.id, prestataireData);
        console.log(`✅ Prestataire mis à jour: ${prestataireData.prenom} ${prestataireData.nom}`);
      }
    } catch (error: any) {
      console.error(`❌ Erreur lors de la mise à jour de ${prestataireData.email}:`, error.message);
    }
  }

  console.log('🎉 Mise à jour des prestataires terminée!');
  await app.close();
}

updatePrestataires().catch(console.error);
