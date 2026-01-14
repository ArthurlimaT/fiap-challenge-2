'use client';
import React, { useState } from 'react';
import styles from './services.module.scss';
import startStyles from '../start/start.module.scss';
import BalanceHero from '../start/balancehero';
import Extrato from '../extrato/extrato';
import MyCards from './mycards';
import { 
  Banknote, CreditCard, HeartHandshake, 
  QrCode, ShieldCheck, Smartphone 
} from 'lucide-react';

export default function ServicesDashboard() {
  const [currentView, setCurrentView] = useState<'menu' | 'cards'>('menu');

  // Se o usuário clicar em "Meus Cartões", renderizamos o componente de detalhe
  if (currentView === 'cards') {
    return <MyCards onBack={() => setCurrentView('menu')} />;
  }

  const services = [
    { id: 'emprestimo', label: 'Empréstimo', icon: <Banknote size={32} />, active: false },
    { id: 'cartoes', label: 'Meus cartões', icon: <CreditCard size={32} />, active: true },
    { id: 'doacoes', label: 'Doações', icon: <HeartHandshake size={32} />, active: false },
    { id: 'pix', label: 'Pix', icon: <QrCode size={32} />, active: false },
    { id: 'seguros', label: 'Seguros', icon: <ShieldCheck size={32} />, active: false },
    { id: 'celular', label: 'Crédito celular', icon: <Smartphone size={32} />, active: false },
  ];

  return (
    <div className={startStyles.dashboardGrid}>
      <div className={startStyles.mainColumn}>
        <BalanceHero />
        
        <div className={styles.servicesCard}>
          <div className={styles.header}>
            <h2 className={styles.title}>Confira os serviços disponíveis</h2>
          </div>
          
          <div className={styles.grid}>
            {services.map((service) => (
              <div 
                key={service.id}
                className={`${styles.card} ${!service.active ? styles.disabled : ''}`}
                onClick={() => service.active && setCurrentView('cards')}
              >
                <div className={styles.iconWrapper}>
                  {service.icon}
                </div>
                <span className={styles.label}>{service.label}</span>
                {!service.active && <span className={styles.badge}>Em breve</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className={startStyles.sideColumn}>
        <Extrato />
      </aside>
    </div>
  );
}