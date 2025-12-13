import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Settings, Users } from 'lucide-react';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    isActive ? styles.activeLink : styles.link;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {/* Link para o Dashboard */}
        <NavLink to="/app" end className={getLinkClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        {/* Exemplo de links futuros */}
        <NavLink to="/app/tickets" className={getLinkClass}>
          <Ticket size={20} />
          Tickets
        </NavLink>

        <NavLink to="/app/clientes" className={getLinkClass}>
          <Users size={20} />
          Clientes
        </NavLink>

        <NavLink to="/app/configuracoes" className={getLinkClass}>
          <Settings size={20} />
          Configurações
        </NavLink>
      </nav>
    </aside>
  );
}