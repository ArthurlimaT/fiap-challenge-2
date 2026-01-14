import { configureStore, combineReducers } from '@reduxjs/toolkit';
import bancoReducer from './bancoslice';

const rootReducer = combineReducers({
  banco: bancoReducer,
});

const loadFromLocalStorage = () => {
  try {
    // Verificação essencial para Next.js (SSR)
    if (typeof window === 'undefined') return undefined;
    
    const serializedState = localStorage.getItem('bytebank_state');
    if (serializedState === null) return undefined;
    
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn("Não foi possível carregar o estado do LocalStorage", e);
    return undefined;
  }
};

const persistedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  // Middleware opcional para evitar erros de serialização de datas se houver
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Tipagens exportadas corretamente
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Subscrever para salvar mudanças
store.subscribe(() => {
  try {
    if (typeof window !== 'undefined') {
      const state = store.getState();
      const serializedState = JSON.stringify(state);
      localStorage.setItem('bytebank_state', serializedState);
    }
  } catch (e) {
    console.warn("Erro ao salvar no LocalStorage", e);
  }
});