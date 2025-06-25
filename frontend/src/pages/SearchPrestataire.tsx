import React, { useState } from 'react';
import axios from 'axios';

const SearchPrestataire: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/ai/suggest-prestataire',
        { prompt },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResult(res.data.message || res.data.result || JSON.stringify(res.data));
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setResult('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Recherche de prestataire par IA</h1>
      <textarea
        placeholder="Décrivez votre besoin ici..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        cols={60}
      />
      <br />
      <button onClick={handleSearch} disabled={loading || !prompt.trim()}>
        {loading ? 'Recherche en cours...' : 'Rechercher'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Résultat :</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default SearchPrestataire;
