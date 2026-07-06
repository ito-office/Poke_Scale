import React from 'react';
import styles from './PokemonCard.module.css';

export default function PokemonCard({ card, isSelected, onClick, isReplacing }) {
  if (!card) return null;

  // 🔑 このカードだけが絶賛交換中の場合、中身をローディング用の表示にする
  if (isReplacing) {
    return (
      <div className={`${styles.card} ${styles.loadingCard}`}>
        <div className={styles.loadingSpinner}>🔁</div>
        <div className={styles.loadingText}>通信中...</div>
      </div>
    );
  }

  let cardClass = styles.card;
  if (card.isLegendary) cardClass += ` ${styles.legendary}`;
  if (isSelected) cardClass += ` ${styles.selected}`;

  if (!card.isOpen) {
    return (
      <div className={styles.cardBack}>
        <div className={styles.backDesign}></div>
      </div>
    );
  }

  return (
    <div className={cardClass} onClick={onClick}>
      {card.isLegendary && <div className={styles.legendTag}>伝説降臨</div>}
      <div className={styles.pokeName}>{card.name}</div>
      
      <div className={styles.imgWrap}>
        {card.img ? <img src={card.img} alt={card.name} /> : <div className={styles.noImage}>？</div>}
      </div>

      <div className={styles.pokeHeight}>
        {card.height.toFixed(1)}
        <span className={styles.unit}>m</span>
      </div>
    </div>
  );
}