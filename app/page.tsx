import React from 'react';
import Link from 'next/link';
import styles from './landing.module.scss';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-black">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-black py-6 px-6 md:px-12 flex justify-between items-center w-full sticky top-0 z-50 border-b border-gray-800">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#47A138] rounded-lg flex items-center justify-center font-bold text-white italic">B</div>
             <span className="text-white font-bold text-2xl tracking-tighter">Bytebank</span>
          </div>

          <div className="hidden md:flex gap-8 text-gray-400 text-sm font-semibold">
            <a href="#" className="hover:text-white transition-colors">Vantagens</a>
            <a href="#" className="hover:text-white transition-colors">Segurança</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-white font-semibold text-sm hover:text-[#47A138] transition-colors pr-4">
            Já tenho conta
          </Link>
          <Link href="/register">
            <button className="bg-[#47A138] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-green-900/20">
              Abrir conta
            </button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-3/5 text-center md:text-left">
              <h1 className={styles.heroTitle}>
                O banco digital que entende sua <span>liberdade.</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Gerencie seus gastos, faça investimentos e controle sua vida financeira sem taxas abusivas e com a segurança que você merece.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/register">
                  <button className="bg-[#47A138] text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform">
                    Começar agora
                  </button>
                </Link>
                <button className="border border-gray-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-colors">
                  Saiba mais
                </button>
              </div>
            </div>

            {/* Ilustração Representativa */}
            <div className="md:w-2/5 hidden md:flex justify-center">
              <div className="relative p-8 bg-gray-900/50 rounded-3xl border border-gray-800 backdrop-blur-sm">
                <div className="text-[#47A138] text-6xl font-bold opacity-20 absolute -top-4 -left-4">“</div>
                <p className="text-white text-xl italic relative z-10">
                  A melhor experiência em banco digital que já utilizei para meu controle diário.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                  <div>
                    <p className="text-white font-bold text-sm">Arthur Silva</p>
                    <p className="text-gray-500 text-xs">Cliente Bytebank</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- VANTAGENS SECTION --- */}
      <section className={styles.featuresSection}>
        <div className="max-w-6xl mx-auto">
          <span className="text-[#47A138] font-bold tracking-widest uppercase text-sm">Por que nós?</span>
          <h2 className="text-4xl font-black text-black mt-4 mb-16">Vantagens de ser Bytebank</h2>
          
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>💳</span>
              <h3 className={styles.featureTitle}>Anuidade Zero</h3>
              <p className={styles.featureText}>Conta digital sem custos e cartão de crédito sem anuidade para sempre.</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>📈</span>
              <h3 className={styles.featureTitle}>Rendimento Real</h3>
              <p className={styles.featureText}>Seu dinheiro no porquinho rende 100% do CDI desde o primeiro dia.</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🛡️</span>
              <h3 className={styles.featureTitle}>Segurança Total</h3>
              <p className={styles.featureText}>Proteção biométrica e criptografia de ponta para seus dados e saldo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={styles.footer}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
               <div className="w-6 h-6 bg-[#47A138] rounded flex items-center justify-center font-bold text-white text-xs">B</div>
               <span className="font-bold text-xl">Bytebank</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              O Bytebank é uma instituição autorizada pelo Banco Central do Brasil.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-white">Links Rápidos</h4>
            <a href="#" className={styles.footerLink}>Privacidade</a>
            <a href="#" className={styles.footerLink}>Trabalhe Conosco</a>
            <a href="#" className={styles.footerLink}>Investidores</a>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">Canais de Atendimento</h4>
            <p className="text-gray-400 text-sm mb-2">meajuda@bytebank.com.br</p>
            <p className="text-[#47A138] font-bold text-lg">0800 555 1234</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-900 text-center text-gray-600 text-xs">
          © 2026 Bytebank - Todos os direitos reservados.
        </div>
      </footer>

    </main>
  );
}