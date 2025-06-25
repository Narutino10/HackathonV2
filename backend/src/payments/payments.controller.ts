import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ProjectsService } from '../projects/projects.service';
import { Payment } from './payment.entity';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Post()
  async create(@Body() body: { amount: number; projectId: number }): Promise<Payment> {
    const project = await this.projectsService.findOne(body.projectId);
    if (!project) throw new NotFoundException('Projet non trouvé');
    return this.paymentsService.create(body.amount, project);
  }

  @Post(':id/pay')
  pay(@Param('id', ParseIntPipe) id: number): Promise<Payment> {
    return this.paymentsService.markAsPaid(id);
  }

  @Get('project/:projectId')
  getByProject(@Param('projectId', ParseIntPipe) projectId: number): Promise<Payment[]> {
    return this.paymentsService.findByProject(projectId);
  }
}
