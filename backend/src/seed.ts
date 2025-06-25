import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ProjectsService } from './projects/projects.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const projectsService = app.get(ProjectsService);

  // Création des utilisateurs
  const admin = await usersService.create('admin@example.com', 'adminpass', 'ADMIN');
  const client = await usersService.create('client@example.com', 'clientpass', 'CLIENT');

  const prestatairesData = [
    { email: 'wordpress@agency.com', password: 'wp123' },
    { email: 'shopify@expert.com', password: 'shopify123' },
    { email: 'seo@guru.io', password: 'seo123' },
    { email: 'landing@designer.com', password: 'design123' },
    { email: 'automation@ai-solutions.com', password: 'ai123' },
  ];

  type Prestataire = { email: string }; // Adjust this type according to the actual return type of usersService.create
  const prestataires: Prestataire[] = [];

  for (const p of prestatairesData) {
    const user = await usersService.create(p.email, p.password, 'PRESTATAIRE');
    prestataires.push(user as Prestataire);
  }

  console.log('✅ Utilisateurs créés :');
  console.table([
    { role: 'ADMIN', email: admin.email },
    { role: 'CLIENT', email: client.email },
    ...prestataires.map((p) => ({ role: 'PRESTATAIRE', email: p.email })),
  ]);

  // Création de projets liés au client
  await projectsService.create(
    'Site vitrine WordPress',
    'Développement d’un site vitrine pour un artisan.',
    client,
  );
  await projectsService.create('Audit SEO', 'Analyse SEO complète d’un site e-commerce.', client);
  await projectsService.create(
    'Landing Page Produit',
    'Création d’une landing page responsive.',
    client,
  );
  await projectsService.create(
    'Automatisation emailing',
    'Mise en place d’un système d’email marketing automatisé.',
    client,
  );

  console.log('✅ Projets créés avec succès.');

  await app.close();
}

void bootstrap(); // évite l’erreur ESLint no-floating-promises
