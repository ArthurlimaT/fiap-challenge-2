'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import styles from './extrato.module.scss';
import { Download, ReceiptText } from 'lucide-react';
import { Transacao } from '@/app/store/bancoslice';

export default function Extrato() {
  // Garantimos que buscamos 'state.banco.transacoes' conforme configurado no store.ts
  // Adicionamos um fallback '|| []' para evitar o erro de .length
  const transacoes = useSelector((state: RootState) => state.banco?.transacoes) || [];

  const handleDownload = (t: Transacao) => {
    const conteudo = `
      COMPROVANTE DE TRANSAÇÃO - BYTEBANK
      ----------------------------------
      ID: ${t.id}
      Tipo: ${t.tipo.toUpperCase()}
      Valor: R$ ${t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      Favorecido: ${t.favorecido}
      Data: ${t.data} às ${t.hora}
      ----------------------------------
      Bytebank S.A.
    `;
    
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprovante_${t.id}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.extratoContainer}>
      <div className={styles.header}>
        <ReceiptText size={20} />
        <h2>Extrato</h2>
      </div>

      <div className={styles.lista}>
        {/* Usamos transacoes?.length para total segurança */}
        {transacoes.length === 0 ? (
          <div className={styles.emptyContainer}>
            <p className={styles.empty}>Nenhuma transação realizada ainda.</p>
          </div>
        ) : (
          transacoes.map((t) => (
            <div key={t.id} className={styles.itemTransacao}>
              <div className={styles.info}>
                <span className={styles.data}>{t.data} - {t.hora}</span>
                <strong className={styles.tipo}>
                  {t.tipo === 'deposito' ? 'Depósito' : t.tipo.toUpperCase()}
                </strong>
                <p className={styles.favorecido}>{t.favorecido}</p>
                <span className={`${styles.valor} ${t.tipo === 'deposito' ? styles.positivo : styles.negativo}`}>
                  {t.tipo === 'deposito' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              
              <button 
                className={styles.downloadBtn} 
                onClick={() => handleDownload(t)}
                title="Baixar comprovante"
              >
                <Download size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}