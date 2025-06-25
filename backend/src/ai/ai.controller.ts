import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest-prestataire')
  async suggest(@Body() body: { prompt: string }): Promise<string[]> {
    const result = await this.aiService.ask(body.prompt);
    return result.split('\n').filter((line) => line.trim() !== '');
  }
}
