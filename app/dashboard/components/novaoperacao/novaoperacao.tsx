'use client';
import React, { useState } from 'react';
import styles from './novaoperacao.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { adicionarTransacao } from '@/app/store/bancoslice';
import { maskCurrency, currencyToNumber } from '@/app/utils/mask';
// Ícones trazem o ar profissional que buscamos
import { Star, Search, ArrowUpRight, ArrowDownLeft, UserPlus, Users } from 'lucide-react';

export default function NovaOperacao() {
  const [tabAtiva, setTabAtiva] = useState('contatos');
  const [valor, setValor] = useState('R$ 0,00');
  const [metodo, setMetodo] = useState('pix');
  const [busca, setBusca] = useState('');

  // Simulação de contatos - em um app real, viria do banco de dados
  const [contatos, setContatos] = useState([
    { id: 1, nome: 'Arthur Silva', inicial: 'A', favorito: true },
    { id: 2, nome: 'Beatriz Lima', inicial: 'B', favorito: false },
    { id: 3, nome: 'Carlos Souza', inicial: 'C', favorito: true },
    { id: 4, nome: 'Diana Rosa', inicial: 'D', favorito: false },
  ]);

  const dispatch = useDispatch();
  const saldo = useSelector((state: RootState) => state.banco.saldo);

  const toggleFavorito = (id: number) => {
    setContatos(contatos.map(c => c.id === id ? { ...c, favorito: !c.favorito } : c));
  };

  const handleConcluir = () => {
    const valorNum = currencyToNumber(valor);
    if (valorNum <= 0) return alert("Digite um valor");
    if (valorNum > saldo && metodo !== 'deposito') return alert("Saldo insuficiente");

    dispatch(adicionarTransacao({
      tipo: metodo,
      valor: valorNum,
      favorecido: "Transferência realizada"
    }));

    setValor('R$ 0,00');
    alert("Operação realizada com sucesso!");
  };

  return (
    <div className={styles.container}>
      {/* Cabeçalho de Seleção de Método (Botões em vez de Select) */}
      <div className={styles.methodToggle}>
        <button 
          className={metodo === 'pix' ? styles.activeMethod : ''} 
          onClick={() => setMetodo('pix')}
        >
          <ArrowUpRight size={18} /> Transferir (Pix/TED)
        </button>
        <button 
          className={metodo === 'deposito' ? styles.activeMethod : ''} 
          onClick={() => setMetodo('deposito')}
        >
          <ArrowDownLeft size={18} /> Depositar
        </button>
      </div>

      <div className={styles.cardMain}>
        {/* Abas Internas */}
        <div className={styles.tabs}>
          <button className={tabAtiva === 'contatos' ? styles.activeTab : ''} onClick={() => setTabAtiva('contatos')}>
            <Users size={16} /> Contatos
          </button>
          <button className={tabAtiva === 'nova' ? styles.activeTab : ''} onClick={() => setTabAtiva('nova')}>
            <UserPlus size={16} /> Nova conta
          </button>
        </div>

        {/* Busca de Contatos */}
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou CPF..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* Lista de Contatos Dinâmica */}
        <div className={styles.scrollArea}>
          {contatos.filter(c => c.nome.toLowerCase().includes(busca.toLowerCase())).map(contato => (
            <div key={contato.id} className={styles.contactItem}>
              <div className={styles.avatar}>{contato.inicial}</div>
              <div className={styles.contactInfo}>
                <span className={styles.name}>{contato.nome}</span>
                <span className={styles.bank}>Bytebank • Ag 0001</span>
              </div>
              <button 
                className={`${styles.starBtn} ${contato.favorito ? styles.isFav : ''}`}
                onClick={() => toggleFavorito(contato.id)}
              >
                <Star size={20} fill={contato.favorito ? "#47A138" : "none"} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer de Valor (Onde a mágica acontece) */}
      <div className={styles.actionFooter}>
        <div className={styles.inputValueArea}>
          <label>Valor da operação</label>
          <input 
            type="text" 
            value={valor} 
            onChange={(e) => setValor(maskCurrency(e.target.value))} 
            className={styles.mainInput}
          />
        </div>
        <button onClick={handleConcluir} className={styles.confirmBtn}>
          Confirmar {metodo === 'pix' ? 'Envio' : 'Depósito'}
        </button>
      </div>
    </div>
  );
}