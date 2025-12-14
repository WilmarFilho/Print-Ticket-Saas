import { LogOut } from 'lucide-react';
import styles from './Menus.module.css';

// --- MENU DE CONFIGURAÇÕES ---
interface SettingsMenuProps {
  onLogout: () => void;
}

export function SettingsMenu({ onLogout }: SettingsMenuProps) {
  return (
    <div className={styles.popover} style={{ width: 200 }}>
      <div className={styles.list}>
        <button className={`${styles.item} ${styles.itemDanger}`} onClick={onLogout}>
          <LogOut size={16} />
          Sair da Conta
        </button>
      </div>
    </div>
  );
}

// --- MENU DE NOTIFICAÇÕES ---
export function NotificationsMenu() {
  // Mock de notificações
  const notifications = [
    { id: 1, title: 'Novo chamado de HP Laserjet', time: 'Há 5 min' },
    { id: 2, title: 'Toner baixo em Recepção', time: 'Há 2 horas' },
    { id: 3, title: 'Chamado #TK-9020 resolvido', time: 'Ontem' },
  ];

  return (
    <div className={styles.popover}>
      <div className={styles.header} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        Notificações
        <span style={{fontSize: '0.7rem', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: 10}}>3</span>
      </div>
      <div style={{maxHeight: 300, overflowY: 'auto'}}>
        {notifications.length === 0 ? (
           <div style={{padding: '2rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem'}}>
             Sem notificações novas
           </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={styles.notificationItem}>
               <div style={{display:'flex', gap: 8}}>
                  <div style={{minWidth: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: 4}} />
                  <div>
                    <div className={styles.notifTitle}>{notif.title}</div>
                    <div className={styles.notifTime}>{notif.time}</div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
      <button className={styles.item} style={{justifyContent: 'center', borderTop: '1px solid #f1f5f9', borderRadius: '0 0 16px 16px', color: '#3b82f6', fontSize: '0.8rem'}}>
        Marcar todas como lidas
      </button>
    </div>
  );
}