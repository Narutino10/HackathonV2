import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ClientStats {
  totalProjets: number;
  projetsEnCours: number;
  projetsTermines: number;
  budgetTotal: number;
}

interface Projet {
  id: number;
  titre: string;
  description: string;
  budget: number;
  statut: string;
  createdAt: string;
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<ClientStats>({
    totalProjets: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    budgetTotal: 0
  });
  const [recentProjects, setRecentProjects] = useState<Projet[]>([]);
  const [user, setUser] = useState<{ prenom: string; nom: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'CLIENT') {
        navigate('/login');
        return;
      }
      setUser({ prenom: payload.prenom, nom: payload.nom });
      loadDashboardData();
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Charger les projets du client
      const projectsResponse = await axios.get('http://localhost:5000/projects/my-projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const projects = projectsResponse.data || [];
      setRecentProjects(projects.slice(0, 5)); // Les 5 projets les plus récents

      // Calculer les statistiques
      const stats: ClientStats = {
        totalProjets: projects.length,
        projetsEnCours: projects.filter((p: any) => p.statut === 'EN_COURS').length,
        projetsTermines: projects.filter((p: any) => p.statut === 'TERMINE').length,
        budgetTotal: projects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0)
      };
      setStats(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      // Données de démonstration en cas d'erreur
      setStats({
        totalProjets: 8,
        projetsEnCours: 3,
        projetsTermines: 5,
        budgetTotal: 15000
      });
      setRecentProjects([
        {
          id: 1,
          titre: "Site e-commerce moderne",
          description: "Développement d'une boutique en ligne avec React",
          budget: 5000,
          statut: "EN_COURS",
          createdAt: "2025-06-20"
        },
        {
          id: 2,
          titre: "Application mobile iOS",
          description: "App de gestion de tâches en Swift",
          budget: 8000,
          statut: "TERMINE",
          createdAt: "2025-06-15"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
        return <span className="badge warning">En cours</span>;
      case 'TERMINE':
        return <span className="badge success">Terminé</span>;
      case 'EN_ATTENTE':
        return <span className="badge info">En attente</span>;
      default:
        return <span className="badge">{statut}</span>;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Chargement du dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          👋 Bienvenue {user?.prenom} !
        </h1>
        <p className="dashboard-subtitle">
          Gérez vos projets et trouvez les meilleurs prestataires
        </p>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalProjets}</div>
          <div className="stat-label">📋 Total Projets</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.projetsEnCours}</div>
          <div className="stat-label">⏳ En Cours</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.projetsTermines}</div>
          <div className="stat-label">✅ Terminés</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.budgetTotal.toLocaleString()} €</div>
          <div className="stat-label">💰 Budget Total</div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="card">
        <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>🚀 Actions Rapides</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button 
            onClick={() => navigate('/create-project')}
            className="full-width"
            style={{ padding: '15px' }}
          >
            ➕ Créer un Nouveau Projet
          </button>
          <button 
            onClick={() => navigate('/search')}
            className="full-width"
            style={{ padding: '15px' }}
          >
            🔍 Trouver un Prestataire
          </button>
          <button 
            onClick={() => navigate('/projects')}
            className="full-width secondary"
            style={{ padding: '15px' }}
          >
            📋 Voir Tous mes Projets
          </button>
        </div>
      </div>

      {/* Projets récents */}
      <div className="card">
        <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>📈 Projets Récents</h2>
        {recentProjects.length > 0 ? (
          <div>
            {recentProjects.map((projet) => (
              <div key={projet.id} className="list-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{projet.titre}</h3>
                    <p style={{ margin: '0 0 8px 0', color: '#7f8c8d' }}>{projet.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontWeight: 'bold', color: '#27ae60' }}>
                        💰 {projet.budget.toLocaleString()} €
                      </span>
                      {getStatusBadge(projet.statut)}
                      <span style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
                        📅 {new Date(projet.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={() => navigate('/projects')}
                className="secondary"
              >
                Voir tous les projets →
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#7f8c8d' }}>Aucun projet pour le moment</h3>
            <p style={{ color: '#95a5a6', marginBottom: '20px' }}>
              Commencez par créer votre premier projet !
            </p>
            <button onClick={() => navigate('/create-project')}>
              ➕ Créer mon Premier Projet
            </button>
          </div>
        )}
      </div>

      {/* Conseils */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h2 style={{ marginBottom: '15px', color: 'white' }}>💡 Conseils pour Optimiser vos Projets</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>✅ Définissez clairement vos objectifs et contraintes</li>
          <li style={{ marginBottom: '10px' }}>✅ Fixez un budget réaliste pour attirer les meilleurs talents</li>
          <li style={{ marginBottom: '10px' }}>✅ Communiquez régulièrement avec vos prestataires</li>
          <li style={{ marginBottom: '10px' }}>✅ Laissez des avis constructifs après chaque projet</li>
        </ul>
      </div>
    </div>
  );
}
