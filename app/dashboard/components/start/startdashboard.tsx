'use client';
import React, { useState, useEffect } from 'react';
import styles from './start.module.scss'; 
import BalanceHero from './balancehero';
import Extrato from '../extrato/extrato';
import NovaOperacao from '../novaoperacao/novaoperacao';
import { 
  Target, 
  AlertTriangle, 
  Settings2, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  Check, 
  LayoutGrid, 
  ArrowRightLeft 
} from 'lucide-react';

export default function StartDashboard() {
  const [mounted, setMounted] = useState(false);
  const [dataAtual, setDataAtual] = useState('');
  const [userName, setUserName] = useState(''); // Estado para guardar o nome
  const [showSettings, setShowSettings] = useState(false);
  
  const [activeWidgets, setActiveWidgets] = useState({
    metas: true,
    gastos: true,
    investimentos: false,
    seguros: false
  });

  useEffect(() => {
    setMounted(true);
    
    // 1. Busca o nome do usuário no localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Pega apenas o primeiro nome para ficar mais elegante
      const primeiroNome = user.name.split(' ')[0];
      setUserName(primeiroNome);
    }

    const agora = new Date();
    setDataAtual(agora.toLocaleDateString('pt-BR', {
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    }));
  }, []);

  const toggleWidget = (name: keyof typeof activeWidgets) => {
    setActiveWidgets(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (!mounted) return <div className={styles.dashboardGrid}></div>;

  return (
    <div className={styles.dashboardGrid}>
      <main className={styles.mainColumn}>
        
        {/* HEADER ATUALIZADO COM NOME */}
        <header className={styles.headerSimples}>
          <div className={styles.welcomeText}>
            <h1>Olá, {userName || 'Usuário'}! 👋</h1>
            <p className={styles.dateText}>{dataAtual}</p>
          </div>
        </header>

        <section className={styles.heroSection}>
          <BalanceHero />
        </section>

        {/* ... restante do código permanece igual ... */}
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

        <section className={styles.abaSection}>
          <div className={styles.abaHeader}>
            <div className={styles.abaTitle}>
              <ArrowRightLeft size={20} className={styles.iconVerde} />
              <h2>Nova Transação</h2>
            </div>
          </div>
          <div className={styles.containerImportado}>
            <NovaOperacao />
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