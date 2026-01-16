'use client';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Download, Target, ArrowUpRight, ArrowDownRight, Loader2, LogOut 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import styles from './dashboardCharts.module.scss';

// --- MOCK DE DADOS ---
const mockDataAno = [
  { label: 'Jan', receita: 4000, despesa: 2400 },
  { label: 'Fev', receita: 3000, despesa: 1398 },
  { label: 'Mar', receita: 5000, despesa: 2800 },
  { label: 'Abr', receita: 2780, despesa: 3908 },
  { label: 'Mai', receita: 4890, despesa: 2800 },
  { label: 'Jun', receita: 6390, despesa: 3800 },
  { label: 'Jul', receita: 5490, despesa: 4300 },
  { label: 'Ago', receita: 7200, despesa: 3500 },
  { label: 'Set', receita: 4100, despesa: 2100 },
  { label: 'Out', receita: 5800, despesa: 3200 },
  { label: 'Nov', receita: 6900, despesa: 4100 },
  { label: 'Dez', receita: 8500, despesa: 3800 },
];

const mockDataMes = [
  { label: 'Sem 1', receita: 1200, despesa: 800 },
  { label: 'Sem 2', receita: 900, despesa: 1100 },
  { label: 'Sem 3', receita: 1500, despesa: 950 },
  { label: 'Sem 4', receita: 1800, despesa: 1200 },
];

const baseCategorias = [
  { name: 'Alimentação', ratio: 0.35 },
  { name: 'Transporte', ratio: 0.20 },
  { name: 'Lazer', ratio: 0.15 },
  { name: 'Saúde', ratio: 0.10 },
  { name: 'Educação', ratio: 0.20 },
];

const COLORS = ['#47A138', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardCharts() {
  const [isClient, setIsClient] = useState(false);
  const [userName, setUserName] = useState('');
  const [periodo, setPeriodo] = useState('6m');
  const [isExporting, setIsExporting] = useState(false);
  
  const router = useRouter();
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    
    // 1. Verifica se existe um usuário logado no localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      // Se não houver sessão, manda de volta para o login
      router.push('/login');
    } else {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
    }
  }, [router]);

  // Função para deslogar
  const handleLogout = () => {
    localStorage.removeItem('currentUser'); // Apaga apenas a sessão atual
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"; // Limpa cookie
    router.push('/login');
  };

  // Seleção de dados conforme o período
  const chartData = useMemo(() => {
    switch (periodo) {
      case '1m': return mockDataMes;
      case '6m': return mockDataAno.slice(-6);
      case '1y': return mockDataAno;
      default: return mockDataAno.slice(-6);
    }
  }, [periodo]);

  // Totais dinâmicos
  const totais = useMemo(() => {
    const receitaTotal = chartData.reduce((acc, curr) => acc + curr.receita, 0);
    const despesaTotal = chartData.reduce((acc, curr) => acc + curr.despesa, 0);
    const saldo = receitaTotal - despesaTotal;
    const metaEconomia = periodo === '1m' ? 1000 : (periodo === '6m' ? 15000 : 30000);
    const porcentagemEconomia = Math.min(Math.round((saldo / metaEconomia) * 100), 100);

    return {
      receita: receitaTotal,
      despesa: despesaTotal,
      economia: Math.max(0, porcentagemEconomia)
    };
  }, [chartData, periodo]);

  const pieData = useMemo(() => {
    return baseCategorias.map(cat => ({
      name: cat.name,
      value: Math.round(totais.despesa * cat.ratio)
    }));
  }, [totais.despesa]);

  // Função de Exportação PDF Corrigida
  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setIsExporting(true);

    // Pequena pausa para o Recharts desativar as animações (evita gráfico vazio)
    await new Promise((resolve) => setTimeout(resolve, 600));

    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#000000',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 20) / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`relatorio-financeiro-${userName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className={styles.chartsWrapper} ref={dashboardRef}>
      <header className={styles.dashHeader}>
        <div className={styles.dashTitle}>
          <h2>Olá, {userName || 'Carregando...'}!</h2>
          <p>Acompanhe seus rendimentos e gastos</p>
        </div>
        
        <div className={styles.dashControls} data-html2canvas-ignore="true">
          <div className={styles.filterGroup}>
            <button className={periodo === '1m' ? styles.active : ''} onClick={() => setPeriodo('1m')}>1M</button>
            <button className={periodo === '6m' ? styles.active : ''} onClick={() => setPeriodo('6m')}>6M</button>
            <button className={periodo === '1y' ? styles.active : ''} onClick={() => setPeriodo('1y')}>1Y</button>
          </div>
          
          <button className={styles.exportBtn} onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
            {isExporting ? ' Gerando...' : ' Exportar PDF'}
          </button>

        
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Receita Total</span>
            <div className={`${styles.badge} ${styles.up}`}><ArrowUpRight size={12}/> 12%</div>
          </div>
          <h4 className={styles.receita}>R$ {totais.receita.toLocaleString()}</h4>
          <p className={styles.trendText}>Período: {periodo.toUpperCase()}</p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Despesa Total</span>
            <div className={`${styles.badge} ${styles.down}`}><ArrowDownRight size={12}/> 5%</div>
          </div>
          <h4 className={styles.despesa}>R$ {totais.despesa.toLocaleString()}</h4>
          <p className={styles.trendText}>Acumulado no gráfico</p>
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
          <p className={styles.trendText}>Saldo atual vs Meta</p>
        </div>
      </section>

      <div className={styles.chartsGrid}>
        {/* GRÁFICO DE ÁREA */}
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h3>Fluxo de Caixa</h3>
            <div className={styles.legendCustom}>
               <span className={styles.dotRec}></span> Receita
               <span className={styles.dotDes}></span> Despesa
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#47A138" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#47A138" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                formatter={(value: number | undefined) => value ? `R$ ${value.toLocaleString()}` : 'R$ 0'}
              />
              <Area 
                type="monotone" 
                dataKey="receita" 
                stroke="#47A138" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorRec)" 
                isAnimationActive={!isExporting} 
              />
              <Area 
                type="monotone" 
                dataKey="despesa" 
                stroke="#E11D48" 
                strokeWidth={3} 
                fill="transparent" 
                strokeDasharray="5 5" 
                isAnimationActive={!isExporting} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* GRÁFICO DE PIZZA */}
        <div className={styles.chartContainer}>
          <h3>Distribuição de Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={70}
                outerRadius={90}
                paddingAngle={8}
                dataKey="value"
                cornerRadius={8}
                isAnimationActive={!isExporting}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip formatter={(value: number | undefined) => value ? `R$ ${value.toLocaleString()}` : 'R$ 0'} />
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.pieLegend}>
            {pieData.map((item, idx) => (
              <div key={idx} className={styles.pieLegendItem}>
                <span style={{ backgroundColor: COLORS[idx] }}></span>
                <div className={styles.pieLegendText}>
                   <label>{item.name}</label>
                   <p>R$ {item.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}