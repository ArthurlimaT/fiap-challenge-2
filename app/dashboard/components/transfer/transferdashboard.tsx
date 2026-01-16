'use client';
import React, { useState } from 'react';
import { z } from 'zod';
import styles from './transfer.module.scss';
import startStyles from '../start/start.module.scss';
import BalanceHero from '../start/balancehero';
import Extrato from '../extrato/extrato';
import Favorites from '../common/favorites';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store';
import { adicionarTransacao, salvarFavorito } from '@/app/store/bancoslice';
import { maskCurrency, currencyToNumber } from '@/app/utils/mask';
import { 
  ArrowRightLeft, Landmark, Wallet, AlertCircle, 
  Search, MessageSquare, CheckCircle2, Download, Share2, Plus 
} from 'lucide-react';

const transferSchema = z.object({
  favorecido: z.string().min(5, "Destinatário inválido ou muito curto"),
  valor: z.number().positive("O valor deve ser maior que zero"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  mensagem: z.string().max(100, "Mensagem muito longa").optional(),
});

const CATEGORIAS_SUGERIDAS = ['Alimentação', 'Aluguel', 'Lazer', 'Saúde', 'Educação', 'Transporte', 'Presentes'];

export default function TransferDashboard() {
  const dispatch = useDispatch();
  const saldo = useSelector((state: RootState) => state.banco.saldo);
  
  const [metodo, setMetodo] = useState('pix');
  const [favorecido, setFavorecido] = useState('');
  const [valorFormatado, setValorFormatado] = useState('R$ 0,00');
  const [categoria, setCategoria] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const valorNumerico = currencyToNumber(valorFormatado);
  const excedeuSaldo = metodo !== 'deposito' && valorNumerico > saldo;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = transferSchema.safeParse({ favorecido, valor: valorNumerico, categoria, mensagem });

    if (!result.success) {
      const formattedErrors: any = {};
      result.error.issues.forEach(issue => { formattedErrors[issue.path[0]] = issue.message; });
      setErrors(formattedErrors);
      return;
    }

    if (metodo !== 'deposito' && excedeuSaldo) return;

    const novaTransacao = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      tipo: metodo,
      valor: valorNumerico,
      favorecido: favorecido || 'Minha conta',
      categoria,
      mensagem,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    dispatch(adicionarTransacao(novaTransacao));
    if (metodo !== 'deposito' && favorecido) {
      dispatch(salvarFavorito({ nome: favorecido.split(' ')[0], chave: favorecido }));
    }

    setLastTransaction(novaTransacao);
    setIsSuccess(true);
    setErrors({});
  };

  // Função para gerar o "Recibo" em formato de texto para download
  const handleDownloadReceipt = () => {
    const conteudo = `
      COMPROVANTE DE TRANSAÇÃO - BYTEBANK
      ----------------------------------
      ID: ${lastTransaction.id}
      Data: ${lastTransaction.data} às ${lastTransaction.hora}
      Tipo: ${lastTransaction.tipo.toUpperCase()}
      Favorecido: ${lastTransaction.favorecido}
      Valor: R$ ${lastTransaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      Categoria: ${lastTransaction.categoria}
      Mensagem: ${lastTransaction.mensagem || 'Sem mensagem'}
      ----------------------------------
    `;
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recibo_${lastTransaction.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={startStyles.dashboardGrid}>
      <div className={startStyles.mainColumn}>
        <BalanceHero />
        
        <div className={styles.container}>
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.header}>
                <h2 className={styles.title}>Nova Transferência</h2>
              </div>

              <div className={styles.methodSelector}>
                {['pix', 'doc', 'deposito'].map((m) => (
                  <button
                    key={m} type="button"
                    className={`${styles.methodBtn} ${metodo === m ? styles.activeMethod : ''}`}
                    onClick={() => setMetodo(m)}
                  >
                    {m === 'pix' ? <ArrowRightLeft size={18}/> : m === 'doc' ? <Landmark size={18}/> : <Wallet size={18}/>}
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className={styles.formBody}>
                {metodo !== 'deposito' && (
                  <div className={styles.inputWrapper}>
                    <label className={styles.label}>Para quem?</label>
                    <input 
                      type="text" placeholder="Nome ou CPF"
                      value={favorecido} onChange={(e) => setFavorecido(e.target.value)}
                    />
                    {errors.favorecido && <span className={styles.errorMsg}>{errors.favorecido}</span>}
                    <Favorites onSelect={(chave) => setFavorecido(chave)} />
                  </div>
                )}

                <div className={styles.autocompleteWrapper}>
                  <label className={styles.label}>Categoria</label>
                  <div className={styles.inputIconWrapper}>
                    <Search size={16} />
                    <input 
                      type="text" value={categoria} placeholder="Ex: Alimentação"
                      onChange={(e) => {setCategoria(e.target.value); setShowAutocomplete(true);}}
                    />
                  </div>
                  {showAutocomplete && categoria && (
                    <ul className={styles.suggestions}>
                      {CATEGORIAS_SUGERIDAS.filter(c => c.toLowerCase().includes(categoria.toLowerCase())).map(s => (
                        <li key={s} onClick={() => {setCategoria(s); setShowAutocomplete(false);}}>{s}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.inputWrapper}>
                  <label className={styles.label}>Mensagem (opcional)</label>
                  <div className={styles.inputIconWrapper}>
                    <MessageSquare size={16} />
                    <input 
                      type="text" placeholder="Adicione uma nota à transferência"
                      value={mensagem} onChange={(e) => setMensagem(e.target.value)}
                    />
                  </div>
                </div>

                <div className={`${styles.valueContainer} ${excedeuSaldo ? styles.valueError : ''}`}>
                  <input 
                    type="text" value={valorFormatado}
                    onChange={(e) => setValorFormatado(maskCurrency(e.target.value))} 
                    className={styles.mainValueInput}
                  />
                  {excedeuSaldo && <div className={styles.balanceWarning}><AlertCircle size={16} /> Saldo insuficiente</div>}
                </div>

                <button type="submit" className={styles.confirmBtn} disabled={excedeuSaldo || valorNumerico <= 0}>
                  Confirmar Envio
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.successScreen}>
              <CheckCircle2 size={70} color="#47A138" />
              <h2>Sucesso!</h2>
              <p>O valor de <strong>R$ {lastTransaction.valor.toLocaleString('pt-BR')}</strong> foi enviado.</p>
              
              <div className={styles.actionButtons}>
                <button className={styles.secondaryBtn} onClick={handleDownloadReceipt}>
                  <Download size={20} /> Baixar Recibo
                </button>

                <button className={styles.secondaryBtn} onClick={() => alert("Comprovante copiado!")}>
                  <Share2 size={20} /> Compartilhar
                </button>

                <button 
                  className={styles.confirmBtn} 
                  onClick={() => { setIsSuccess(false); setValorFormatado('R$ 0,00'); setFavorecido(''); setCategoria(''); setMensagem(''); }}
                >
                  <Plus size={20} /> Nova Transação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <aside className={startStyles.sideColumn}><Extrato /></aside>
    </div>
  );
}