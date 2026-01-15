'use client';
import React, { useState } from 'react';
import styles from './mycards.module.scss';
import startStyles from '../start/start.module.scss';
import Extrato from '../extrato/extrato';
import { 
  ArrowLeft, Eye, EyeOff, Lock, 
  Settings, Cpu, Check, X 
} from 'lucide-react';

export default function MyCards({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'fisico' | 'virtual'>('fisico');
  const [showData, setShowData] = useState(false);
  const [blockedFisico, setBlockedFisico] = useState(false);
  const [blockedVirtual, setBlockedVirtual] = useState(false);
  
  // Estados para o Limite (Slider)
  const [limit, setLimit] = useState(5000);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [tempLimit, setTempLimit] = useState(5000);
  const maxLimit = 10000;

  const isCurrentBlocked = activeTab === 'fisico' ? blockedFisico : blockedVirtual;

  const handleSaveLimit = () => {
    setLimit(tempLimit);
    setIsEditingLimit(false);
  };

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
                onClick={() => {setActiveTab('virtual'); setShowData(false);}}
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
                {showData 
                  ? (activeTab === 'fisico' ? '4502 1234 5678 7741' : '4502 8812 0093 7741') 
                  : '•••• •••• •••• 7741'}
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
                <div>
                  <small>CVV</small>
                  <p>{showData ? (activeTab === 'fisico' ? '889' : '123') : '•••'}</p>
                </div>
              </div>
              {isCurrentBlocked && <div className={styles.blockedOverlay}>BLOQUEADO</div>}
            </div>

            {/* Botão Ver Dados agora disponível para ambos */}
            <button className={styles.toggleData} onClick={() => setShowData(!showData)}>
              {showData ? <><EyeOff size={16}/> Ocultar dados</> : <><Eye size={16}/> Ver dados do cartão</>}
            </button>
          </div>

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

            <div className={`${styles.settingItem} ${isEditingLimit ? styles.editing : ''}`}>
              <div className={styles.settingInfo}>
                <div className={styles.iconCircle}><Settings size={20}/></div>
                <div className={styles.limitContent}>
                  <strong>Ajuste de limite</strong>
                  {isEditingLimit ? (
                    <div className={styles.sliderContainer}>
                      <div className={styles.sliderHeader}>
                        <span className={styles.tempValue}>
                          R$ {tempLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <div className={styles.actions}>
                           <button onClick={handleSaveLimit} className={styles.confirmBtn}><Check size={16} /></button>
                           <button onClick={() => setIsEditingLimit(false)} className={styles.cancelBtn}><X size={16} /></button>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max={maxLimit} 
                        step="100"
                        value={tempLimit}
                        onChange={(e) => setTempLimit(Number(e.target.value))}
                        className={styles.rangeInput}
                      />
                      <div className={styles.rangeLabels}>
                        <span>R$ 0</span>
                        <span>R$ {maxLimit.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  ) : (
                    <p>Seu limite atual é <strong>R$ {limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong></p>
                  )}
                </div>
              </div>
              {!isEditingLimit && (
                <button 
                  className={styles.configBtn}
                  onClick={() => {
                    setTempLimit(limit);
                    setIsEditingLimit(true);
                  }}
                >
                  Ajustar
                </button>
              )}
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