import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <div className={styles.container}>
      <header className={styles.sidebarArea}>
        <Sidebar />
      </header>

      <main className={styles.contentArea}>
        <Outlet />
      </main>
    </div>
  );
}