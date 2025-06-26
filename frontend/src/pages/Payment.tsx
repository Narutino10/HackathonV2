import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';

// Clé publique Stripe (remplacez par votre vraie clé)
const stripePromise = loadStripe('pk_test_51234567890abcdef...');

interface PaymentFormProps {
  prestataire: any;
  projectDetails: any;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ prestataire, projectDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [paymentData, setPaymentData] = useState({
    heuresEstimees: 10,
    fraisService: 29,
    typeContrat: 'mission',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  const montantTotal = paymentData.heuresEstimees * prestataire.tarifHoraire;
  const montantTTC = montantTotal + paymentData.fraisService;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    try {
      // Simulation du paiement (en production, vous appelleriez votre API backend)
      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: projectDetails.nom,
          email: projectDetails.email,
        },
      });

      if (error) {
        setPaymentMessage(`Erreur de paiement: ${error.message}`);
      } else {
        // Simulation réussie
        setPaymentMessage('Paiement réussi ! Votre projet a été envoyé au prestataire.');
        
        // Redirection après succès
        setTimeout(() => {
          navigate('/dashboard', { 
            state: { 
              message: 'Votre paiement a été traité et le prestataire a été notifié.'
            }
          });
        }, 3000);
      }
    } catch (error) {
      setPaymentMessage('Une erreur est survenue lors du paiement.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '30px',
        backgroundColor: 'white',
        marginBottom: '20px'
      }}>
        <h3>Détails du paiement</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Type de contrat
          </label>
          <select
            value={paymentData.typeContrat}
            onChange={(e) => setPaymentData(prev => ({ ...prev, typeContrat: e.target.value }))}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            <option value="mission">Mission ponctuelle</option>
            <option value="retainer">Collaboration mensuelle</option>
            <option value="hourly">Facturation à l'heure</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Nombre d'heures estimées
          </label>
          <input
            type="number"
            min="1"
            max="200"
            value={paymentData.heuresEstimees}
            onChange={(e) => setPaymentData(prev => ({ 
              ...prev, 
              heuresEstimees: parseInt(e.target.value) || 1 
            }))}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          />
        </div>

        {/* Récapitulatif des coûts */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h4>Récapitulatif</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>{paymentData.heuresEstimees}h × {prestataire.tarifHoraire}€/h</span>
            <span>{montantTotal}€</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Frais de service</span>
            <span>{paymentData.fraisService}€</span>
          </div>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
            <span>Total</span>
            <span>{montantTTC}€</span>
          </div>
        </div>

        {/* Élément de carte Stripe */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Informations de carte bancaire
          </label>
          <div style={{
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: 'white'
          }}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {paymentMessage && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '5px',
            backgroundColor: paymentMessage.includes('réussi') ? '#d4edda' : '#f8d7da',
            color: paymentMessage.includes('réussi') ? '#155724' : '#721c24',
            border: `1px solid ${paymentMessage.includes('réussi') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {paymentMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: isProcessing ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: isProcessing ? 'not-allowed' : 'pointer'
          }}
        >
          {isProcessing ? 'Traitement...' : `Payer ${montantTTC}€`}
        </button>
      </div>

      <div style={{
        fontSize: '12px',
        color: '#666',
        textAlign: 'center',
        marginTop: '10px'
      }}>
        🔒 Paiement sécurisé par Stripe. Vos informations sont protégées.
      </div>
    </form>
  );
};

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prestataire, projectDetails } = location.state || {};

  if (!prestataire || !projectDetails) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Erreur</h2>
        <p>Informations manquantes pour le paiement.</p>
        <button onClick={() => navigate('/search-prestataire')}>
          Retourner à la recherche
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Finaliser votre commande</h1>
      
      {/* Récapitulatif du prestataire et projet */}
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        marginBottom: '30px'
      }}>
        <h3>Récapitulatif</h3>
        <p><strong>Prestataire:</strong> {prestataire.prenom} {prestataire.nom}</p>
        <p><strong>Email:</strong> {prestataire.email}</p>
        <p><strong>Tarif:</strong> {prestataire.tarifHoraire}€/h</p>
        <p><strong>Votre projet:</strong> {projectDetails.projet}</p>
        {projectDetails.budget && (
          <p><strong>Budget indicatif:</strong> {projectDetails.budget}</p>
        )}
      </div>

      <Elements stripe={stripePromise}>
        <PaymentForm prestataire={prestataire} projectDetails={projectDetails} />
      </Elements>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => navigate('/contact-prestataire', { state: { prestataire } })}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ← Retour au formulaire
        </button>
      </div>
    </div>
  );
};

export default Payment;
