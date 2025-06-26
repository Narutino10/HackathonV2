import { AiService } from './ai.service';

const ai = new AiService();
ai.ask('Je veux créer une app mobile de réservation').then(console.log).catch(console.error);
