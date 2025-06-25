import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private repo: Repository<Review>,
  ) {}

  create(note: number, comment: string, author: User, project: Project): Promise<Review> {
    const review = this.repo.create({ note, comment, author, project });
    return this.repo.save(review);
  }

  getByProject(projectId: number): Promise<Review[]> {
    return this.repo.find({ where: { project: { id: projectId } } });
  }
}
