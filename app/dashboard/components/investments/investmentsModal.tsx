'use client';
import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import styles from './investmentsModal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (valor: number, tipo: 'investir' | 'resgatar') => void;
  investimentoNome: string;
  saldoDisponivel: number; // Saldo da conta corrente
  saldoInvestido: number;  // Quanto já tem na caixinha
  cor: string;
}

export default function InvestmentModal({ 
  isOpen, onClose, onConfirm, investimentoNome, saldoDisponivel, saldoInvestido, cor 
}: Props) {
  const [valor, setValor] = useState('');
  const [tipoOperacao, setTipoOperacao] = useState<'investir' | 'resgatar'>('investir');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const valorNumerico = parseFloat(valor);
    if (!valorNumerico || valorNumerico <= 0) return;

    // Validações
    if (tipoOperacao === 'investir' && valorNumerico > saldoDisponivel) {
      alert("Saldo insuficiente na conta corrente!");
      return;
    }
    if (tipoOperacao === 'resgatar' && valorNumerico > saldoInvestido) {
      alert("Valor maior do que o disponível neste investimento!");
      return;
    }

    onConfirm(valorNumerico, tipoOperacao);
    setValor('');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        
        <div className={styles.header}>
          <div className={styles.iconBox} style={{backgroundColor: `${cor}20`, color: cor}}>
            <Wallet size={24} />
          </div>
          <h3>{investimentoNome}</h3>
          <p>Saldo atual na caixinha: <strong>R$ {saldoInvestido.toLocaleString()}</strong></p>
        </div>

        {/* Abas de Escolha */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${tipoOperacao === 'investir' ? styles.active : ''}`}
            onClick={() => setTipoOperacao('investir')}
          >
            <ArrowUpRight size={16} /> Guardar
          </button>
          <button 
            className={`${styles.tab} ${tipoOperacao === 'resgatar' ? styles.active : ''}`}
            onClick={() => setTipoOperacao('resgatar')}
          >
            <ArrowDownLeft size={16} /> Resgatar
          </button>
        </div>

        <div className={styles.inputSection}>
          <label>Quanto queres {tipoOperacao}?</label>
          <div className={styles.currencyInput}>
            <span>R$</span>
            <input 
              type="number" 
              placeholder="0,00" 
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              autoFocus
            />
          </div>
          <span className={styles.helperText}>
            {tipoOperacao === 'investir' 
              ? `Disponível na conta: R$ ${saldoDisponivel.toLocaleString()}`
              : `Disponível para resgate: R$ ${saldoInvestido.toLocaleString()}`
            }
          </span>
        </div>

        <button 
          className={styles.confirmBtn} 
          onClick={handleConfirm}
          style={{backgroundColor: tipoOperacao === 'investir' ? '#47A138' : '#E11D48'}}
        >
          Confirmar {tipoOperacao === 'investir' ? 'Aporte' : 'Resgate'}
        </button>
      </div>
    </div>
  );
}