import React from 'react';
import styles from './ActionButtons.module.css';

// 🔑 親から届く buttonText を受け取れるようにします
export default function ActionButtons({ onOpenModal, onRestart, onQuit, buttonText = "もう1回" }) {
  return (
    <footer className={styles.footer}>
      {/* 左側：説明ボタン */}
      <button className={`${styles.btn} ${styles.sideBtn}`} onClick={onOpenModal}>
        説明を見る
      </button>
      
      {/* 🔑 中央：交換・もう1回ボタン（文字が状況に合わせて自動で変わります！） */}
      <button className={`${styles.btn} ${styles.mainBtn}`} onClick={onRestart}>
        {buttonText}
      </button>
      
      {/* 右側：ホームへ戻るボタン */}
      <button className={`${styles.btn} ${styles.sideBtn}`} onClick={onQuit}>
        ホームへ戻る
      </button>
    </footer>
  );
}