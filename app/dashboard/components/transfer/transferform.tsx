// app/dashboard/components/TransferForm.tsx
import React, { useState } from 'react';
import styles from './transfer.module.scss'; // Use o SCSS que te mandei antes

export default function TransferForm() {
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6 text-[#47A138]">Nova Transferência</h2>
      <form className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-4">
          <label className="block font-bold mb-2">Valor</label>
          <input type="number" placeholder="R$ 0,00" className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2">Destinatário (CPF ou Chave)</label>
          <input type="text" placeholder="Digite os dados" className="w-full p-2 border rounded" />
        </div>
        <button className="bg-[#47A138] text-white w-full py-3 rounded-lg font-bold">
          Enviar Dinheiro
        </button>
      </form>
    </div>
  );
}