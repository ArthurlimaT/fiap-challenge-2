import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Favorito {
  id: string;
  nome: string;
  chave: string;
  inicial: string;
}

export interface Transacao {
  id: string;
  tipo: string;
  valor: number;
  favorecido: string;
  data: string;
  hora?: string;      // O ? indica que é opcional
  categoria?: string; // O ? indica que é opcional
  titulo?: string;    // Adicionado para compatibilidade com o mock
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
    adicionarTransacao: (state, action: PayloadAction<Omit<Transacao, 'id' | 'data' | 'hora'>>) => {
      const { tipo, valor, favorecido } = action.payload;
      const agora = new Date();
      
      const novaTransacao: Transacao = {
        id: Math.random().toString(36).substring(2, 11).toUpperCase(),
        tipo,
        valor,
        favorecido,
        data: agora.toLocaleDateString('pt-BR'),
        hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      // --- PROTEÇÃO CONTRA ESTADO CORROMPIDO (LOCALSTORAGE) ---
      if (!state.transacoes) state.transacoes = [];
      
      if (tipo === 'deposito') {
        state.saldo += valor;
      } else {
        state.saldo -= valor;
      }

      state.transacoes.unshift(novaTransacao);
    },

    salvarFavorito: (state, action: PayloadAction<{ nome: string; chave: string }>) => {
      // Proteção para o array de favoritos também
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
  },
});

export const { adicionarTransacao, salvarFavorito } = bancoSlice.actions;
export default bancoSlice.reducer;