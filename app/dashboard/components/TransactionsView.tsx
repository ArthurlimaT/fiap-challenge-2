'use client';
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ChevronLeft, 
  ChevronRight,
  Calendar
} from 'lucide-react';
import styles from './transactions.module.scss';

// Mock de dados para teste (Simulando 45 transações)
const MOCK_DATA = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  titulo: i % 3 === 0 ? 'Pagamento Fornecedor' : i % 2 === 0 ? 'Venda de Produto' : 'Assinatura Software',
  tipo: i % 2 === 0 ? 'entrada' : 'saida',
  valor: Math.floor(Math.random() * 2000) + 100,
  data: `2024-05-${(i % 28 + 1).toString().padStart(2, '0')}`,
  categoria: i % 3 === 0 ? 'Serviços' : 'Operacional'
}));

export default function TransactionsView() {
  // Estados de Filtro e Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'todos' | 'entrada' | 'saida'>('todos');
  const [filterData, setFilterData] = useState('');

  // Estado de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- Lógica de Filtragem (Busca + Tipo + Data) ---
  const filteredTransactions = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchesSearch = item.titulo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTipo = filterTipo === 'todos' || item.tipo === filterTipo;
      const matchesData = filterData === '' || item.data === filterData;
      return matchesSearch && matchesTipo && matchesData;
    });
  }, [searchTerm, filterTipo, filterData]);

  // --- Lógica de Paginação ---
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h2>Extrato de Transações</h2>
          <p>Consulte e filtre suas movimentações financeiras</p>
        </div>
      </header>

      {/* Barra de Ferramentas: Busca e Filtros */}
      <section className={styles.toolbar}>
        <div className={styles.searchBar}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por descrição..." 
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          />
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.selectWrapper}>
            <Filter size={16} />
            <select 
              value={filterTipo} 
              onChange={(e) => {setFilterTipo(e.target.value as any); setCurrentPage(1);}}
            >
              <option value="todos">Todos os tipos</option>
              <option value="entrada">Entradas</option>
              <option value="saida">Saídas</option>
            </select>
          </div>

          <div className={styles.dateWrapper}>
            <Calendar size={16} />
            <input 
              type="date" 
              value={filterData}
              onChange={(e) => {setFilterData(e.target.value); setCurrentPage(1);}}
            />
          </div>
        </div>
      </section>

      {/* Tabela de Dados */}
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Transação</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item.id}>
                <td>
                  <span className={styles.title}>{item.titulo}</span>
                  <span className={styles.category}>{item.categoria}</span>
                </td>
                <td>
                  <span className={item.tipo === 'entrada' ? styles.tagIn : styles.tagOut}>
                    {item.tipo === 'entrada' ? <ArrowUpCircle size={14}/> : <ArrowDownCircle size={14}/>}
                    {item.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                  </span>
                </td>
                <td>{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                <td className={item.tipo === 'entrada' ? styles.priceIn : styles.priceOut}>
                  {item.tipo === 'entrada' ? '+' : '-'} R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className={styles.noResults}>Nenhuma transação encontrada para os filtros aplicados.</div>
        )}
      </div>

      {/* Controles de Paginação */}
      <footer className={styles.pagination}>
        <p>Mostrando {currentItems.length} de {filteredTransactions.length} resultados</p>
        <div className={styles.pageControls}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft size={20} />
          </button>
          <span className={styles.pageNumber}>Página <strong>{currentPage}</strong> de {totalPages || 1}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}