// src/components/RecordsView/RecordsView.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './RecordsView.module.css';

export default function RecordsView({ activeGame, setActiveGame, stats, rankings }) {

  const navigate = useNavigate();
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        
        {/* ヘッダーエリア */}
        <div className={styles.header}>

          <button
            className={styles.homeButton}
            onClick={() => navigate("/home")}
          >
            ← ホームへ
          </button>

          <h1 className={styles.title}>
            殿堂入り（勝負の記録）
          </h1>

          <div className={styles.spacer}></div>

        </div>

        {/* ゲーム切り替えタブ */}
        <div className={styles.tabRow}>
          <button 
            className={`${styles.tabBtn} ${activeGame === 'ポーカー' ? styles.tabActive : ''}`}
            onClick={() => setActiveGame('ポーカー')}
          >
            ポーカー
          </button>
          <button 
            className={`${styles.tabBtn} ${activeGame === 'ブラック・ジャック' ? styles.tabActive : ''}`}
            onClick={() => setActiveGame('ブラック・ジャック')}
          >
            ブラック・ジャック
          </button>
        </div>

        {/* サマリー実績（2連カプセル） */}
        <div className={styles.summaryRow}>
          <div className={styles.summaryBox}>
            <span className={styles.summaryLabel}>総対戦数</span>
            <strong className={styles.summaryValue}>{stats.total}回</strong>
          </div>
          <div className={styles.summaryBox}>
            <span className={styles.summaryLabel}>最長連勝記録</span>
            <strong className={styles.summaryValue}>{stats.maxWin}回</strong>
          </div>
        </div>

        {/* ランキングセクション */}
        <div className={styles.rankingSection}>
          <div className={styles.sectionTitle}>最小誤差 ランキング（TOP5）</div>
          
          <div className={styles.rankList}>
            {rankings.map((item) => (
              <div key={item.rank} className={styles.rankRow}>
                
                {/* 順位と誤差表示 */}
                <div className={styles.rankInfoBox}>
                  <div className={styles.rankNumber}>{item.rank}位</div>
                  <div className={styles.errorInfo}>
                    <div className={styles.errorValue}>誤差 {item.error}</div>
                    <div className={styles.targetValue}>{item.target}</div>
                  </div>
                </div>

                {/* ポケモンカードの横スクロールエリア */}
                <div className={styles.pokemonScrollArea}>
                  {item.pokemons.map((poke, idx) => (
                    <div key={idx} className={styles.miniCard}>
                      <div className={styles.imgPlaceholder}>
                        <img src={poke.imageUrl} alt={poke.name} className={styles.pokeImg} />
                      </div>
                      <div className={styles.pokeName}>{poke.name}</div>
                      <div className={styles.pokeWeight}>{poke.weight}</div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>


        {/* 下部アクションバー */}
        <div className={styles.bottomBar}>
          <button
          className={styles.actionBtn}
          onClick={() => {
            if (activeGame === "ポーカー") {
              navigate("/poker");
            } else if (activeGame === "ブラック・ジャック") {
              navigate("/blackjack");
            }
          }}
        >
          {activeGame}の画面へ移動
        </button>
</div>


       

      </div>
    </div>
  );
}