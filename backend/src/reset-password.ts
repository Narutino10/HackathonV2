import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import * as bcrypt from 'bcrypt';

async function resetPassword() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  const dataSource = app.get(DataSource);
  const userRepository = dataSource.getRepository(User);

  console.log('🔧 Réinitialisation du mot de passe pour Lucas Martin...');

  try {
    // Trouver Lucas Martin par email
    const user = await userRepository.findOne({ where: { email: 'shopify@expert.com' } });
    
    if (user) {
      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Mettre à jour directement en base
      await userRepository.update(user.id, { password: hashedPassword });
      
      console.log('✅ Mot de passe mis à jour pour Lucas Martin (shopify@expert.com)');
      console.log('🔑 Nouveau mot de passe: password123');
    } else {
      console.log('❌ Utilisateur Lucas Martin non trouvé');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }

  await app.close();
}

resetPassword().catch(console.error);
