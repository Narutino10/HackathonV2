import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { UsersModule } from '../users/users.module';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [UsersModule, MatchingModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
