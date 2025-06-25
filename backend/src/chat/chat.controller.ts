import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Message } from './message.entity';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get(':projectId')
  getMessages(@Param('projectId', ParseIntPipe) id: number): Promise<Message[]> {
    return this.chatService.getMessagesByProject(id);
  }

  @Post()
  async sendMessage(
    @Body() body: { content: string; senderId: number; projectId: number },
  ): Promise<Message> {
    const sender = await this.usersService.findById(body.senderId);
    if (!sender) throw new NotFoundException('Utilisateur non trouvé');

    const project = await this.projectsService.findOne(body.projectId);
    if (!project) throw new NotFoundException('Projet non trouvé');

    return this.chatService.sendMessage(body.content, sender, project);
  }
}
