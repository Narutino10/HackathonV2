import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export type ProjectStatus = 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: ['EN_ATTENTE', 'EN_COURS', 'TERMINE'], default: 'EN_ATTENTE' })
  status: ProjectStatus;

  @ManyToOne(() => User, (user) => user.projects, { eager: true })
  client: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  prestataire: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
