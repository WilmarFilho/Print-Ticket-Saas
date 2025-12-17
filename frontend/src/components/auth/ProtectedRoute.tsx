import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { sessionAtom } from '../../state/atoms';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const setSession = useSetAtom(sessionAtom);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Verifica a sessão atual ao carregar a página (ex: F5)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthenticated(!!session);
      setLoading(false);
    });

    // Escuta mudanças (ex: logout em outra aba)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  if (loading) {
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  // Se não estiver autenticado, manda pro Login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver OK, renderiza as rotas filhas (Layout)
  return <Outlet />;
}