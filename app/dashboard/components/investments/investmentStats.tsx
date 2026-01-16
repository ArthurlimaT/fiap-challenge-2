'use client';
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Sector, Legend
} from 'recharts';
import { TrendingUp, ArrowRightLeft, RefreshCcw } from 'lucide-react';
import styles from './investment.module.scss';

// --- MOCK DATA ---
const evolutionDataMap: any = {
  'Total': [
    { month: 'Jan', value: 42000 }, { month: 'Fev', value: 43500 },
    { month: 'Mar', value: 43100 }, { month: 'Abr', value: 45800 },
    { month: 'Mai', value: 48000 }, { month: 'Jun', value: 50000 },
  ],
  'Tesouro': [
    { month: 'Jan', value: 15000 }, { month: 'Fev', value: 15200 },
    { month: 'Mar', value: 15500 }, { month: 'Abr', value: 16000 },
    { month: 'Mai', value: 16800 }, { month: 'Jun', value: 17500 },
  ],
  'Ações': [
    { month: 'Jan', value: 10000 }, { month: 'Fev', value: 11000 },
    { month: 'Mar', value: 9500 },  { month: 'Abr', value: 11500 },
    { month: 'Mai', value: 12000 }, { month: 'Jun', value: 12500 },
  ],
  'FIIs': [
    { month: 'Jan', value: 8000 },  { month: 'Fev', value: 8200 },
    { month: 'Mar', value: 8500 },  { month: 'Abr', value: 9000 },
    { month: 'Mai', value: 9500 },  { month: 'Jun', value: 10000 },
  ],
  'Cripto': [
    { month: 'Jan', value: 9000 },  { month: 'Fev', value: 9100 },
    { month: 'Mar', value: 9600 },  { month: 'Abr', value: 9300 },
    { month: 'Mai', value: 9700 },  { month: 'Jun', value: 10000 },
  ]
};

const flowDataMap: any = {
  'Total': [
    { month: 'Jan', aporte: 2500, resgate: 200 },
    { month: 'Fev', aporte: 1000, resgate: 500 },
    { month: 'Mar', aporte: 3000, resgate: 100 },
    { month: 'Abr', aporte: 1500, resgate: 2000 },
    { month: 'Mai', aporte: 4000, resgate: 300 },
  ],
  'Tesouro': [
    { month: 'Jan', aporte: 1000, resgate: 0 },
    { month: 'Fev', aporte: 500, resgate: 0 },
    { month: 'Mar', aporte: 500, resgate: 0 },
    { month: 'Abr', aporte: 1000, resgate: 0 },
    { month: 'Mai', aporte: 800, resgate: 0 },
  ],
  'Ações': [
    { month: 'Jan', aporte: 1000, resgate: 0 },
    { month: 'Fev', aporte: 0, resgate: 500 },
    { month: 'Mar', aporte: 1000, resgate: 0 },
    { month: 'Abr', aporte: 500, resgate: 1000 },
    { month: 'Mai', aporte: 1200, resgate: 0 },
  ],
  'FIIs': [
    { month: 'Jan', aporte: 500, resgate: 0 },
    { month: 'Fev', aporte: 500, resgate: 0 },
    { month: 'Mar', aporte: 500, resgate: 0 },
    { month: 'Abr', aporte: 0, resgate: 200 },
    { month: 'Mai', aporte: 1000, resgate: 0 },
  ],
  'Cripto': [
    { month: 'Jan', aporte: 0, resgate: 200 },
    { month: 'Fev', aporte: 0, resgate: 0 },
    { month: 'Mar', aporte: 1000, resgate: 100 },
    { month: 'Abr', aporte: 0, resgate: 800 },
    { month: 'Mai', aporte: 1000, resgate: 300 },
  ]
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 8} outerRadius={outerRadius + 10} fill={fill} />
    </g>
  );
};

interface Props {
  data: any[];
  currentSessionFlow: { invested: number; redeemed: number };
}

export default function InvestmentStats({ data, currentSessionFlow }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState('Total');
  const [chartView, setChartView] = useState<'evolution' | 'flow'>('evolution'); 

  const resetView = () => {
    setSelectedCategory('Total');
    setActiveIndex(undefined);
  };

  const handlePieClick = (entry: any, index: number) => {
    if (selectedCategory === entry.name) {
      resetView();
    } else {
      setSelectedCategory(entry.name);
      setActiveIndex(index);
    }
  };

  const onPieEnter = (_: any, index: number) => setActiveIndex(index);

  // --- LÓGICA DE CORES DINÂMICA ---
  // Se for "Total", usa Verde padrão. Se for categoria, usa a cor da categoria.
  const activeItem = data.find(item => item.name === selectedCategory);
  const activeColor = activeItem ? activeItem.color : '#47A138'; 

  // --- PREPARAÇÃO DOS DADOS ---
  const currentEvolutionData = evolutionDataMap[selectedCategory] || evolutionDataMap['Total'];
  const baseFlowData = flowDataMap[selectedCategory] || flowDataMap['Total'];
  
  const currentFlowData = [
    ...baseFlowData,
    { 
      month: 'Atual', 
      aporte: (selectedCategory === 'Total' ? 2000 : 500) + currentSessionFlow.invested, 
      resgate: (selectedCategory === 'Total' ? 500 : 0) + currentSessionFlow.redeemed 
    }
  ];

  return (
    <div className={styles.statsWrapper}>
      
      <div className={styles.mainChart}>
        
        <div className={styles.chartTitleRow}>
          <div className={styles.titleWithReset}>
            {/* O Título agora também pega a cor da categoria */}
            <h4 style={{color: selectedCategory === 'Total' ? '#0F172A' : activeColor}}>
              {selectedCategory === 'Total' ? 'Visão Geral' : selectedCategory}
            </h4>
            {selectedCategory !== 'Total' && (
              <button onClick={resetView} className={styles.resetBtn}>
                <RefreshCcw size={12}/> Voltar
              </button>
            )}
          </div>

          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.chartTab} ${chartView === 'evolution' ? styles.active : ''}`}
              onClick={() => setChartView('evolution')}
            >
              <TrendingUp size={14}/> Evolução
            </button>
            <button 
              className={`${styles.chartTab} ${chartView === 'flow' ? styles.active : ''}`}
              onClick={() => setChartView('flow')}
            >
              <ArrowRightLeft size={14}/> Fluxo
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={240}> 
          {chartView === 'evolution' ? (
            
            // --- GRÁFICO DE EVOLUÇÃO ---
            <AreaChart data={currentEvolutionData}>
              <defs>
                {/* Gradiente Dinâmico baseado na ActiveColor */}
                <linearGradient id="colorEvolution" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: any) => [`R$ ${Number(value).toLocaleString()}`, 'Patrimônio']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={activeColor} // Cor da linha muda
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorEvolution)" // Gradiente muda
                animationDuration={800}
              />
            </AreaChart>

          ) : (

            // --- GRÁFICO DE FLUXO (ENTRADAS VS SAÍDAS) ---
            <AreaChart data={currentFlowData}>
              <defs>
                {/* Aporte usa a cor da categoria (activeColor) */}
                <linearGradient id="colorAporte" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                </linearGradient>
                
                {/* Resgate continua sempre Vermelho (#E11D48) */}
                <linearGradient id="colorResgate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E11D48" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#E11D48" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
              
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value: any, name: any) => [
                  `R$ ${Number(value).toLocaleString()}`, 
                  name === 'aporte' ? 'Entradas' : 'Saídas'
                ]}
              />
              <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
              
              {/* ONDA DE ENTRADA (Cor Dinâmica) */}
              <Area 
                type="monotone" 
                dataKey="aporte" 
                name="aporte" 
                stroke={activeColor} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorAporte)"
                animationDuration={800} 
              />
              
              {/* ONDA DE SAÍDA (Sempre Vermelha) */}
              <Area 
                type="monotone" 
                dataKey="resgate" 
                name="resgate" 
                stroke="#E11D48" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorResgate)"
                animationDuration={800} 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className={styles.interactivePanel}>
        <p className={styles.instruction}>
          {selectedCategory === 'Total' ? 'Selecionar Categoria' : `Detalhe: ${selectedCategory}`}
        </p>
        <div className={styles.pieContainer}>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                // @ts-ignore
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                innerRadius={50}
                outerRadius={65}
                paddingAngle={4}
                dataKey="amount"
                onClick={handlePieClick}
                onMouseEnter={onPieEnter}
                cursor="pointer"
              >
                {data.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="none" 
                    fillOpacity={selectedCategory === 'Total' || selectedCategory === entry.name ? 1 : 0.3} 
                  />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                 formatter={(value: any) => [`R$ ${Number(value).toLocaleString()}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className={styles.miniLegend}>
           {data.map((item: any) => (
             <div 
                key={item.id} 
                className={styles.legendItem} 
                style={{opacity: selectedCategory === 'Total' || selectedCategory === item.name ? 1 : 0.4}}
             >
               <span style={{background: item.color}}></span>
               <small>{item.name} ({item.value}%)</small>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}