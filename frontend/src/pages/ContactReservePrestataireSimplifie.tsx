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
  nom: string;
  email: string;
  telephone: string;
  entreprise: string;
}

const ContactReservePrestataire: React.FC = () => {
  const { prestataireId } = useParams();
  const navigate = useNavigate();
  const [prestataire, setPrestataire] = useState<Prestataire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  const [reservation, setReservation] = useState<ReservationData>({
    dateDebut: '',
    dateFin: '',
    heures: 1,
    description: '',
    budget: 0,
    nom: '',
    email: '',
    telephone: '',
    entreprise: ''
  });

  useEffect(() => {
    const fetchPrestataire = async () => {
      try {
        const response = await api.get(`/users/${prestataireId}`);
        setPrestataire(response.data);
        setReservation(prev => ({
          ...prev,
          budget: response.data.tarifHoraire
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
    
    if (!reservation.nom || !reservation.email || !reservation.description) {
      setSubmitMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer le projet/réservation
      await api.post('/projects', {
        title: `Mission avec ${prestataire?.prenom} ${prestataire?.nom}`,
        description: reservation.description,
        budget: reservation.budget,
        prestataireId: prestataire?.id,
        dateDebut: reservation.dateDebut,
        dateFin: reservation.dateFin,
        heures: reservation.heures,
        status: 'EN_ATTENTE'
      });

      setSubmitMessage('✅ Votre demande a été envoyée avec succès ! Le prestataire vous contactera sous 24h.');
      
      // Rediriger vers les projets après 3 secondes
      setTimeout(() => {
        navigate('/projects');
      }, 3000);
      
    } catch (error: any) {
      setSubmitMessage(`❌ Erreur: ${error.response?.data?.message || error.message}`);
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid #f3f3f3', 
            borderTop: '3px solid #007bff', 
            borderRadius: '50%', 
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !prestataire) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>❌ Erreur</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* En-tête */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#333', marginBottom: '10px' }}>
            🤝 Réserver {prestataire.prenom} {prestataire.nom}
          </h1>
          <p style={{ color: '#666' }}>Remplissez le formulaire pour envoyer votre demande de collaboration</p>
        </div>
        
        {/* Informations du prestataire */}
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>
            👤 {prestataire.prenom} {prestataire.nom}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <p style={{ margin: 0 }}><strong>📧 Email:</strong> {prestataire.email}</p>
            <p style={{ margin: 0 }}><strong>💰 Tarif:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>{prestataire.tarifHoraire}€/h</span></p>
          </div>
          <p style={{ margin: '10px 0' }}><strong>🛠️ Compétences:</strong> {prestataire.competences}</p>
          <p style={{ margin: '10px 0 0 0' }}><strong>📝 Description:</strong> {prestataire.description}</p>
        </div>

        {/* Formulaire de réservation */}
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '30px', color: '#333' }}>📋 Décrivez votre projet</h2>
          
          {submitMessage && (
            <div style={{
              padding: '15px',
              marginBottom: '30px',
              borderRadius: '8px',
              backgroundColor: submitMessage.includes('✅') ? '#d4edda' : '#f8d7da',
              color: submitMessage.includes('✅') ? '#155724' : '#721c24',
              border: `1px solid ${submitMessage.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
              fontSize: '16px'
            }}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Informations personnelles */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: '#555' }}>👤 Vos informations</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={reservation.nom}
                    onChange={(e) => handleReservationChange('nom', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={reservation.email}
                    onChange={(e) => handleReservationChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={reservation.telephone}
                    onChange={(e) => handleReservationChange('telephone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={reservation.entreprise}
                    onChange={(e) => handleReservationChange('entreprise', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Détails du projet */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px', color: '#555' }}>🚀 Détails du projet</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={reservation.dateDebut}
                    onChange={(e) => handleReservationChange('dateDebut', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={reservation.dateFin}
                    onChange={(e) => handleReservationChange('dateFin', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                    Heures estimées
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={reservation.heures}
                    onChange={(e) => handleReservationChange('heures', parseInt(e.target.value) || 1)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
                  Description de votre projet *
                </label>
                <textarea
                  required
                  rows={4}
                  value={reservation.description}
                  onChange={(e) => handleReservationChange('description', e.target.value)}
                  placeholder="Décrivez votre projet en détail : objectifs, fonctionnalités souhaitées, contraintes..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Budget estimé */}
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '30px'
              }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>💰 Budget estimé</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>{reservation.heures}h × {prestataire.tarifHoraire}€/h</span>
                  <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '18px' }}>
                    {reservation.budget}€
                  </span>
                </div>
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  💡 Le budget final sera convenu avec le prestataire selon la complexité exacte du projet
                </p>
              </div>
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  padding: '15px 30px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ← Retour
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '15px 30px',
                  backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                {isSubmitting ? '📤 Envoi en cours...' : '📨 Envoyer la demande'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactReservePrestataire;
