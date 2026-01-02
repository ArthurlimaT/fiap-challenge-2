'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adicionarTransacao } from '@/app/store/bancoslice';
import { RootState } from '@/app/store/store';
import { maskCurrency, currencyToNumber } from '@/app/utils/mask';

export default function TransactionForm() {
  const dispatch = useDispatch();
  const saldo = useSelector((state: RootState) => state.banco.saldo);
  const [tipo, setTipo] = useState('Depósito');
  const [valor, setValor] = useState('R$ 0,00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNum = currencyToNumber(valor);

    if (valorNum <= 0) return;
    if (tipo !== 'Depósito' && valorNum > saldo) return alert("Saldo insuficiente");

    dispatch(adicionarTransacao({
      tipo: tipo.toLowerCase(),
      valor: valorNum,
      favorecido: tipo === 'Depósito' ? 'Própria conta' : 'Transação Avulsa'
    }));

    setValor('R$ 0,00');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <h3 className="text-[#47A138] font-bold text-lg border-l-4 border-[#47A138] pl-3">
        Nova transação
      </h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-500">Tipo de operação</label>
        <select 
          className="p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#47A138]"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option>Depósito</option>
          <option>Transferência</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-500">Valor</label>
        <input 
          type="text"
          className="p-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#47A138] text-xl font-medium"
          value={valor}
          onChange={(e) => setValor(maskCurrency(e.target.value))}
        />
      </div>

      <button className="bg-[#004D4D] text-white py-4 rounded-xl font-bold hover:brightness-110 transition-all shadow-md">
        Concluir transação
      </button>
    </form>
  );
}