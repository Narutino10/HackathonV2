import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ClientDashboard from "./pages/dashboards/ClientDashboard";
import PrestataireDashboard from "./pages/dashboards/PrestataireDashboard";
import Projects from "./pages/Projects";
import SearchPrestataire from "./pages/SearchPrestataire";
import Navbar from "./components/Navbar";
import CreateProject from './pages/CreateProject';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/prestataire" element={<PrestataireDashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/search" element={<SearchPrestataire />} />
        <Route path="/create-project" element={<CreateProject />} />
        {/* Redirection pour les routes non définies */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
