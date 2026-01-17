'use client';
import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Sector, Legend
} from 'recharts';
import { TrendingUp, ArrowRightLeft, RefreshCcw, Calendar } from 'lucide-react';
import styles from './investment.module.scss';

// Função para gerar histórico fictício baseado no valor ATUAL (para parecer real e reativo)
const generateHistory = (portfolio: any[], monthsBack: number) => {
  const history = [];
  const today = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = date.toLocaleString('pt-BR', { month: 'short' });
    
    // Cria um objeto de dados para este mês
    const monthData: any = { 
      month: i === 0 ? 'Atual' : monthName, // O último mês é "Atual"
      originalDate: date 
    }; 

    // Para cada categoria, gera um valor histórico
    // Lógica: Mês atual = 100%. Meses anteriores = Variação aleatória decrescente
    portfolio.forEach((asset) => {
      if (i === 0) {
        monthData[asset.name] = asset.amount; // Mês atual é o valor real exato
      } else {
        // Simula uma evolução onde no passado tinha menos (crescimento de ~1-2% ao mês)
        const factor = 1 - (i * 0.015) + (Math.random() * 0.02 - 0.01); 
        monthData[asset.name] = Math.max(0, asset.amount * factor);
      }
    });

    history.push(monthData);
  }
  return history;
};

// Mock simples para fluxo (entradas/saidas) também baseado no tempo
const generateFlowHistory = (monthsBack: number, currentFlow: any) => {
  const history = [];
  const today = new Date();
  
  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = date.toLocaleString('pt-BR', { month: 'short' });

    if (i === 0) {
       history.push({ 
         month: 'Atual', 
         aporte: 2000 + currentFlow.invested, 
         resgate: 500 + currentFlow.redeemed 
       });
    } else {
       // Mock aleatório para passado
       history.push({
         month: monthName,
         aporte: Math.floor(Math.random() * 3000) + 1000,
         resgate: Math.random() > 0.7 ? Math.floor(Math.random() * 1000) : 0 // Resgate ocasional
       });
    }
  }
  return history;
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
  
  // Novo Estado: Filtro de Tempo (1 Mes, 6 Meses, 1 Ano)
  const [timeRange, setTimeRange] = useState<'1M' | '6M' | '1Y'>('6M');

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

  // --- ORDENAÇÃO DINÂMICA (MAIOR PARA MENOR) ---
  // Ordenamos o array de dados para que o gráfico desenhe a maior fatia primeiro (base) ou por último
  // Para Stacked Area, geralmente queremos os maiores na base visualmente.
  const sortedPortfolio = useMemo(() => {
    return [...data].sort((a, b) => b.amount - a.amount);
  }, [data]);

  // --- GERAÇÃO DE DADOS DINÂMICOS ---
  const monthsToGenerate = timeRange === '1Y' ? 12 : timeRange === '6M' ? 6 : 2; // 1M mostra atual e anterior para ter linha
  
  const chartData = useMemo(() => {
    return generateHistory(data, monthsToGenerate);
  }, [data, monthsToGenerate]);

  const flowData = useMemo(() => {
    return generateFlowHistory(monthsToGenerate, currentSessionFlow);
  }, [monthsToGenerate, currentSessionFlow]);

  // Cor do item selecionado (ou verde padrão)
  const activeItem = data.find(item => item.name === selectedCategory);
  const activeColor = activeItem ? activeItem.color : '#47A138'; 

  // Preparar dados para o gráfico de Categoria Única
  const singleCategoryData = chartData.map(item => ({
    month: item.month,
    value: item[selectedCategory] || 0
  }));

  return (
    <div className={styles.statsWrapper}>
      
      {/* GRÁFICO PRINCIPAL */}
      <div className={styles.mainChart}>
        
        <div className={styles.chartTitleRow}>
          <div className={styles.titleWithReset}>
            <h4 style={{color: selectedCategory === 'Total' ? '#0F172A' : activeColor}}>
              {selectedCategory === 'Total' ? 'Patrimônio' : selectedCategory}
            </h4>
            {selectedCategory !== 'Total' && (
              <button onClick={resetView} className={styles.resetBtn}>
                <RefreshCcw size={12}/> Voltar
              </button>
            )}
          </div>

          {/* Controle de Filtros e Abas */}
          <div className={styles.controlsGroup}>
            {/* Filtro de Tempo */}
            <div className={styles.timeFilter}>
               <button className={timeRange === '1M' ? styles.activeTime : ''} onClick={() => setTimeRange('1M')}>1M</button>
               <button className={timeRange === '6M' ? styles.activeTime : ''} onClick={() => setTimeRange('6M')}>6M</button>
               <button className={timeRange === '1Y' ? styles.activeTime : ''} onClick={() => setTimeRange('1Y')}>1A</button>
            </div>

            <div className={styles.divider}></div>

            {/* Abas Tipo de Gráfico */}
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.chartTab} ${chartView === 'evolution' ? styles.active : ''}`}
                onClick={() => setChartView('evolution')}
                title="Evolução"
              >
                <TrendingUp size={16}/>
              </button>
              <button 
                className={`${styles.chartTab} ${chartView === 'flow' ? styles.active : ''}`}
                onClick={() => setChartView('flow')}
                title="Entradas e Saídas"
              >
                <ArrowRightLeft size={16}/>
              </button>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={240}> 
          {chartView === 'evolution' ? (
            
            selectedCategory === 'Total' ? (
              // --- CENÁRIO 1: TOTAL (EMPILHADO ORDENADO) ---
              <AreaChart data={chartData}>
                <defs>
                  {sortedPortfolio.map(item => (
                    <linearGradient key={item.id} id={`grad${item.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={item.color} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={item.color} stopOpacity={0.1}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: number | undefined, name: string | undefined) => [`R$ ${Number(value || 0).toLocaleString()}`, name || '']}
                  itemSorter={(item) => -1 * (item.value as number)} // Tooltip também ordena do maior para menor
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '11px', paddingTop: '10px'}}/>
                
                {/* Renderizamos as Áreas baseadas no Portfolio ORDENADO */}
                {sortedPortfolio.map(item => (
                  <Area 
                    key={item.id}
                    type="monotone" 
                    dataKey={item.name} 
                    stackId="1" 
                    stroke={item.color} 
                    fill={`url(#grad${item.id})`}
                    animationDuration={500}
                  />
                ))}
              </AreaChart>
            ) : (
              // --- CENÁRIO 2: FILTRADO (SINGLE) ---
              <AreaChart data={singleCategoryData}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`R$ ${Number(value).toLocaleString()}`, selectedCategory]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={activeColor} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorFocus)" 
                  animationDuration={500}
                />
              </AreaChart>
            )

          ) : (

            // --- GRÁFICO DE FLUXO ---
            <AreaChart data={flowData}>
              <defs>
                <linearGradient id="colorAporte" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0}/>
                </linearGradient>
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
              <Area 
                type="monotone" 
                dataKey="aporte" 
                name="Entrada" 
                stroke={activeColor} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorAporte)"
                animationDuration={500} 
              />
              {/* Se quiser esconder saídas e mostrar só entradas como pediu numa mensagem anterior, comente o bloco abaixo. Mantive para coerência com 'Fluxo' */}
              <Area 
                type="monotone" 
                dataKey="resgate" 
                name="Saída" 
                stroke="#E11D48" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorResgate)"
                animationDuration={500} 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* PAINEL LATERAL (PIZZA) */}
      <div className={styles.interactivePanel}>
        <p className={styles.instruction}>
          {selectedCategory === 'Total' ? 'Alocação Geral' : `Detalhe: ${selectedCategory}`}
        </p>
        <div className={styles.pieContainer}>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                // @ts-ignore
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={sortedPortfolio} // A Pizza também respeita a ordem do maior para o menor
                innerRadius={50}
                outerRadius={65}
                paddingAngle={4}
                dataKey="amount"
                onClick={handlePieClick}
                onMouseEnter={onPieEnter}
                cursor="pointer"
              >
                {sortedPortfolio.map((entry: any, index: number) => (
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
           {sortedPortfolio.map((item: any) => (
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