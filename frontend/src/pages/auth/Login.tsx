import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react'; // Ícone de loading

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Se der certo, vai para o dashboard
      navigate('/app');
    } catch {
      setError('Erro ao entrar. Verifique suas credenciais.');
      console.error('ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f1f5f9'
    }}>
      <div style={{
        background: 'white', 
        padding: '2rem', 
        borderRadius: '16px', 
        width: '100%', 
        maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', textAlign: 'center'}}>
          Acessar Sistema
        </h1>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#ef4444', 
            padding: '0.75rem', borderRadius: '8px', 
            fontSize: '0.9rem', marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#475569'}}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px', 
                border: '1px solid #e2e8f0', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#475569'}}>Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px', 
                border: '1px solid #e2e8f0', outline: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginTop: '1rem',
              background: '#050810', color: 'white',
              padding: '0.75rem', borderRadius: '100px',
              border: 'none', cursor: 'pointer', fontWeight: 500,
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}