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

  // Formatação de data elegante (Primeira letra maiúscula)
  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
    const dateString = date.toLocaleDateString('pt-BR', options);
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  };

  return (
    <div className={styles.heroCard}>
      {/* Cabeçalho do Card */}
      <div className={styles.header}>
        <div className={styles.greeting}>
          <h1>Olá, Joana!</h1>
          <p className={styles.dateBadge}>{getCurrentDate()}</p>
        </div>
        <div className={styles.accountBadge}>
          Conta Corrente
        </div>
      </div>

      {/* Área do Saldo */}
      <div className={styles.balanceContainer}>
        <div className={styles.labelRow}>
          <span>Saldo disponível</span>
          <button onClick={toggleVisible} className={styles.eyeBtn} aria-label="Mostrar saldo">
            {showBalance ? (
              // Ícone de Olho Aberto (SVG Inline)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            ) : (
              // Ícone de Olho Fechado (SVG Inline)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            )}
          </button>
        </div>
        
        <div className={styles.amountWrapper}>
          {isClient ? (
            showBalance ? (
              <div className={styles.valueGroup}>
                <span className={styles.currency}>R$</span>
                <strong className={styles.value}>
                  {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
              </div>
            ) : (
              <div className={styles.hiddenBalance} />
            )
          ) : (
            <div className={styles.skeletonLoader} />
          )}
        </div>
      </div>
    </div>
  );
}