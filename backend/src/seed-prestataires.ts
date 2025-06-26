import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedPrestataires(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  // Vérifier si des prestataires existent déjà
  const existingPrestataires = await userRepository.find({ where: { role: 'PRESTATAIRE' } });

  if (existingPrestataires.length > 0) {
    console.log('Des prestataires existent déjà dans la base de données.');
    return;
  }

  const prestataireData = [
    {
      email: 'marie.dupont@exemple.com',
      password: await bcrypt.hash('password123', 10),
      role: 'PRESTATAIRE' as const,
      nom: 'Dupont',
      prenom: 'Marie',
      competences: 'Développement web, React, Node.js, TypeScript, JavaScript',
      description:
        "Développeuse full-stack avec 5 ans d'expérience en développement web moderne. Spécialisée dans React et Node.js.",
      tarifHoraire: 45,
    },
    {
      email: 'pierre.martin@exemple.com',
      password: await bcrypt.hash('password123', 10),
      role: 'PRESTATAIRE' as const,
      nom: 'Martin',
      prenom: 'Pierre',
      competences: 'Design graphique, UI/UX, Adobe Creative Suite, Figma, Photoshop',
      description:
        "Designer graphique et UX/UI avec 7 ans d'expérience. Expert en création d'identités visuelles et interfaces utilisateur.",
      tarifHoraire: 40,
    },
    {
      email: 'sophie.bernard@exemple.com',
      password: await bcrypt.hash('password123', 10),
      role: 'PRESTATAIRE' as const,
      nom: 'Bernard',
      prenom: 'Sophie',
      competences: 'Marketing digital, SEO, Google Ads, Facebook Ads, Analytics',
      description:
        "Spécialiste en marketing digital avec expertise en SEO et campagnes publicitaires. 6 ans d'expérience.",
      tarifHoraire: 35,
    },
    {
      email: 'thomas.durand@exemple.com',
      password: await bcrypt.hash('password123', 10),
      role: 'PRESTATAIRE' as const,
      nom: 'Durand',
      prenom: 'Thomas',
      competences: 'Développement mobile, Flutter, React Native, iOS, Android',
      description:
        "Développeur mobile spécialisé en applications cross-platform. 4 ans d'expérience avec Flutter et React Native.",
      tarifHoraire: 50,
    },
    {
      email: 'laura.petit@exemple.com',
      password: await bcrypt.hash('password123', 10),
      role: 'PRESTATAIRE' as const,
      nom: 'Petit',
      prenom: 'Laura',
      competences: 'Rédaction web, Content marketing, SEO, Copywriting, Blog',
      description:
        'Rédactrice web et spécialiste en content marketing. Création de contenus optimisés SEO depuis 5 ans.',
      tarifHoraire: 30,
    },
    {
      email: 'julien.rousseau@exemple.com',
      password: await bcrypt.hash('password123', 10),
      role: 'PRESTATAIRE' as const,
      nom: 'Rousseau',
      prenom: 'Julien',
      competences: 'Data Science, Python, Machine Learning, IA, Analyse de données',
      description:
        "Data Scientist avec expertise en machine learning et intelligence artificielle. 6 ans d'expérience en analyse de données.",
      tarifHoraire: 60,
    },
  ];

  for (const prestataireInfo of prestataireData) {
    const prestataire = userRepository.create(prestataireInfo);
    await userRepository.save(prestataire);
    console.log(`Prestataire créé: ${prestataireInfo.prenom} ${prestataireInfo.nom}`);
  }

  console.log('Données de prestataires ajoutées avec succès!');
}
