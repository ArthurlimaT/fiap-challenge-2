'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Filter, ChevronLeft, ChevronRight, 
  Utensils, Car, Home, Heart, GraduationCap, Gift, 
  ShoppingBag, Banknote, Landmark, ArrowRightLeft,
  Calendar as CalendarIcon, X, FileDown, FileSpreadsheet // Ícones novos para PDF e Excel
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import styles from './transactions.module.scss';

interface TransacaoData {
  id: string;
  tipo: string;
  valor: number;
  favorecido: string;
  data: string;
  hora?: string;
  categoria?: string;
}

const getIcon = (categoria?: string, tipo?: string) => {
  if (tipo === 'deposito') return <Banknote size={18} />;
  if (tipo === 'pix') return <ArrowRightLeft size={18} />;
  if (tipo === 'doc' || tipo === 'ted') return <Landmark size={18} />;
  
  switch (categoria?.toLowerCase()) {
    case 'alimentação': return <Utensils size={18} />;
    case 'transporte': return <Car size={18} />;
    case 'casa': return <Home size={18} />;
    case 'saúde': return <Heart size={18} />;
    case 'educação': return <GraduationCap size={18} />;
    case 'lazer': return <Gift size={18} />;
    default: return <ShoppingBag size={18} />;
  }
};

export default function TransactionsView() {
  const [isClient, setIsClient] = useState(false);
  const transacoesReais = useSelector((state: RootState) => state.banco.transacoes);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterData, setFilterData] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => setIsClient(true), []);

  const MOCK_DATA: TransacaoData[] = useMemo(() => [
    { id: 'm1', favorecido: 'Restaurante Sabor Local', tipo: 'pix', valor: 82.50, data: '2024-05-15', hora: '12:30', categoria: 'Alimentação' },
    { id: 'm2', favorecido: 'Posto Shell', tipo: 'doc', valor: 250.00, data: '2024-05-14', hora: '09:15', categoria: 'Transporte' },
    { id: 'm3', favorecido: 'Salário Mensal', tipo: 'deposito', valor: 4500.00, data: '2024-05-01', hora: '08:00', categoria: 'Renda' }
  ], []);

  const allTransactions = useMemo(() => {
    const normalizadas = transacoesReais.map((t: any) => {
      let tipoFinal = (t.tipo || '').toLowerCase();
      if (tipoFinal === 'transferir') tipoFinal = 'doc';
      if (tipoFinal === 'depositar') tipoFinal = 'deposito';

      let dataFinal = t.data;
      if (typeof t.data === 'string' && t.data.includes('/')) {
        const [d, m, y] = t.data.split('/');
        dataFinal = `${y}-${m}-${d}`;
      }
      
      const dataValida = !isNaN(Date.parse(dataFinal)) ? dataFinal : new Date().toISOString();

      return {
        ...t,
        tipo: tipoFinal,
        data: dataValida,
        favorecido: t.favorecido || 'Transação Bytebank',
        categoria: t.categoria || (tipoFinal === 'deposito' ? 'Depósito' : 'Transferência')
      };
    });

    return [...normalizadas, ...MOCK_DATA].sort((a, b) => 
      new Date(b.data).getTime() - new Date(a.data).getTime()
    );
  }, [transacoesReais, MOCK_DATA]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(item => {
      const matchesSearch = item.favorecido.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = filterTipo === 'todos' || item.tipo === filterTipo;
      
      const itemDataFormatada = new Date(item.data).toISOString().split('T')[0];
      const matchesData = !filterData || itemDataFormatada === filterData;

      return matchesSearch && matchesTipo && matchesData;
    });
  }, [searchTerm, filterTipo, filterData, allTransactions]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentItems = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- EXPORTAR EXCEL (Melhorado) ---
  const handleExportExcel = () => {
    const header = ['Data', 'Favorecido', 'Categoria', 'Tipo', 'Valor'];
    const csvRows = filteredTransactions.map(item => {
      const valorFormatado = item.valor.toFixed(2).replace('.', ',');
      const row = [
        new Date(item.data).toLocaleDateString('pt-BR'),
        `"${item.favorecido}"`,
        `"${item.categoria || '-'}"`,
        item.tipo.toUpperCase(),
        `"${valorFormatado}"`
      ];
      return row.join(';');
    });

    const csvString = [header.join(';'), ...csvRows].join('\n');
    const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `extrato_bytebank_${new Date().toISOString().split('T')[0]}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- EXPORTAR PDF (Via navegador formatado) ---
  const handleExportPDF = () => {
    // Aciona a impressão nativa que permite "Salvar como PDF"
    window.print();
  };

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>Extrato</h2>
          <p>Consulte as suas movimentações por período, tipo ou favorecido</p>
        </div>
        
        {/* BOTÕES DE EXPORTAÇÃO */}
        <div className={styles.actionButtons}>
          <button className={styles.btnPdf} onClick={handleExportPDF} title="Salvar como PDF">
            <FileDown size={18} />
            <span>PDF</span>
          </button>
          <button className={styles.btnExcel} onClick={handleExportExcel} title="Baixar Excel">
            <FileSpreadsheet size={18} />
            <span>Excel</span>
          </button>
        </div>
      </header>

      <section className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar favorecido..." 
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          />
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.dateField}>
            <CalendarIcon size={16} />
            <input 
              type="date" 
              value={filterData}
              onChange={(e) => {setFilterData(e.target.value); setCurrentPage(1);}}
            />
            {filterData && (
              <button className={styles.clearDate} onClick={() => setFilterData('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className={styles.selectWrapper}>
            <Filter size={16} />
            <select value={filterTipo} onChange={(e) => {setFilterTipo(e.target.value); setCurrentPage(1);}}>
              <option value="todos">Todos os tipos</option>
              <option value="pix">PIX</option>
              <option value="doc">DOC/TED</option>
              <option value="deposito">Depósitos</option>
            </select>
          </div>
        </div>
      </section>

      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Favorecido</th>
              <th>Método</th>
              <th>Data</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className={styles.transactionInfo}>
                    <div className={`${styles.iconBox} ${item.tipo === 'deposito' ? styles.iconIn : styles.iconOut}`}>
                      {getIcon(item.categoria, item.tipo)}
                    </div>
                    <div>
                      <span className={styles.title}>{item.favorecido}</span>
                      <span className={styles.category}>{item.categoria}</span>
                    </div>
                  </div>
                </td>
                <td><span className={styles.methodBadge}>{item.tipo.toUpperCase()}</span></td>
                <td>
                  <div className={styles.dateTime}>
                    <span>{new Date(item.data).toLocaleDateString('pt-BR')}</span>
                    <small>{item.hora || '--:--'}</small>
                  </div>
                </td>
                <td className={item.tipo === 'deposito' ? styles.priceIn : styles.priceOut}>
                  {item.tipo === 'deposito' ? '+' : '-'} R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <div className={styles.noResults}>Nenhuma transação encontrada para este período ou filtro.</div>
        )}
      </div>

      <footer className={styles.pagination}>
        <p>Página {currentPage} de {totalPages || 1}</p>
        <div className={styles.pageControls}>
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft size={20}/></button>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0}><ChevronRight size={20}/></button>
        </div>
      </footer>
    </div>
  );
}