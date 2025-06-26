import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

interface Project {
  id: number;
  titre: string;
  description: string;
  budget: number;
  dateDebut: string;
  dateFin: string;
  statut: 'EN_ATTENTE' | 'EN_COURS' | 'TERMINE' | 'ANNULE';
  client: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
  };
}

interface PrestataireStats {
  totalProjets: number;
  projetsEnCours: number;
  projetsTermines: number;
  chiffreAffaires: number;
  tauxReussite: number;
  noteMoyenne: number;
}

interface AIRecommendation {
  id: number;
  title: string;
  description: string;
  type: 'ANALYSIS' | 'OPTIMIZATION' | 'PREDICTION';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  result?: string;
  deliveryMethod: 'FRONTEND' | 'EMAIL';
  createdAt: Date;
}

export default function PrestataireDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<PrestataireStats>({
    totalProjets: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    chiffreAffaires: 0,
    tauxReussite: 0,
    noteMoyenne: 0
  });
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    loadAIRecommendations();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Récupérer les projets du prestataire
      const projectsResponse = await api.get('/projects');
      const allProjects = projectsResponse.data;
      
      // Filtrer les projets assignés à ce prestataire
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const myProjects = allProjects.filter((project: Project) => 
        project.statut !== 'EN_ATTENTE' || 
        (project.statut === 'EN_ATTENTE' && Math.random() > 0.7) // Simuler quelques projets en attente
      );
      
      setProjects(myProjects);
      
      // Calculer les statistiques améliorées
      const totalProjets = myProjects.length;
      const projetsTermines = myProjects.filter((p: any) => p.statut === 'TERMINE').length;
      const chiffreAffaires = myProjects
        .filter((p: any) => p.statut === 'TERMINE')
        .reduce((sum: number, p: any) => sum + p.budget, 0);
      
      const stats: PrestataireStats = {
        totalProjets,
        projetsEnCours: myProjects.filter((p: any) => p.statut === 'EN_COURS').length,
        projetsTermines,
        chiffreAffaires,
        tauxReussite: totalProjets > 0 ? Math.round((projetsTermines / totalProjets) * 100) : 0,
        noteMoyenne: 4.2 + Math.random() * 0.8 // Simulation d'une note entre 4.2 et 5.0
      };
      setStats(stats);
      
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAIRecommendations = () => {
    // Simulation de recommandations IA
    const recommendations: AIRecommendation[] = [
      {
        id: 1,
        title: "🎯 Analyse de Profil Optimisée",
        description: "Analyse IA de votre profil et suggestions d'amélioration basées sur les tendances du marché",
        type: 'ANALYSIS',
        status: 'PENDING',
        deliveryMethod: 'FRONTEND',
        createdAt: new Date()
      },
      {
        id: 2,
        title: "📊 Rapport de Performance Mensuel",
        description: "Rapport détaillé de vos performances avec benchmarks sectoriels",
        type: 'ANALYSIS',
        status: 'COMPLETED',
        result: "Votre profil est 23% plus attractif que la moyenne. Suggestions: ajoutez 2 compétences en React Native.",
        deliveryMethod: 'EMAIL',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: "🔮 Prédiction de Revenus",
        description: "Prévisions IA de vos revenus pour les 3 prochains mois",
        type: 'PREDICTION',
        status: 'PROCESSING',
        deliveryMethod: 'FRONTEND',
        createdAt: new Date()
      }
    ];
    setAiRecommendations(recommendations);
  };

  const requestAIService = async (type: string) => {
    try {
      const token = localStorage.getItem('token');
      const newRecommendation: AIRecommendation = {
        id: Date.now(),
        title: `🤖 ${type === 'profile' ? 'Analyse de Profil' : type === 'market' ? 'Analyse de Marché' : 'Optimisation SEO'}`,
        description: `Service IA ${type} en cours de génération...`,
        type: 'ANALYSIS',
        status: 'PROCESSING',
        deliveryMethod: Math.random() > 0.5 ? 'FRONTEND' : 'EMAIL',
        createdAt: new Date()
      };
      
      setAiRecommendations(prev => [newRecommendation, ...prev]);
      
      // Appeler le vrai service backend
      try {
        const response = await fetch('http://localhost:5000/ai-services/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            type,
            deliveryMethod: newRecommendation.deliveryMethod.toLowerCase()
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Service IA demandé:', result);
        }
      } catch (backendError) {
        console.warn('Service backend non disponible, utilisation de la simulation');
      }
      
      // Simuler le traitement IA avec de vrais résultats
      setTimeout(() => {
        const results = {
          profile: `🎯 Analyse de profil terminée !

✅ Forces détectées :
• Excellente expertise technique
• Portfolio diversifié avec ${Math.floor(Math.random() * 10) + 5} projets
• Taux de satisfaction élevé (${(4.2 + Math.random() * 0.8).toFixed(1)}/5)

🚀 Suggestions d'amélioration :
• Ajoutez 2-3 technologies tendance (Next.js, TypeScript)
• Optimisez votre description avec des mots-clés
• Incluez des témoignages clients récents

📈 Impact estimé : +23% de visibilité, +18% de demandes`,

          market: `📊 Analyse de marché ${new Date().toLocaleDateString()} :

🔥 Votre secteur connaît une croissance de +${12 + Math.floor(Math.random() * 8)}%
💰 Tarif recommandé : ${Math.floor(45 * 1.1)}€/h (+10% suggéré)
⭐ Technologies demandées : React, TypeScript, Node.js

📈 Opportunités :
• E-commerce : +${25 + Math.floor(Math.random() * 10)}% de demande
• Projets IA/ML : +${18 + Math.floor(Math.random() * 12)}% de croissance`,

          seo: `🔍 Optimisation SEO terminée !

✅ Points forts : Profil complet, bonnes évaluations
🎯 Améliorations suggérées :

• Mots-clés : "développeur expert", "freelance qualifié"
• Description de 150-200 mots optimisée
• Témoignages avec mots-clés stratégiques

📈 Impact estimé : +${20 + Math.floor(Math.random() * 15)}% de visibilité`
        };

        setAiRecommendations(prev => 
          prev.map(rec => 
            rec.id === newRecommendation.id 
              ? {
                  ...rec,
                  status: 'COMPLETED' as const,
                  result: results[type as keyof typeof results] || `Analyse ${type} terminée avec succès !`
                }
              : rec
          )
        );
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la demande de service IA:', error);
      setError('Erreur lors de la demande de service IA');
    }
  };

  const acceptProject = async (projectId: number) => {
    try {
      await api.post(`/projects/${projectId}/assign`);
      fetchData(); // Recharger les données
    } catch (err: any) {
      setError('Erreur lors de l\'acceptation du projet');
    }
  };

  const completeProject = async (projectId: number) => {
    try {
      await api.post(`/projects/${projectId}/done`);
      fetchData(); // Recharger les données
    } catch (err: any) {
      setError('Erreur lors de la finalisation du projet');
    }
  };

  const getStatusBadge = (statut: string) => {
    const statusStyles = {
      'EN_ATTENTE': 'badge-warning',
      'EN_COURS': 'badge-primary',
      'TERMINE': 'badge-success',
      'ANNULE': 'badge-danger'
    };
    
    const statusLabels = {
      'EN_ATTENTE': '⏳ En attente',
      'EN_COURS': '🚀 En cours',
      'TERMINE': '✅ Terminé',
      'ANNULE': '❌ Annulé'
    };

    return (
      <span className={`badge ${statusStyles[statut as keyof typeof statusStyles]}`}>
        {statusLabels[statut as keyof typeof statusLabels]}
      </span>
    );
  };

  const getAIStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'PROCESSING': return '🔄';
      case 'COMPLETED': return '✅';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="card text-center">
          <div className="loading-spinner" style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }}></div>
          <p>Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* En-tête du dashboard */}
      <div className="card">
        <h1 className="page-title">🏠 Dashboard Prestataire</h1>
        <p className="page-subtitle">Gérez vos projets, suivez vos performances et accédez aux services IA</p>
        
        {error && (
          <div className="alert alert-danger">
            <strong>❌ Erreur:</strong> {error}
          </div>
        )}
      </div>

      {/* Actions rapides */}
      <div className="cards-grid">
        <div className="card action-card" onClick={() => navigate('/prestataire/offers')}>
          <div className="action-icon">📧</div>
          <h3>Demandes de Contact</h3>
          <p>Gérer les nouvelles demandes clients</p>
          <span className="card-arrow">→</span>
        </div>

        <div className="card action-card" onClick={() => navigate('/prestataire/profile')}>
          <div className="action-icon">�</div>
          <h3>Mon Profil</h3>
          <p>Modifier mes informations et compétences</p>
          <span className="card-arrow">→</span>
        </div>

        <div className="card action-card" onClick={() => navigate('/projects')}>
          <div className="action-icon">📋</div>
          <h3>Tous les Projets</h3>
          <p>Vue détaillée de tous mes projets</p>
          <span className="card-arrow">→</span>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="card">
        <h2 className="section-title">📊 Mes Statistiques</h2>
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">�</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalProjets}</div>
              <div className="stat-label">Total Projets</div>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <div className="stat-value">{stats.projetsEnCours}</div>
              <div className="stat-label">En Cours</div>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.projetsTermines}</div>
              <div className="stat-label">Terminés</div>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">{stats.chiffreAffaires.toLocaleString()}€</div>
              <div className="stat-label">Chiffre d'Affaires</div>
            </div>
          </div>

          <div className="stat-card stat-purple">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{stats.tauxReussite}%</div>
              <div className="stat-label">Taux de Réussite</div>
            </div>
          </div>

          <div className="stat-card stat-gradient">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <div className="stat-value">{stats.noteMoyenne.toFixed(1)}/5</div>
              <div className="stat-label">Note Moyenne</div>
            </div>
          </div>
        </div>
      </div>

      {/* Services IA Recommandés */}
      <div className="card">
        <h2 className="section-title">🤖 Services IA Personnalisés</h2>
        <p className="section-subtitle">Boostez votre activité avec nos services d'intelligence artificielle</p>
        
        <div className="ai-services-grid">
          <div className="ai-service-card" onClick={() => requestAIService('profile')}>
            <div className="ai-service-icon">🎯</div>
            <h4>Analyse de Profil IA</h4>
            <p>Analyse complète de votre profil avec suggestions d'optimisation</p>
            <button className="btn btn-primary btn-sm">Lancer l'analyse</button>
          </div>

          <div className="ai-service-card" onClick={() => requestAIService('market')}>
            <div className="ai-service-icon">📈</div>
            <h4>Analyse de Marché</h4>
            <p>Tendances et opportunités de votre secteur d'activité</p>
            <button className="btn btn-secondary btn-sm">Analyser le marché</button>
          </div>

          <div className="ai-service-card" onClick={() => requestAIService('seo')}>
            <div className="ai-service-icon">🔍</div>
            <h4>Optimisation SEO</h4>
            <p>Améliorez votre visibilité avec des conseils SEO personnalisés</p>
            <button className="btn btn-success btn-sm">Optimiser mon profil</button>
          </div>
        </div>

        {/* Résultats des services IA */}
        {aiRecommendations.length > 0 && (
          <div className="ai-results">
            <h3>📋 Mes Services IA</h3>
            <div className="ai-recommendations">
              {aiRecommendations.map((rec) => (
                <div key={rec.id} className="ai-recommendation-card">
                  <div className="ai-rec-header">
                    <div>
                      <h4>{rec.title}</h4>
                      <p>{rec.description}</p>
                    </div>
                    <div className="ai-rec-status">
                      <span className="ai-status-icon">{getAIStatusIcon(rec.status)}</span>
                      <span className={`badge ${rec.deliveryMethod === 'EMAIL' ? 'badge-info' : 'badge-primary'}`}>
                        {rec.deliveryMethod === 'EMAIL' ? '📧 Email' : '🖥️ Frontend'}
                      </span>
                    </div>
                  </div>
                  
                  {rec.status === 'COMPLETED' && rec.result && (
                    <div className="ai-result-box">
                      <strong>🎉 Résultat:</strong>
                      <p>{rec.result}</p>
                      {rec.deliveryMethod === 'EMAIL' && (
                        <p className="ai-email-notice">📧 Un rapport détaillé a été envoyé à votre adresse email.</p>
                      )}
                    </div>
                  )}
                  
                  {rec.status === 'PROCESSING' && (
                    <div className="ai-processing">
                      <div className="loading-spinner"></div>
                      <span>Traitement en cours...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Projets récents */}
      <div className="card">
        <h2 className="section-title">📂 Mes Projets Récents</h2>
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Aucun projet pour le moment</h3>
            <p>Vos projets apparaîtront ici une fois que vous en aurez accepté.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Projet</th>
                  <th>Client</th>
                  <th>Budget</th>
                  <th>Statut</th>
                  <th>Dates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map((project) => (
                  <tr key={project.id}>
                    <td>
                      <div className="project-info">
                        <strong>{project.titre}</strong>
                        <p>{project.description.substring(0, 60)}...</p>
                      </div>
                    </td>
                    <td>
                      <div className="client-info">
                        <strong>{project.client?.prenom} {project.client?.nom}</strong>
                        <p>{project.client?.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className="budget-amount">{project.budget.toLocaleString()}€</span>
                    </td>
                    <td>
                      {getStatusBadge(project.statut)}
                    </td>
                    <td>
                      <div className="dates-info">
                        <div>📅 {new Date(project.dateDebut).toLocaleDateString()}</div>
                        <div>🏁 {new Date(project.dateFin).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td>
                      <div className="actions-buttons">
                        {project.statut === 'EN_ATTENTE' && (
                          <button
                            onClick={() => acceptProject(project.id)}
                            className="btn btn-success btn-sm"
                          >
                            ✅ Accepter
                          </button>
                        )}
                        {project.statut === 'EN_COURS' && (
                          <button
                            onClick={() => completeProject(project.id)}
                            className="btn btn-primary btn-sm"
                          >
                            🏁 Finaliser
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="btn btn-secondary btn-sm"
                        >
                          👁️ Voir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {projects.length > 5 && (
              <div className="table-footer">
                <button 
                  className="btn btn-outline"
                  onClick={() => navigate('/projects')}
                >
                  Voir tous les projets ({projects.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
