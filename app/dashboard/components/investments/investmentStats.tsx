import React from 'react';

export default function InvestmentStats() {
  const legend = [
    { label: 'Fundos de investimento', color: '#2F80ED' },
    { label: 'Tesouro Direto', color: '#FF5031' },
    { label: 'Previdência Privada', color: '#9C27B0' },
    { label: 'Bolsa de Valores', color: '#47A138' },
  ];

  return (
    <div className="bg-[#004D61] rounded-xl p-10 text-white shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-around gap-12">
        {/* Gráfico Donut (Interativo/Visual) */}
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#2F80ED" strokeWidth="4" strokeDasharray="100" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="#FF5031" strokeWidth="4" strokeDasharray="30 100" strokeDashoffset="-40" />
            <circle cx="18" cy="18" r="16" fill="none" stroke="#47A138" strokeWidth="4" strokeDasharray="20 100" strokeDashoffset="-70" />
          </svg>
        </div>

        {/* Legenda conforme imagem */}
        <div className="flex flex-col gap-5">
          {legend.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium opacity-90">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}