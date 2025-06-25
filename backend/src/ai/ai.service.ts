import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse, AxiosError } from 'axios';

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
  private apiKey =  process.env.MISTRAL_API_KEY;

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
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Axios error:', error.response.data);
        return 'Erreur API IA';
      } else {
        console.error('Unexpected error:', (error as Error).message);
        return 'Erreur inattendue';
      }
    }
  }
}
