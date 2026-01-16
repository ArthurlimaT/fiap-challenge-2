'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, ArrowLeft, Mail, Lock, User } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // 1. Puxa a lista de usuários do "banco" (localStorage)
      const savedUsers = JSON.parse(localStorage.getItem('bytebank_users') || '[]');

      // 2. Verifica se o e-mail já existe
      const userExists = savedUsers.find((u: any) => u.email === email);
      
      if (userExists) {
        alert("Você já tem um login com este e-mail!");
        setIsLoading(false);
        return;
      }

      // 3. Salva o novo usuário na lista
      const newUser = { name, email, password };
      savedUsers.push(newUser);
      localStorage.setItem('bytebank_users', JSON.stringify(savedUsers));

      alert("Conta criada com sucesso! Agora faça seu login.");
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#47A138] rounded-full mix-blend-screen filter blur-[120px] opacity-15 animate-pulse"></div>
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#47A138] rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>

      <Link href="/login" className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm z-20">
        <ArrowLeft size={16} /> Voltar para login
      </Link>

      <div className="w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-white/5 border border-gray-700 rounded-xl flex items-center justify-center mb-4">
            <UserPlus className="text-[#47A138]" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Abra sua conta</h2>
          <p className="text-gray-400 text-sm mt-2">Rápido, fácil e totalmente seguro.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como quer ser chamado?" 
                className="w-full pl-11 p-3.5 bg-gray-950/50 border border-gray-700 rounded-xl text-white outline-none focus:border-[#47A138] focus:ring-1 focus:ring-[#47A138] transition-all placeholder:text-gray-600" 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                className="w-full pl-11 p-3.5 bg-gray-950/50 border border-gray-700 rounded-xl text-white outline-none focus:border-[#47A138] focus:ring-1 focus:ring-[#47A138] transition-all placeholder:text-gray-600" 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Crie uma senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="No mínimo 6 caracteres" 
                className="w-full pl-11 p-3.5 bg-gray-950/50 border border-gray-700 rounded-xl text-white outline-none focus:border-[#47A138] focus:ring-1 focus:ring-[#47A138] transition-all placeholder:text-gray-600" 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#47A138] hover:bg-[#3f9132] text-white py-4 rounded-xl font-bold transition-all transform active:scale-[0.98] shadow-lg shadow-green-900/20 disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Finalizar Cadastro'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            Já possui conta? <Link href="/login" className="text-[#47A138] font-bold hover:underline ml-1">Fazer Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}