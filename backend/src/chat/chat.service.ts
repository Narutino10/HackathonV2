import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private repo: Repository<Message>,
  ) {}

  async getMessagesByProject(projectId: number): Promise<Message[]> {
    return this.repo.find({
      where: { project: { id: projectId } },
      order: { sentAt: 'ASC' },
    });
  }

  sendMessage(content: string, sender: User, project: Project): Promise<Message> {
    const msg = this.repo.create({ content, sender, project });
    return this.repo.save(msg);
  }
}
