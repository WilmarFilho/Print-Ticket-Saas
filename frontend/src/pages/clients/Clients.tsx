import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAtom, useAtomValue } from 'jotai'; 
import { 
    searchTermAtom, 
    clientsAtom, 
    sessionAtom // <--- IMPORTANTE: Importar o atom da sessão
} from '../../state/atoms';
import styles from './Clients.module.css';
import { PageHeader } from '../../components/ui/PageHeader'; 
import { ClientCard } from '../../components/cards/ClientCard';
import { ClientModal } from '../../components/modals/ClientModal';
import api from '../../services/api';
import type ClientData from '../../types/client';
import type { PayloadClient } from '../../types/client';

export function Clients() {
  const searchTerm = useAtomValue(searchTermAtom);
  const [clients, setClients] = useAtom(clientsAtom);
  
  // 1. Pegamos a sessão para extrair o tenant_id do usuário logado
  const session = useAtomValue(sessionAtom);

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
      client.razao_social.toLowerCase().includes(searchLower) ||
      client.documento.includes(searchLower)
    );
  });

  const handleNewClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: ClientData) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  // Função centralizada para Salvar
  const handleSaveClient = async (formData: PayloadClient) => {
    // 2. Extraímos o tenant_id dos metadados do usuário
    const tenantId = session?.user?.user_metadata?.tenant_id;

    if (!tenantId) {
      alert("Erro de Segurança: Sessão inválida (sem tenant_id). Faça login novamente.");
      return;
    }

    // 3. Criamos o payload final injetando o tenant_id
    const payload = { 
      ...formData, 
      tenant_id: tenantId 
    };

    try {
      if (editingClient) {
        // ATUALIZAR (PATCH)
        const { data } = await api.patch(`/clientes/${editingClient.id}`, payload);
        
        // Atualiza estado local na lista
        setClients(prev => prev.map(c => c.id === editingClient.id ? data : c));
      } else {
        // CRIAR (POST)
        const { data } = await api.post('/clientes', payload);
        
        // Adiciona ao topo da lista local
        setClients(prev => [data, ...prev]);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      alert(error.response?.data?.message || "Erro ao salvar cliente.");
      throw error; // Repassa erro para o modal parar o loading
    }
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
          <ClientCard 
            key={client.id} 
            data={client} 
            onEdit={handleEditClient} // Passa a função de editar
          />
        ))}
      </div>

      <ClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient} // O modal chama essa função passando os dados do form
        initialData={editingClient}
      />
    </section>
  );
}