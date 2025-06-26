export interface Project {
  id: number;
  title: string;
  description: string;
  statut: 'EN_COURS' | 'TERMINE';
  budget: number;
  client?: {
    id: number;
    email: string;
  };
  prestataire?: {
    id: number;
    email: string;
  };
}

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'CLIENT' | 'PRESTATAIRE';
  competences?: string;
  description?: string;
  tarifHoraire?: number;
}

export interface PrestataireStats {
  totalProjets: number;
  projetsEnCours: number;
  projetsTermines: number;
  chiffreAffaires: number;
}
