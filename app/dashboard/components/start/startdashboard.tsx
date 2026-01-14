'use client';
import React from 'react';
import styles from './start.module.scss'; 
import BalanceHero from './balancehero';
import Extrato from '../extrato/extrato';
import NovaOperacao from '../novaoperacao/novaoperacao';

export default function StartDashboard() {
  return (
    <div className={styles.dashboardGrid}>
      {/* Coluna Principal (Esquerda) - Saldo, Ações e Widgets futuros */}
      <section className={styles.mainColumn}>
        
        {/* Componente de Saldo (Vamos estilizá-lo a seguir) */}
        <div className={styles.heroSection}>
          <BalanceHero />
        </div>
        
        {/* Área de Operações (Transferir/Depositar) */}
        <div className={styles.operationsSection}>
           <NovaOperacao />
        </div>

        {/* Aqui entrarão seus Widgets Personalizáveis no futuro */}
        
      </section>

      {/* Coluna Lateral (Direita) - Extrato e Comprovantes */}
      <aside className={styles.sideColumn}>
        <Extrato />
        
        {/* Botão de baixar comprovantes pode ficar aqui futuramente */}
      </aside>
    </div>
  );
}