'use client';
import React, { useState } from 'react';
import styles from '../styles/dashboard.module.scss';
import Sidebar from './components/sidebar/Sidebar';
import StartDashboard from './components/start/startdashboard';
import ServicesDashboard from './components/services/servicesDashboard';
import InvestmentsDashboard from './components/investments/investmentsDashboard';
import TransferDashboard from './components/transfer/transferdashboard';

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState('start');

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.userBox}>
            <span className={styles.userName}>Joana Fonseca Gomes</span>
            <div className={styles.userAvatar}></div>
          </div>
        </div>
      </header>

      <div className={styles.wrapper}>
        <aside className={styles.sidebar}>
          <Sidebar activeView={currentView} setActiveView={setCurrentView} />
        </aside>

        <main className={styles.main}>
          {/* Lógica de troca de telas */}
          {currentView === 'start' && <StartDashboard />}
          
          {/* Nova View de Transferências */}
          {currentView === 'transfer' && <TransferDashboard />}
          
          {currentView === 'investments' && <InvestmentsDashboard />}
          
          {currentView === 'services' && <ServicesDashboard />}
        </main>
      </div>
    </div>
  );
}