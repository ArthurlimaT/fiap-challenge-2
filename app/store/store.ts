import { configureStore, combineReducers } from '@reduxjs/toolkit';
import bancoReducer from './bancoslice';

const rootReducer = combineReducers({
  banco: bancoReducer,
});

const loadFromLocalStorage = () => {
  try {
    if (typeof window === 'undefined') return undefined;
    const serializedState = localStorage.getItem('bytebank_state');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};

const persistedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
});

// --- AS LINHAS ABAIXO SÃO AS QUE RESOLVEM O ERRO 2305 ---
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// -------------------------------------------------------

store.subscribe(() => {
  try {
    const state = store.getState();
    const serializedState = JSON.stringify(state); 
    localStorage.setItem('bytebank_state', serializedState);
  } catch (e) {
    console.warn("Erro ao salvar no LocalStorage", e);
  }
});