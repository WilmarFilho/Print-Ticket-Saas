import { Printer, Wifi, WifiOff, AlertCircle, Hash, FileText } from 'lucide-react';
import styles from './PrinterCard.module.css';
import type PrinterData from '../../types/printer';

interface PrinterCardProps {
  data: PrinterData;
}

export function PrinterCard({ data }: PrinterCardProps) {
  
  const getStatusColor = () => {
    switch(data.status) {
        case 'online': return styles.online;
        case 'offline': return styles.offline;
        case 'warning': return styles.warning;
    }
  };

  const getStatusIcon = () => {
      if (data.status === 'online') return <Wifi size={16} color="#22c55e" />;
      if (data.status === 'offline') return <WifiOff size={16} color="#ef4444" />;
      return <AlertCircle size={16} color="#f59e0b" />;
  };

  return (
    <div className={styles.card}>

      <div className={`${styles.statusBar} ${getStatusColor()}`} />

      <div className={styles.cardContent}>
        <div className={styles.header}>
            <div>
                <h3 className={styles.modelName}>{data.modelo}</h3>
            </div>
            <div className={styles.iconWrapper}>
                <Printer size={22} strokeWidth={1.5} />
            </div>
        </div>

        <div className={styles.serialBadge}>
            <Hash size={12} color="#94a3b8" />
            {data.serial_number.toUpperCase()}
        </div>

        <div style={{display:'flex', alignItems:'center', gap: 6, fontSize: '0.8rem', color: '#64748b', marginTop: 'auto'}}>
            {getStatusIcon()}
            <span style={{textTransform: 'capitalize'}}>{data.status}</span>
        </div>

      </div>

      <div className={styles.metricsFooter}>
         <div className={styles.metricItem}>
             <span className={styles.metricLabel}>Contador</span>
             <div style={{display:'flex', alignItems:'center', gap: 6}}>
                <FileText size={14} color="#64748b" />
                <span className={styles.metricValue}>{data.contador_atual.toLocaleString()}</span>
             </div>
         </div>
      </div>

    </div>
  );
}