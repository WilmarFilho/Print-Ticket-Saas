import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Settings, Users, Layers, BellRing, Wrench, Printer } from 'lucide-react';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? styles.activeLink : styles.link;

  return (
    <aside className={styles.sidebar}>
      <article>
        <Layers size={40} />
      </article>

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

        <NavLink to="/app/tecnicos" className={getLinkClass}>
          <Wrench size={20} />
          Técnicos
        </NavLink>

        <NavLink to="/app/ativos" className={getLinkClass}>
          <Printer size={20} />
          Ativos
        </NavLink>
      </nav>

      <article className={styles.navButtons}>
        <button className={styles.linkButton}>
          <BellRing size={20} />
        </button>
        <NavLink to="" className={styles.linkButton}>
          <Settings size={20} />
        </NavLink>
        <NavLink to="">
          <img className={styles.imgPerfil} src='https://avatars.githubusercontent.com/u/103720085?v=4' />
        </NavLink>
      </article>
    </aside>
  );
}