import { MoreVertical, UserCog } from 'lucide-react';
import styles from './TechnicianCard.module.css';
import type TechnicianData from '../../types/techinicians';

interface TechnicianCardProps {
  data: TechnicianData;
  onEdit?: (tech: TechnicianData) => void;
}

export function TechnicianCard({ data, onEdit }: TechnicianCardProps) {
  // Helpers para extrair dados com segurança (profiles é array)
  const profile = data.profiles?.[0] || { nome: 'Sem Nome', email: 'Sem Email' };
  
  return (
    <div 
        className={styles.card}
        onClick={() => onEdit && onEdit(data)}
        role="button"
        tabIndex={0}
    >
      
      {/* Botão de opções decorativo (pode manter ou remover, já que o clique no card edita) */}
      <button className={styles.optionsBtn} onClick={(e) => e.stopPropagation()}>
        <MoreVertical size={18} />
      </button>

      <div className={styles.iconBox}>
        <UserCog size={32} strokeWidth={1.5} />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{profile.nome}</h3>
        <p className={styles.email} title={profile.email}>
            {profile.email}
        </p>
      </div>

      <div className={`${styles.statusBadge} ${styles[`status_${data.status}`]}`}>
        <div className={styles.statusDot} />
        {data.status === 'ativo' ? 'Disponível' : 'Indisponível'}
      </div>

    </div>
  );
}