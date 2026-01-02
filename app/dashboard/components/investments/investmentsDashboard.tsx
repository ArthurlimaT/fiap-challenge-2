'use client';
import React from 'react';
import styles from './investment.module.scss'; 
// Importamos o Start SCSS para herdar o mesmo grid do Início
import startStyles from '../start/start.module.scss'; 
import BalanceHero from '../start/balancehero';
import Extrato from '../extrato/extrato'; // Usamos o Extrato real, não a StatementList
import InvestmentStats from './investmentStats';

export default function InvestmentsDashboard() {
  return (
    <div className={startStyles.container}>
      {/* COLUNA DA ESQUERDA (Principal) */}
      <div className={startStyles.mainContent}>
        <BalanceHero />
        
        <section className={styles.investmentsSection}>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Investimentos</h2>
            <span className={styles.total}>Total: R$ 50.000,00</span>
          </div>

          <div className={styles.topCards}>
            <div className={styles.smallCard}>
              <span className={styles.smallCardTitle}>Renda Fixa</span>
              <p className={styles.smallCardValue}>R$ 36.000,00</p>
            </div>
            
            <div className={styles.smallCard}>
              <span className={styles.smallCardTitle}>Renda Variável</span>
              <p className={styles.smallCardValue}>R$ 14.000,00</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className={styles.statsTitle}>Estatísticas</h3>
            <div className={styles.statsCard}>
              <InvestmentStats />
            </div>
          </div>
        </section>
      </div>

      {/* COLUNA DA DIREITA (Extrato Padronizado) */}
      <aside className={startStyles.extratoAside}>
        <Extrato />
      </aside>
    </div>
  );
}