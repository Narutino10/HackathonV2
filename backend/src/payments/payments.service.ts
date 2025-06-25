import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private repo: Repository<Payment>,
  ) {}

  create(amount: number, project: Project): Promise<Payment> {
    const payment = this.repo.create({ amount, project });
    return this.repo.save(payment);
  }

  findByProject(projectId: number): Promise<Payment[]> {
    return this.repo.find({ where: { project: { id: projectId } } });
  }

  async markAsPaid(id: number): Promise<Payment> {
    const payment = await this.repo.findOneBy({ id });
    if (!payment) throw new Error('Paiement introuvable');
    payment.status = 'PAYE';
    return this.repo.save(payment);
  }
}
