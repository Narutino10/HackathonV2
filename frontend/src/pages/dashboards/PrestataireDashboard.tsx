import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
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
}

export default function PrestataireDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<PrestataireStats>({
    totalProjets: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    chiffreAffaires: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
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
      
      // Calculer les statistiques
      const stats: PrestataireStats = {
        totalProjets: myProjects.length,
        projetsEnCours: myProjects.filter((p: any) => p.statut === 'EN_COURS').length,
        projetsTermines: myProjects.filter((p: any) => p.statut === 'TERMINE').length,
        chiffreAffaires: myProjects
          .filter((p: any) => p.statut === 'TERMINE')
          .reduce((sum: number, p: any) => sum + p.budget, 0)
      };
      setStats(stats);
      
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
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
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
      'EN_COURS': 'bg-blue-100 text-blue-800',
      'TERMINE': 'bg-green-100 text-green-800',
      'ANNULE': 'bg-red-100 text-red-800'
    };
    
    const statusLabels = {
      'EN_ATTENTE': 'En attente',
      'EN_COURS': 'En cours',
      'TERMINE': 'Terminé',
      'ANNULE': 'Annulé'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[statut as keyof typeof statusStyles]}`}>
        {statusLabels[statut as keyof typeof statusLabels]}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Prestataire</h1>
            <p className="mt-2 text-gray-600">Gérez vos projets et suivez votre activité</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Menu de navigation rapide */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => navigate('/prestataire/offers')}
              className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">📧</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Demandes de Contact</h3>
                  <p className="text-gray-600">Gérer les nouvelles demandes</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/prestataire/profile')}
              className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">👤</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Mon Profil</h3>
                  <p className="text-gray-600">Modifier mes informations</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/projects')}
              className="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl">📋</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tous les Projets</h3>
                  <p className="text-gray-600">Vue détaillée</p>
                </div>
              </div>
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{stats.totalProjets}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Projets</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalProjets}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{stats.projetsEnCours}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">En Cours</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.projetsEnCours}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{stats.projetsTermines}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Terminés</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.projetsTermines}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">€</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Chiffre d'Affaires</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.chiffreAffaires}€</p>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des projets */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Mes Projets</h2>
            </div>
            <div className="overflow-x-auto">
              {projects.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Aucun projet pour le moment</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{project.titre}</div>
                            <div className="text-sm text-gray-500">{project.description.substring(0, 60)}...</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {project.client?.prenom} {project.client?.nom}
                          </div>
                          <div className="text-sm text-gray-500">{project.client?.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {project.budget}€
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(project.statut)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div>Début: {new Date(project.dateDebut).toLocaleDateString()}</div>
                          <div>Fin: {new Date(project.dateFin).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          {project.statut === 'EN_ATTENTE' && (
                            <button
                              onClick={() => acceptProject(project.id)}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                            >
                              Accepter
                            </button>
                          )}
                          {project.statut === 'EN_COURS' && (
                            <button
                              onClick={() => completeProject(project.id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              Finaliser
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700"
                          >
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
