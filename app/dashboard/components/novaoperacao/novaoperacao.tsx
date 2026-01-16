'use client';
import React, { useState, useEffect } from 'react';
import styles from './novaoperacao.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { adicionarTransacao } from '@/app/store/bancoslice';
import { maskCurrency, currencyToNumber } from '@/app/utils/mask';
import { 
  Star, Search, ArrowRightLeft, QrCode, ArrowDownCircle, 
  CheckCircle2, Copy, Wallet, Download, Share2, Plus, 
  ClipboardList, Landmark, UserPlus
} from 'lucide-react';

export default function NovaOperacao() {
  const [isClient, setIsClient] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [metodo, setMetodo] = useState<'transferir' | 'pix' | 'deposito'>('transferir');
  const [subMetodo, setSubMetodo] = useState('contatos');
  
  const [valor, setValor] = useState('R$ 0,00');
  const [busca, setBusca] = useState('');
  const [chavePix, setChavePix] = useState('');
  const [contatoSelecionado, setContatoSelecionado] = useState<any>(null);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const dispatch = useDispatch();
  const { saldo } = useSelector((state: RootState) => state.banco);

  const [contatos, setContatos] = useState([
    { id: 1, nome: 'Arthur Silva', inicial: 'A', favorito: true, banco: 'Bytebank' },
    { id: 2, nome: 'Beatriz Lima', inicial: 'B', favorito: false, banco: 'Bytebank' },
    { id: 3, nome: 'Carlos Souza', inicial: 'C', favorito: true, banco: 'Bytebank' },
  ]);

  useEffect(() => setIsClient(true), []);

  const toggleFavorito = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setContatos(prev => prev.map(c => c.id === id ? { ...c, favorito: !c.favorito } : c));
  };

  const handleConcluir = () => {
    const valorNum = currencyToNumber(valor);
    if (valorNum <= 0) return alert("Digite um valor válido");
    
    const transacao = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      tipo: metodo,
      valor: valorNum,
      favorecido: metodo === 'deposito' ? "Minha Conta" : (contatoSelecionado?.nome || chavePix || "Chave Pix"),
      data: new Date().toLocaleDateString('pt-BR'),
    };

    dispatch(adicionarTransacao(transacao));
    setLastTransaction(transacao);
    setIsSuccess(true);
  };

  if (!isClient) return null;

  if (isSuccess) {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.receiptCard}>
          <div className={styles.receiptHeader}>
            <div className={styles.checkIcon}><CheckCircle2 size={52} strokeWidth={2.5} /></div>
            <h2>Pagamento realizado</h2>
            <span className={styles.date}>{lastTransaction.data}</span>
          </div>

          <div className={styles.receiptDivider}>
            <div className={styles.circleLeft}></div>
            <div className={styles.dashedLine}></div>
            <div className={styles.circleRight}></div>
          </div>

          <div className={styles.receiptBody}>
            <div className={styles.receiptRow}>
              <span>Valor</span>
              <strong className={styles.value}>R$ {lastTransaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>Para</span>
              <strong>{lastTransaction.favorecido}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>ID Transação</span>
              <code className={styles.transactionId}>{lastTransaction.id}</code>
            </div>
          </div>

          <div className={styles.receiptActions}>
            <div className={styles.actionGroup}>
              <button className={styles.secondaryBtn} onClick={() => alert("PDF gerado")}><Download size={18} /> PDF</button>
              <button className={styles.secondaryBtn} onClick={() => alert("Copiado")}><Share2 size={18} /> Enviar</button>
            </div>
            <button className={styles.primaryBtn} onClick={() => { setIsSuccess(false); setValor('R$ 0,00'); }}>
              <Plus size={20} /> Nova Transação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.navHeader}>
        <button className={metodo === 'transferir' ? styles.active : ''} onClick={() => { setMetodo('transferir'); setSubMetodo('contatos'); }}>
          <ArrowRightLeft size={18} /> Transferir
        </button>
        <button className={metodo === 'pix' ? styles.active : ''} onClick={() => { setMetodo('pix'); setSubMetodo('contatos'); }}>
          <QrCode size={18} /> Pix
        </button>
        <button className={metodo === 'deposito' ? styles.active : ''} onClick={() => { setMetodo('deposito'); setSubMetodo('conta'); }}>
          <ArrowDownCircle size={18} /> Depositar
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.tabsRow}>
          {metodo !== 'deposito' && (
            <>
              <button className={subMetodo === 'contatos' ? styles.activeTab : ''} onClick={() => setSubMetodo('contatos')}>
                <UserPlus size={14} /> Contatos
              </button>
              <button className={subMetodo === 'favoritos' ? styles.activeTab : ''} onClick={() => setSubMetodo('favoritos')}>
                <Star size={14} /> Favoritos
              </button>
              {metodo === 'pix' && (
                <button className={subMetodo === 'copiacola' ? styles.activeTab : ''} onClick={() => setSubMetodo('copiacola')}>
                  <Copy size={14} /> Copia e Cola
                </button>
              )}
            </>
          )}
        </div>

        <div className={styles.formArea}>
          {subMetodo === 'copiacola' ? (
            <div className={styles.fieldGroup}>
              <label>Cole o código Pix</label>
              <textarea placeholder="00020126580014br.gov.bcb.pix..." value={chavePix} onChange={(e) => setChavePix(e.target.value)} />
            </div>
          ) : metodo !== 'deposito' ? (
            <div className={styles.listSection}>
              {metodo === 'pix' && (
                <div className={styles.fieldGroup}>
                  <label>Chave Pix</label>
                  <input type="text" placeholder="CPF, e-mail ou telefone" value={chavePix} onChange={(e) => setChavePix(e.target.value)} />
                </div>
              )}
              <div className={styles.searchBox}>
                <Search size={16} />
                <input type="text" placeholder="Buscar contato..." value={busca} onChange={(e) => setBusca(e.target.value)} />
              </div>
              <div className={styles.scroller}>
                {contatos
                  .filter(c => subMetodo === 'favoritos' ? c.favorito : true)
                  .filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))
                  .map(c => (
                  <div key={c.id} className={`${styles.item} ${contatoSelecionado?.id === c.id ? styles.selected : ''}`} onClick={() => setContatoSelecionado(c)}>
                    <div className={styles.avatar}>{c.inicial}</div>
                    <div className={styles.info}><strong>{c.nome}</strong><span>{c.banco}</span></div>
                    <button className={`${styles.star} ${c.favorito ? styles.isFav : ''}`} onClick={(e) => toggleFavorito(c.id, e)}>
                      <Star size={18} fill={c.favorito ? "#47A138" : "none"} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.accountBox}>
              <Landmark size={24} color="#47A138" />
              <p><strong>Minha Conta Bytebank</strong></p>
              <span>Agência: 0001 | Conta: 12345-6</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.amountInput}>
          <label>Valor da operação</label>
          <input type="text" value={valor} onChange={(e) => setValor(maskCurrency(e.target.value))} />
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}><Wallet size={14}/> Saldo: <strong>R$ {saldo.toLocaleString('pt-BR')}</strong></div>
          <div className={styles.stat}><ClipboardList size={14}/> Limite: <strong>R$ 5.000,00</strong></div>
        </div>
        <button onClick={handleConcluir} className={styles.mainBtn}>Confirmar Pagamento</button>
      </div>
    </div>
  );
}