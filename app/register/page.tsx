'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você faria a lógica de salvar o usuário
    alert("Conta criada com sucesso!");
    router.push('/dashboard'); // Manda para o dashboard real
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-[#47A138]">Criar nova conta</h2>
        <input type="text" placeholder="Nome completo" className="w-full p-3 border rounded mb-4 outline-none focus:border-[#47A138]" required />
        <input type="email" placeholder="E-mail" className="w-full p-3 border rounded mb-4 outline-none focus:border-[#47A138]" required />
        <input type="password" placeholder="Senha" className="w-full p-3 border rounded mb-6 outline-none focus:border-[#47A138]" required />
        <button type="submit" className="w-full bg-[#47A138] text-white py-3 rounded font-bold hover:brightness-90 transition-all">
          Cadastrar
        </button>
        <Link href="/" className="block text-center mt-4 text-sm text-gray-500 hover:underline">Voltar para o início</Link>
      </form>
    </div>
  );
}