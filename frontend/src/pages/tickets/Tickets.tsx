import { useState } from 'react';
import { Plus } from 'lucide-react'; 
import { useAtomValue, useSetAtom } from 'jotai';
import { searchTermAtom, createTicketModalAtom, ticketsAtom } from '../../state/atoms'; // Importando o atom real
import styles from './Tickets.module.css';
import { CreateTicketModal } from '../../components/modals/CreateTicketModal';
import { PageHeader } from '../../components/ui/PageHeader';
import { TicketCard } from '../../components/cards/TicketCard';


//const shortId = `#TK-${ticket.id.slice(0, 4).toUpperCase()}`;

export function Tickets() {
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  
  // Estados globais
  const searchTerm = useAtomValue(searchTermAtom);
  const setIsModalOpen = useSetAtom(createTicketModalAtom);
  const rawTickets = useAtomValue(ticketsAtom); // Dados vindos da API (via Layout)

  const toggleExpand = (id: string) => {
    setExpandedTicketId(current => current === id ? null : id);
  };

  // Filtro sobre os dados formatados
  const filteredTickets = rawTickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    if (!searchLower) return true;
    return (
      ticket.id.toLowerCase().includes(searchLower) || // Busca pelo ID curto
      ticket.clientes.razao_social.toLowerCase().includes(searchLower) ||
      ticket.ativos.serial_number.toLowerCase().includes(searchLower) ||
      ticket.titulo.toLowerCase().includes(searchLower)
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
            Nenhum ticket encontrado.
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