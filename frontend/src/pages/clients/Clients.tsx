import { Plus } from 'lucide-react';
import { useAtomValue } from 'jotai'; 
import { searchTermAtom, clientsAtom } from '../../state/atoms'; // Importe o atom
import styles from './Clients.module.css';
import { PageHeader } from '../../components/ui/PageHeader'; 
import { ClientCard } from '../../components/cards/ClientCard';

export function Clients() {
  const searchTerm = useAtomValue(searchTermAtom);
  const clients = useAtomValue(clientsAtom); // Lê os dados reais da API/Cache

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
      client.razao_social.toLowerCase().includes(searchLower) ||
      client.documento.includes(searchLower)
    );
  });

  const handleNewClient = () => {
    alert("Modal de Novo Cliente");
  };

  return (
    <section className={styles.wrapper}>

      <PageHeader
        title="Meus Clientes"
        description="Gerencie sua carteira de empresas"
        actionIcon={<Plus size={20} />}
        actionLabel="Novo Cliente"
        onActionClick={handleNewClient}
        searchPlaceholder="Buscar empresa ou CNPJ..."
        pageKey="clients"
      />

      <div className={styles.gridContainer}>
        {filteredClients.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>
            Nenhum cliente encontrado.
          </div>
        )}

        {filteredClients.map(client => (
          <ClientCard key={client.id} data={client} />
        ))}
      </div>
    </section>
  );
}