import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { UsersService } from '../users/users.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll(): Promise<Project[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Project | null> {
    return this.projectsService.findOne(id);
  }

  @Post()
  async create(
    @Body() body: { title: string; description: string; clientId: number },
  ): Promise<Project> {
    const client = await this.usersService.findById(body.clientId);
    if (!client) throw new NotFoundException('Client non trouvé');
    return this.projectsService.create(body.title, body.description, client);
  }

  @Post(':id/assign')
  async assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { prestataireId: number },
  ): Promise<Project> {
    const prestataire = await this.usersService.findById(body.prestataireId);
    if (!prestataire) throw new NotFoundException('Prestataire non trouvé');
    return this.projectsService.assignPrestataire(id, prestataire);
  }

  @Post(':id/done')
  markDone(@Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectsService.markAsDone(id);
  }
}
