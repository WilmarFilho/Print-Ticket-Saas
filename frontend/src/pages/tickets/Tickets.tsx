import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Printer, Calendar, User } from 'lucide-react'; 
import { useAtomValue, useSetAtom } from 'jotai'; // Novos hooks do Jotai
import { searchTermAtom, createTicketModalAtom } from '../../state/atoms';
import styles from './Tickets.module.css';
import { CreateTicketModal } from '../../components/modals/CreateTicketModal';
import { PageHeader } from '../../components/ui/PageHeader';

// Mock de dados (MANTÉM IGUAL)
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
];

export function Tickets() {
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  
  // LEITURA: useAtomValue (equivalente ao useRecoilValue)
  const searchTerm = useAtomValue(searchTermAtom); 
  
  // ESCRITA: useSetAtom (equivalente ao useSetRecoilState)
  const setIsModalOpen = useSetAtom(createTicketModalAtom);

  const toggleExpand = (id: string) => {
    setExpandedTicketId(current => current === id ? null : id);
  };

  // Lógica de Filtragem agora usa o Recoil
  const filteredTickets = MOCK_TICKETS.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    // Apenas filtra se o estado da busca não estiver vazio
    if (!searchLower) return true;
    
    return (
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.cliente.toLowerCase().includes(searchLower) ||
        ticket.ativo.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.container}>
      
      {/* HEADER COMPONENTIZADO */}
      <PageHeader
        title="Tickets de Serviço"
        description="Gerencie os chamados técnicos"
        actionIcon={<Plus size={20} />}
        actionLabel="Novo Ticket"
        onActionClick={() => setIsModalOpen(true)} // Ação que muda o estado Recoil
        searchPlaceholder="Buscar por ID, Cliente ou Ativo..."
        pageKey="tickets" // Define a página atual
      />

      {/* Lista com Scroll */}
      <div className={styles.listContainer}>
        
        {filteredTickets.length === 0 && (
            <div style={{textAlign: 'center', color: '#94a3b8', marginTop: '2rem'}}>
                Nenhum ticket encontrado para "{searchTerm}"
            </div>
        )}

        {filteredTickets.map(ticket => (
          <div 
            key={ticket.id} 
            className={`${styles.ticketCard} ${expandedTicketId === ticket.id ? styles.expanded : ''}`}
            onClick={() => toggleExpand(ticket.id)}
          >
            {/* ... Conteúdo do Card de Ticket (MANTÉM IGUAL) ... */}
            <div className={styles.cardHeader}>
              <div>
                 <div className={styles.idBadge}>{ticket.id}</div>
                 <h3 className={styles.cardTitle}>{ticket.titulo}</h3>
                 <div className={styles.clientInfo}>
                    <User size={14} /> {ticket.cliente}
                    <span style={{margin: '0 8px'}}>•</span>
                    <Printer size={14} /> {ticket.ativo}
                 </div>
              </div>

              <div style={{display:'flex', flexDirection:'column', alignItems:'end', gap: 10}}>
                 <span className={`${styles.statusTag} ${styles[`status_${ticket.status}`]}`}>
                    {ticket.status}
                 </span>
                 {expandedTicketId === ticket.id ? <ChevronUp size={18} color="#94a3b8"/> : <ChevronDown size={18} color="#94a3b8"/>}
              </div>
            </div>

            {/* Detalhes Expandidos (MANTÉM IGUAL) */}
            <div className={styles.expandedContent} onClick={e => e.stopPropagation()}>
               <div className={styles.detailGrid}>
                  <div>
                    <span className={styles.detailLabel}>Descrição do Problema</span>
                    <p className={styles.detailValue} style={{lineHeight: 1.6}}>{ticket.descricao}</p>
                  </div>
                  <div style={{display:'flex', flexDirection:'column', gap: '1rem'}}>
                    <div>
                        <span className={styles.detailLabel}>Data de Abertura</span>
                        <div style={{display:'flex', alignItems:'center', gap: 6, fontSize: '0.95rem'}}>
                            <Calendar size={16} color="#64748b"/> {ticket.data}
                        </div>
                    </div>
                    <div>
                        <span className={styles.detailLabel}>Técnico Responsável</span>
                        <div className={styles.detailValue}>{ticket.tecnico}</div>
                    </div>
                  </div>
               </div>
               
               <div style={{marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
                   <button style={{padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer'}}>Ver Histórico</button>
                   <button style={{padding: '8px 16px', borderRadius: 8, border: 'none', background: '#050810', color: 'white', cursor: 'pointer'}}>Atender Chamado</button>
               </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal agora lê o estado do Recoil */}
      <CreateTicketModal 
        isOpen={useAtomValue(createTicketModalAtom)}
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
}