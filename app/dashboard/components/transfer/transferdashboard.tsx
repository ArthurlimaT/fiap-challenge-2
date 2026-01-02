'use client';
import React, { useState } from 'react';
import styles from './transfer.module.scss';
import startStyles from '../start/start.module.scss';
import BalanceHero from '../start/balancehero';
import Extrato from '../extrato/extrato';
import Favorites from '../common/favorites'; // Importação do novo componente
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store';
import { adicionarTransacao, salvarFavorito } from '@/app/store/bancoslice'; // Importando a nova action
import { maskCPF, maskPhone, validateEmail, maskCurrency, currencyToNumber } from '@/app/utils/mask';

export default function TransferDashboard() {
  const dispatch = useDispatch();
  const saldo = useSelector((state: RootState) => state.banco.saldo);
  
  const [metodo, setMetodo] = useState('pix');
  const [tipoChave, setTipoChave] = useState('cpf');
  const [favorecido, setFavorecido] = useState('');
  const [valorFormatado, setValorFormatado] = useState('R$ 0,00');
  const [erroEmail, setErroEmail] = useState(false);

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValorFormatado(maskCurrency(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNumerico = currencyToNumber(valorFormatado);

    if (metodo !== 'deposito' && valorNumerico > saldo) {
      alert("Saldo insuficiente.");
      return;
    }

    if (valorNumerico <= 0) {
      alert("Insira um valor válido.");
      return;
    }

    if (metodo !== 'deposito' && tipoChave === 'email' && !validateEmail(favorecido)) {
      setErroEmail(true);
      return;
    }

    // 1. Dispara a transação para o histórico
    dispatch(adicionarTransacao({
      tipo: metodo,
      valor: valorNumerico,
      favorecido: favorecido || 'Minha conta'
    }));

    // 2. Lógica de Favoritos: Salva automaticamente se for transferência
    if (metodo !== 'deposito' && favorecido) {
      // Pegamos o primeiro nome para o avatar ou o e-mail encurtado
      const nomeExibicao = favorecido.includes('@') ? favorecido.split('@')[0] : favorecido;
      dispatch(salvarFavorito({ 
        nome: nomeExibicao, 
        chave: favorecido 
      }));
    }
    
    alert(`${metodo.toUpperCase()} realizado com sucesso!`);
    setValorFormatado('R$ 0,00');
    setFavorecido('');
    setErroEmail(false);
  };

  const excedeuSaldo = metodo !== 'deposito' && currencyToNumber(valorFormatado) > saldo;

  return (
    <div className={startStyles.container}>
      <div className={startStyles.mainContent}>
        <BalanceHero />
        
        <div className={styles.transferSection}>
          <div className={styles.header}>
            <h2 className={styles.title}>Nova Operação</h2>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Tipo de transação</label>
              <select 
                value={metodo} 
                onChange={(e) => { setMetodo(e.target.value); setFavorecido(''); }}
              >
                <option value="pix">PIX</option>
                <option value="doc">DOC</option>
                <option value="deposito">Depósito</option>
              </select>
            </div>

            {metodo !== 'deposito' && (
              <div className={styles.fadeAnim}>
                <div className={styles.inputGroup}>
                  <label>Destino por:</label>
                  <div className={styles.radioGroup}>
                    {['cpf', 'telefone', 'email'].map((tipo) => (
                      <label key={tipo} className={styles.radioLabel}>
                        <input 
                          type="radio" 
                          name="tipoChave" 
                          checked={tipoChave === tipo} 
                          onChange={() => { setTipoChave(tipo); setFavorecido(''); }} 
                        />
                        {tipo.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Dados do Favorecido</label>
                  <input 
                    type="text" 
                    placeholder={tipoChave === 'cpf' ? "000.000.000-00" : tipoChave === 'telefone' ? "(00) 00000-0000" : "email@exemplo.com"}
                    value={favorecido}
                    onChange={(e) => {
                      let val = e.target.value;
                      if(tipoChave === 'cpf') val = maskCPF(val);
                      if(tipoChave === 'telefone') val = maskPhone(val);
                      setFavorecido(val);
                    }}
                    className={erroEmail ? styles.inputError : ''}
                    required
                  />
                  {erroEmail && <span className={styles.errorText}>E-mail inválido.</span>}
                </div>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Valor</label>
              <input 
                type="text" 
                value={valorFormatado}
                onChange={handleValorChange}
                className={`${styles.valueInput} ${excedeuSaldo ? styles.inputError : ''}`}
                required
              />
              {excedeuSaldo && <span className={styles.errorText}>Valor excede o saldo disponível!</span>}
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={excedeuSaldo}
            >
              {metodo === 'deposito' ? 'Concluir Depósito' : 'Concluir Transferência'}
            </button>

            {/* Inserção dos Favoritos dentro da seção branca para manter o design */}
            <Favorites onSelect={(chave) => setFavorecido(chave)} />
          </form>
        </div>
      </div>

      <aside className={startStyles.extratoAside}>
        <Extrato />
      </aside>
    </div>
  );
}