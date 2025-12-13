import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {Login} from './pages/auth/Login';
// Importe o Layout que acabamos de criar
import { Layout } from './layouts/Layout';

// Placeholders (depois você cria os arquivos reais em src/pages/admin/...)
const AdminDashboard = () => <h1>Visão Geral do Dashboard</h1>;
const TicketsList = () => <h1>Lista de Tickets</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            ROTAS PÚBLICAS (Sem Sidebar)
        ====================================================== */}
        <Route path="/login" element={<Login />} />


        {/* =====================================================
            ROTAS PRIVADAS (Com Sidebar)
            Todas as rotas aqui dentro usarão o <Layout />
        ====================================================== */}
        <Route path="/app" element={<Layout />}>
           {/* Rota Index: É renderizada quando acessa exatamente "/app".
             Geralmente é o Dashboard.
           */}
           <Route index element={<AdminDashboard />} />

           {/* Rotas Filhas: Serão renderizadas dentro do Outlet do Layout.
             O caminho final será /app/tickets
           */}
           <Route path="tickets" element={<TicketsList />} />
           
           {/* Adicione outras aqui: clientes, ativos, etc */}
        </Route>


        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;