import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', width: 1 })
  note: number; // ex: 1 à 5

  @Column('text')
  comment: string;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @ManyToOne(() => Project, { eager: true })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;
}
