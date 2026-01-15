'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  TrendingUp, 
  Grid2X2, 
  LogOut,
  PieChart,
  FileText // Importação adicionada aqui
} from 'lucide-react'; 
import styles from './sidebar.module.scss';

export default function Sidebar({ activeView, setActiveView }: any) {
  const router = useRouter();

  const menuItems = [
    { id: 'start', label: 'Início', icon: <LayoutDashboard size={20} /> },
    { id: 'dashboard', label: 'Dashboard', icon: <PieChart size={20} /> },
    { id: 'transactions', label: 'Extrato', icon: <FileText size={20} /> },
    { id: 'transfer', label: 'Transferências', icon: <ArrowLeftRight size={20} /> },
    { id: 'investments', label: 'Investimentos', icon: <TrendingUp size={20} /> },
    { id: 'services', label: 'Outros serviços', icon: <Grid2X2 size={20} /> },
  ];

  const handleLogout = () => {
    // Limpa o cookie de autenticação
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
              {/* Indicador lateral verde para o item ativo */}
              {activeView === item.id && <div className={styles.indicator} />}
            </li>
          ))}
        </ul>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sair da conta</span>
        </button>
      </div>
    </nav>
  );
}