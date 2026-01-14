'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  TrendingUp, 
  Grid2X2, 
  LogOut 
} from 'lucide-react'; 
import styles from './sidebar.module.scss'; // Criaremos um arquivo específico para ela

export default function Sidebar({ activeView, setActiveView }: any) {
  const router = useRouter();

  const menuItems = [
    { id: 'start', label: 'Início', icon: <LayoutDashboard size={20} /> },
    { id: 'transfer', label: 'Transferências', icon: <ArrowLeftRight size={20} /> },
    { id: 'investments', label: 'Investimentos', icon: <TrendingUp size={20} /> },
    { id: 'services', label: 'Outros serviços', icon: <Grid2X2 size={20} /> },
  ];

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push('/'); 
    router.refresh();
  };

  return (
    <nav className={styles.sideNav}>
      <div className={styles.menuWrapper}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`${styles.sidebarItem} ${activeView === item.id ? styles.active : ''}`}
              onClick={() => setActiveView?.(item.id)}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
              {/* Indicador visual de item ativo (barrinha lateral) */}
              {activeView === item.id && <div className={styles.indicator} />}
            </li>
          ))}
        </ul>

        {/* Botão de Sair fixado no rodapé da Sidebar */}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sair da conta</span>
        </button>
      </div>
    </nav>
  );
}