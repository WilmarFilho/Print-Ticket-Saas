import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Layout } from './layouts/Layout';
import { Tickets } from './pages/tickets/Tickets';
import { Clients } from './pages/clients/Clients';
import { Technicians } from './pages/technicians/Technicians';

const AdminDashboard = () => <h1>Visão Geral do Dashboard</h1>;
const AtivosList = () => <h1>Lista de Ativos</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/app" element={<Layout />}>

          <Route index element={<AdminDashboard />} />

          <Route path="tickets" element={<Tickets />} />

          <Route path="clientes" element={<Clients />} />

          <Route path="tecnicos" element={<Technicians />} />

          <Route path="ativos" element={<AtivosList />} />

        </Route>

        <Route path="*" element={<Navigate to="/app" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;