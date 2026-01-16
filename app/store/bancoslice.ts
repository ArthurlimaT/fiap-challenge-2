import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Favorito {
  id: string;
  nome: string;
  chave: string;
  inicial: string;
}

export interface Transacao {
  id: string;
  tipo: string; // 'entrada', 'saida', 'Investimento', 'Resgate'
  valor: number;
  favorecido: string; // No caso de investimento, será o nome do ativo (ex: "Tesouro")
  data: string;
  hora?: string;
  categoria?: string;
  titulo?: string;
}

interface BancoState {
  saldo: number;
  transacoes: Transacao[];
  favoritos: Favorito[];
}

const initialState: BancoState = {
  saldo: 2500,
  transacoes: [],
  favoritos: [
    { id: '1', nome: 'Joana', chave: 'joana@email.com', inicial: 'J' },
    { id: '2', nome: 'André', chave: '123.456.789-00', inicial: 'A' },
  ],
};

const bancoSlice = createSlice({
  name: 'banco',
  initialState,
  reducers: {
    // --- 1. Transações Normais (Pix, Transferência) ---
    adicionarTransacao: (state, action: PayloadAction<Omit<Transacao, 'id' | 'data' | 'hora'>>) => {
      const { tipo, valor, favorecido, categoria, titulo } = action.payload;
      const agora = new Date();
      
      const novaTransacao: Transacao = {
        id: Math.random().toString(36).substring(2, 11).toUpperCase(),
        tipo,
        valor,
        favorecido,
        data: agora.toLocaleDateString('pt-BR'),
        hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        categoria: categoria || 'Geral',
        titulo: titulo || 'Transação',
      };

      if (!state.transacoes) state.transacoes = [];
      
      if (tipo === 'deposito' || tipo === 'entrada') {
        state.saldo += valor;
      } else {
        state.saldo -= valor;
      }

      state.transacoes.unshift(novaTransacao);
    },

    // --- 2. Salvar Contatos ---
    salvarFavorito: (state, action: PayloadAction<{ nome: string; chave: string }>) => {
      if (!state.favoritos) state.favoritos = [];

      const existe = state.favoritos.find(f => f.chave === action.payload.chave);
      if (!existe) {
        state.favoritos.push({
          id: Date.now().toString(),
          nome: action.payload.nome,
          chave: action.payload.chave,
          inicial: action.payload.nome.charAt(0).toUpperCase(),
        });
      }
    },

    // --- 3. NOVO: Realizar Investimento (Tira do Saldo) ---
    realizarInvestimento: (state, action: PayloadAction<{ valor: number; nomeInvestimento: string }>) => {
      const { valor, nomeInvestimento } = action.payload;
      const agora = new Date();

      // Debita do saldo
      state.saldo -= valor;

      // Registra no extrato
      const novaTransacao: Transacao = {
        id: Math.random().toString(36).substring(2, 11).toUpperCase(),
        tipo: 'saida', // Marca como saída para aparecer vermelho no extrato
        valor: valor,
        favorecido: nomeInvestimento, // Ex: "Tesouro Direto"
        data: agora.toLocaleDateString('pt-BR'),
        hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        categoria: 'Investimentos',
        titulo: 'Aporte Financeiro'
      };

      if (!state.transacoes) state.transacoes = [];
      state.transacoes.unshift(novaTransacao);
    },

    // --- 4. NOVO: Resgatar Investimento (Volta para o Saldo) ---
    resgatarInvestimento: (state, action: PayloadAction<{ valor: number; nomeInvestimento: string }>) => {
      const { valor, nomeInvestimento } = action.payload;
      const agora = new Date();

      // Credita no saldo
      state.saldo += valor;

      // Registra no extrato
      const novaTransacao: Transacao = {
        id: Math.random().toString(36).substring(2, 11).toUpperCase(),
        tipo: 'entrada', // Marca como entrada para aparecer verde
        valor: valor,
        favorecido: nomeInvestimento,
        data: agora.toLocaleDateString('pt-BR'),
        hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        categoria: 'Resgate',
        titulo: 'Resgate de Aplicação'
      };

      if (!state.transacoes) state.transacoes = [];
      state.transacoes.unshift(novaTransacao);
    }
  },
});

// Exportar todas as ações, incluindo as novas
export const { 
  adicionarTransacao, 
  salvarFavorito, 
  realizarInvestimento, 
  resgatarInvestimento 
} = bancoSlice.actions;

export default bancoSlice.reducer;