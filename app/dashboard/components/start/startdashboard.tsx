'use client';
import React, { useState, useEffect } from 'react';
import styles from './start.module.scss'; 
import BalanceHero from './balancehero';
import Extrato from '../extrato/extrato';


import { 
  Target, AlertTriangle, Settings2, TrendingUp, ShieldCheck, 
  Plus, Check, LayoutGrid, ArrowRightLeft, Receipt, 
  CreditCard, Smartphone, ShieldAlert, Sparkles, ChevronRight,
  Banknote, Phone, Box
} from 'lucide-react';

export default function StartDashboard({ setActiveView }: any) {
  const [mounted, setMounted] = useState(false);
  const [dataAtual, setDataAtual] = useState('');
  const [userName, setUserName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  const [activeWidgets, setActiveWidgets] = useState({
    metas: true,
    gastos: true,
    investimentos: false,
    seguros: false
  });

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name.split(' ')[0]);
    }

    const agora = new Date();
    setDataAtual(agora.toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }));
  }, []);

  const toggleWidget = (name: keyof typeof activeWidgets) => {
    setActiveWidgets(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (!mounted) return <div className={styles.dashboardGrid}></div>;

  return (
    <div className={styles.dashboardGrid}>
      <main className={styles.mainColumn}>
        
        <header className={styles.headerSimples}>
          <div className={styles.welcomeText}>
            <h1>Olá, {userName || 'Bruna'}! 👋</h1>
            <p className={styles.dateText}>{dataAtual}</p>
          </div>
        </header>

        <section className={styles.heroSection}>
          <BalanceHero />
        </section>

        {/* 1. ATALHOS RÁPIDOS - CORES DO EXTRATO + CLIQUES */}
        <section className={styles.quickActions}>
          <div className={styles.actionItem} onClick={() => setActiveView?.('transfer')}>
            <div className={styles.iconCircle}><ArrowRightLeft size={24} /></div>
            <span>Transferir</span>
          </div>

          <div className={styles.actionItem} onClick={() => setActiveView?.('transfer')}>
            <div className={styles.iconCircle}><Receipt size={24} /></div>
            <span>Pagar</span>
          </div>

          <div className={styles.actionItem} onClick={() => setActiveView?.('transfer')}>
            <div className={styles.iconCircle}><Plus size={24} /></div>
            <span>Depositar</span>
          </div>

          <div className={styles.actionItem} onClick={() => setActiveView?.('services')}>
            <div className={styles.iconCircle}><Smartphone size={24} /></div>
            <span>Virtual</span>
          </div>

          <div className={styles.actionItem} onClick={() => setActiveView?.('services')}>
            <div className={styles.iconCircle}><Banknote size={24} /></div>
            <span>Empréstimo</span>
          </div>

          <div className={styles.actionItem} onClick={() => setActiveView?.('services')}>
            <div className={styles.iconCircle}><Phone size={24} /></div>
            <span>Recarga</span>
          </div>

          <div className={styles.actionItem} onClick={() => setActiveView?.('services')}>
            <div className={styles.iconCircle}><Box size={24} /></div>
            <span>Caixinha</span>
          </div>
        </section>

        {/* 2. CAMPANHAS DE SEGURO */}
        <section className={styles.merchContainer}>
          <div className={`${styles.merchCard} ${styles.bgGradientGreen}`} onClick={() => setActiveView?.('services')}>
            <div className={styles.merchInfo}>
              <div className={styles.merchBadge}><Sparkles size={12} /> Sugestão</div>
              <h4>Seguro Vida Byte</h4>
              <p>Proteção por R$ 9,90/mês.</p>
            </div>
            <ChevronRight size={20} />
          </div>
          <div className={`${styles.merchCard} ${styles.bgGradientDark}`} onClick={() => setActiveView?.('services')}>
            <div className={styles.merchInfo}>
              <div className={styles.merchBadge}><ShieldAlert size={12} /> Segurança</div>
              <h4>Seguro Transações</h4>
              <p>Proteja seu Pix e cartões.</p>
            </div>
            <ChevronRight size={20} />
          </div>
        </section>

        {/* 3. CARTÃO DE CRÉDITO */}
        <section className={styles.creditInfoCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <CreditCard size={18} color="#47A138" />
              <h3>Cartão de Crédito</h3>
            </div>
            <span className={styles.vencimento}>Vence em 15/02</span>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.faturaInfo}>
              <div>
                <p className={styles.labelFatura}>Fatura atual</p>
                <h2 className={styles.valorFatura}>R$ 1.420,50</h2>
              </div>
              <button className={styles.faturaBtn} onClick={() => setActiveView?.('services')}>Meus Cartões</button>
            </div>
            <div className={styles.limitUsage}>
              <div className={styles.barBackground}>
                <div className={styles.barFill} style={{ width: '65%' }}></div>
              </div>
              <div className={styles.barLabels}>
                <span>Limite usado: R$ 1.420</span>
                <span>Disponível: R$ 850,00</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. MEUS WIDGETS */}
        <section className={styles.abaSection}>
          <div className={styles.abaHeader}>
            <div className={styles.abaTitle}>
              <LayoutGrid size={20} className={styles.iconVerde} />
              <h2>Meus Widgets</h2>
            </div>
            <button 
              className={`${styles.personalizarBtn} ${showSettings ? styles.btnAtivo : ''}`} 
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 size={16} />
              <span>{showSettings ? 'Salvar' : 'Personalizar'}</span>
            </button>
          </div>

          {showSettings && (
            <div className={styles.menuConfig}>
              <div className={styles.configOptions}>
                {[
                  { id: 'metas', label: 'Metas' },
                  { id: 'gastos', label: 'Limites' },
                  { id: 'investimentos', label: 'Investimentos' },
                  { id: 'seguros', label: 'Seguros' },
                ].map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => toggleWidget(opt.id as any)} 
                    className={activeWidgets[opt.id as keyof typeof activeWidgets] ? styles.optAtiva : ''}
                  >
                    {activeWidgets[opt.id as keyof typeof activeWidgets] ? <Check size={14} /> : <Plus size={14} />}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.widgetsGrid}>
            {activeWidgets.metas && (
              <div className={styles.widgetCard}>
                <div className={styles.cardTop}>
                  <Target size={18} color="#47A138" />
                  <h3>Meta de Reserva</h3>
                </div>
                <div className={styles.widgetBody}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: '45%' }}></div>
                  </div>
                  <p>R$ 2.250 de R$ 5.000</p>
                </div>
              </div>
            )}

            {activeWidgets.gastos && (
              <div className={`${styles.widgetCard} ${styles.alerta}`}>
                <div className={styles.cardTop}>
                  <AlertTriangle size={18} color="#F59E0B" />
                  <h3>Limite de Gastos</h3>
                </div>
                <p>Lazer: 85% do limite atingido.</p>
              </div>
            )}
            
            {activeWidgets.investimentos && (
              <div className={styles.widgetCard}>
                <div className={styles.cardTop}>
                  <TrendingUp size={18} color="#47A138" />
                  <h3>Investimentos</h3>
                </div>
                <p>Rendimento de +1.25% este mês.</p>
              </div>
            )}

            {activeWidgets.seguros && (
              <div className={styles.widgetCard}>
                <div className={styles.cardTop}>
                  <ShieldCheck size={18} color="#47A138" />
                  <h3>Seguros</h3>
                </div>
                <p>Sua conta e cartões estão protegidos.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <aside className={styles.sideColumn}>
        <div className={styles.sticky}>
          <Extrato />
        </div>
      </aside>
    </div>
  );
}