import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import axios, { AxiosResponse } from 'axios';

interface MistralResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

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

interface AIAnalysisResult {
  score: number;
  explanation: string;
}

@Injectable()
export class AiService {
  private apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private apiKey = process.env.MISTRAL_API_KEY!;

  constructor(private readonly usersService: UsersService) {}

  async ask(prompt: string): Promise<string> {
    try {
      const response: AxiosResponse<MistralResponse> = await axios.post(
        this.apiUrl,
        {
          model: 'mistral-small',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err;
        console.error('Erreur Mistral :', axiosError.response?.data ?? axiosError.message);
      } else {
        console.error('Erreur inconnue :', err);
      }

      throw new Error("Erreur IA : impossible d'obtenir une réponse");
    }
  }

  async suggestPrestataires(demande: string): Promise<PrestataireSuggestion[]> {
    try {
      // Récupérer tous les prestataires
      const prestataires = await this.usersService.findPrestataires();

      if (prestataires.length === 0) {
        return [];
      }

      // Créer un prompt pour analyser la demande et les prestataires
      const prestatairesList = prestataires
        .map(
          (p) =>
            `ID: ${p.id}, Nom: ${p.nom || 'Non renseigné'} ${p.prenom || ''}, Email: ${p.email}, Compétences: ${p.competences || 'Non renseignées'}, Description: ${p.description || 'Aucune description'}, Tarif: ${p.tarifHoraire || 'Non renseigné'}€/h`,
        )
        .join('\n');

      const analysisPrompt = `
Analyse cette demande client : "${demande}"

Voici la liste des prestataires disponibles :
${prestatairesList}

Tu dois recommander les 3 meilleurs prestataires pour cette demande. Pour chaque prestataire recommandé, fournis :
1. L'ID du prestataire
2. Un score de pertinence de 1 à 10
3. Une explication courte de pourquoi ce prestataire convient

Réponds UNIQUEMENT au format JSON suivant :
[
  {
    "id": number,
    "score": number,
    "raison": "explication courte"
  }
]

Si aucun prestataire ne convient, retourne un tableau vide [].
`;

      const response = await this.ask(analysisPrompt);

      try {
        const recommendations = JSON.parse(response) as Array<{
          id: number;
          score: number;
          raison: string;
        }>;

        // Enrichir les recommandations avec les données complètes des prestataires
        const suggestions: PrestataireSuggestion[] = [];

        for (const rec of recommendations) {
          const prestataire = prestataires.find((p) => p.id === rec.id);
          if (prestataire) {
            suggestions.push({
              id: prestataire.id,
              nom: prestataire.nom || 'Non renseigné',
              prenom: prestataire.prenom || '',
              email: prestataire.email,
              competences: prestataire.competences || 'Non renseignées',
              description: prestataire.description || 'Aucune description',
              tarifHoraire: prestataire.tarifHoraire || 0,
              score: rec.score,
              raison: rec.raison,
            });
          }
        }

        // Trier par score décroissant
        return suggestions.sort((a, b) => b.score - a.score);
      } catch (parseError) {
        console.error('Erreur de parsing JSON:', parseError);
        console.error('Réponse IA:', response);

        // Fallback : retourner tous les prestataires avec un score par défaut
        return prestataires.slice(0, 3).map((p) => ({
          id: p.id,
          nom: p.nom || 'Non renseigné',
          prenom: p.prenom || '',
          email: p.email,
          competences: p.competences || 'Non renseignées',
          description: p.description || 'Aucune description',
          tarifHoraire: p.tarifHoraire || 0,
          score: 5,
          raison: 'Prestataire disponible sur la plateforme',
        }));
      }
    } catch (err) {
      console.error('Erreur lors de la suggestion de prestataires:', err);
      throw new Error('Erreur lors de la recherche de prestataires');
    }
  }

  /**
   * Analyse individuelle d'un prestataire par l'IA
   */
  async analyzePrestataire(prestataire: User, demande: string): Promise<AIAnalysisResult> {
    try {
      const analysisPrompt = `
Analyse ce prestataire pour la demande suivante :

DEMANDE CLIENT: "${demande}"

PRESTATAIRE:
- Nom: ${prestataire.nom || 'Non renseigné'} ${prestataire.prenom || ''}
- Email: ${prestataire.email}
- Compétences: ${prestataire.competences || 'Non renseignées'}
- Description: ${prestataire.description || 'Aucune description'}
- Tarif: ${prestataire.tarifHoraire || 'Non renseigné'}€/h

Analyse la pertinence de ce prestataire pour cette demande en considérant :
1. La correspondance des compétences
2. L'expérience apparent dans la description
3. Le rapport qualité/prix
4. L'adéquation générale au projet

Réponds UNIQUEMENT au format JSON suivant :
{
  "score": number (1-100),
  "explanation": "Explication courte et précise de ton analyse (max 150 caractères)"
}
`;

      const response = await this.ask(analysisPrompt);

      try {
        const analysis = JSON.parse(response) as AIAnalysisResult;
        
        // Validation des données
        if (typeof analysis.score !== 'number' || analysis.score < 0 || analysis.score > 100) {
          analysis.score = 50;
        }
        
        if (!analysis.explanation || typeof analysis.explanation !== 'string') {
          analysis.explanation = 'Prestataire potentiellement adapté au projet';
        }

        return analysis;
      } catch (parseError) {
        console.error('Erreur de parsing JSON pour analyse prestataire:', parseError);
        
        // Fallback
        return {
          score: 50,
          explanation: 'Analyse IA indisponible, évaluation basique effectuée',
        };
      }
    } catch (err) {
      console.error("Erreur lors de l'analyse IA du prestataire:", err);
      
      // Fallback en cas d'erreur
      return {
        score: 40,
        explanation: 'Erreur IA, évaluation manuelle recommandée',
      };
    }
  }
}
