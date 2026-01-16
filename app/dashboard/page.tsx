'use client';
import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';
import styles from '../styles/dashboard.module.scss';

// Importação dos Componentes
import Sidebar from './components/sidebar/Sidebar';
import StartDashboard from './components/start/startdashboard';
import ServicesDashboard from './components/services/servicesDashboard';
import InvestmentsDashboard from './components/investments/investmentsDashboard';
import TransferDashboard from './components/transfer/transferdashboard';
import DashboardCharts from './components/dashboard/DashboardCharts'; 
import TransactionsView from './components/PesquisaExtrato/TransactionsView';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState('start');
  const [userName, setUserName] = useState('Usuário');
  const [userInitials, setUserInitials] = useState('U');

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.name) {
          setUserName(user.name);
          const names = user.name.trim().split(' ');
          const initials = names.length > 1 
            ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
            : names[0][0].toUpperCase();
          setUserInitials(initials);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.leftSection}>
            <div className={styles.logoArea}>
              <div className={styles.logoBadge}>B</div>
              <span className={styles.logoText}>Byte<span>bank</span></span>
            </div>
            <div className={styles.headerSearch}>
              <Search size={16} />
              <input type="text" placeholder="Buscar transação ou serviço..." />
            </div>
          </div>

          <div className={styles.rightSection}>
            <button className={styles.notifBtn} title="Notificações">
              <Bell size={20} />
              <span className={styles.notifDot}></span>
            </button>
            <div className={styles.divider}></div>
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName}</span>
                <span className={styles.userRole}>Conta Digital</span>
              </div>
              <div className={styles.avatarWrapper}>
                <div className={styles.userAvatar}>{userInitials}</div>
                <div className={styles.statusOnline}></div>
              </div>
              <ChevronDown size={16} className={styles.chevron} />
            </div>
          </div>
        </div>
      </header>

      <div className={styles.wrapper}>
        <aside className={styles.sidebar}>
          <Sidebar activeView={currentView} setActiveView={setCurrentView} />
        </aside>

        <main className={styles.main}>
          <div className={styles.cardBase}>
            {/* INJEÇÃO DA FUNÇÃO DE NAVEGAÇÃO NO STARTDASHBOARD */}
            {currentView === 'start' && <StartDashboard setActiveView={setCurrentView} />}
            
            {currentView === 'dashboard' && <DashboardCharts />}
            {currentView === 'transactions' && <TransactionsView />}
            {currentView === 'transfer' && <TransferDashboard />}
            {currentView === 'investments' && <InvestmentsDashboard />}
            {currentView === 'services' && <ServicesDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
}