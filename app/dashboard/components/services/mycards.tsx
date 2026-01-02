'use client';
import React, { useState } from 'react';
import styles from './mycards.module.scss';
import startStyles from '../start/start.module.scss';
import BalanceHero from '../start/balancehero';
import Extrato from '../extrato/extrato';

interface MyCardsProps {
  onBack: () => void;
}

export default function MyCards({ onBack }: MyCardsProps) {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <div className={startStyles.container}>
      <div className={startStyles.mainContent}>
        <BalanceHero />
        
        <div className={styles.cardsSection}>
          <button className={styles.backBtn} onClick={onBack}>
            <span>←</span> Voltar para Serviços
          </button>

          <h2 className={styles.sectionTitle}>Meus cartões</h2>

          <div className={styles.cardsGrid}>
            {/* Cartão Físico */}
            <div className={styles.cardWrapper}>
              <label className={styles.cardLabel}>Cartão Físico</label>
              <div className={`${styles.baseCard} ${styles.cardPhysical}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.chip} />
                  <span className={styles.brand}>ByteBank</span>
                </div>
                <span className={styles.cardNumber}>**** **** **** 4589</span>
                <div className={styles.cardFooter}>
                  <span>João da Silva</span>
                  <span>12/29</span>
                </div>
              </div>
            </div>

            {/* Cartão Virtual */}
            <div className={styles.cardWrapper}>
              <label className={styles.cardLabel}>Cartão Virtual</label>
              <div className={`${styles.baseCard} ${styles.cardVirtual}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.chipVirtual} />
                  <span className={styles.brand}>ByteBank</span>
                </div>
                <span className={styles.cardNumber}>**** **** **** 9901</span>
                <div className={styles.cardFooter}>
                  <span>João da Silva</span>
                  <span>08/30</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className={startStyles.extratoAside}>
        <Extrato />
      </aside>
    </div>
  );
}