'use client';
import React, { useState } from 'react';
import styles from './investment.module.scss';
import BalanceHero from '../start/balancehero';
import InvestmentStats from './investmentStats';
import { TrendingUp, ShieldCheck, Wallet, Plus, Coins, Landmark, Bitcoin } from 'lucide-react';

// Dados iniciais (Estado Inicial)
const initialPortfolio = [
  { id: 'tesouro', name: 'Tesouro', value: 35, amount: 17500, color: '#47A138', icon: <Landmark /> },
  { id: 'acoes', name: 'Ações', value: 25, amount: 12500, color: '#6366F1', icon: <TrendingUp /> },
  { id: 'fiis', name: 'FIIs', value: 20, amount: 10000, color: '#F59E0B', icon: <Coins /> },
  { id: 'cripto', name: 'Cripto', value: 20, amount: 10000, color: '#E11D48', icon: <Bitcoin /> },
];

export default function InvestmentsDashboard() {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [totalPatrimonio, setTotalPatrimonio] = useState(50000);

  // Função para simular um investimento (Adiciona R$ 1.000)
  const handleInvest = (id: string) => {
    const valorAporte = 1000; // Valor fixo para teste rápido
    
    const newPortfolio = portfolio.map(item => {
      if (item.id === id) {
        return { ...item, amount: item.amount + valorAporte };
      }
      return item;
    });

    // Recalcula as porcentagens
    const newTotal = totalPatrimonio + valorAporte;
    const portfolioWithPercent = newPortfolio.map(item => ({
      ...item,
      value: parseFloat(((item.amount / newTotal) * 100).toFixed(1))
    }));

    setPortfolio(portfolioWithPercent);
    setTotalPatrimonio(newTotal);
  };

  return (
    <div className={styles.premiumContainer}>
      <section className={styles.heroSection}>
        <BalanceHero />
      </section>

      <main className={styles.mainContent}>
        {/* HEADER */}
        <header className={styles.premiumHeader}>
          <div className={styles.headerLabelGroup}>
            <Wallet className={styles.headerIcon} />
            <h1 className={styles.mainTitle}>Gestão de Patrimônio</h1>
          </div>
          
          <div className={styles.patrimonioHero}>
             <div className={styles.patrimonioInfo}>
                <span className={styles.patrimonioLabel}>Total Acumulado</span>
                <div className={styles.patrimonioValueGroup}>
                    <span className={styles.currency}>R$</span>
                    {/* Agora o valor é dinâmico */}
                    <span className={styles.bigValue}>{totalPatrimonio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </div>
             </div>
          </div>
        </header>

        {/* NOVA SEÇÃO: CAIXINHAS DE APORTE RAPIDO */}
        <section className={styles.caixinhasSection}>
          <h3><Plus size={16}/> Realizar novo aporte (+ R$ 1.000)</h3>
          <div className={styles.caixinhasGrid}>
            {portfolio.map((item) => (
              <button 
                key={item.id} 
                className={styles.caixinhaCard}
                onClick={() => handleInvest(item.id)}
                style={{borderColor: item.color}} // Borda sutil na cor do ativo
              >
                <div className={styles.iconBox} style={{color: item.color, background: `${item.color}15`}}>
                  {item.icon}
                </div>
                <div className={styles.caixinhaInfo}>
                  <span className={styles.caixinhaName}>{item.name}</span>
                  <span className={styles.caixinhaValue}>R$ {item.amount.toLocaleString()}</span>
                </div>
                <div className={styles.addHover}>+</div>
              </button>
            ))}
          </div>
        </section>

        {/* GRÁFICOS INTERATIVOS INTEGRADOS */}
        {/* Passamos o portfolio atualizado para o gráfico */}
        <section className={styles.chartsSection}>
          <InvestmentStats data={portfolio} />
        </section>
      </main>
    </div>
  );
}