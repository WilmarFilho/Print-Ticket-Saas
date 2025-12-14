import { useState } from 'react';
import { Plus } from 'lucide-react'; 
import { useAtomValue, useSetAtom } from 'jotai';
import { searchTermAtom, createTicketModalAtom } from '../../state/atoms';
import styles from './Tickets.module.css';
import { CreateTicketModal } from '../../components/modals/CreateTicketModal';
import { PageHeader } from '../../components/ui/PageHeader';
import { TicketCard } from '../../components/cards/TicketCard';

const MOCK_TICKETS = [
  // ... MOCK_TICKETS continua o mesmo ...
  { 
    id: '#TK-9021', 
    titulo: 'Impressora não puxa papel', 
    cliente: 'Advocacia Silva', 
    ativo: 'Kyocera Ecosys M2040', 
    status: 'aberto', 
    data: '12/12/2025',
    descricao: 'A impressora faz barulho de engrenagem mas o papel não sobe. Aparentemente rolete gasto.',
    tecnico: 'Pendente'
  },
  { 
    id: '#TK-9020', 
    titulo: 'Troca de Toner Ciano', 
    cliente: 'Hospital Central', 
    ativo: 'HP Laserjet Pro', 
    status: 'resolvido', 
    data: '10/12/2025',
    descricao: 'Solicitação de troca de suprimento preventiva.',
    tecnico: 'Carlos Souza'
  },
  { 
    id: '#TK-9019', 
    titulo: 'Erro de fusor 50.1', 
    cliente: 'Supermercado Dia', 
    ativo: 'Brother 8157', 
    status: 'andamento', 
    data: '09/12/2025',
    descricao: 'Erro intermitente no painel. Reinicia e volta, mas trava depois de 10 paginas.',
    tecnico: 'Ana Paula'
  },
  { 
    id: '#TK-90191', 
    titulo: 'Erro de fusor 50.1', 
    cliente: 'Supermercado Dia', 
    ativo: 'Brother 8157', 
    status: 'andamento', 
    data: '09/12/2025',
    descricao: 'Erro intermitente no painel. Reinicia e volta, mas trava depois de 10 paginas.',
    tecnico: 'Ana Paula'
  },
  { 
    id: '#TK-90192', 
    titulo: 'Erro de fusor 50.1', 
    cliente: 'Supermercado Dia', 
    ativo: 'Brother 8157', 
    status: 'andamento', 
    data: '09/12/2025',
    descricao: 'Erro intermitente no painel. Reinicia e volta, mas trava depois de 10 paginas.',
    tecnico: 'Ana Paula'
  },
];

export function Tickets() {
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const searchTerm = useAtomValue(searchTermAtom);
  const setIsModalOpen = useSetAtom(createTicketModalAtom);

  const toggleExpand = (id: string) => {
    setExpandedTicketId(current => current === id ? null : id);
  };

  const filteredTickets = MOCK_TICKETS.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
      ticket.id.toLowerCase().includes(searchLower) ||
      ticket.cliente.toLowerCase().includes(searchLower) ||
      ticket.ativo.toLowerCase().includes(searchLower)
    );
  });

  return (
    <section className={styles.wrapper}>
      <PageHeader
        title="Tickets de Serviço"
        description="Gerencie os chamados técnicos"
        actionIcon={<Plus size={20} />}
        actionLabel="Novo Ticket"
        onActionClick={() => setIsModalOpen(true)}
        searchPlaceholder="Buscar por ID, Cliente ou Ativo..."
        pageKey="tickets"
      />

      <div className={styles.listContainer}>
        {filteredTickets.length === 0 && (
          <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>
            Nenhum ticket encontrado para "{searchTerm}"
          </div>
        )}

        {filteredTickets.map(ticket => (
          <TicketCard
            key={ticket.id}
            data={ticket}
            isExpanded={expandedTicketId === ticket.id}
            onToggle={() => toggleExpand(ticket.id)}
          />
        ))}
      </div>

      <CreateTicketModal
        isOpen={useAtomValue(createTicketModalAtom)}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}