import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    } catch {
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#ddd' }}>
      {role === 'ADMIN' && (
        <>
          <Link to="/admin">Dashboard Admin</Link> |{' '}
          <Link to="/projects">Voir Projets</Link> |{' '}
        </>
      )}

      {role === 'CLIENT' && (
        <>
          <Link to="/client">Dashboard Client</Link> |{' '}
          <Link to="/create-project">Créer un projet</Link> |{' '}
          <Link to="/projects">Mes Projets</Link> |{' '}
          <Link to="/search">Trouver un prestataire</Link> |{' '}
        </>
      )}

      {role === 'PRESTATAIRE' && (
        <>
          <Link to="/prestataire">Dashboard Prestataire</Link> |{' '}
          <Link to="/projects">Projets assignés</Link> |{' '}
        </>
      )}

      {role && (
        <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
          Déconnexion
        </button>
      )}
    </nav>
  );
}
