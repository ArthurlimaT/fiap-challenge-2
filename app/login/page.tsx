'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de login: Se houver algo digitado, ele entra
    if (email && password) {
      console.log("Login realizado com sucesso!");
      router.push('/dashboard'); // Redireciona para o Dashboard REAL
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-[#47A138] text-center">Acesse sua conta</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">E-mail</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail" 
            className="w-full p-3 border rounded outline-none focus:border-[#47A138]" 
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Senha</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha" 
            className="w-full p-3 border rounded outline-none focus:border-[#47A138]" 
            required 
          />
        </div>

        <button type="submit" className="w-full bg-[#47A138] text-white py-3 rounded font-bold hover:brightness-90 transition-all">
          Acessar Conta
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          Ainda não tem conta? <Link href="/register" className="text-[#47A138] font-bold hover:underline">Abra sua conta aqui</Link>
        </div>
      </form>
    </div>
  );
}