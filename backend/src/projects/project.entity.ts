import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

export type ProjectStatus = 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE' | 'confirmed';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: ['EN_ATTENTE', 'EN_COURS', 'TERMINE', 'confirmed'], default: 'EN_ATTENTE' })
  status: ProjectStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget: number;

  @Column({ nullable: true })
  dateDebut: string;

  @Column({ nullable: true })
  dateFin: string;

  @Column({ type: 'int', nullable: true })
  heures: number;

  @Column({ nullable: true })
  paymentId: string;

  @ManyToOne(() => User, (user) => user.projects, { eager: true })
  client: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  prestataire: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
