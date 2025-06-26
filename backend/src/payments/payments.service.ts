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

  createPaymentIntent(data: {
    amount: number;
    currency: string;
    prestataireId: number;
    reservation: any;
  }) {
    try {
      // Simulation d'une intention de paiement (sans Stripe pour l'instant)
      const mockPaymentIntent = {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_mock`,
        amount: data.amount,
        currency: data.currency,
        status: 'requires_payment_method',
      };

      return {
        clientSecret: mockPaymentIntent.client_secret,
        paymentIntentId: mockPaymentIntent.id,
        message: 'Intention de paiement créée (mode simulation)',
      };
    } catch (error) {
      console.error('Erreur simulation paiement:', error);
      throw new Error('Erreur lors de la création du paiement');
    }
  }
}
