import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ProjectsService } from './projects/projects.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const projectsService = app.get(ProjectsService);

  // Création d'utilisateurs
  const admin = await usersService.create('admin@example.com', 'adminpass', 'ADMIN');
  const client = await usersService.create('client@example.com', 'clientpass', 'CLIENT');
  const prestataire = await usersService.create(
    'prestataire@example.com',
    'presta123',
    'PRESTATAIRE',
  );

  console.log('✅ Utilisateurs créés :');
  console.log({ admin, client, prestataire });

  // Création de projets
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

  console.log('✅ Projets créés avec succès.');
  await app.close();
}

void bootstrap(); // ✅ Évite l'erreur ESLint no-floating-promises
