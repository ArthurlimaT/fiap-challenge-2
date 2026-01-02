'use client';
import React, { useState } from 'react';
import styles from './novaoperacao.module.scss';
import Favorites from '../common/favorites'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { adicionarTransacao } from '@/app/store/bancoslice';
import { maskCurrency, currencyToNumber } from '@/app/utils/mask';

export default function NovaOperacao() {
  const [tabAtiva, setTabAtiva] = useState('nova');
  const [valor, setValor] = useState('R$ 0,00');
  const [metodo, setMetodo] = useState('pix');
  
  const dispatch = useDispatch();
  const saldo = useSelector((state: RootState) => state.banco.saldo);

  const handleConcluir = () => {
    const valorNum = currencyToNumber(valor);
    if (valorNum <= 0) return alert("Digite um valor");
    if (valorNum > saldo && metodo !== 'deposito') return alert("Saldo insuficiente");

    dispatch(adicionarTransacao({
      tipo: metodo,
      valor: valorNum,
      favorecido: "Nova Operação"
    }));

    setValor('R$ 0,00');
    alert("Operação realizada!");
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Nova Operação</h2>

      <div className={styles.selectBox}>
        <select value={metodo} onChange={(e) => setMetodo(e.target.value)}>
          <option value="pix">Pix, DOC, TED</option>
          <option value="deposito">Depósito</option>
        </select>
      </div>

      <div className={styles.tabs}>
        <button 
          className={tabAtiva === 'nova' ? styles.active : ''} 
          onClick={() => setTabAtiva('nova')}
        >
          Nova conta
        </button>
        <button 
          className={tabAtiva === 'favoritos' ? styles.active : ''} 
          onClick={() => setTabAtiva('favoritos')}
        >
          Favoritos
        </button>
        <button 
          className={tabAtiva === 'contatos' ? styles.active : ''} 
          onClick={() => setTabAtiva('contatos')}
        >
          Meus contatos
        </button>
      </div>

      <div className={styles.content}>
        {tabAtiva === 'nova' && (
          <div className={styles.list}>
            <div className={styles.item}><span>Mesma titularidade</span> <i>›</i></div>
            <div className={styles.item}><span>Outra titularidade</span> <i>›</i></div>
          </div>
        )}
        {tabAtiva === 'favoritos' && <div className={styles.favWrapper}><Favorites onSelect={() => {}} /></div>}
      </div>

      <div className={styles.footer}>
        <label>Valor a ser transferido</label>
        <input 
          type="text" 
          value={valor} 
          onChange={(e) => setValor(maskCurrency(e.target.value))} 
        />
        <button onClick={handleConcluir} className={styles.btnPrimary}>
          Concluir transação
        </button>
      </div>
    </div>
  );
}