import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<{ prenom?: string; nom?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
      setUser({ prenom: payload.prenom, nom: payload.nom });
    } catch {
      setRole(null);
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
    setUser(null);
    navigate('/login');
  };

  const navStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    color: 'white'
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  };

  const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 15px',
    padding: '8px 16px',
    borderRadius: '20px',
    transition: 'background-color 0.3s ease',
    fontSize: '0.95rem'
  };

  const linkHoverStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.2)'
  };

  const buttonStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '8px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease'
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/" style={logoStyle}>
          🚀 FreelanceHub
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {role === 'ADMIN' && (
          <>
            <Link 
              to="/admin" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              📊 Dashboard Admin
            </Link>
            <Link 
              to="/projects" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              📋 Projets
            </Link>
          </>
        )}

        {role === 'CLIENT' && (
          <>
            <Link 
              to="/client" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              🏠 Dashboard
            </Link>
            <Link 
              to="/create-project" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              ➕ Nouveau Projet
            </Link>
            <Link 
              to="/projects" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              📋 Mes Projets
            </Link>
            <Link 
              to="/search" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              🔍 Trouver un Prestataire
            </Link>
          </>
        )}

        {role === 'PRESTATAIRE' && (
          <>
            <Link 
              to="/prestataire" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              🏠 Dashboard
            </Link>
            <Link 
              to="/prestataire/offers" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              💼 Mes Offres
            </Link>
            <Link 
              to="/prestataire/profile" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              👤 Mon Profil
            </Link>
            <Link 
              to="/projects" 
              style={linkStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, linkHoverStyle)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, linkStyle)}
            >
              📋 Projets Assignés
            </Link>
          </>
        )}

        {role && user && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
            <span style={{ marginRight: '15px', fontSize: '0.9rem' }}>
              👋 Bonjour {user.prenom}
            </span>
            <button 
              onClick={handleLogout} 
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            >
              🚪 Déconnexion
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
