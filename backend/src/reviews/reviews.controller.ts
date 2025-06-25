import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { Review } from './review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      note: number;
      comment: string;
      authorId: number;
      projectId: number;
    },
  ): Promise<Review> {
    const author = await this.usersService.findById(body.authorId);
    if (!author) throw new NotFoundException('Utilisateur non trouvé');

    const project = await this.projectsService.findOne(body.projectId);
    if (!project) throw new NotFoundException('Projet non trouvé');

    return this.reviewsService.create(body.note, body.comment, author, project);
  }

  @Get('project/:projectId')
  getByProject(@Param('projectId', ParseIntPipe) projectId: number): Promise<Review[]> {
    return this.reviewsService.getByProject(projectId);
  }
}
