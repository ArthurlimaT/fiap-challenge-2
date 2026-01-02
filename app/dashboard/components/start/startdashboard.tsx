'use client';
import React from 'react';
import styles from './start.module.scss'; // Usaremos apenas 'styles' aqui
import BalanceHero from './balancehero';
import Extrato from '../extrato/extrato';
import NovaOperacao from '../novaoperacao/novaoperacao';

export default function StartDashboard() {
  return (
    <div className={styles.container}>
      {/* Lado Esquerdo: Conteúdo Principal */}
      <div className={styles.mainContent}>
        
        {/* 1. Boas-vindas e Saldo */}
        <BalanceHero />
        
        {/* 2. O novo componente de Operação (Estilo Abas) */}
        <section className={styles.formSection}>
          <NovaOperacao />
        </section>

      </div>

      {/* Lado Direito: Extrato Lateral Fixo */}
      <aside className={styles.extratoAside}>
        <Extrato />
      </aside>
    </div>
  );
}