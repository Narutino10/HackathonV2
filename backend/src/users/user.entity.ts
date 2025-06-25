import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

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
}
