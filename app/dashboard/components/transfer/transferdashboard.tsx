'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { adicionarTransacao, salvarFavorito } from '@/app/store/bancoslice';
import { maskCurrency, currencyToNumber } from '@/app/utils/mask';
import styles from './transfer.module.scss';
import { 
  Star, Search, ArrowRightLeft, QrCode, ArrowDownCircle, 
  CheckCircle2, Copy, Wallet, Download, Share2, Plus, 
  ClipboardList, Landmark, UserPlus, AlertCircle, X
} from 'lucide-react';

export default function TransferDashboard() {
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

  // Lista de contatos local (poderia vir do Redux)
  const [contatos, setContatos] = useState([
    { id: 1, nome: 'Arthur Silva', inicial: 'A', favorito: true, banco: 'Bytebank' },
    { id: 2, nome: 'Beatriz Lima', inicial: 'B', favorito: false, banco: 'Bytebank' },
    { id: 3, nome: 'Carlos Souza', inicial: 'C', favorito: true, banco: 'Bytebank' },
    { id: 4, nome: 'Diana Pereira', inicial: 'D', favorito: false, banco: 'Bytebank' },
  ]);

  useEffect(() => setIsClient(true), []);

  const valorNum = currencyToNumber(valor);
  const excedeuSaldo = metodo !== 'deposito' && valorNum > saldo;

  const handleConcluir = () => {
    if (valorNum <= 0) return alert("Digite um valor válido");
    if (excedeuSaldo) return;

    // Determina o nome do favorecido
    let favorecidoNome = "Minha Conta";
    if (metodo !== 'deposito') {
      favorecidoNome = contatoSelecionado ? contatoSelecionado.nome : (chavePix || "Chave Pix");
    }

    const transacao = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      tipo: metodo === 'transferir' ? 'doc' : metodo,
      valor: valorNum,
      favorecido: favorecidoNome,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      categoria: metodo === 'deposito' ? 'Depósito' : 'Transferência'
    };

    // Envia para o Redux
    dispatch(adicionarTransacao(transacao));
    
    // Se for um novo nome, salva nos favoritos do Redux
    if (contatoSelecionado) {
      dispatch(salvarFavorito({ nome: contatoSelecionado.nome, chave: favorecidoNome }));
    }

    setLastTransaction(transacao);
    setIsSuccess(true);
  };

  if (!isClient) return null;

  // TELA DE COMPROVANTE (SUCESSO)
  if (isSuccess) {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.receiptCard}>
          <div className={styles.receiptHeader}>
            <div className={styles.checkIcon}><CheckCircle2 size={52} strokeWidth={2.5} /></div>
            <h2>Pagamento realizado</h2>
            <span className={styles.date}>{lastTransaction.data} às {lastTransaction.hora}</span>
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
              <span>Tipo de operação</span>
              <strong style={{textTransform: 'uppercase'}}>{lastTransaction.tipo}</strong>
            </div>
            <div className={styles.receiptRow}>
              <span>ID Transação</span>
              <code className={styles.transactionId}>{lastTransaction.id}</code>
            </div>
          </div>

          <div className={styles.receiptActions}>
            <div className={styles.actionGroup}>
              <button className={styles.secondaryBtn} onClick={() => window.print()}><Download size={18} /> PDF</button>
              <button className={styles.secondaryBtn} onClick={() => alert("Link de compartilhamento copiado!")}><Share2 size={18} /> Enviar</button>
            </div>
            <button className={styles.primaryBtn} onClick={() => { setIsSuccess(false); setValor('R$ 0,00'); setContatoSelecionado(null); setChavePix(''); }}>
              <Plus size={20} /> Nova Transação
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* SELETOR DE MÉTODO SUPERIOR */}
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
        {/* TABS DE FILTRO (CONTATOS/FAVORITOS) */}
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
              <textarea 
                placeholder="00020126580014br.gov.bcb.pix..." 
                value={chavePix} 
                onChange={(e) => setChavePix(e.target.value)} 
              />
            </div>
          ) : metodo !== 'deposito' ? (
            <div className={styles.listSection}>
              {metodo === 'pix' && (
                <div className={styles.fieldGroup}>
                  <label>Chave Pix</label>
                  <input 
                    type="text" 
                    placeholder="CPF, e-mail ou telefone" 
                    value={chavePix} 
                    onChange={(e) => setChavePix(e.target.value)} 
                  />
                </div>
              )}
              
              <div className={styles.searchBox}>
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Buscar contato..." 
                  value={busca} 
                  onChange={(e) => setBusca(e.target.value)} 
                />
              </div>

              <div className={styles.scroller}>
                {contatos
                  .filter(c => subMetodo === 'favoritos' ? c.favorito : true)
                  .filter(c => c.nome.toLowerCase().includes(busca.toLowerCase()))
                  .map(c => (
                  <div 
                    key={c.id} 
                    className={`${styles.item} ${contatoSelecionado?.id === c.id ? styles.selected : ''}`} 
                    onClick={() => setContatoSelecionado(c)}
                  >
                    <div className={styles.avatar}>{c.inicial}</div>
                    <div className={styles.info}>
                      <strong>{c.nome}</strong>
                      <span>{c.banco}</span>
                    </div>
                    {contatoSelecionado?.id === c.id ? (
                      <CheckCircle2 size={20} color="#47A138" />
                    ) : (
                      <Star 
                        size={18} 
                        fill={c.favorito ? "#47A138" : "none"} 
                        color={c.favorito ? "#47A138" : "#d1d5db"} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.accountBox}>
              <Landmark size={40} color="#47A138" />
              <p><strong>Minha Conta Bytebank</strong></p>
              <span>Agência: 0001 | Conta: 12345-6</span>
            </div>
          )}
        </div>
      </div>

      {/* RODAPÉ ESCURO COM INPUT DE VALOR */}
      <div className={styles.footer}>
        <div className={styles.amountInput}>
          <label>Valor da operação</label>
          <div className={styles.inputFlex}>
             <input 
                type="text" 
                value={valor} 
                onChange={(e) => setValor(maskCurrency(e.target.value))} 
                className={excedeuSaldo ? styles.inputError : ''}
              />
              {valorNum > 0 && (
                <button className={styles.clearVal} onClick={() => setValor('R$ 0,00')}><X size={20}/></button>
              )}
          </div>
          {excedeuSaldo && (
            <span className={styles.errorText}><AlertCircle size={14} /> Saldo insuficiente</span>
          )}
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <Wallet size={14}/> Saldo: <strong>R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
          </div>
          <div className={styles.stat}>
            <ClipboardList size={14}/> Limite: <strong>R$ 5.000,00</strong>
          </div>
        </div>

        <button 
          onClick={handleConcluir} 
          className={styles.mainBtn}
          disabled={excedeuSaldo || valorNum <= 0}
        >
          {metodo === 'deposito' ? 'Confirmar Depósito' : 'Confirmar Pagamento'}
        </button>
      </div>
    </div>
  );
}