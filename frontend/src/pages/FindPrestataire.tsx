import React, { useState } from 'react';
import axios from 'axios';

const FindPrestataire: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.post('http://localhost:5000/ai/prompt', { prompt });
      setSuggestion(res.data.response); // réponse de l'IA
    } catch (err) {
      console.error(err);
      setSuggestion("Erreur lors de la recherche");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Décrivez votre besoin</h1>
      <textarea
        placeholder="J'ai besoin d'un site e-commerce pour vendre des vêtements..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        cols={60}
      />
      <br />
      <button onClick={handleSearch} style={{ marginTop: '10px' }}>
        Rechercher
      </button>

      {suggestion && (
        <div style={{ marginTop: '20px' }}>
          <h2>Suggestion de l'IA</h2>
          <p>{suggestion}</p>
        </div>
      )}
    </div>
  );
};

export default FindPrestataire;
