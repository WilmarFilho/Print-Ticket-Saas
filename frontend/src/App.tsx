import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Layout } from './layouts/Layout';

// Placeholders (depois você cria os arquivos reais em src/pages/admin/...)
const AdminDashboard = () => <h1>Visão Geral do Dashboard</h1>;
const TicketsList = () => <h1>Lista de Tickets</h1>;
const ClientesList = () => <h1>Lista de Clientes</h1>;
const TecnicosList = () => <h1>Lista de Tecnicos</h1>;
const AtivosList = () => <h1>Lista de Ativos</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route path="/app" element={<Layout />}>

          <Route index element={<AdminDashboard />} />

          <Route path="tickets" element={<TicketsList />} />

          <Route path="clientes" element={<ClientesList />} />

          <Route path="tecnicos" element={<TecnicosList />} />

          <Route path="ativos" element={<AtivosList />} />

        </Route>

        <Route path="*" element={<Navigate to="/app" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;