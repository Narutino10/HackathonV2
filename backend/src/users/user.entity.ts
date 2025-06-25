import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Project } from '../projects/project.entity';

export type UserRole = 'CLIENT' | 'PRESTATAIRE';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['CLIENT', 'PRESTATAIRE'] })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];
}
