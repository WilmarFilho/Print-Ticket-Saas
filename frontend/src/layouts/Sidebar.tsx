import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Ticket, Settings, Users, 
  Layers, BellRing, Wrench, Printer 
} from 'lucide-react';
import styles from './Sidebar.module.css';
import { SettingsMenu, NotificationsMenu } from '../components/sidebar/SidebarMenus'; // Ajuste o import conforme sua pasta
import { useClickOutside } from '../hooks/useClickOutside'; // Ajuste o import
import { supabase } from '../lib/supabase'; // Para o logout

export function Sidebar() {
  const navigate = useNavigate();
  
  // Controle de qual menu está aberto ('notifications' | 'settings' | null)
  const [activeMenu, setActiveMenu] = useState<'notifications' | 'settings' | null>(null);

  // Refs para detectar clique fora e fechar
  const navRef = useClickOutside<HTMLElement>(() => setActiveMenu(null));

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? styles.activeLink : styles.link;

  const toggleMenu = (menu: 'notifications' | 'settings') => {
    // Se clicar no mesmo que já está aberto, fecha. Senão, abre o novo.
    setActiveMenu(current => current === menu ? null : menu);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      <article>
        <Layers size={40} />
      </article>

      <nav className={styles.nav}>
        <NavLink to="/app" end className={getLinkClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
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
          Impressoras
        </NavLink>
      </nav>

      {/* Usamos a ref no container dos botões. 
          Se clicar fora desse container, os menus fecham.
      */}
      <article className={styles.navButtons} ref={navRef}>
        
        {/* --- BOTÃO NOTIFICAÇÕES --- */}
        <div style={{ position: 'relative' }}>
          {activeMenu === 'notifications' && <NotificationsMenu />}
          
          <button 
            className={`${styles.linkButton} ${activeMenu === 'notifications' ? styles.activeButton : ''}`}
            onClick={() => toggleMenu('notifications')}
          >
            <BellRing size={20} />
            {/* Bolinha vermelha se tiver notificação (opcional) */}
            <span style={{position:'absolute', top: 8, right: 8, width:8, height:8, background:'#ef4444', borderRadius:'50%', border:'2px solid white'}}></span>
          </button>
        </div>

        {/* --- BOTÃO SETTINGS --- */}
        <div style={{ position: 'relative' }}>
          {activeMenu === 'settings' && <SettingsMenu onLogout={handleLogout} />}
          
          <button 
            className={`${styles.linkButton} ${activeMenu === 'settings' ? styles.activeButton : ''}`}
            onClick={() => toggleMenu('settings')}
          >
            <Settings size={20} />
          </button>
        </div>

        <NavLink to="">
          <img className={styles.imgPerfil} src='https://avatars.githubusercontent.com/u/103720085?v=4' alt="Perfil" />
        </NavLink>
      </article>
    </aside>
  );
}