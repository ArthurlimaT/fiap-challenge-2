'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  // --- AQUI ESTÁ A CORREÇÃO: DEFININDO OS ESTADOS ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula um tempo de carregamento para o efeito visual
    setTimeout(() => {
      // 1. Busca a lista de usuários cadastrados no "Banco" (LocalStorage)
      const savedUsers = JSON.parse(localStorage.getItem('bytebank_users') || '[]');

      // 2. Procura o usuário que tenha o email e a senha digitados
      // AQUI É ONDE O ERRO ACONTECIA: email e password agora existem via useState
      const authenticatedUser = savedUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (authenticatedUser) {
        // 3. Se achou, salva quem é o usuário logado no momento
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        
        // Define o cookie de sessão (importante para o seu middleware de proteção)
        document.cookie = "auth_token=user_logado; path=/; max-age=86400; SameSite=Lax";
        
        router.push('/dashboard');
      } else {
        // 4. Se não achou, avisa o usuário
        alert("E-mail ou senha incorretos! Verifique seus dados.");
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      
      {/* Glows de Fundo */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#47A138] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
      
      <div className="w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#47A138] rounded-xl flex items-center justify-center mb-4">
            <span className="font-bold text-white text-xl italic">B</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Bem-vindo de volta</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase">E-mail</label>
            <input 
              type="email" 
              value={email} // Vinculado ao estado
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
              placeholder="exemplo@bytebank.com" 
              className="w-full p-3.5 bg-gray-950/50 border border-gray-700 rounded-xl text-white outline-none focus:border-[#47A138]" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase">Senha</label>
            <input 
              type="password" 
              value={password} // Vinculado ao estado
              onChange={(e) => setPassword(e.target.value)} // Atualiza o estado ao digitar
              placeholder="••••••••" 
              className="w-full p-3.5 bg-gray-950/50 border border-gray-700 rounded-xl text-white outline-none focus:border-[#47A138]" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#47A138] hover:bg-[#3f9132] text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? "Entrando..." : "Acessar Conta"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            Ainda não é cliente? <Link href="/register" className="text-[#47A138] font-bold">Criar conta grátis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}