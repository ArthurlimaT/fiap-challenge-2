'use client';
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Sector 
} from 'recharts';
import { ArrowUpRight, RefreshCcw } from 'lucide-react';
import styles from './investment.module.scss';

// Dados estáticos apenas para a evolução (simulação)
const evolutionDataMap: any = {
  'Total': [
    { month: 'Jan', value: 42000 }, { month: 'Fev', value: 43500 },
    { month: 'Mar', value: 43100 }, { month: 'Abr', value: 45800 },
    { month: 'Mai', value: 48000 }, { month: 'Jun', value: 50000 },
  ],
  // ... (outros mocks de evolução se quiser manter)
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

// Componente de Tooltip Customizado para a Pizza
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'white', 
        padding: '10px', 
        border: '1px solid #E5E7EB', 
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{margin:0, fontSize:'12px', fontWeight:'bold', color: data.color}}>{data.name}</p>
        <p style={{margin:0, fontSize:'14px'}}>R$ {data.amount.toLocaleString()}</p>
        <p style={{margin:0, fontSize:'11px', color:'#6B7280'}}>{data.value}% da carteira</p>
      </div>
    );
  }
  return null;
};

// Agora aceita props
interface Props {
  data: any[];
}

export default function InvestmentStats({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState('Total');

  // Reseta seleção se os dados mudarem drasticamente (opcional)
  useEffect(() => {
    // Pode recalcular algo aqui se necessário
  }, [data]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handlePieClick = (entry: any, index: number) => {
    if (selectedCategory === entry.name) {
      setSelectedCategory('Total');
      setActiveIndex(undefined);
    } else {
      setSelectedCategory(entry.name);
      setActiveIndex(index);
    }
  };

  const resetView = () => {
    setSelectedCategory('Total');
    setActiveIndex(undefined);
  };

  // Encontra os detalhes do item selecionado na lista "data" que veio via props
  const currentDetails = data.find(item => item.name === selectedCategory);
  
  // Para simplificar a evolução, usamos o mock estático, mas a cor muda dinamicamente
  const currentChartData = evolutionDataMap['Total']; 

  return (
    <div className={styles.statsWrapper}>
      
      {/* Gráfico de Área */}
      <div className={styles.mainChart}>
        <div className={styles.chartTitleRow}>
          <h4>
            {selectedCategory === 'Total' ? 'Evolução Patrimonial Total' : `Performance: ${selectedCategory}`}
          </h4>
          {selectedCategory !== 'Total' && (
             <button onClick={resetView} className={styles.resetBtn}>
               <RefreshCcw size={14}/> Ver Geral
             </button>
          )}
        </div>
        
        <ResponsiveContainer width="100%" height={220}> 
          <AreaChart data={currentChartData}>
            <defs>
              <linearGradient id="colorDynamic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentDetails?.color || '#47A138'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={currentDetails?.color || '#47A138'} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
              formatter={(value: number | undefined) => [`R$ ${Number(value).toLocaleString()}`, selectedCategory]}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={currentDetails?.color || '#47A138'} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorDynamic)" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Pizza */}
      <div className={styles.interactivePanel}>
        <p className={styles.instruction}>Clique para filtrar</p>
        
        <div className={styles.pieContainer}>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Tooltip content={<CustomPieTooltip />} /> {/* AQUI ESTÁ O TOOLTIP NOVO */}
              <Pie
                // @ts-ignore
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data} // Usa os dados dinâmicos
                innerRadius={50}
                outerRadius={65}
                paddingAngle={4}
                dataKey="amount" // Usa o valor financeiro real
                onClick={handlePieClick}
                onMouseEnter={onPieEnter}
                cursor="pointer"
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Detalhes Dinâmicos */}
        <div className={styles.detailsBox}>
          {selectedCategory === 'Total' ? (
             <div className={styles.summaryInfo}>
               <span>Patrimônio Total</span>
               <strong>R$ {data.reduce((acc, cur) => acc + cur.amount, 0).toLocaleString()}</strong>
             </div>
          ) : (
            <div className={styles.categoryInfo} style={{borderColor: currentDetails?.color}}>
              <span style={{color: currentDetails?.color}}>{currentDetails?.name}</span>
              <div className={styles.catValue}>
                 <strong>R$ {currentDetails?.amount.toLocaleString()}</strong>
                 <small>{currentDetails?.value}%</small>
              </div>
              <div className={styles.catTrend}>
                <ArrowUpRight size={12}/> +1.2% este mês
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}