'use client';
import React, { useState, useEffect } from 'react';
import styles from './start.module.scss'; 
import BalanceHero from './balancehero';
import Extrato from '../extrato/extrato';

import { 
  Target, AlertTriangle, Settings2, TrendingUp, ShieldCheck, 
  Plus, Check, LayoutGrid, ArrowRightLeft, Receipt, 
  CreditCard, Smartphone, ShieldAlert, Sparkles, ChevronRight,
  Banknote, Phone, Box, Users
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
      try {
        const user = JSON.parse(storedUser);
        if (user && user.name) {
          setUserName(user.name.split(' ')[0]);
        }
      } catch (e) { console.error(e); }
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
          </div>
        </header>

        <section className={styles.heroSection}>
          <BalanceHero />
        </section>

        {/* 1. ATALHOS RÁPIDOS */}
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
          <div className={styles.actionItem} onClick={() => setActiveView?.('services/mycards')}>
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
          <div className={styles.actionItem} onClick={() => setActiveView?.('investments')}>
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
              <button className={styles.faturaBtn} onClick={() => setActiveView?.('services/mycards')}>Meus Cartões</button>
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
                {['metas', 'gastos', 'investimentos', 'seguros'].map((id) => (
                  <button 
                    key={id}
                    onClick={() => toggleWidget(id as any)} 
                    className={activeWidgets[id as keyof typeof activeWidgets] ? styles.optAtiva : ''}
                  >
                    {activeWidgets[id as keyof typeof activeWidgets] ? <Check size={14} /> : <Plus size={14} />}
                    {id.charAt(0).toUpperCase() + id.slice(1)}
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
                  <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: '45%' }}></div></div>
                  <p>R$ 2.250 de R$ 5.000</p>
                </div>
              </div>
            )}
            {activeWidgets.gastos && (
              <div className={`${styles.widgetCard} ${styles.alerta}`}>
                <div className={styles.cardTop}><AlertTriangle size={18} color="#F59E0B" /><h3>Limite de Gastos</h3></div>
                <p>Lazer: 85% do limite atingido.</p>
              </div>
            )}
            {activeWidgets.investimentos && (
              <div className={styles.widgetCard}>
                <div className={styles.cardTop}><TrendingUp size={16} color="#47A138" /><h3>Rendimento</h3></div>
                <p>+1.25% este mês.</p>
              </div>
            )}
            {activeWidgets.seguros && (
              <div className={styles.widgetCard}>
                <div className={styles.cardTop}><ShieldCheck size={16} color="#47A138" /><h3>Seguros</h3></div>
                <p>Sua conta está protegida.</p>
              </div>
            )}
          </div>
        </section>

{/* EMPRÉSTIMO */}
        <section className={styles.loanPreviewSection} onClick={() => setActiveView?.('services')}>
          <div className={styles.loanHeader}>
            <div className={styles.loanTitleGroup}>
              <div className={styles.iconCircleLoan}><Banknote size={20} /></div>
              <div><h2>Empréstimo</h2><p>Valor disponível para você</p></div>
            </div>
            <ChevronRight size={18} />
          </div>
          <div className={styles.loanGrid}>
            <div className={styles.loanItem}><span className={styles.loanLabel}>Crédito Pessoal</span><span className={styles.loanValue}>R$ 15.000</span></div>
            <div className={styles.loanDivider}></div>
            <div className={styles.loanItem}><span className={styles.loanLabel}>Empréstimo FGTS</span><span className={styles.loanValue}>R$ 4.500</span></div>
          </div>
        </section>

 {/* 6. CARD CONVIDAR AMIGOS (ESTILIZADO) */}
        <section className={styles.inviteCard}>
          <div className={styles.inviteDecor}></div>
          <div className={styles.inviteContent}>
            <div className={styles.inviteText}>
              <div className={styles.usersIconBg}>
                <Users size={24} />
              </div>
              <div>
                <h3>Indique e Ganhe</h3>
                <p>Convide amigos para o Bytebank e desbloqueie recompensas.</p>
              </div>
            </div>
            <button className={styles.inviteBtn}>
              Convidar
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* Coluna Lateral */}
      <aside className={styles.sideColumn}>
          <Extrato />
      </aside>
    </div>
  );
}