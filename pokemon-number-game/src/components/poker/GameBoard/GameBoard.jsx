import React, { useState, useEffect, useCallback } from 'react';
import styles from './GameBoard.module.css';

import ScoreBoard from '../ScoreBoard/ScoreBoard';
import CardZone from '../CardZone/CardZone';
import ActionButtons from '../ActionButtons/ActionButtons';
import RuleModal from '../RuleModal/RuleModal';

export default function GameBoard({ onBackToHome }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [hasExchanged, setHasExchanged] = useState(false);
  
  // 🔑 新しく追加する状態：成立した役の名前を保存する
  const [activeRoles, setActiveRoles] = useState([]);

  // 🎲 ポケモンデータを1匹分だけ取得するヘルパー関数
  const fetchSinglePokemon = async () => {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const resPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = await resPokemon.json();

    const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
    const species = await resSpecies.json();

    const japaneseName = species.names.find(name => name.language.name === 'ja')?.name || pokemon.name;

    return {
      name: japaneseName,
      height: pokemon.height / 10,
      img: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
      isLegendary: species.is_legendary || species.is_mythical,
      isOpen: true,
    };
  };

  // 🔑 【コアロジック】オリジナルの役とスコアを計算する関数
  const calculateFinalScore = (currentCards) => {
    if (currentCards.length === 0) return { score: 0, roles: [] };

    let roles = [];
    let baseScore = 0;

    // --- 1. ちびちびコンボ の判定 ---
    const smallPokemons = currentCards.filter(c => c.height < 1.0);
    const otherPokemons = currentCards.filter(c => c.height >= 1.0);

    if (smallPokemons.length >= 3) {
      const smallSum = smallPokemons.reduce((sum, c) => sum + c.height, 0);
      const otherSum = otherPokemons.reduce((sum, c) => sum + c.height, 0);
      // ちびちびの合計を3倍 ＋ それ以外の合計
      baseScore = (smallSum * 3) + otherSum;
      roles.push(`ちびちびコンボ (1m未満×${smallPokemons.length})`);
    } else {
      // 通常の合計身長
      baseScore = currentCards.reduce((sum, c) => sum + c.height, 0);
    }

    // --- 2. シンクロ の判定 ---
    // 身長ごとに枚数をカウントするマップを作成
    const heightMap = {};
    currentCards.forEach(c => {
      heightMap[c.height] = (heightMap[c.height] || 0) + 1;
    });

    // 各身長のグループに対してボーナスを計算
    Object.keys(heightMap).forEach(h => {
      const count = heightMap[h];
      const heightVal = parseFloat(h);

      if (count >= 2) {
        const groupSum = heightVal * count; // そのグループの合計身長
        let synchroBonus = 0;
        let roleName = "";

        if (count === 2) { synchroBonus = groupSum * 2; roleName = "シンクロ"; }
        else if (count === 3) { synchroBonus = groupSum * 3; roleName = "トリプルシンクロ"; }
        else if (count === 4) { synchroBonus = groupSum * 4; roleName = "スーパーシンクロ"; }
        else if (count === 5) { synchroBonus = groupSum * 5; roleName = "ミラクルシンクロ"; }

        baseScore += synchroBonus;
        roles.push(`${roleName} (${heightVal}m×${count})`);
      }
    });

    // --- 3. 伝説降臨 の判定 ---
    const legendaryCount = currentCards.filter(c => c.isLegendary).length;
    let finalScore = baseScore;

    if (legendaryCount > 0) {
      let multiplier = 1;
      if (legendaryCount === 1) multiplier = 2;
      else if (legendaryCount === 2) multiplier = 5;
      else if (legendaryCount === 3) multiplier = 10;
      else if (legendaryCount === 4) multiplier = 50;
      else if (legendaryCount === 5) multiplier = 100;

      finalScore = baseScore * multiplier;
      roles.push(`伝説降臨 (×${multiplier}倍)`);
    }

    return {
      score: parseFloat(finalScore.toFixed(1)),
      roles: roles
    };
  };

  // 🔄 ゲーム開始時に5枚すべてを新規に引く
  const initGame = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const promises = Array.from({ length: 5 }, () => fetchSinglePokemon());
      const newCards = await Promise.all(promises);
      setCards(newCards);
      setSelectedIndices([]);
      setHasExchanged(false);
      setActiveRoles([]); // 役をリセット
    } catch (error) {
      console.error("ゲーム初期化失敗:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // 🔄 選択されたカードのみを交換する関数
  const exchangeSelectedCards = useCallback(async () => {
    if (isLoading || hasExchanged || selectedIndices.length === 0) return;
    setIsLoading(true);

    try {
      const nextCards = [...cards];
      const promises = selectedIndices.map(async (index) => {
        const newCard = await fetchSinglePokemon();
        nextCards[index] = newCard;
      });

      await Promise.all(promises);
      setCards(nextCards);
      setSelectedIndices([]);
      setHasExchanged(true);

      // 🔑 交換完了後に、最終的な手札で役を判定する
      const result = calculateFinalScore(nextCards);
      setActiveRoles(result.roles);

    } catch (error) {
      console.error("カード交換失敗:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasExchanged, selectedIndices, cards]);

  // 🔑 カードがクリックされたときの処理
  const handleCardClick = (index) => {
    if (hasExchanged || isLoading) return;

    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  useEffect(() => {
    initGame();
  }, []);

  // 🔑 リアルタイム、または確定後のスコアと役を取得
  const gameResult = calculateFinalScore(cards);

  const displayRoles = gameResult.roles;

  return (
    <div className={styles.gameScreen}>
      <ScoreBoard 
        cpuScore={12.5} 
        playerScore={gameResult.score} 
        deckCount={hasExchanged ? "勝負！" : "交換残り1回"} 
      />
      
      {/* 🔑 位置をここ（スコアボードの真下）に固定します */}
      <div className={styles.roleContainer}>
        {displayRoles.length > 0 ? (
          <div className={styles.roleOverlay}>
            {displayRoles.map((role, i) => (
              <span key={i} className={styles.roleBadge}>✨ {role}</span>
            ))}
          </div>
        ) : (
          /* 🔑 役がない時も領域を確保して、カードが上下にガタガタ動くのを防ぐ */
          <div className={styles.noRole}>発動中のコンボ: なし</div>
        )}
      </div>
      
      <main className={styles.mainContent}>
        <CardZone 
          cards={cards} 
          selectedIndices={selectedIndices} 
          onCardClick={handleCardClick} 
          isGlobalLoading={isLoading}
        />
      </main>

      {/* （以下略、ActionButtonsなど） */}

      <ActionButtons 
        onOpenModal={() => setIsModalOpen(true)} 
        onRestart={() => {
          if (hasExchanged) {
            initGame();
          } else {
            // もし1枚も選択せずに交換ボタンを押したら、そのまま勝負（交換スキップ）にする
            if (selectedIndices.length === 0) {
              setHasExchanged(true);
              const result = calculateFinalScore(cards);
              setActiveRoles(result.roles);
            } else {
              exchangeSelectedCards();
            }
          }
        }}
        onQuit={onBackToHome}
        buttonText={hasExchanged ? "もう1回遊ぶ" : (selectedIndices.length === 0 ? "このまま勝負！" : "選択したカードを交換")}
      />

      <RuleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}