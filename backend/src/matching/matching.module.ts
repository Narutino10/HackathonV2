import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
