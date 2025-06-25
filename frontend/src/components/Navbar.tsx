import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#ddd' }}>
      <Link to="/client">Client</Link> |{' '}
      <Link to="/prestataire">Prestataire</Link> |{' '}
      <Link to="/admin">Admin</Link> |{' '}
      <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
        Déconnexion
      </button>
    </nav>
  );
}
