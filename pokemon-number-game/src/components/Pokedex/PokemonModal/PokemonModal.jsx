// src/components/Pokedex/PokemonModal/PokemonModal.jsx
import React, { useState } from 'react';
import styles from './PokemonModal.module.css';

// 💡 分けやすいように、データの定義はそのままにしておきます
const comparisonTargets = [
  { id: "randoseru", name: "🎒ランドセル", height: 0.3, weight: 1.2, unit: "個分", type: "item" },
  { id: "pikachu", name: "ピカチュウ", height: 0.4, weight: 6.0, unit: "匹分", type: "pokemon" },
  { id: "lucario", name: "ルカリオ", height: 1.2, weight: 54.0, unit: "匹分", type: "pokemon" },
  { id: "post", name: "📮郵便ポスト", height: 1.2, weight: 35.0, unit: "台分", type: "item" },
  { id: "charizard", name: "リザードン", height: 1.7, weight: 90.5, unit: "匹分", type: "pokemon" },
  { id: "vendingMachine", name: "🥫自動販売機", height: 1.8, weight: 400.0, unit: "台分", type: "item" },
];

export default function PokemonModal({ pokemon, onClose }) {
  if (!pokemon) return null;

  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [activeTargetId, setActiveTargetId] = useState('pikachu');

  const currentTarget = comparisonTargets.find(t => t.id === activeTargetId) || comparisonTargets[0];

  const heightCount = pokemon.height / currentTarget.height;
  const weightCount = pokemon.weight / currentTarget.weight;

  const formatCount = (count) => {
    if (count === 0) return "0.0";
    if (count < 0.1) {
      return count.toFixed(3);
    }
    return count.toFixed(1);
  };

  // 💡 ポケモンと物をそれぞれフィルタリング
  const pokemonTargets = comparisonTargets.filter(t => t.type === 'pokemon');
  const itemTargets = comparisonTargets.filter(t => t.type === 'item');

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        {/* メイン表示エリア */}
        <div className={styles.mainArea}>
          <div className={styles.imageBox}>
            {pokemon.imageUrl ? (
              <img src={pokemon.imageUrl} alt={pokemon.name} className={styles.pokemonImage} />
            ) : (
              <span className={styles.noImage}>🦖</span>
            )}
          </div>

          <div className={styles.infoBox}>
            <div className={styles.idNumber}>No.{pokemon.id}</div>
            <h2 className={styles.name}>{pokemon.name}</h2>
            
            <div className={styles.statusRow}>
              <span>📐 身長</span>
              <strong>{pokemon.height}m</strong>
            </div>
            <div className={styles.statusRow}>
              <span>⚖️ 体重</span>
              <strong>{pokemon.weight}kg</strong>
            </div>
            <div className={styles.statusRow}>
              <span>🌏 {pokemon.region}地方</span>
            </div>
          </div>
        </div>

        {/* 算数博士セクション */}
        <div className={styles.doctorSection}>
          
          <button 
            className={styles.doctorMenuBtn} 
            onClick={() => setIsDoctorOpen(!isDoctorOpen)}
          >
            <span className={styles.doctorTitle}>
              算数博士に聞いてみよう！ {isDoctorOpen ? '▲' : '▼'}
            </span>
          </button>

          {isDoctorOpen && (
            <div className={styles.doctorContent}>
              <p className={styles.doctorSub}>[比較対象を選んでね]</p>

              {/* 💡 2列に並べるためのコンテナ */}
              <div className={styles.twoColumnButtons}>
                
                {/* 1列目：ポケモングループ */}
                <div className={styles.buttonColumn}>
                  <div className={styles.columnLabel}>ポケモン</div>
                  {pokemonTargets.map((target) => (
                    <button
                      key={target.id}
                      className={`${styles.targetBtn} ${activeTargetId === target.id ? styles.targetBtnActive : ''}`}
                      onClick={() => setActiveTargetId(target.id)}
                    >
                      {target.name}
                    </button>
                  ))}
                </div>

                {/* 2列目：物のグループ */}
                <div className={styles.buttonColumn}>
                  <div className={styles.columnLabel}>身の回りのもの</div>
                  {itemTargets.map((target) => (
                    <button
                      key={target.id}
                      className={`${styles.targetBtn} ${activeTargetId === target.id ? styles.targetBtnActive : ''}`}
                      onClick={() => setActiveTargetId(target.id)}
                    >
                      {target.name}
                    </button>
                  ))}
                </div>

              </div>

              {/* 結果表示エリア */}
              <div className={styles.resultArea}>
                <p className={styles.resultSub}>[ 結果表示エリア(算数博士の答え) ]</p>
                
                <div className={styles.resultRow}>
                  <span className={styles.resultLabel}>📐 身長 : {currentTarget.name}</span>
                  <span className={styles.resultValue}>
                    <strong>{formatCount(heightCount)}</strong> {currentTarget.unit}
                  </span>
                </div>
                
                <div className={styles.resultRow}>
                  <span className={styles.resultLabel}>⚖️ 体重 : {currentTarget.name}</span>
                  <span className={styles.resultValue}>
                    <strong>{formatCount(weightCount)}</strong> {currentTarget.unit}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}