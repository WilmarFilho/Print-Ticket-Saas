import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAtom, useSetAtom } from 'jotai';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';
import api from '../services/api';
import { 
  clientsAtom, printersAtom, techniciansAtom, ticketsAtom, 
  isLoadingDataAtom 
} from '../state/atoms';
import { Loader2 } from 'lucide-react';

export function Layout() {
  // Atoms para setar os dados globais
  const setClients = useSetAtom(clientsAtom);
  const setPrinters = useSetAtom(printersAtom);
  const setTechnicians = useSetAtom(techniciansAtom);
  const setTickets = useSetAtom(ticketsAtom);
  
  const [isLoading, setIsLoading] = useAtom(isLoadingDataAtom);

  useEffect(() => {
    async function fetchAllData() {
      setIsLoading(true);
      try {
        // Promise.all para carregar tudo em paralelo (muito mais rápido)
        const [clientsRes, printersRes, techsRes, ticketsRes] = await Promise.all([
          api.get('/clientes'),
          api.get('/ativos'),   // Assumindo que você criou esse endpoint
          api.get('/tecnicos'), // Assumindo que você criou esse endpoint
          api.get('/tickets')   // Assumindo que você criou esse endpoint
        ]);

        setClients(clientsRes.data);
        setPrinters(printersRes.data);
        setTechnicians(techsRes.data);
        setTickets(ticketsRes.data);

        
        
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllData();
  }, []);

  // Enquanto carrega os dados iniciais, mostra um loading bonito cobrindo a tela
  if (isLoading) {
    return (
      <div style={{height: '100vh', display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', gap: '1rem'}}>
        <Loader2 className="animate-spin" size={48} />
        <p style={{color: '#64748b'}}>Sincronizando sistema...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.sidebarArea}>
        <Sidebar />
      </header>

      <main className={styles.contentArea}>
        <Outlet />
      </main>
    </div>
  );
}