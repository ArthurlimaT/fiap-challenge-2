'use client';
import React, { useState } from 'react';
import styles from '../styles/dashboard.module.scss';
import Sidebar from './components/sidebar/Sidebar';
import StartDashboard from './components/start/startdashboard';
import ServicesDashboard from './components/services/servicesDashboard';
import InvestmentsDashboard from './components/investments/investmentsDashboard';
import TransferDashboard from './components/transfer/transferdashboard';
import DashboardCharts from './components/DashboardCharts'; // Importe o componente de gráficos

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState('start');

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.logoArea}>
            <div className="w-6 h-6 bg-[#47A138] rounded flex items-center justify-center text-white text-[10px]">B</div>
            Byte<span>bank</span>
          </div>

          <div className={styles.userBox}>
            <span className={styles.userName}>Joana Fonseca Gomes</span>
            <div className={styles.userAvatar}>JF</div>
          </div>
        </div>
      </header>

      <div className={styles.wrapper}>
        <aside className={styles.sidebar}>
          <Sidebar activeView={currentView} setActiveView={setCurrentView} />
        </aside>

        <main className={styles.main}>
          <div className={styles.cardBase}>
            {currentView === 'start' && <StartDashboard />}
            {currentView === 'dashboard' && <DashboardCharts />} {/* Nova View */}
            {currentView === 'transfer' && <TransferDashboard />}
            {currentView === 'investments' && <InvestmentsDashboard />}
            {currentView === 'services' && <ServicesDashboard />}
          </div>
        </main>
      </div>
    </div>
  );
}