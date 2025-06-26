import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(email: string, password: string, role: UserRole): Promise<User> {
    const user = this.repo.create({ email, password, role });
    return this.repo.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async findPrestataires(): Promise<User[]> {
    return this.repo.find({
      where: { role: 'PRESTATAIRE' },
      select: ['id', 'email', 'nom', 'prenom', 'competences', 'description', 'tarifHoraire'],
    });
  }

  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    await this.repo.update(id, updateData);
    return this.findById(id);
  }
}
