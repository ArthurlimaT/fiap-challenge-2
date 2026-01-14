'use client';
import React, { useState, useEffect } from 'react';
import styles from './transfer.module.scss';
import startStyles from '../start/start.module.scss';
import BalanceHero from '../start/balancehero';
import Extrato from '../extrato/extrato';
import Favorites from '../common/favorites';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store';
import { adicionarTransacao, salvarFavorito } from '@/app/store/bancoslice';
import { maskCPF, maskPhone, validateEmail, maskCurrency, currencyToNumber } from '@/app/utils/mask';
import { ArrowRightLeft, Landmark, Wallet, AlertCircle } from 'lucide-react';

export default function TransferDashboard() {
  const dispatch = useDispatch();
  const saldo = useSelector((state: RootState) => state.banco.saldo);
  
  const [metodo, setMetodo] = useState('pix');
  const [tipoChave, setTipoChave] = useState('cpf');
  const [favorecido, setFavorecido] = useState('');
  const [valorFormatado, setValorFormatado] = useState('R$ 0,00');
  const [erroEmail, setErroEmail] = useState(false);

  const valorNumerico = currencyToNumber(valorFormatado);
  const excedeuSaldo = metodo !== 'deposito' && valorNumerico > saldo;

  // Limpa o favorecido ao mudar o tipo de chave ou método
  useEffect(() => {
    setFavorecido('');
    setErroEmail(false);
  }, [metodo, tipoChave]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (metodo !== 'deposito' && (excedeuSaldo || valorNumerico <= 0)) return;
    if (metodo !== 'deposito' && tipoChave === 'email' && !validateEmail(favorecido)) {
      setErroEmail(true);
      return;
    }

    dispatch(adicionarTransacao({
      tipo: metodo,
      valor: valorNumerico,
      favorecido: favorecido || 'Minha conta'
    }));

    if (metodo !== 'deposito' && favorecido) {
      const nomeExibicao = favorecido.includes('@') ? favorecido.split('@')[0] : favorecido;
      dispatch(salvarFavorito({ nome: nomeExibicao, chave: favorecido }));
    }
    
    alert(`Sucesso! Operação de ${metodo.toUpperCase()} concluída.`);
    setValorFormatado('R$ 0,00');
    setFavorecido('');
  };

  return (
    <div className={startStyles.dashboardGrid}>
      <div className={startStyles.mainColumn}>
        <BalanceHero />
        
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Transferir ou Depositar</h2>
            <p className={styles.subtitle}>Escolha como deseja movimentar seu dinheiro</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* SELETOR DE MÉTODO TIPO 'CHIPS' */}
            <div className={styles.methodSelector}>
              {[
                { id: 'pix', label: 'Pix', icon: <ArrowRightLeft size={18} /> },
                { id: 'doc', label: 'TED/DOC', icon: <Landmark size={18} /> },
                { id: 'deposito', label: 'Depósito', icon: <Wallet size={18} /> },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`${styles.methodBtn} ${metodo === m.id ? styles.activeMethod : ''}`}
                  onClick={() => setMetodo(m.id)}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            <div className={styles.formBody}>
              {metodo !== 'deposito' && (
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.stepNumber}>1</span>
                    <h3>Dados do destinatário</h3>
                  </div>

                  <div className={styles.keySelector}>
                    {['cpf', 'telefone', 'email'].map((tipo) => (
                      <button
                        key={tipo}
                        type="button"
                        className={`${styles.keyBtn} ${tipoChave === tipo ? styles.activeKey : ''}`}
                        onClick={() => setTipoChave(tipo)}
                      >
                        {tipo.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className={styles.inputWrapper}>
                    <input 
                      type="text" 
                      placeholder={tipoChave === 'cpf' ? "000.000.000-00" : tipoChave === 'telefone' ? "(00) 00000-0000" : "Digite o e-mail"}
                      value={favorecido}
                      onChange={(e) => {
                        let val = e.target.value;
                        if(tipoChave === 'cpf') val = maskCPF(val);
                        if(tipoChave === 'telefone') val = maskPhone(val);
                        setFavorecido(val);
                      }}
                      className={erroEmail ? styles.inputError : ''}
                    />
                    {erroEmail && <div className={styles.errorMsg}><AlertCircle size={14}/> E-mail inválido</div>}
                  </div>
                  
                  <Favorites onSelect={(chave) => setFavorecido(chave)} />
                </section>
              )}

              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.stepNumber}>{metodo === 'deposito' ? '1' : '2'}</span>
                  <h3>Quanto deseja {metodo === 'deposito' ? 'depositar' : 'enviar'}?</h3>
                </div>

                <div className={`${styles.valueContainer} ${excedeuSaldo ? styles.valueError : ''}`}>
                  <input 
                    type="text" 
                    value={valorFormatado}
                    onChange={(e) => setValorFormatado(maskCurrency(e.target.value))} 
                    className={styles.mainValueInput}
                  />
                  {excedeuSaldo && (
                    <div className={styles.balanceWarning}>
                      <AlertCircle size={16} /> Saldo insuficiente (Disponível: R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                    </div>
                  )}
                </div>
              </section>

              <button 
                type="submit" 
                className={styles.confirmBtn}
                disabled={excedeuSaldo || valorNumerico <= 0}
              >
                Confirmar {metodo.toUpperCase()}
              </button>
            </div>
          </form>
        </div>
      </div>

      <aside className={startStyles.sideColumn}>
        <Extrato />
      </aside>
    </div>
  );
}