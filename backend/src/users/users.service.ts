import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async create(email: string, password: string, role: 'CLIENT' | 'PRESTATAIRE'): Promise<User> {
    const user = this.repo.create({ email, password, role });
    return this.repo.save(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }
}
