import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Prestataire {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  competences: string;
  description: string;
  tarifHoraire: number;
}

interface ReservationData {
  dateDebut: string;
  dateFin: string;
  heures: number;
  description: string;
  budget: number;
}

const ContactReservePrestataire: React.FC = () => {
  const { prestataireId } = useParams();
  const navigate = useNavigate();
  const [prestataire, setPrestataire] = useState<Prestataire | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [reservation, setReservation] = useState<ReservationData>({
    dateDebut: '',
    dateFin: '',
    heures: 1,
    description: '',
    budget: 0
  });

  useEffect(() => {
    const fetchPrestataire = async () => {
      try {
        const response = await api.get(`/users/${prestataireId}`);
        setPrestataire(response.data);
        setReservation(prev => ({
          ...prev,
          budget: response.data.tarifHoraire || 0
        }));
      } catch (err: any) {
        setError('Prestataire non trouvé');
        console.error('Erreur:', err);
      }
      setLoading(false);
    };

    if (prestataireId) {
      fetchPrestataire();
    }
  }, [prestataireId]);

  const handleReservationChange = (field: keyof ReservationData, value: string | number) => {
    const newReservation = { ...reservation, [field]: value };
    
    // Calculer automatiquement le budget selon les heures
    if (field === 'heures' && prestataire) {
      newReservation.budget = Number(value) * prestataire.tarifHoraire;
    }
    
    setReservation(newReservation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservation.dateDebut || !reservation.dateFin || !reservation.description) {
      setMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSubmitting(true);
    setMessage('');
    
    try {
      // Créer le projet/réservation directement (sans paiement pour l'instant)
      await api.post('/projects', {
        title: `Mission avec ${prestataire?.prenom} ${prestataire?.nom}`,
        description: reservation.description,
        budget: reservation.budget,
        prestataireId: prestataire?.id,
        dateDebut: reservation.dateDebut,
        dateFin: reservation.dateFin,
        heures: reservation.heures,
        status: 'EN_ATTENTE' // Status en attente au lieu de confirmed
      });

      setMessage('Votre demande de réservation a été envoyée ! Le prestataire sera notifié.');
      
      // Rediriger vers les projets après 2 secondes
      setTimeout(() => {
        navigate('/projects');
      }, 2000);
      
    } catch (error: any) {
      setMessage(`Erreur: ${error.response?.data?.message || error.message}`);
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !prestataire) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Réserver {prestataire.prenom} {prestataire.nom}
        </h2>
        
        {/* Informations du prestataire */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-lg">{prestataire.prenom} {prestataire.nom}</h3>
          <p className="text-gray-600">{prestataire.email}</p>
          <p className="text-sm text-gray-700 mt-2">{prestataire.competences}</p>
          <p className="text-sm text-gray-600 mt-2">{prestataire.description}</p>
          <p className="text-lg font-semibold text-blue-600 mt-2">{prestataire.tarifHoraire}€/heure</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début *
              </label>
              <input
                type="date"
                required
                value={reservation.dateDebut}
                onChange={(e) => handleReservationChange('dateDebut', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin *
              </label>
              <input
                type="date"
                required
                value={reservation.dateFin}
                onChange={(e) => handleReservationChange('dateFin', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre d'heures estimées
            </label>
            <input
              type="number"
              min="1"
              value={reservation.heures}
              onChange={(e) => handleReservationChange('heures', parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Budget estimé: {reservation.budget}€
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description de votre projet *
            </label>
            <textarea
              required
              rows={4}
              value={reservation.description}
              onChange={(e) => handleReservationChange('description', e.target.value)}
              placeholder="Décrivez votre projet, vos besoins, vos attentes..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.includes('envoyée') 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : 'bg-red-100 border border-red-400 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Prochaines étapes :</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Votre demande sera envoyée au prestataire</li>
            <li>• Le prestataire examinera votre projet</li>
            <li>• Vous recevrez une confirmation ou des questions supplémentaires</li>
            <li>• Le paiement sera effectué une fois le projet accepté</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactReservePrestataire;
