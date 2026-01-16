'use client';
import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import styles from './dashboardCharts.module.scss';

// Mock de dados - Em um cenário real, isso viria via props ou hook de transações
const dataMensal = [
  { mes: 'Jan', receita: 4000, despesa: 2400 },
  { mes: 'Fev', receita: 3000, despesa: 1398 },
  { mes: 'Mar', receita: 2000, despesa: 9800 },
  { mes: 'Abr', receita: 2780, despesa: 3908 },
  { mes: 'Mai', receita: 1890, despesa: 4800 },
  { mes: 'Jun', receita: 2390, despesa: 3800 },
];

const dataCategorias = [
  { name: 'Alimentação', value: 400 },
  { name: 'Transporte', value: 300 },
  { name: 'Lazer', value: 300 },
  { name: 'Saúde', value: 200 },
  { name: 'Educação', value: 100 },
];

const COLORS = ['#47A138', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardCharts() {
  
  // 🔍 Totais calculados dinamicamente
  const totais = useMemo(() => {
    const receitaTotal = dataMensal.reduce((acc, curr) => acc + curr.receita, 0);
    const despesaTotal = dataMensal.reduce((acc, curr) => acc + curr.despesa, 0);
    return {
      receita: receitaTotal,
      despesa: despesaTotal,
      saldo: receitaTotal - despesaTotal
    };
  }, []);

  return (
    <div className={styles.chartsWrapper}>
      {/* Cards de Totais Dinâmicos */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Receita Total</span>
          <h4 className={styles.receita}>R$ {totais.receita.toLocaleString()}</h4>
        </div>
        <div className={styles.statCard}>
          <span>Despesa Total</span>
          <h4 className={styles.despesa}>R$ {totais.despesa.toLocaleString()}</h4>
        </div>
        <div className={styles.statCard}>
          <span>Saldo Atual</span>
          <h4 className={totais.saldo >= 0 ? styles.receita : styles.despesa}>
            R$ {totais.saldo.toLocaleString()}
          </h4>
        </div>
      </section>

      <div className={styles.chartsGrid}>
        {/* 📈 Gráfico de gastos por mês & Receita vs Despesa */}
        <div className={styles.chartContainer}>
          <h3>Receita vs Despesas (Mensal)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataMensal}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Legend />
              <Bar dataKey="receita" fill="#47A138" name="Receita" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesa" fill="#E11D48" name="Despesa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 Gráfico de gastos por categoria */}
        <div className={styles.chartContainer}>
          <h3>Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataCategorias}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataCategorias.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}