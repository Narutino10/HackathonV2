import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.access_token;
      localStorage.setItem('token', token);
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role;

      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'CLIENT') navigate('/client');
      else if (role === 'PRESTATAIRE') navigate('/prestataire');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Se connecter</button>
    </form>
  );
}
