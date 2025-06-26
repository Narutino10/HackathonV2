import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ContactPrestataireProps {
  prestataire: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    competences: string;
    description: string;
    tarifHoraire: number;
    score: number;
  };
}

const ContactPrestataire: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prestataire } = location.state as ContactPrestataireProps;

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    entreprise: '',
    projet: '',
    budget: '',
    delai: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ici on pourrait envoyer les données vers le backend
      // Pour l'instant, on simule l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitMessage('Votre demande a été envoyée avec succès ! Le prestataire vous contactera sous 24h.');
      
      // Rediriger vers la page de paiement après quelques secondes
      setTimeout(() => {
        navigate('/payment', { 
          state: { 
            prestataire, 
            projectDetails: formData 
          } 
        });
      }, 2000);
      
    } catch (error) {
      setSubmitMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!prestataire) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Erreur</h2>
        <p>Aucun prestataire sélectionné.</p>
        <button onClick={() => navigate('/search-prestataire')}>
          Retourner à la recherche
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Contacter {prestataire.prenom} {prestataire.nom}</h1>
      
      {/* Carte du prestataire */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{prestataire.prenom} {prestataire.nom}</h3>
          <div>
            <span style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              marginRight: '10px'
            }}>
              Score: {prestataire.score}/10
            </span>
            <span style={{ fontWeight: 'bold', color: '#28a745' }}>
              {prestataire.tarifHoraire}€/h
            </span>
          </div>
        </div>
        
        <p><strong>Email:</strong> {prestataire.email}</p>
        <p><strong>Compétences:</strong> {prestataire.competences}</p>
        <p><strong>Description:</strong> {prestataire.description}</p>
      </div>

      {/* Formulaire de contact */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '30px',
        backgroundColor: 'white'
      }}>
        <h2>Décrivez votre projet</h2>
        
        {submitMessage && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '5px',
            backgroundColor: submitMessage.includes('succès') ? '#d4edda' : '#f8d7da',
            color: submitMessage.includes('succès') ? '#155724' : '#721c24',
            border: `1px solid ${submitMessage.includes('succès') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {submitMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Nom complet *
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Entreprise
              </label>
              <input
                type="text"
                name="entreprise"
                value={formData.entreprise}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Description du projet *
            </label>
            <textarea
              name="projet"
              value={formData.projet}
              onChange={handleInputChange}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                resize: 'vertical'
              }}
              placeholder="Décrivez votre projet en détail..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Budget approximatif
              </label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              >
                <option value="">Sélectionnez un budget</option>
                <option value="500-1000">500€ - 1 000€</option>
                <option value="1000-2500">1 000€ - 2 500€</option>
                <option value="2500-5000">2 500€ - 5 000€</option>
                <option value="5000-10000">5 000€ - 10 000€</option>
                <option value="10000+">Plus de 10 000€</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Délai souhaité
              </label>
              <select
                name="delai"
                value={formData.delai}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              >
                <option value="">Sélectionnez un délai</option>
                <option value="urgent">Urgent (moins d'1 semaine)</option>
                <option value="1-2semaines">1-2 semaines</option>
                <option value="1mois">1 mois</option>
                <option value="2-3mois">2-3 mois</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Message complémentaire
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={3}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                resize: 'vertical'
              }}
              placeholder="Informations complémentaires..."
            />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              type="button"
              onClick={() => navigate('/search-prestataire')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Retour
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '12px 24px',
                backgroundColor: isSubmitting ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                flex: 1
              }}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPrestataire;
