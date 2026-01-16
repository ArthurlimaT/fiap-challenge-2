'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import styles from './investmentsModal.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (valor: number, tipo: 'investir' | 'resgatar') => void;
  investimentoNome: string;
  saldoDisponivel: number;
  saldoInvestido: number;
  cor: string;
}

export default function InvestmentModal({ 
  isOpen, onClose, onConfirm, investimentoNome, saldoDisponivel, saldoInvestido, cor 
}: Props) {
  const [rawValue, setRawValue] = useState(''); 
  const [tipoOperacao, setTipoOperacao] = useState<'investir' | 'resgatar'>('investir');
  
  // Referência para focar no input automaticamente
  const inputRef = useRef<HTMLInputElement>(null);

  // --- CORREÇÃO: Reseta o estado e foca no input ao abrir ---
  useEffect(() => {
    if (isOpen) {
      setRawValue(''); // Limpa o valor anterior
      setTipoOperacao('investir'); // Volta para a aba padrão
      
      // Pequeno delay para garantir que o modal renderizou antes de focar
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Remove tudo que não for número
    const numeric = e.target.value.replace(/\D/g, '');
    
    // 2. Limita o tamanho para evitar números gigantescos (opcional, mas bom)
    if (numeric.length > 12) return;

    // 3. Remove zeros à esquerda
    setRawValue(numeric.replace(/^0+/, ''));
  };

  const formatDisplay = (value: string) => {
    if (!value) return '0,00';
    const number = parseInt(value) / 100;
    return number.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const handleConfirm = () => {
    const valorNumerico = rawValue ? parseInt(rawValue) / 100 : 0;

    if (valorNumerico <= 0) return;

    // Validações
    if (tipoOperacao === 'investir' && valorNumerico > saldoDisponivel) {
      alert(`Saldo insuficiente! Você tem R$ ${saldoDisponivel.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
      return;
    }
    if (tipoOperacao === 'resgatar' && valorNumerico > saldoInvestido) {
      alert(`Saldo insuficiente no investimento! Disponível: R$ ${saldoInvestido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`);
      return;
    }

    onConfirm(valorNumerico, tipoOperacao);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* stopPropagation impede que o clique no card feche o modal */}
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        
        <div className={styles.header}>
          <div className={styles.iconBox} style={{backgroundColor: `${cor}20`, color: cor}}>
            <Wallet size={24} />
          </div>
          <h3>{investimentoNome}</h3>
          <p>Saldo na caixinha: <strong>R$ {saldoInvestido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</strong></p>
        </div>

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
              ref={inputRef} // Adicionamos a referência aqui
              type="text"
              inputMode="numeric"
              placeholder="0,00" 
              value={formatDisplay(rawValue)}
              onChange={handleChange}
            />
          </div>
          <span className={styles.helperText}>
            {tipoOperacao === 'investir' 
              ? `Disponível na conta: R$ ${saldoDisponivel.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
              : `Disponível para resgate: R$ ${saldoInvestido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
            }
          </span>
        </div>

        <button 
          className={styles.confirmBtn} 
          onClick={handleConfirm}
          disabled={!rawValue}
          style={{
            backgroundColor: tipoOperacao === 'investir' ? '#47A138' : '#E11D48',
            opacity: !rawValue ? 0.5 : 1,
            cursor: !rawValue ? 'not-allowed' : 'pointer'
          }}
        >
          Confirmar {tipoOperacao === 'investir' ? 'Aporte' : 'Resgate'}
        </button>
      </div>
    </div>
  );
}