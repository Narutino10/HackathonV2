import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private repo: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Project | null> {
    return this.repo.findOne({ where: { id } });
  }

  create(title: string, description: string, client: User): Promise<Project> {
    const project = this.repo.create({ title, description, client });
    return this.repo.save(project);
  }

  async assignPrestataire(projectId: number, prestataire: User): Promise<Project> {
    const project = await this.repo.findOneBy({ id: projectId });
    if (!project) throw new Error('Projet introuvable');
    project.prestataire = prestataire;
    project.status = 'EN_COURS';
    return this.repo.save(project);
  }

  async markAsDone(projectId: number): Promise<Project> {
    const project = await this.repo.findOneBy({ id: projectId });
    if (!project) throw new Error('Projet introuvable');
    project.status = 'TERMINE';
    return this.repo.save(project);
  }
}
