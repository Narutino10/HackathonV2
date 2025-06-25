import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Project } from '../projects/project.entity';

export type PaymentStatus = 'EN_ATTENTE' | 'PAYE';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, { eager: true })
  project: Project;

  @Column('decimal')
  amount: number;

  @Column({ type: 'enum', enum: ['EN_ATTENTE', 'PAYE'], default: 'EN_ATTENTE' })
  status: PaymentStatus;

  @Column({ nullable: true })
  paymentIntentId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
