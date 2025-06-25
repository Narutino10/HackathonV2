import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== 'CLIENT') {
      navigate('/login');
    }
  }, []);

  return <div>Bienvenue sur le dashboard client !</div>;
}
