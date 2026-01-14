'use client';
import React from 'react';
import styles from './investment.module.scss'; 
import startStyles from '../start/start.module.scss'; 
import BalanceHero from '../start/balancehero';
import Extrato from '../extrato/extrato'; 
import InvestmentStats from './investmentStats';
import { TrendingUp, PieChart, ShieldCheck, BarChart3 } from 'lucide-react';

export default function InvestmentsDashboard() {
  return (
    // Usando o grid padronizado que definimos no Start
    <div className={startStyles.dashboardGrid}>
      
      {/* COLUNA DA ESQUERDA (Conteúdo Principal) */}
      <section className={startStyles.mainColumn}>
        <BalanceHero />
        
        <div className={styles.investmentCard}>
          <div className={styles.headerRow}>
            <div className={styles.titleGroup}>
              <PieChart className={styles.iconTitle} size={24} />
              <h2 className={styles.title}>Meus Investimentos</h2>
            </div>
            <div className={styles.totalBadge}>
              <span className={styles.totalLabel}>Patrimônio Total</span>
              <span className={styles.totalValue}>R$ 50.000,00</span>
            </div>
          </div>

          <div className={styles.cardsGrid}>
            <div className={styles.smallCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconCircle} ${styles.blue}`}>
                  <ShieldCheck size={20} />
                </div>
                <span className={styles.growth}>+ 12% aa</span>
              </div>
              <span className={styles.smallCardTitle}>Renda Fixa</span>
              <p className={styles.smallCardValue}>R$ 36.000,00</p>
              <div className={styles.progressBar}><div className={styles.progressInner} style={{width: '72%'}}></div></div>
            </div>
            
            <div className={styles.smallCard}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconCircle} ${styles.green}`}>
                  <TrendingUp size={20} />
                </div>
                <span className={styles.growth}>+ 24% aa</span>
              </div>
              <span className={styles.smallCardTitle}>Renda Variável</span>
              <p className={styles.smallCardValue}>R$ 14.000,00</p>
              <div className={styles.progressBar}><div className={styles.progressInner} style={{width: '28%', backgroundColor: '#47A138'}}></div></div>
            </div>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.statsHeader}>
              <BarChart3 size={20} />
              <h3 className={styles.statsTitle}>Evolução da Carteira</h3>
            </div>
            <div className={styles.chartContainer}>
              <InvestmentStats />
            </div>
          </div>
        </div>
      </section>

      {/* COLUNA DA DIREITA (Extrato) */}
      <aside className={startStyles.sideColumn}>
        <Extrato />
      </aside>
    </div>
  );
}