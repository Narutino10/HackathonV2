import { Controller, Get, Param, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    
    // Ne pas exposer le mot de passe
    return {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      competences: user.competences,
      description: user.description,
      tarifHoraire: user.tarifHoraire,
    };
  }

  @Get()
  async findPrestataires() {
    return this.usersService.findPrestataires();
  }
}
