import { ChevronDown, ChevronUp, Printer, Calendar, User } from 'lucide-react';
import styles from './TicketCard.module.css';
import type TicketData from '../../types/ticket';

interface TicketCardProps {
  data: TicketData;
  isExpanded: boolean;
  onToggle: () => void;
}

export function TicketCard({ data, isExpanded, onToggle }: TicketCardProps) {
  return (
    <div
      className={`${styles.ticketCard} ${isExpanded ? styles.expanded : ''}`}
      onClick={onToggle}
    >
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.idBadge}>{data.id}</div>
          <h3 className={styles.cardTitle}>{data.titulo}</h3>
          <div className={styles.clientInfo}>
            <User size={14} /> {data.cliente}
            <span style={{ margin: '0 8px' }}>•</span>
            <Printer size={14} /> {data.ativo}
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
            <p className={styles.detailValue} style={{ lineHeight: 1.6 }}>{data.descricao}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span className={styles.detailLabel}>Data de Abertura</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.95rem' }}>
                <Calendar size={16} color="#64748b" /> {data.data}
              </div>
            </div>
            <div>
              <span className={styles.detailLabel}>Técnico Responsável</span>
              <div className={styles.detailValue}>{data.tecnico}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Ver Histórico</button>
          <button style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#050810', color: 'white', cursor: 'pointer' }}>Atender Chamado</button>
        </div>
      </div>
    </div>
  );
}