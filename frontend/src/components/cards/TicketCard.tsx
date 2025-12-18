import { ChevronDown, ChevronUp, Printer, Calendar, User } from 'lucide-react';
import styles from './TicketCard.module.css';
import type TicketData from '../../types/ticket'; // Importando a interface raw do banco

interface TicketCardProps {
  data: TicketData;
  isExpanded: boolean;
  onToggle: () => void;
}

export function TicketCard({ data, isExpanded, onToggle }: TicketCardProps) {
  // Helpers para formatação segura
  const formattedDate = new Date(data.created_at).toLocaleDateString('pt-BR');
  const shortId = `#TK-${data.id.slice(0, 6).toUpperCase()}`; // Ex: #TK-A1B2C3
  
  // Tratamento de nulos (caso o backend não retorne o join corretamente)
  const clientName = data.clientes?.razao_social || 'Cliente N/A';
  const assetModel = data.ativos?.modelo || 'Ativo N/A';
  const techName = data.tecnicos?.profiles?.nome || 'Pendente';

  return (
    <div
      className={`${styles.ticketCard} ${isExpanded ? styles.expanded : ''}`}
      onClick={onToggle}
    >
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.idBadge}>{shortId}</div>
          <h3 className={styles.cardTitle}>{data.titulo}</h3>
          <div className={styles.clientInfo}>
            <User size={14} /> {clientName}
            <span style={{ margin: '0 8px' }}>•</span>
            <Printer size={14} /> {assetModel}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 10 }}>
          <span className={`${styles.statusTag} ${styles[`status_${data.status}`]}`}>
            {data.status}
          </span>
          {isExpanded ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
        </div>
      </div>

      <div className={styles.expandedContent} onClick={e => e.stopPropagation()}>
        <div className={styles.detailGrid}>
          <div>
            <span className={styles.detailLabel}>Descrição do Problema</span>
            <p className={styles.detailValue} style={{ lineHeight: 1.6 }}>
              {data.descricao || 'Sem descrição.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span className={styles.detailLabel}>Data de Abertura</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem' }}>
                <Calendar size={16} color="#64748b" /> {formattedDate}
              </div>
            </div>
            <div>
              <span className={styles.detailLabel}>Técnico Responsável</span>
              <div className={styles.detailValue}>{techName}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>
            Ver Histórico
          </button>
          <button style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#050810', color: 'white', cursor: 'pointer' }}>
            Atender Chamado
          </button>
        </div>
      </div>
    </div>
  );
}