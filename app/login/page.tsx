'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // Se não tiver lucide-react, pode remover essa linha e o ícone

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Pequeno delay para simular processamento e mostrar o "Loading..."
    setTimeout(() => {
      if (email && password) {
        // --- LÓGICA DE COOKIE ---
        // Cria o cookie de autenticação com duração de 24h
        document.cookie = "auth_token=user_autenticado_bytebank; path=/; max-age=86400; SameSite=Lax";

        // Redireciona para o Dashboard
        router.push('/dashboard');
      } else {
        alert("Por favor, preencha todos os campos.");
        setIsLoading(false);
      }
    }, 1500); // 1.5 segundos de "carregando"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      
      {/* Efeito de Fundo (Glow Verde) */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#47A138] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#47A138] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>

      {/* Botão de Voltar discreto */}
      <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors flex items-center gap-2">
        <span>←</span> Voltar para home
      </Link>

      {/* Card de Login */}
      <div className="w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl z-10">
        
        {/* Cabeçalho do Card */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#47A138] rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-900/20">
            <span className="font-bold text-white text-xl italic">B</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Bem-vindo de volta</h2>
          <p className="text-gray-400 text-sm mt-2">Acesse sua conta Bytebank</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@bytebank.com" 
              className="w-full p-3.5 bg-gray-950/50 border border-gray-700 rounded-xl text-white outline-none focus:border-[#47A138] focus:ring-1 focus:ring-[#47A138] transition-all placeholder:text-gray-600" 
              required 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Senha</label>
              <a href="#" className="text-xs text-[#47A138] hover:underline">Esqueceu?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full p-3.5 bg-gray-950/50 border border-gray-700 rounded-xl text-white outline-none focus:border-[#47A138] focus:ring-1 focus:ring-[#47A138] transition-all placeholder:text-gray-600" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#47A138] hover:bg-[#3f9132] text-white py-3.5 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-green-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Entrando...</span>
              </>
            ) : (
              'Acessar Conta'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            Ainda não é cliente? <Link href="/register" className="text-[#47A138] font-bold hover:text-[#3f9132] transition-colors ml-1">Criar conta grátis</Link>
          </p>
        </div>

      </div>
      
      {/* Rodapé discreto */}
      <div className="absolute bottom-6 text-gray-600 text-xs">
        &copy; 2026 Bytebank Secure Login
      </div>
    </div>
  );
}