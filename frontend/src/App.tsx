import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Layout } from './layouts/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Clients } from './pages/clients/Clients';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Tickets } from './pages/tickets/Tickets';
import { Technicians } from './pages/technicians/Technicians';
import { Printers } from './pages/printers/Printers';
// ... outros imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clientes" element={<Clients />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="tecnicos" element={<Technicians />} />
            <Route path="ativos" element={<Printers />} />
          </Route>

        </Route>

        {/* Redirecionar raiz para /app (o ProtectedRoute vai jogar pro Login se precisar) */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;