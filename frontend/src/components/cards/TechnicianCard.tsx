import { MoreVertical, UserCog } from 'lucide-react';
import styles from './TechnicianCard.module.css';
import type TechnicianData from '../../types/techinicians';

interface TechnicianCardProps {
  data: TechnicianData;
}

export function TechnicianCard({ data }: TechnicianCardProps) {
  return (
    <div className={styles.card}>
      
      <button className={styles.optionsBtn}>
        <MoreVertical size={18} />
      </button>

      <div className={styles.iconBox}>
        <UserCog size={32} strokeWidth={1.5} />
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{data.profiles[0].nome}</h3>
        <p className={styles.email} title={data.profiles[0].email}>
            {data.profiles[0].email}
        </p>
      </div>

      <div className={`${styles.statusBadge} ${styles[`status_${data.status}`]}`}>
        <div className={styles.statusDot} />
        {data.status === 'ativo' ? 'Disponível' : 'Indisponível'}
      </div>

    </div>
  );
}