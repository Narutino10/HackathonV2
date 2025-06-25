export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'EN_COURS' | 'TERMINE';
  client?: {
    id: number;
    email: string;
  };
  prestataire?: {
    id: number;
    email: string;
  };
}
