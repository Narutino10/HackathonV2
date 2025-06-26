import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

interface PrestataireSuggestion {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  competences: string;
  description: string;
  tarifHoraire: number;
  score: number;
  raison: string;
}

interface SuggestResponse {
  success: boolean;
  prestataires: PrestataireSuggestion[];
  message: string;
  error?: string;
}

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('suggest-prestataire')
  async suggest(@Body() body: { prompt: string }): Promise<SuggestResponse> {
    try {
      const prestataires = await this.aiService.suggestPrestataires(body.prompt);
      return {
        success: true,
        prestataires: prestataires,
        message: `${prestataires.length} prestataire(s) trouvé(s) pour votre demande.`,
      };
    } catch (error) {
      return {
        success: false,
        prestataires: [],
        message: 'Erreur lors de la recherche de prestataires.',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }
}
