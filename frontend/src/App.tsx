import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ClientDashboard from './pages/dashboards/ClientDashboard';
import PrestataireDashboard from './pages/dashboards/PrestataireDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/prestataire" element={<PrestataireDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
