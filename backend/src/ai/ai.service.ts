import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

interface MistralResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

@Injectable()
export class AiService {
  private apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private apiKey = process.env.MISTRAL_API_KEY!;

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
}
