import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ProjectsService } from './projects/projects.service';
import { DataSource } from 'typeorm';
import { seedPrestataires } from './seed-prestataires';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const projectsService = app.get(ProjectsService);
  const dataSource = app.get(DataSource);

  console.log('🌱 Démarrage du seeding avec prestataires...');

  try {
    // Vérifier si les utilisateurs existent déjà
    const existingAdmin = await usersService.findByEmail('admin@example.com');
    const existingClient = await usersService.findByEmail('client@example.com');

    let admin, client;

    if (!existingAdmin) {
      admin = await usersService.create(
        'admin@example.com',
        await bcrypt.hash('adminpass', 10),
        'ADMIN',
      );
      console.log('✅ Admin créé');
    } else {
      admin = existingAdmin;
      console.log('ℹ️ Admin déjà existant');
    }

    if (!existingClient) {
      client = await usersService.create(
        'client@example.com',
        await bcrypt.hash('clientpass', 10),
        'CLIENT',
      );
      console.log('✅ Client créé');
    } else {
      client = existingClient;
      console.log('ℹ️ Client déjà existant');
    }

    // Ajouter les prestataires avec leurs compétences
    await seedPrestataires(dataSource);

    // Récupérer tous les prestataires pour affichage
    const prestataires = await usersService.findPrestataires();

    console.log('\n📊 Utilisateurs dans la base :');
    console.log(`- Admin: ${admin.email}`);
    console.log(`- Client: ${client.email}`);
    prestataires.forEach((p) => {
      console.log(
        `- Prestataire: ${p.prenom} ${p.nom} (${p.email}) - ${p.competences?.split(',')[0]}... - ${p.tarifHoraire}€/h`,
      );
    });

    // Création de projets liés au client
    try {
      await projectsService.create(
        'Site vitrine WordPress',
        "Développement d'un site vitrine pour un artisan avec WordPress. Besoin d'un design moderne et responsive.",
        client,
      );
      await projectsService.create(
        'Audit SEO',
        "Analyse SEO complète d'un site e-commerce pour améliorer le référencement naturel.",
        client,
      );
      await projectsService.create(
        'Landing Page Produit',
        "Création d'une landing page responsive pour le lancement d'un nouveau produit.",
        client,
      );
      await projectsService.create(
        'Application mobile',
        "Développement d'une application mobile cross-platform pour iOS et Android.",
        client,
      );

      console.log('\n✅ Projets créés avec succès.');
    } catch {
      console.log('\nℹ️ Les projets existent peut-être déjà.');
    }

    console.log('\n🎉 Seeding terminé avec succès!');
    console.log("\n📝 Vous pouvez maintenant tester l'API AI avec des demandes comme :");
    console.log('   - "Je cherche un développeur web"');
    console.log('   - "J\'ai besoin d\'un designer"');
    console.log('   - "Je veux faire du SEO"');
    console.log('   - "Application mobile"');
    console.log('   - "Développement React"');
    console.log('\n🌐 API disponible sur: http://localhost:5000');
    console.log('📝 Endpoint pour tester: POST /ai/suggest-prestataire');
    console.log('📋 Body exemple: { "prompt": "Je cherche un développeur web" }');
  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
  }

  await app.close();
}

void bootstrap();
