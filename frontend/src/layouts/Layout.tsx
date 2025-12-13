import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <div className={styles.container}>
      <div className={styles.sidebarArea}>
        <Sidebar />
      </div>

      <main className={styles.contentArea}>
        <Outlet />
      </main>
    </div>
  );
}