import React from 'react';
import Link from 'next/link';
import styles from './landing.module.scss';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-black py-5 px-6 md:px-12 flex justify-between items-center w-full">
        <div className="flex items-center gap-12">
          {/* Logo Simulado */}
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-[#47A138] rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
               <div className="bg-black opacity-20 rounded-sm"></div>
               <div className="bg-white opacity-80 rounded-sm"></div>
               <div className="bg-white opacity-80 rounded-sm"></div>
               <div className="bg-black opacity-20 rounded-sm"></div>
             </div>
             <span className="text-white font-bold text-xl tracking-tight">Bytebank</span>
          </div>

          <div className="hidden md:flex gap-6 text-white text-sm font-medium">
            <a href="#" className="hover:text-[#47A138] transition-colors">Sobre</a>
            <a href="#" className="hover:text-[#47A138] transition-colors">Serviços</a>
          </div>
        </div>

        <div className="flex items-center">
          <Link href="/register">
          <button className={styles.navBtnPrimary}>
            Abrir minha conta
          </button>
          </Link>

          <Link href="/login">
            <button className="border border-[#47A138] text-[#47A138] px-5 py-2 rounded font-semibold text-sm">
            Já tenho conta
            </button>
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className={styles.heroSection}>
        <div className={`${styles.heroContent} flex flex-col md:flex-row items-center justify-between`}>
          
          {/* Texto Hero */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className={styles.heroTitle}>
              Experimente mais liberdade no controle da sua vida financeira.
              Crie sua conta com a gente!
            </h1>
            {/* Imagem Mobile Placeholder se necessário */}
          </div>

          {/* Ilustração (Simulação CSS para substituir a imagem da mulher e gráficos) */}
          <div className="md:w-1/2 flex justify-center relative">
             <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                {/* Barras do Gráfico */}
                <div className="absolute bottom-0 left-0 w-12 h-32 bg-[#47A138] rounded-t-lg z-10 border-r-2 border-black"></div>
                <div className="absolute bottom-0 left-20 w-12 h-48 bg-[#47A138] rounded-t-lg z-10 border-r-2 border-black"></div>
                <div className="absolute bottom-0 left-40 w-12 h-64 bg-[#47A138] rounded-t-lg z-10 border-r-2 border-black"></div>
                
                {/* Linhas Tracejadas */}
                <div className="absolute top-20 left-0 w-full border-t-2 border-dashed border-white opacity-50"></div>
                <div className="absolute top-40 left-0 w-full border-t-2 border-dashed border-white opacity-50"></div>
                
                {/* Pessoa (Simplificada) */}
                <div className="absolute bottom-0 right-10 w-24 h-56 bg-gray-300 rounded-t-full z-20 flex items-center justify-center">
                   <span className="text-4xl">🧍‍♀️</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- VANTAGENS SECTION --- */}
      <section className={styles.featuresSection}>
        <h2 className="text-2xl font-bold text-black mb-12">Vantagens do nosso banco:</h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎁</div>
            <h3 className={styles.featureTitle}>Conta e cartão gratuitos</h3>
            <p className={styles.featureText}>
              Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção.
            </p>
          </div>

          {/* Card 2 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💸</div>
            <h3 className={styles.featureTitle}>Saques sem custo</h3>
            <p className={styles.featureText}>
              Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h.
            </p>
          </div>

          {/* Card 3 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⭐</div>
            <h3 className={styles.featureTitle}>Programa de pontos</h3>
            <p className={styles.featureText}>
              Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!
            </p>
          </div>

          {/* Card 4 */}
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💻</div>
            <h3 className={styles.featureTitle}>Seguro Dispositivos</h3>
            <p className={styles.featureText}>
              Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.
            </p>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className={styles.footer}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div>
            <h4 className="font-bold mb-4">Serviços</h4>
            <span className={styles.footerLink}>Conta corrente</span>
            <span className={styles.footerLink}>Conta PJ</span>
            <span className={styles.footerLink}>Cartão de crédito</span>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <span className={styles.footerLink}>0800 004 250 08</span>
            <span className={styles.footerLink}>meajuda@bytebank.com.br</span>
            <span className={styles.footerLink}>ouvidoria@bytebank.com.br</span>
          </div>

          <div>
            <h4 className="font-bold mb-4">Desenvolvido por Alura</h4>
            <div className="flex items-center gap-2 mb-4">
               {/* Logo Bytebank Footer */}
               <div className="w-5 h-5 bg-white rounded-sm"></div>
               <span className="font-bold text-lg">Bytebank</span>
            </div>
            <div className="flex gap-4 text-xl">
              <span>📷</span> {/* Instagram Icon Placeholder */}
              <span>💬</span> {/* Whatsapp Icon Placeholder */}
              <span>▶️</span> {/* Youtube Icon Placeholder */}
            </div>
          </div>

        </div>
      </footer>

    </main>
  );
}