import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PrestataireSuggestion {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  competences: string;
  description: string;
  tarifHoraire: number;
  score: number;
  raison: string;
}

interface SearchResponse {
  success: boolean;
  prestataires: PrestataireSuggestion[];
  message: string;
  error?: string;
}

const SearchPrestataire: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/ai/suggest-prestataire',
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setResult(res.data);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setResult({
        success: false,
        prestataires: [],
        message: 'Une erreur est survenue lors de la recherche.',
        error: 'Erreur de connexion',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Recherche de prestataire par IA</h1>

      <div style={{ marginBottom: '20px' }}>
        <textarea
          placeholder="Décrivez votre besoin ici... (ex: 'Je cherche un développeur web pour créer un site e-commerce')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px',
          }}
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading || !prompt.trim()}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px',
        }}
      >
        {loading ? 'Recherche en cours...' : 'Rechercher'}
      </button>

      {result && (
        <div style={{ marginTop: '30px' }}>
          {result.success ? (
            <>
              <h3 style={{ color: '#28a745' }}>{result.message}</h3>
              {result.prestataires.length > 0 ? (
                <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
                  {result.prestataires.map((prestataire) => (
                    <div
                      key={prestataire.id}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '20px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, color: '#333' }}>
                          {prestataire.prenom} {prestataire.nom}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              backgroundColor: '#007bff',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }}
                          >
                            Score: {prestataire.score}/10
                          </span>
                          <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                            {prestataire.tarifHoraire}€/h
                          </span>
                        </div>
                      </div>

                      <p style={{ margin: '5px 0', color: '#666' }}>
                        <strong>Email:</strong> {prestataire.email}
                      </p>

                      <p style={{ margin: '10px 0' }}>
                        <strong>Compétences:</strong> {prestataire.competences}
                      </p>

                      <p style={{ margin: '10px 0' }}>
                        <strong>Description:</strong> {prestataire.description}
                      </p>

                      <div
                        style={{
                          marginTop: '15px',
                          padding: '10px',
                          backgroundColor: '#e7f3ff',
                          borderRadius: '5px',
                          borderLeft: '4px solid #007bff',
                        }}
                      >
                        <strong>Pourquoi ce prestataire?</strong> {prestataire.raison}
                      </div>

                      <button
                        style={{
                          marginTop: '15px',
                          padding: '8px 16px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          navigate(`/contact-reserve/${prestataire.id}`);
                        }}
                      >
                        Réserver et Payer
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  Aucun prestataire ne correspond exactement à votre demande.
                </p>
              )}
            </>
          ) : (
            <div style={{ color: '#dc3545' }}>
              <h3>Erreur</h3>
              <p>{result.message}</p>
              {result.error && <p style={{ fontSize: '14px' }}>Détails: {result.error}</p>}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>💡 Exemples de recherches que vous pouvez essayer :</h4>
        <ul style={{ paddingLeft: '20px' }}>
          <li>"Je cherche un développeur web React pour créer un site e-commerce"</li>
          <li>"J'ai besoin d'un designer pour refaire l'identité visuelle de mon entreprise"</li>
          <li>"Je veux améliorer le SEO de mon site web"</li>
          <li>"Développement d'une application mobile iOS et Android"</li>
          <li>"Rédaction de contenu pour mon blog et stratégie marketing"</li>
          <li>"Analyse de données et création de tableaux de bord"</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchPrestataire;
