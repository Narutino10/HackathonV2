import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProject: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'CLIENT') return navigate('/login');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const clientId = payload.sub;

    try {
      await axios.post(
        'http://localhost:5000/projects',
        { title, description, clientId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Projet créé avec succès');
      navigate('/projects');
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création du projet');
    }
  };

  return (
    <div>
      <h1>Créer un projet</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre :</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Créer</button>
      </form>
    </div>
  );
};

export default CreateProject;
