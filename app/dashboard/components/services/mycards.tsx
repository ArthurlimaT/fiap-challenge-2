'use client';
import React, { useState } from 'react';
import styles from './mycards.module.scss';
import startStyles from '../start/start.module.scss';
import Extrato from '../extrato/extrato';
import { 
  ArrowLeft, Eye, EyeOff, Lock, Unlock, 
  Settings, ShieldCheck, Cpu 
} from 'lucide-react';

export default function MyCards({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'fisico' | 'virtual'>('fisico');
  const [showData, setShowData] = useState(false);
  const [blockedFisico, setBlockedFisico] = useState(false);
  const [blockedVirtual, setBlockedVirtual] = useState(false);

  const isCurrentBlocked = activeTab === 'fisico' ? blockedFisico : blockedVirtual;

  return (
    <div className={startStyles.dashboardGrid}>
      <div className={startStyles.mainColumn}>
        <div className={styles.container}>
          <button onClick={onBack} className={styles.backBtn}>
            <ArrowLeft size={18} /> Voltar para serviços
          </button>

          <header className={styles.header}>
            <h2>Meus Cartões</h2>
            <div className={styles.tabs}>
              <button 
                className={activeTab === 'fisico' ? styles.activeTab : ''} 
                onClick={() => {setActiveTab('fisico'); setShowData(false);}}
              >
                Cartão Físico
              </button>
              <button 
                className={activeTab === 'virtual' ? styles.activeTab : ''} 
                onClick={() => setActiveTab('virtual')}
              >
                Cartão Virtual
              </button>
            </div>
          </header>

          <div className={styles.cardDisplay}>
            {/* Visual do Cartão */}
            <div className={`
              ${styles.creditCard} 
              ${activeTab === 'fisico' ? styles.black : styles.green}
              ${isCurrentBlocked ? styles.blocked : ''}
            `}>
              <div className={styles.cardTop}>
                <span className={styles.brand}>Bytebank <span>• Premium</span></span>
                <Cpu size={32} className={styles.chip} />
              </div>
              
              <div className={styles.number}>
                {activeTab === 'virtual' && showData ? '4502 8812 0093 7741' : '•••• •••• •••• 7741'}
              </div>

              <div className={styles.cardBottom}>
                <div>
                  <small>TITULAR</small>
                  <p>JOANA DA SILVA</p>
                </div>
                <div>
                  <small>VALIDADE</small>
                  <p>12/29</p>
                </div>
                {activeTab === 'virtual' && (
                  <div>
                    <small>CVV</small>
                    <p>{showData ? '123' : '•••'}</p>
                  </div>
                )}
              </div>
              {isCurrentBlocked && <div className={styles.blockedOverlay}>BLOQUEADO</div>}
            </div>

            {activeTab === 'virtual' && (
              <button className={styles.toggleData} onClick={() => setShowData(!showData)}>
                {showData ? <><EyeOff size={16}/> Ocultar dados</> : <><Eye size={16}/> Ver dados do cartão</>}
              </button>
            )}
          </div>

          {/* Configurações */}
          <section className={styles.settings}>
            <h3>Configurações de segurança</h3>
            
            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.iconCircle}><Lock size={20}/></div>
                <div>
                  <strong>Bloqueio temporário</strong>
                  <p>Bloqueie o uso do seu cartão num clique</p>
                </div>
              </div>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={isCurrentBlocked}
                  onChange={() => activeTab === 'fisico' ? setBlockedFisico(!blockedFisico) : setBlockedVirtual(!blockedVirtual)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div className={styles.settingInfo}>
                <div className={styles.iconCircle}><Settings size={20}/></div>
                <div>
                  <strong>Ajuste de limite</strong>
                  <p>Seu limite atual é R$ 5.000,00</p>
                </div>
              </div>
              <button className={styles.configBtn}>Ajustar</button>
            </div>
          </section>
        </div>
      </div>

      <aside className={startStyles.sideColumn}>
        <Extrato />
      </aside>
    </div>
  );
}