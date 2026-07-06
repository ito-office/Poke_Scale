import styles from './BlackjackGame.module.css';

function BJPokemonCard({ pokemon, isHidden = false }) {
  if (!pokemon) return null;

  // CPUの裏向きカード用のデザイン
  if (isHidden) {
    return (
      <div className={`${styles.bjCard} ${styles.bjCardBack}`}>
        <div className={styles.pokeballLogo}>🔴</div>
      </div>
    );
  }

  const cardClass = pokemon.isLegendary 
    ? `${styles.bjCard} ${styles.bjLegendary}` 
    : styles.bjCard;

  return (
    <div className={cardClass}>
      {pokemon.isLegendary && <span className={styles.bjBadge}>LEGEND</span>}
      <img src={pokemon.image} alt={pokemon.name} className={styles.bjImg} />
      <div className={styles.bjInfo}>
        <div className={styles.bjName}>{pokemon.name}</div>
        <div className={styles.bjWeight}>{pokemon.weight} kg</div>
      </div>
    </div>
  );
}

export default BJPokemonCard;