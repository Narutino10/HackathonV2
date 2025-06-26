import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

export interface MatchResult {
  user: User;
  algorithmScore: number;
  matchedKeywords: string[];
  matchReason: string;
}

export interface SearchFilters {
  maxPrice?: number;
  minPrice?: number;
  skills?: string[];
  experience?: string;
}

@Injectable()
export class MatchingService {
  constructor(private usersService: UsersService) {}

  /**
   * Algorithme de matching par mots-clés et filtres
   */
  async findCandidatesByAlgorithm(
    query: string,
    filters: SearchFilters = {},
  ): Promise<MatchResult[]> {
    // 1. Récupérer tous les prestataires
    const prestataires = await this.usersService.findPrestataires();

    // 2. Extraire les mots-clés de la requête
    const queryKeywords = this.extractKeywords(query);

    // 3. Filtrer et scorer chaque prestataire
    const matches: MatchResult[] = [];

    for (const prestataire of prestataires) {
      const matchResult = this.scorePrestataire(prestataire, queryKeywords, filters);
      
      if (matchResult.algorithmScore > 0) {
        matches.push(matchResult);
      }
    }

    // 4. Trier par score décroissant
    return matches.sort((a, b) => b.algorithmScore - a.algorithmScore);
  }

  /**
   * Extrait les mots-clés pertinents d'une requête
   */
  private extractKeywords(query: string): string[] {
    const normalizedQuery = query.toLowerCase();
    
    // Dictionnaire de mapping des termes
    const skillsMapping = {
      // Développement web
      'développeur web': ['react', 'javascript', 'html', 'css', 'frontend', 'backend'],
      'dev web': ['react', 'javascript', 'html', 'css', 'frontend', 'backend'],
      'site web': ['wordpress', 'html', 'css', 'javascript', 'frontend'],
      'react': ['react', 'javascript', 'frontend', 'typescript'],
      'vue': ['vue', 'javascript', 'frontend'],
      'angular': ['angular', 'typescript', 'frontend'],
      'node': ['node.js', 'javascript', 'backend'],
      'php': ['php', 'backend', 'mysql'],
      'python': ['python', 'backend', 'django', 'flask'],
      
      // E-commerce
      'boutique': ['shopify', 'woocommerce', 'e-commerce', 'prestashop'],
      'e-commerce': ['shopify', 'woocommerce', 'prestashop', 'magento'],
      'ecommerce': ['shopify', 'woocommerce', 'prestashop', 'magento'],
      'shopify': ['shopify', 'e-commerce'],
      'wordpress': ['wordpress', 'php', 'woocommerce'],
      
      // Design
      'design': ['ui/ux', 'figma', 'photoshop', 'illustrator'],
      'designer': ['ui/ux', 'figma', 'photoshop', 'illustrator'],
      'ui': ['ui/ux', 'figma', 'design'],
      'ux': ['ui/ux', 'figma', 'design'],
      'logo': ['illustrator', 'photoshop', 'design'],
      'landing': ['design', 'html', 'css', 'conversion'],
      
      // Marketing
      'seo': ['seo', 'google', 'référencement', 'analytics'],
      'référencement': ['seo', 'google', 'analytics'],
      'google ads': ['google ads', 'ppc', 'marketing'],
      'marketing': ['seo', 'google ads', 'analytics', 'social media'],
      
      // Mobile
      'mobile': ['react native', 'flutter', 'ios', 'android'],
      'application mobile': ['react native', 'flutter', 'ios', 'android'],
      'app mobile': ['react native', 'flutter', 'ios', 'android'],
      'ios': ['swift', 'ios', 'mobile'],
      'android': ['kotlin', 'java', 'android', 'mobile'],
      
      // Autres
      'automatisation': ['python', 'automation', 'api'],
      'ia': ['python', 'machine learning', 'tensorflow'],
      'intelligence artificielle': ['python', 'machine learning', 'tensorflow'],
    };

    let keywords: string[] = [];

    // Chercher des correspondances dans le mapping
    for (const [term, mappedSkills] of Object.entries(skillsMapping)) {
      if (normalizedQuery.includes(term)) {
        keywords = [...keywords, ...mappedSkills];
      }
    }

    // Ajouter les mots simples de la requête
    const simpleWords = normalizedQuery
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter(word => !['pour', 'avec', 'dans', 'sur', 'une', 'des', 'les', 'mon', 'ma', 'mes'].includes(word));

    keywords = [...keywords, ...simpleWords];

    // Retourner les mots-clés uniques
    return [...new Set(keywords)];
  }

  /**
   * Score un prestataire selon l'algorithme de matching
   */
  private scorePrestataire(
    prestataire: User,
    queryKeywords: string[],
    filters: SearchFilters,
  ): MatchResult {
    let score = 0;
    const matchedKeywords: string[] = [];
    const reasons: string[] = [];

    // Vérifier les compétences du prestataire
    const prestataireSkills = (prestataire.competences || '').toLowerCase();
    const prestataireDescription = (prestataire.description || '').toLowerCase();
    const prestataireText = `${prestataireSkills} ${prestataireDescription}`;

    // 1. Score basé sur les mots-clés trouvés
    for (const keyword of queryKeywords) {
      if (prestataireText.includes(keyword.toLowerCase())) {
        score += 10;
        matchedKeywords.push(keyword);
      }
    }

    // 2. Bonus pour correspondance exacte dans les compétences
    for (const keyword of queryKeywords) {
      if (prestataireSkills.includes(keyword.toLowerCase())) {
        score += 5; // Bonus compétence exacte
        if (!reasons.includes(`Expert en ${keyword}`)) {
          reasons.push(`Expert en ${keyword}`);
        }
      }
    }

    // 3. Score basé sur le nombre de mots-clés trouvés
    const keywordMatchRatio = matchedKeywords.length / queryKeywords.length;
    score += Math.round(keywordMatchRatio * 20);

    // 4. Filtres de prix
    if (filters.maxPrice && prestataire.tarifHoraire && prestataire.tarifHoraire > filters.maxPrice) {
      score -= 15; // Pénalité si trop cher
    }
    if (filters.minPrice && prestataire.tarifHoraire && prestataire.tarifHoraire < filters.minPrice) {
      score -= 10; // Pénalité si trop bon marché (suspicion de qualité)
    }

    // 5. Bonus pour profil complet
    if (prestataire.description && prestataire.description.length > 50) {
      score += 5;
      reasons.push('Profil détaillé');
    }

    // 6. Normaliser le score sur 100
    score = Math.min(Math.max(score, 0), 100);

    // Générer la raison du match
    let matchReason = 'Prestataire disponible sur la plateforme';
    if (reasons.length > 0) {
      matchReason = reasons.join(', ');
    } else if (matchedKeywords.length > 0) {
      matchReason = `Compétences en ${matchedKeywords.slice(0, 2).join(', ')}`;
    }

    return {
      user: prestataire,
      algorithmScore: score,
      matchedKeywords,
      matchReason,
    };
  }

  /**
   * Analyse les tendances de recherche
   */
  analyzeSearchTrends(query: string): { 
    category: string; 
    complexity: 'simple' | 'medium' | 'complex';
    suggestedFilters: SearchFilters;
  } {
    const normalizedQuery = query.toLowerCase();
    
    let category = 'Général';
    let complexity: 'simple' | 'medium' | 'complex' = 'medium';
    const suggestedFilters: SearchFilters = {};

    // Détecter la catégorie
    if (normalizedQuery.includes('design') || normalizedQuery.includes('ui') || normalizedQuery.includes('logo')) {
      category = 'Design & UI/UX';
      suggestedFilters.maxPrice = 60;
    } else if (normalizedQuery.includes('développeur') || normalizedQuery.includes('react') || normalizedQuery.includes('web')) {
      category = 'Développement Web';
      suggestedFilters.maxPrice = 80;
    } else if (normalizedQuery.includes('seo') || normalizedQuery.includes('marketing')) {
      category = 'Marketing Digital';
      suggestedFilters.maxPrice = 50;
    } else if (normalizedQuery.includes('mobile') || normalizedQuery.includes('application')) {
      category = 'Développement Mobile';
      complexity = 'complex';
      suggestedFilters.minPrice = 50;
    }

    // Détecter la complexité
    if (normalizedQuery.includes('simple') || normalizedQuery.includes('basique')) {
      complexity = 'simple';
      suggestedFilters.maxPrice = 40;
    } else if (normalizedQuery.includes('complexe') || normalizedQuery.includes('avancé') || normalizedQuery.includes('enterprise')) {
      complexity = 'complex';
      suggestedFilters.minPrice = 60;
    }

    return { category, complexity, suggestedFilters };
  }
}
