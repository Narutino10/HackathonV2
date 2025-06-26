import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ClientDashboard from "./pages/dashboards/ClientDashboard";
import PrestataireDashboard from "./pages/dashboards/PrestataireDashboard";
import Projects from "./pages/Projects";
import SearchPrestataire from "./pages/SearchPrestataire";
import ContactPrestataire from "./pages/ContactPrestataire";
import ContactReservePrestataireSimplifie from "./pages/ContactReservePrestataireSimplifie";
import Payment from "./pages/Payment";
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
        <Route path="/search-prestataire" element={<SearchPrestataire />} />
        <Route path="/contact-prestataire" element={<ContactPrestataire />} />
        <Route path="/contact-reserve/:prestataireId" element={<ContactReservePrestataireSimplifie />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        {/* Redirection pour les routes non définies */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
