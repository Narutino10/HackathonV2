import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password, role });
      navigate('/login');
    } catch (err) {
      alert('Register failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="CLIENT">Client</option>
        <option value="PRESTATAIRE">Prestataire</option>
      </select>
      <button type="submit">S'inscrire</button>
    </form>
  );
}
