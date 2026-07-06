import React from 'react';
import styles from './ScoreBoard.module.css';

export default function ScoreBoard({ cpuScore, playerScore, deckCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.cpuInfo}>CPUスコア: <span className={styles.digital}>{cpuScore}m</span></div>
      <div className={styles.scoreBoard}>
        <div className={styles.label}>YOUR SCORE</div>
        <div className={styles.value}>{playerScore} <span className={styles.unit}>m</span></div>
      </div>
      <div className={styles.deckInfo}>山札: {deckCount}枚</div>
    </header>
  );
}