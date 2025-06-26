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
  finalScore: number;
  explanation: string;
  matchedKeywords?: string[];
}

interface SearchResponse {
  success: boolean;
  prestataires: PrestataireSuggestion[];
  message: string;
  searchAnalysis?: {
    category: string;
    complexity: string;
  };
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
    <div className="page-container">
      <div className="card">
        <h1 className="page-title">🔍 Recherche Intelligente de Prestataires</h1>
        <p className="page-subtitle">Décrivez votre projet et notre IA trouvera les meilleurs prestataires pour vous</p>

        <div className="form-group">
          <textarea
            placeholder="Décrivez votre besoin ici... 
Exemples :
• 'Je cherche un développeur web pour créer un site e-commerce avec React'
• 'J'ai besoin d'un designer pour refaire l'identité visuelle de mon entreprise'
• 'Développement d'une application mobile iOS et Android'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="textarea-field"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || !prompt.trim()}
          className={`btn ${loading || !prompt.trim() ? 'btn-disabled' : 'btn-primary'}`}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Recherche en cours...
            </>
          ) : (
            <>
              🚀 Rechercher des prestataires
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="results-section">
          {result.success ? (
            <>
              <div className="card">
                <div className="success-header">
                  <h3>✅ {result.message}</h3>
                  {result.searchAnalysis && (
                    <div className="search-analysis">
                      <span className="badge">Catégorie: {result.searchAnalysis.category}</span>
                      <span className="badge">Complexité: {result.searchAnalysis.complexity}</span>
                    </div>
                  )}
                </div>
              </div>

              {result.prestataires.length > 0 ? (
                <div className="prestataires-grid">
                  {result.prestataires.map((prestataire) => (
                    <div key={prestataire.id} className="prestataire-card">
                      <div className="prestataire-header">
                        <div className="prestataire-info">
                          <h4 className="prestataire-name">
                            👨‍💻 {prestataire.prenom} {prestataire.nom}
                          </h4>
                          <p className="prestataire-email">📧 {prestataire.email}</p>
                        </div>
                        <div className="prestataire-metrics">
                          <span className="score-badge">
                            ⭐ {Math.round(prestataire.finalScore / 10)}/10
                          </span>
                          <span className="price-badge">
                            💰 {prestataire.tarifHoraire}€/h
                          </span>
                        </div>
                      </div>

                      <div className="prestataire-competences">
                        <strong>🛠️ Compétences:</strong>
                        <div className="competences-tags">
                          {prestataire.competences.split(',').map((comp, index) => (
                            <span key={index} className="competence-tag">
                              {comp.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="prestataire-description">
                        <strong>📝 Description:</strong>
                        <p>{prestataire.description}</p>
                      </div>

                      {prestataire.matchedKeywords && prestataire.matchedKeywords.length > 0 && (
                        <div className="matched-keywords">
                          <strong>🎯 Mots-clés correspondants:</strong>
                          <div className="keywords-tags">
                            {prestataire.matchedKeywords.map((keyword, index) => (
                              <span key={index} className="keyword-tag">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="explanation-box">
                        <strong>🤖 Analyse du matching:</strong>
                        <p>{prestataire.explanation}</p>
                      </div>

                      <button
                        className="btn btn-success contact-btn"
                        onClick={() => {
                          navigate(`/contact-reserve/${prestataire.id}`);
                        }}
                      >
                        💼 Réserver et Contacter
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card">
                  <div className="no-results">
                    <h3>😔 Aucun prestataire trouvé</h3>
                    <p>Essayez de reformuler votre demande ou d'être plus spécifique sur vos besoins.</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card error-card">
              <h3>❌ Erreur</h3>
              <p>{result.message}</p>
              {result.error && <p className="error-details">Détails: {result.error}</p>}
            </div>
          )}
        </div>
      )}

      <div className="card examples-section">
        <h4>💡 Exemples de recherches que vous pouvez essayer :</h4>
        <div className="examples-grid">
          <div className="example-item" onClick={() => setPrompt("Je cherche un développeur web React pour créer un site e-commerce")}>
            🛒 Développement d'un site e-commerce React
          </div>
          <div className="example-item" onClick={() => setPrompt("J'ai besoin d'un designer pour refaire l'identité visuelle de mon entreprise")}>
            🎨 Refonte d'identité visuelle d'entreprise
          </div>
          <div className="example-item" onClick={() => setPrompt("Je veux améliorer le SEO de mon site web")}>
            📈 Amélioration SEO d'un site web
          </div>
          <div className="example-item" onClick={() => setPrompt("Développement d'une application mobile iOS et Android")}>
            📱 Application mobile native
          </div>
          <div className="example-item" onClick={() => setPrompt("Rédaction de contenu pour mon blog et stratégie marketing")}>
            ✍️ Rédaction et stratégie marketing
          </div>
          <div className="example-item" onClick={() => setPrompt("Analyse de données et création de tableaux de bord")}>
            📊 Analyse de données et dashboard
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPrestataire;
