import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Project } from '../projects/project.entity';

export type UserRole = 'CLIENT' | 'PRESTATAIRE' | 'ADMIN';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['CLIENT', 'PRESTATAIRE', 'ADMIN'], default: 'CLIENT' })
  role: UserRole;

  @Column({ nullable: true })
  nom?: string;

  @Column({ nullable: true })
  prenom?: string;

  @Column({ type: 'text', nullable: true })
  competences?: string; // Liste des compétences séparées par des virgules

  @Column({ type: 'text', nullable: true })
  description?: string; // Description du prestataire

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tarifHoraire?: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];
}
