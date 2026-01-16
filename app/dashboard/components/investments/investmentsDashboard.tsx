'use client';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store/store';
import { realizarInvestimento, resgatarInvestimento } from '@/app/store/bancoslice';
import styles from './investment.module.scss';
import BalanceHero from '../start/balancehero';
import InvestmentStats from './investmentStats';
import InvestmentModal from './investmentsModal';
import { TrendingUp, Wallet, Plus, Coins, Landmark, Bitcoin } from 'lucide-react';

// Dados iniciais padrão (usados apenas na primeira vez)
const initialPortfolio = [
  { id: 'tesouro', name: 'Tesouro', value: 35, amount: 17500, color: '#47A138', icon: <Landmark /> },
  { id: 'acoes', name: 'Ações', value: 25, amount: 12500, color: '#6366F1', icon: <TrendingUp /> },
  { id: 'fiis', name: 'FIIs', value: 20, amount: 10000, color: '#F59E0B', icon: <Coins /> },
  { id: 'cripto', name: 'Cripto', value: 20, amount: 10000, color: '#E11D48', icon: <Bitcoin /> },
];

export default function InvestmentsDashboard() {
  const dispatch = useDispatch();
  const saldoContaCorrente = useSelector((state: RootState) => state.banco.saldo);

  // Estados
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [sessionFlow, setSessionFlow] = useState({ invested: 0, redeemed: 0 });
  const [isLoaded, setIsLoaded] = useState(false); // Para evitar piscar a tela

  // 1. CARREGAR DADOS SALVOS (Ao abrir a página)
  useEffect(() => {
    const savedData = localStorage.getItem('userPortfolio');
    if (savedData) {
      // Precisamos reconstruir os ícones pois JSON não salva componentes React
      const parsedData = JSON.parse(savedData);
      const restoredPortfolio = parsedData.map((item: any) => ({
        ...item,
        icon: getIconById(item.id) // Função auxiliar para recuperar o ícone
      }));
      setPortfolio(restoredPortfolio);
    }
    setIsLoaded(true);
  }, []);

  // 2. SALVAR DADOS (Sempre que o portfolio mudar)
  useEffect(() => {
    if (isLoaded) {
      // Salvamos tudo exceto o ícone (que é componente React)
      const dataToSave = portfolio.map(({ icon, ...rest }) => rest);
      localStorage.setItem('userPortfolio', JSON.stringify(dataToSave));
    }
  }, [portfolio, isLoaded]);

  // Auxiliar para recuperar ícones
  const getIconById = (id: string) => {
    switch(id) {
      case 'tesouro': return <Landmark />;
      case 'acoes': return <TrendingUp />;
      case 'fiis': return <Coins />;
      case 'cripto': return <Bitcoin />;
      default: return <Wallet />;
    }
  };

  const totalInvestido = portfolio.reduce((acc, item) => acc + item.amount, 0);

  const openInvestModal = (id: string) => {
    setSelectedAssetId(id);
    setIsModalOpen(true);
  };

  const handleOperation = (valor: number, tipo: 'investir' | 'resgatar') => {
    if (!selectedAssetId) return;

    const newPortfolio = portfolio.map(item => {
      if (item.id === selectedAssetId) {
        return { 
          ...item, 
          amount: tipo === 'investir' ? item.amount + valor : item.amount - valor 
        };
      }
      return item;
    });

    // Recalcula %
    const newTotal = newPortfolio.reduce((acc, curr) => acc + curr.amount, 0);
    const portfolioWithPercent = newPortfolio.map(item => ({
      ...item,
      value: newTotal > 0 ? parseFloat(((item.amount / newTotal) * 100).toFixed(1)) : 0
    }));

    setPortfolio(portfolioWithPercent);

    // Atualiza fluxo da sessão
    setSessionFlow(prev => ({
      invested: tipo === 'investir' ? prev.invested + valor : prev.invested,
      redeemed: tipo === 'resgatar' ? prev.redeemed + valor : prev.redeemed
    }));

    // Atualiza Redux
    const assetName = portfolio.find(p => p.id === selectedAssetId)?.name || 'Investimento';
    if (tipo === 'investir') {
      dispatch(realizarInvestimento({ valor, nomeInvestimento: assetName }));
    } else {
      dispatch(resgatarInvestimento({ valor, nomeInvestimento: assetName }));
    }
  };

  const selectedAsset = portfolio.find(p => p.id === selectedAssetId);

  if (!isLoaded) return null; // Evita erro de hidratação

  return (
    <div className={styles.premiumContainer}>
      <section className={styles.heroSection}>
        <BalanceHero />
      </section>

      <main className={styles.mainContent}>
        <header className={styles.premiumHeader}>
          <div className={styles.headerLabelGroup}>
            <Wallet className={styles.headerIcon} />
            <h1 className={styles.mainTitle}>Gestão de Patrimônio</h1>
          </div>
          <div className={styles.patrimonioHero}>
             <div className={styles.patrimonioInfo}>
                <span className={styles.patrimonioLabel}>Total Investido</span>
                <div className={styles.patrimonioValueGroup}>
                    <span className={styles.currency}>R$</span>
                    <span className={styles.bigValue}>
                      {totalInvestido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                </div>
             </div>
          </div>
        </header>

        <section className={styles.caixinhasSection}>
          <h3><Plus size={16}/> Carteira (Clique para operar)</h3>
          <div className={styles.caixinhasGrid}>
            {portfolio.map((item) => (
              <button 
                key={item.id} 
                className={styles.caixinhaCard}
                onClick={() => openInvestModal(item.id)}
                style={{borderColor: item.color}} 
              >
                <div className={styles.iconBox} style={{color: item.color, background: `${item.color}15`}}>
                  {item.icon}
                </div>
                <div className={styles.caixinhaInfo}>
                  <span className={styles.caixinhaName}>{item.name}</span>
                  <span className={styles.caixinhaValue}>R$ {item.amount.toLocaleString()}</span>
                </div>
                <div className={styles.addHover}>+</div>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.chartsSection}>
          <InvestmentStats data={portfolio} currentSessionFlow={sessionFlow} />
        </section>
      </main>

      <InvestmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleOperation}
        investimentoNome={selectedAsset?.name || ''}
        saldoDisponivel={saldoContaCorrente}
        saldoInvestido={selectedAsset?.amount || 0}
        cor={selectedAsset?.color || '#000'}
      />
    </div>
  );
}