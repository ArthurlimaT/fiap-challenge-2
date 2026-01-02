'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import styles from './extrato.module.scss';

export default function Extrato() {
  const [mounted, setMounted] = useState(false);
  
  // CORREÇÃO 1: Adicionamos um fallback (|| []) para garantir que extrato nunca seja undefined
  const extrato = useSelector((state: RootState) => state.banco.transacoes || []);

  // CORREÇÃO 2: Garantir que o componente só renderize no cliente para evitar conflitos de LocalStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Extrato</h3>
      </div>
      
      <div className={styles.list}>
        {/* CORREÇÃO 3: Uso de optional chaining (?.) por segurança extra */}
        {extrato?.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhuma movimentação até o momento.</p>
          </div>
        ) : (
          extrato?.map((item, index) => (
            <div key={item.id || index} className={styles.item}>
              <p className={styles.date}>{item.data}</p>
              
              <div className={styles.details}>
                <div className={styles.info}>
                  {/* Melhoria: Capitalizar a primeira letra do tipo */}
                  <p className={styles.type}>
                    {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                  </p>
                  <p className={styles.target}>{item.favorecido}</p>
                </div>

                <span className={`${styles.value} ${item.tipo === 'deposito' ? styles.positive : styles.negative}`}>
                  {item.tipo === 'deposito' ? '+ ' : '- '}
                  {Math.abs(item.valor).toLocaleString('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}