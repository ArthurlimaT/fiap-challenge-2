// app/store/bancoslice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Favorito {
  id: string;
  nome: string;
  chave: string;
  inicial: string;
}

interface Transacao {
  id: string;
  tipo: string;
  valor: number;
  favorecido: string;
  data: string; // Removi o '?' para garantir que sempre exista no Extrato
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
    // Usamos Omit para dizer: "Receba tudo da Transacao, MENOS o id e a data"
    adicionarTransacao: (state, action: PayloadAction<Omit<Transacao, 'id' | 'data'>>) => {
      const { tipo, valor, favorecido } = action.payload;
      
      // Criamos o objeto completo com ID único
      const novaTransacao: Transacao = {
        id: Math.random().toString(36).substr(2, 9), // Gera ID aleatório
        tipo,
        valor,
        favorecido,
        data: new Date().toLocaleDateString('pt-BR'),
      };

      // Atualiza o saldo
      if (tipo === 'deposito') {
        state.saldo += valor;
      } else {
        state.saldo -= valor;
      }

      // Adiciona ao início da lista (as mais recentes primeiro no extrato)
      state.transacoes.unshift(novaTransacao);
    },

    salvarFavorito: (state, action: PayloadAction<{ nome: string; chave: string }>) => {
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