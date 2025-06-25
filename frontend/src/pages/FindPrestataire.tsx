import React, { useState } from 'react';
import axios from 'axios';

const FindPrestataire: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = async () => {
    try {
      const res = await axios.post('http://localhost:5000/ia/suggest', { prompt });
      setSuggestions(res.data); // suppose que l'IA renvoie un tableau de suggestions
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Décrivez votre besoin</h1>
      <textarea
        placeholder="J'ai besoin d'un site e-commerce pour vendre des vêtements..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        cols={60}
      />
      <br />
      <button onClick={handleSearch}>Rechercher</button>

      {suggestions.length > 0 && (
        <div>
          <h2>Suggestions de prestataires ou solutions IA</h2>
          <ul>
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FindPrestataire;
