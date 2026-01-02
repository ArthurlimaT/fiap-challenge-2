'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import styles from './favorites.module.scss';

interface FavoritesProps {
  onSelect: (chave: string) => void;
}

export default function Favorites({ onSelect }: FavoritesProps) {
  const [mounted, setMounted] = useState(false);
  
  // CORREÇÃO: Garante que favoritos seja sempre um array, mesmo que o estado falhe
  const favoritos = useSelector((state: RootState) => state.banco.favoritos || []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.subtitle}>Favoritos recentes</h3>
      <div className={styles.list}>
        {/* CORREÇÃO: Uso de optional chaining (?.) por segurança */}
        {favoritos?.length === 0 ? (
          <p className={styles.empty}>Nenhum favorito salvo.</p>
        ) : (
          favoritos?.map((fav) => (
            <button 
              key={fav.id} 
              type="button" 
              className={styles.favButton}
              onClick={() => onSelect(fav.chave)}
            >
              <div className={styles.avatar}>
                {fav.inicial}
              </div>
              <span>{fav.nome}</span>
            </button>
          ))
        )}
        
        {/* Botão de adicionar novo (opcional, estilo da imagem) */}
        <button className={styles.addButton}>+</button>
      </div>
    </div>
  );
}