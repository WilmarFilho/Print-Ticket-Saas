import { Building2, MapPin, Phone, Printer, Ticket } from 'lucide-react';
import styles from './ClientCard.module.css';
import type ClientData from '../../types/client';

interface ClientCardProps {
  data: ClientData;
  onEdit?: (client: ClientData) => void;
}

export function ClientCard({ data, onEdit }: ClientCardProps) {
  return (
    <div 
        className={styles.clientCard}
        onClick={() => onEdit && onEdit(data)}
        role="button"
        tabIndex={0}
    >
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <Building2 size={24} />
        </div>
        <div className={styles.cardInfo}>
          <h3>{data.razao_social}</h3>
          <p className={styles.docText}>{data.documento}</p>
        </div>
        {/* Removemos o botão options, pois o card todo é clicável */}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.contactRow}>
          <MapPin size={14} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
            {data.endereco}
          </span>
        </div>
        <div className={styles.contactRow}>
          <Phone size={14} /> {data.telefone}
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.statBadge}>
          <Printer size={14} color="#64748b" />
          {data.ativos || 0} Ativos
        </div>

        <div
          className={styles.statBadge}
          style={data.ticketsAbertos > 0 ? { background: '#fee2e2', color: '#ef4444' } : {}}
        >
          <Ticket size={14} />
          {data.ticketsAbertos || 0} Chamados
        </div>
      </div>
    </div>
  );
}