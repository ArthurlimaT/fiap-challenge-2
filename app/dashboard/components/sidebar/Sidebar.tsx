import React from 'react';
import styles from '../../../styles/dashboard.module.scss';

export default function Sidebar({ activeView, setActiveView }: any) {
  // Lista de itens para evitar repetição de código e erros de digitação
  const menuItems = [
    { id: 'start', label: 'Início' },
    { id: 'transfer', label: 'Transferências' },
    { id: 'investments', label: 'Investimentos' },
    { id: 'services', label: 'Outros serviços' },
  ];

  return (
    <nav className={styles.sideNav}>
      <ul className="list-none p-0 m-0">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`${styles.sidebarItem} ${activeView === item.id ? styles.active : ''}`}
              onClick={() => setActiveView?.(item.id)}
            style={{ cursor: 'pointer' }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
}