import React from 'react';
import styles from './CardZone.module.css';
import PokemonCard from '../PokemonCard/PokemonCard';

export default function CardZone({ cards, selectedIndices = [], onCardClick, isGlobalLoading }) {
  return (
    <div className={styles.zone}>
      {cards.map((card, index) => {
        const isSelected = selectedIndices.includes(index);

        return (
          <PokemonCard 
            key={index} 
            card={card} 
            isSelected={isSelected}
            onClick={() => onCardClick(index)}
            // 🔑 「今通信中で、かつこのカードが選択されている」なら、このカードだけをローディング状態にする
            isReplacing={isGlobalLoading && isSelected} 
          />
        );
      })}
    </div>
  );
}

