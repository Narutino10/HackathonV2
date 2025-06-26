import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../../components/Navbar";
import api from '../../services/api';

interface ContactRequest {
  id: number;
  message: string;
  budget: number;
  dateDebut: string;
  dateFin: string;
  statut: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';
  client: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
  };
  createdAt: string;
}

export default function PrestataireOffers() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchContactRequests();
  }, []);

  const fetchContactRequests = async () => {
    try {
      setLoading(true);
      // Simuler des demandes de contact pour le prestataire
      const mockRequests: ContactRequest[] = [
        {
          id: 1,
          message: "Bonjour, j'ai besoin d'aide pour créer une boutique Shopify pour mon entreprise de mode. Pouvez-vous m'aider ?",
          budget: 2500,
          dateDebut: "2025-01-15",
          dateFin: "2025-02-15",
          statut: "EN_ATTENTE",
          client: {
            id: 1,
            prenom: "Sophie",
            nom: "Durand",
            email: "sophie.durand@email.com"
          },
          createdAt: "2025-01-10T10:30:00Z"
        },
        {
          id: 2,
          message: "Je voudrais migrer ma boutique existante vers Shopify et optimiser les performances. Budget flexible.",
          budget: 3500,
          dateDebut: "2025-01-20",
          dateFin: "2025-03-01",
          statut: "EN_ATTENTE",
          client: {
            id: 2,
            prenom: "Marc",
            nom: "Leblanc",
            email: "marc.leblanc@email.com"
          },
          createdAt: "2025-01-08T14:15:00Z"
        },
        {
          id: 3,
          message: "Création d'une marketplace avec plusieurs vendeurs sur Shopify Plus. Projet ambitieux !",
          budget: 8000,
          dateDebut: "2025-02-01",
          dateFin: "2025-04-30",
          statut: "ACCEPTE",
          client: {
            id: 3,
            prenom: "Julia",
            nom: "Martinez",
            email: "julia.martinez@email.com"
          },
          createdAt: "2025-01-05T09:20:00Z"
        }
      ];
      
      setRequests(mockRequests);
    } catch (err: any) {
      setError('Erreur lors du chargement des demandes');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: number, action: 'ACCEPTE' | 'REFUSE') => {
    try {
      // Simuler l'API call
      setRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, statut: action }
            : req
        )
      );
      
      if (action === 'ACCEPTE') {
        // Créer un projet automatiquement
        const request = requests.find(r => r.id === requestId);
        if (request) {
          await api.post('/projects', {
            titre: `Projet Shopify - ${request.client.prenom} ${request.client.nom}`,
            description: request.message,
            budget: request.budget,
            dateDebut: request.dateDebut,
            dateFin: request.dateFin,
            clientId: request.client.id
          });
        }
      }
    } catch (err: any) {
      setError(`Erreur lors de ${action === 'ACCEPTE' ? 'l\'acceptation' : 'le refus'} de la demande`);
    }
  };

  const getStatusBadge = (statut: string) => {
    const statusStyles = {
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-800',
      'ACCEPTE': 'bg-green-100 text-green-800',
      'REFUSE': 'bg-red-100 text-red-800'
    };
    
    const statusLabels = {
      'EN_ATTENTE': 'En attente',
      'ACCEPTE': 'Acceptée',
      'REFUSE': 'Refusée'
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Demandes de Contact</h1>
                <p className="mt-2 text-gray-600">Gérez les demandes de projets de vos clients</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retour au Dashboard
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">En Attente</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {requests.filter(r => r.statut === 'EN_ATTENTE').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Acceptées</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {requests.filter(r => r.statut === 'ACCEPTE').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Budget Total Potentiel</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {requests.filter(r => r.statut === 'EN_ATTENTE').reduce((sum, r) => sum + r.budget, 0)}€
              </p>
            </div>
          </div>

          {/* Liste des demandes */}
          <div className="space-y-6">
            {requests.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">Aucune demande pour le moment</p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Demande de {request.client.prenom} {request.client.nom}
                          </h3>
                          {getStatusBadge(request.statut)}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{request.client.email}</p>
                        <p className="text-sm text-gray-500">
                          Reçue le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{request.budget}€</div>
                        <div className="text-sm text-gray-500">Budget</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Message du client :</h4>
                      <p className="text-gray-700">{request.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Date de début</label>
                        <p className="text-gray-900">{new Date(request.dateDebut).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Date de fin</label>
                        <p className="text-gray-900">{new Date(request.dateFin).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>

                    {request.statut === 'EN_ATTENTE' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRequest(request.id, 'ACCEPTE')}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex-1"
                        >
                          ✓ Accepter la demande
                        </button>
                        <button
                          onClick={() => handleRequest(request.id, 'REFUSE')}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex-1"
                        >
                          ✗ Refuser la demande
                        </button>
                      </div>
                    )}

                    {request.statut === 'ACCEPTE' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-800 font-medium">✓ Demande acceptée - Un projet a été créé automatiquement</p>
                      </div>
                    )}

                    {request.statut === 'REFUSE' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-800 font-medium">✗ Demande refusée</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
