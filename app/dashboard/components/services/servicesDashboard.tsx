'use client';
import React, { useState } from 'react';
import styles from './services.module.scss';
import startStyles from '../start/start.module.scss';
import BalanceHero from '../start/balancehero';
import Extrato from '../extrato/extrato';
import MyCards from './mycards';

// Objeto de Ícones com Stroke padronizado para o verde ByteBank
const Icons = {
  Emprestimo: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#47A138" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Cartoes: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#47A138" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  Doacoes: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#47A138" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Pix: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#47A138" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.5 3.5L12 9l-3.5-3.5L12 2zM12 15l3.5 3.5L12 22l-3.5-3.5L12 15zM22 12l-3.5 3.5L15 12l3.5-3.5L22 12zM9 12l-3.5 3.5L2 12l3.5-3.5L9 12z" />
    </svg>
  ),
  Seguros: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#47A138" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Celular: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#47A138" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
};

export default function ServicesDashboard() {
  const [currentView, setCurrentView] = useState<'menu' | 'cards'>('menu');

  if (currentView === 'cards') return <MyCards onBack={() => setCurrentView('menu')} />;

  const services = [
    { id: 'emprestimo', label: 'Empréstimo', icon: <Icons.Emprestimo /> },
    { id: 'cartoes', label: 'Meus cartões', icon: <Icons.Cartoes /> },
    { id: 'doacoes', label: 'Doações', icon: <Icons.Doacoes /> },
    { id: 'pix', label: 'Pix', icon: <Icons.Pix /> },
    { id: 'seguros', label: 'Seguros', icon: <Icons.Seguros /> },
    { id: 'celular', label: 'Crédito celular', icon: <Icons.Celular /> },
  ];

  return (
    <div className={startStyles.container}>
      <div className={startStyles.mainContent}>
        <BalanceHero />
        
        <div className={styles.servicesContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Confira os serviços disponíveis</h2>
          </div>
          
          <div className={styles.grid}>
            {services.map((service) => (
              <div 
                key={service.id}
                className={styles.card}
                onClick={() => service.id === 'cartoes' && setCurrentView('cards')}
              >
                <div className={styles.iconWrapper}>
                  {service.icon}
                </div>
                <span className={styles.label}>{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className={startStyles.extratoAside}>
        <Extrato />
      </aside>
    </div>
  );
}