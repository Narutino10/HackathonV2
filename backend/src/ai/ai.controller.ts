import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { MatchingService, MatchResult, SearchFilters } from '../matching/matching.service';

interface PrestataireSuggestion {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  competences: string;
  description: string;
  tarifHoraire: number;
  algorithmScore: number;
  aiScore?: number;
  finalScore: number;
  matchedKeywords: string[];
  algorithmReason: string;
  aiAnalysis?: string;
  explanation: string;
}

interface SuggestResponse {
  success: boolean;
  prestataires: PrestataireSuggestion[];
  message: string;
  searchAnalysis: {
    category: string;
    complexity: string;
    suggestedFilters: SearchFilters;
  };
  error?: string;
}

@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly matchingService: MatchingService,
  ) {}

  @Post('suggest-prestataire')
  async suggest(
    @Body() body: { prompt: string; filters?: SearchFilters; useAiAnalysis?: boolean },
  ): Promise<SuggestResponse> {
    try {
      const { prompt, filters = {}, useAiAnalysis = true } = body;

      // 1. Analyse de la recherche et extraction de catégorie
      const searchAnalysis = this.matchingService.analyzeSearchTrends(prompt);
      
      // Fusionner les filtres suggérés avec ceux fournis
      const finalFilters = { ...searchAnalysis.suggestedFilters, ...filters };

      // 2. Matching algorithmique
      const algorithmMatches = await this.matchingService.findCandidatesByAlgorithm(
        prompt,
        finalFilters,
      );

      // 3. Amélioration par IA (optionnelle et seulement pour les meilleurs candidats)
      let enhancedMatches: PrestataireSuggestion[] = [];

      if (useAiAnalysis && algorithmMatches.length > 0) {
        // Prendre les 10 meilleurs candidats algorithmiques pour l'analyse IA
        const topCandidates = algorithmMatches.slice(0, 10);
        enhancedMatches = await this.enhanceWithAI(topCandidates, prompt);
      } else {
        // Juste transformer les résultats algorithmiques
        enhancedMatches = algorithmMatches.map((match) => this.transformToSuggestion(match));
      }

      // 4. Trier par score final
      enhancedMatches.sort((a, b) => b.finalScore - a.finalScore);

      return {
        success: true,
        prestataires: enhancedMatches.slice(0, 8), // Limiter à 8 résultats
        message: `${enhancedMatches.length} prestataire(s) trouvé(s) pour votre demande.`,
        searchAnalysis,
      };
    } catch (error) {
      return {
        success: false,
        prestataires: [],
        message: 'Erreur lors de la recherche de prestataires.',
        searchAnalysis: {
          category: 'Général',
          complexity: 'medium',
          suggestedFilters: {},
        },
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Améliore les résultats algorithmiques avec l'analyse IA
   */
  private async enhanceWithAI(
    matches: MatchResult[],
    prompt: string,
  ): Promise<PrestataireSuggestion[]> {
    const enhanced: PrestataireSuggestion[] = [];

    for (const match of matches) {
      try {
        // Analyse IA individuelle pour ce prestataire
        const aiAnalysis = await this.aiService.analyzePrestataire(match.user, prompt);
        
        const suggestion: PrestataireSuggestion = {
          id: match.user.id,
          nom: match.user.nom || '',
          prenom: match.user.prenom || '',
          email: match.user.email,
          competences: match.user.competences || '',
          description: match.user.description || '',
          tarifHoraire: match.user.tarifHoraire || 0,
          algorithmScore: match.algorithmScore,
          aiScore: aiAnalysis.score,
          finalScore: this.calculateFinalScore(match.algorithmScore, aiAnalysis.score),
          matchedKeywords: match.matchedKeywords,
          algorithmReason: match.matchReason,
          aiAnalysis: aiAnalysis.explanation,
          explanation: this.generateCombinedExplanation(match, aiAnalysis),
        };

        enhanced.push(suggestion);
      } catch {
        // En cas d'erreur IA, on garde juste le résultat algorithmique
        enhanced.push(this.transformToSuggestion(match));
      }
    }

    return enhanced;
  }

  /**
   * Transforme un MatchResult en PrestataireSuggestion (sans IA)
   */
  private transformToSuggestion(match: MatchResult): PrestataireSuggestion {
    return {
      id: match.user.id,
      nom: match.user.nom || '',
      prenom: match.user.prenom || '',
      email: match.user.email,
      competences: match.user.competences || '',
      description: match.user.description || '',
      tarifHoraire: match.user.tarifHoraire || 0,
      algorithmScore: match.algorithmScore,
      finalScore: match.algorithmScore,
      matchedKeywords: match.matchedKeywords,
      algorithmReason: match.matchReason,
      explanation: `Score algorithmique: ${match.algorithmScore}/100. ${match.matchReason}`,
    };
  }

  /**
   * Calcule le score final en combinant algorithme et IA
   */
  private calculateFinalScore(algorithmScore: number, aiScore?: number): number {
    if (!aiScore) return algorithmScore;
    
    // Combinaison pondérée : 60% algorithme, 40% IA
    return Math.round(algorithmScore * 0.6 + aiScore * 0.4);
  }

  /**
   * Génère une explication combinée algorithme + IA
   */
  private generateCombinedExplanation(
    match: MatchResult,
    aiAnalysis: { score: number; explanation: string },
  ): string {
    const parts = [];
    
    parts.push(`Score algorithmique: ${match.algorithmScore}/100`);
    if (aiAnalysis.score) {
      parts.push(`Score IA: ${aiAnalysis.score}/100`);
    }
    
    parts.push(`Matching: ${match.matchReason}`);
    
    if (aiAnalysis.explanation) {
      parts.push(`Analyse IA: ${aiAnalysis.explanation}`);
    }
    
    return parts.join(' • ');
  }
}
