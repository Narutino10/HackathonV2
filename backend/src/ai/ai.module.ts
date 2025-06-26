import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiServicesController } from './ai-services.controller';
import { UsersModule } from '../users/users.module';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [UsersModule, MatchingModule],
  providers: [AiService],
  controllers: [AiController, AiServicesController],
})
export class AiModule {}
