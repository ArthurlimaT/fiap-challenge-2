import React from 'react';
import styles from '../../../styles/dashboard.module.scss';
import { Pencil, Trash2 } from 'lucide-react';

export default function StatementList() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className={styles.rightTitle}>Extrato</h2>
        <div className="flex gap-2 text-[#0b5860]">
          <Pencil size={16} className="cursor-pointer" />
          <Trash2 size={16} className="cursor-pointer" />
        </div>
      </div>

      <div className={styles.txList}>
        {[
          { month: 'Novembro', type: 'Depósito', date: '18/11/2022', amount: 'R$ 150' },
          { month: 'Novembro', type: 'Transferência', date: '21/11/2022', amount: 'R$ 500', isDebit: true },
        ].map((tx, i) => (
          <div key={i} className={styles.txItem}>
            <div>
              <p className="text-[10px] font-bold text-[#1b6b60] uppercase">{tx.month}</p>
              <p className="text-sm font-medium">{tx.type}</p>
              <p className={styles.balanceValue} style={{fontSize: '14px'}}>
                 {tx.isDebit ? `- ${tx.amount}` : tx.amount}
              </p>
            </div>
            <span className="text-[10px] text-gray-400">{tx.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}