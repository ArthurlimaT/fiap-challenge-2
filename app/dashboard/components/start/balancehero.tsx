'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import styles from './balancehero.module.scss';

export default function BalanceHero() {
  const [isClient, setIsClient] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  
  // Pegando o saldo real do Redux
  const saldo = useSelector((state: RootState) => state.banco.saldo);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleVisible = () => setShowBalance(!showBalance);

  return (
    <div className={styles.heroContainer}>
      <div className={styles.header}>
        <div className={styles.greeting}>
          <h1>Olá, Joana! :)</h1>
          <p>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
        </div>
      </div>

      <div className={styles.balanceContent}>
        <div className={styles.labelGroup}>
          <span>Saldo disponível</span>
          <button onClick={toggleVisible} className={styles.eyeBtn}>
            {showBalance ? '👁️' : '🙈'}
          </button>
        </div>
        
        <div className={styles.amount}>
          {isClient ? (
            showBalance ? (
              <strong className={styles.value}>
                R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </strong>
            ) : (
              <div className={styles.skeletonText} />
            )
          ) : (
            <div className={styles.skeletonLoader} />
          )}
        </div>
        <div className={styles.divider} />
        <p className={styles.accountType}>Conta Corrente</p>
      </div>
    </div>
  );
}