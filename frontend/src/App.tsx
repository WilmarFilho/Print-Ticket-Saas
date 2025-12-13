import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Placeholders para testarmos a navegação
const Login = () => <div className="p-10 text-xl font-bold">Tela de LoAAAgin TESTEEE</div>;
const AdminDashboard = () => <div className="p-10 text-xl text-blue-600">Painel do Técnico/Admin</div>;
const ClientPortal = () => <div className="p-10 text-xl text-green-600">Portal do Cliente</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas Privadas (Futuramente protegidas por AuthGuard) */}
        <Route path="/app" element={<AdminDashboard />} />
        <Route path="/portal" element={<ClientPortal />} />

        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;