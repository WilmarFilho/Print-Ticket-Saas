import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp, Printer, Calendar, User, Search } from 'lucide-react'; // Adicionei o Search
import styles from './Tickets.module.css';
import { CreateTicketModal } from '../../components/modals/CreateTicketModal';

// Mock de dados
const MOCK_TICKETS = [
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  
  // 1. Estado da Busca
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedTicketId(current => current === id ? null : id);
  };

  // 2. Lógica de Filtragem (Case Insensitive)
  const filteredTickets = MOCK_TICKETS.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.cliente.toLowerCase().includes(searchLower) ||
        ticket.ativo.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.container}>
      
      {/* Header Fixo */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tickets de Serviço</h1>
          <p style={{color: '#64748b', fontSize: '0.9rem'}}>Gerencie os chamados técnicos</p>
        </div>
        
        {/* Container de Ações da Direita */}
        <div className={styles.headerActions}>
            
            {/* Input de Busca */}
            <div className={styles.searchWrapper}>
                <Search className={styles.searchIcon} size={18} />
                <input 
                    type="text" 
                    className={styles.searchInput} 
                    placeholder="Buscar por ID, Cliente ou Ativo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Botão Novo */}
            <button className={styles.newBtn} onClick={() => setIsModalOpen(true)}>
                <Plus size={20} />
                Novo Ticket
            </button>
        </div>
      </div>

      {/* Lista com Scroll (Usando filteredTickets) */}
      <div className={styles.listContainer}>
        
        {/* Feedback visual se não achar nada */}
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
            {/* Resumo */}
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

            {/* Detalhes Expandidos */}
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

      <CreateTicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
}