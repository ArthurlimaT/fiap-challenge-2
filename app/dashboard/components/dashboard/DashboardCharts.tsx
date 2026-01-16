'use client';
import React, { useMemo, useState, useEffect } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Download, Target, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import styles from './dashboardCharts.module.scss';

// Mock de dados
const dataMensal = [
  { mes: 'Jan', receita: 4000, despesa: 2400 },
  { mes: 'Fev', receita: 3000, despesa: 1398 },
  { mes: 'Mar', receita: 5000, despesa: 2800 },
  { mes: 'Abr', receita: 2780, despesa: 3908 },
  { mes: 'Mai', receita: 4890, despesa: 2800 },
  { mes: 'Jun', receita: 6390, despesa: 3800 },
];

const dataCategorias = [
  { name: 'Alimentação', value: 1200 },
  { name: 'Transporte', value: 800 },
  { name: 'Lazer', value: 600 },
  { name: 'Saúde', value: 400 },
  { name: 'Educação', value: 800 },
];

const COLORS = ['#47A138', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardCharts() {
  const [isClient, setIsClient] = useState(false);
  const [periodo, setPeriodo] = useState('6m');

  // Garante que o gráfico só renderize no cliente (evita erro de hidratação do Recharts)
  useEffect(() => {
    setIsClient(true);
  }, []);

  const totais = useMemo(() => {
    const receitaTotal = dataMensal.reduce((acc, curr) => acc + curr.receita, 0);
    const despesaTotal = dataMensal.reduce((acc, curr) => acc + curr.despesa, 0);
    return {
      receita: receitaTotal,
      despesa: despesaTotal,
      saldo: receitaTotal - despesaTotal,
      economia: 65 
    };
  }, []);

  if (!isClient) return null;

  return (
    <div className={styles.chartsWrapper}>
      {/* Cabeçalho de Controle */}
      <header className={styles.dashHeader}>
        <div className={styles.dashTitle}>
          <h2>Visão Geral Financeira</h2>
          <p>Acompanhe seus rendimentos e gastos</p>
        </div>
        
        <div className={styles.dashControls}>
          <div className={styles.filterGroup}>
            <button className={periodo === '1m' ? styles.active : ''} onClick={() => setPeriodo('1m')}>1M</button>
            <button className={periodo === '6m' ? styles.active : ''} onClick={() => setPeriodo('6m')}>6M</button>
            <button className={periodo === '1y' ? styles.active : ''} onClick={() => setPeriodo('1y')}>1Y</button>
          </div>
          <button className={styles.exportBtn}>
            <Download size={16} /> Exportar
          </button>
        </div>
      </header>

      {/* Grid de Stats */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Receita Total</span>
            <div className={`${styles.badge} ${styles.up}`}><ArrowUpRight size={12}/> 12%</div>
          </div>
          <h4 className={styles.receita}>R$ {totais.receita.toLocaleString()}</h4>
          <p className={styles.trendText}>+ R$ 450 em relação ao mês anterior</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Despesa Total</span>
            <div className={`${styles.badge} ${styles.down}`}><ArrowDownRight size={12}/> 5%</div>
          </div>
          <h4 className={styles.despesa}>R$ {totais.despesa.toLocaleString()}</h4>
          <p className={styles.trendText}>Economia de R$ 120 este mês</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Meta de Economia</span>
            <Target size={16} color="#6B7280" />
          </div>
          <div className={styles.progressWrapper}>
             <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${totais.economia}%` }}></div>
             </div>
             <span className={styles.progressValue}>{totais.economia}%</span>
          </div>
          <p className={styles.trendText}>Faltam R$ 800 para sua meta</p>
        </div>
      </section>

      {/* Gráficos Principais */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h3>Fluxo de Caixa</h3>
            <div className={styles.legendCustom}>
               <span className={styles.dotRec}></span> Receita
               <span className={styles.dotDes}></span> Despesa
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dataMensal}>
              <defs>
                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#47A138" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#47A138" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="receita" stroke="#47A138" strokeWidth={3} fillOpacity={1} fill="url(#colorRec)" />
              <Area type="monotone" dataKey="despesa" stroke="#E11D48" strokeWidth={3} fill="transparent" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartContainer}>
          <h3>Distribuição de Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataCategorias}
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                cornerRadius={8} // ✅ Corrigido: Propriedade aqui
              >
                {dataCategorias.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="none" // Remove borda branca
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.pieLegend}>
            {dataCategorias.map((item, idx) => (
              <div key={idx} className={styles.pieLegendItem}>
                <span style={{ backgroundColor: COLORS[idx] }}></span>
                <div className={styles.pieLegendText}>
                   <label>{item.name}</label>
                   <p>R$ {item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}