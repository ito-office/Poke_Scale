import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import BJPokemonCard from './BJPokemonCard';
import styles from './BlackjackGame.module.css';

function BlackjackGame() {

  const navigate = useNavigate();
  // プレイヤー側の状態
  const [deck, setDeck] = useState([]); 
  const [totalWeight, setTotalWeight] = useState(0); 
  
  // CPU側の状態 💡
  const [cpuDeck, setCpuDeck] = useState([]);
  const [cpuTotalWeight, setCpuTotalWeight] = useState(0);

  const [targetWeight, setTargetWeight] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'cpuTurn', 'win', 'lose', 'burst', 'draw'
  const [resultMessage, setResultMessage] = useState('');


  const isInitialDrawStarted = useRef(false);

  // ポケモンをランダムに取得する共通関数
  const fetchRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    return {
      name: data.name.toUpperCase(),
      image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
      height: data.height / 10,
      weight: data.weight / 10,
      types: data.types.map((t) => t.type.name),
      isLegendary: data.species.url.includes('legendary') || data.species.url.includes('mythical')
    };
  };

  // プレイヤーのドロー
  const drawPlayerPokemon = async () => {
    if (gameState !== 'playing') return;
    setLoading(true);
    try {
      const newPokemon = await fetchRandomPokemon();
      const nextWeight = Math.round((totalWeight + newPokemon.weight) * 10) / 10;
      
      setDeck([...deck, newPokemon]);
      setTotalWeight(nextWeight);

      if (nextWeight > targetWeight) {
        setGameState('burst');
        setResultMessage(`💥 バースト！ 目標の ${targetWeight}kg を超えてしまいました...`);
      }
    } catch (error) {
      console.error("プレイヤーのドローに失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  // ゲームの初期化（お互いに2枚ずつ配る）
  const initGame = async () => {
    setDeck([]);
    setTotalWeight(0);
    setCpuDeck([]);
    setCpuTotalWeight(0);
    setGameState('playing');
    setResultMessage('');
    isInitialDrawStarted.current = false;
    
    const randomTarget = (Math.floor(Math.random() * 10) + 3) * 50; // 150〜600kg
    setTargetWeight(randomTarget);
  };

  useEffect(() => {
    initGame();
  }, []);

  // 最初にお互い2枚ずつ時間差で引く演出
  useEffect(() => {
    if (targetWeight > 0 && !isInitialDrawStarted.current) {
      isInitialDrawStarted.current = true;
      
      const startInitialDraw = async () => {
        setLoading(true);
        try {
          // 1枚目：プレイヤー
          const p1 = await fetchRandomPokemon();
          setDeck([p1]);
          setTotalWeight(p1.weight);

          // 0.2秒後：CPU 1枚目
          await new Promise(resolve => setTimeout(resolve, 200));
          const c1 = await fetchRandomPokemon();
          setCpuDeck([c1]);
          setCpuTotalWeight(c1.weight);

          // 0.4秒後：プレイヤー 2枚目
          await new Promise(resolve => setTimeout(resolve, 200));
          const p2 = await fetchRandomPokemon();
          setDeck([p1, p2]);
          setTotalWeight(Math.round((p1.weight + p2.weight) * 10) / 10);

          // 0.6秒後：CPU 2枚目（画面上は裏向きになる）
          await new Promise(resolve => setTimeout(resolve, 200));
          const c2 = await fetchRandomPokemon();
          setCpuDeck([c1, c2]);
          setCpuTotalWeight(Math.round((c1.weight + c2.weight) * 10) / 10);

        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      startInitialDraw();
    }
  }, [targetWeight]);

  // CPUの思考＆自動ドローロジック
  const handleStand = async () => {
    if (gameState !== 'playing' || loading) return;
    setGameState('cpuTurn');
    setLoading(true);

    // CPUは目標値の80%に届くまで引き続けるAI
    const cpuThreshold = targetWeight * 0.8;
    let currentCpuWeight = cpuTotalWeight;
    let currentCpuDeck = [...cpuDeck];

    // 本物のカジノのように、1枚ずつ時間差で引くのを見せる
    while (currentCpuWeight < cpuThreshold) {
      await new Promise(resolve => setTimeout(resolve, 800)); // 0.8秒ごとに引く
      try {
        const newPokemon = await fetchRandomPokemon();
        currentCpuWeight = Math.round((currentCpuWeight + newPokemon.weight) * 10) / 10;
        currentCpuDeck.push(newPokemon);
        
        setCpuDeck([...currentCpuDeck]);
        setCpuTotalWeight(currentCpuWeight);

        // CPUがバーストしたらその時点で終了
        if (currentCpuWeight > targetWeight) {
          break;
        }
      } catch (e) {
        console.error(e);
        break;
      }
    }

    // 最終勝敗判定
    await new Promise(resolve => setTimeout(resolve, 600));
    if (currentCpuWeight > targetWeight) {
      setGameState('win');
      setResultMessage(`🎉 あなたの勝ち！ CPUがバースト（${currentCpuWeight}kg）しました！`);
    } else if (totalWeight > currentCpuWeight) {
      setGameState('win');
      setResultMessage(`🎉 あなたの勝ち！ CPU（${currentCpuWeight}kg）より目標に近いです！`);
    } else if (totalWeight === currentCpuWeight) {
      setGameState('lose');
      setResultMessage(`🤝 引き分け！だけどカジノルールでCPU（${currentCpuWeight}kg）の勝ち！`);
    } else {
      setGameState('lose');
      setResultMessage(`😢 あなたの負け... CPU（${currentCpuWeight}kg）の方が目標に近いです。`);
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>⚖️ 重さ × ブラックジャック</h2>
        <div className={styles.targetBox}>目標: {targetWeight} kg 以内！</div>
        <div className={styles.scoreContainer}>
          <div className={styles.scoreBadge}>あなた: {totalWeight} kg</div>
          {/* 💡 プレイ中はCPUの1枚目の重さだけ、スタンド後は合計を表示 */}
          <div className={styles.scoreBadgeCpu}>
            CPU: {gameState === 'playing' ? `${cpuDeck[0]?.weight || 0} kg + ?` : `${cpuTotalWeight} kg`}
          </div>
        </div>
      </div>

      {/* 勝敗判定表示 */}
      {['win', 'lose', 'burst'].includes(gameState) && (
        <div className={`${styles.resultCard} ${styles[gameState]}`}>
          <h3>{gameState.toUpperCase()}</h3>
          <p>{resultMessage}</p>
          <button className={styles.retryBtn} onClick={initGame}>もう一度遊ぶ</button>
        </div>
      )}

      <div className={styles.gameTable}>
        {/* 💡 CPUのフィールド */}
        <div className={styles.fieldSection}>
          <span className={styles.fieldLabel}>CPU HAND</span>
          <div className={styles.cardStack}>
            {cpuDeck.map((pokemon, index) => (
              <div 
                key={index} 
                className={styles.cardWrapper}
                style={{ transform: `translateX(${index * 45}px)` }} 
              >
                {/* 💡 プレイ中は2枚目（index 1）を裏向きにする */}
                <BJPokemonCard 
                  pokemon={pokemon} 
                  isHidden={gameState === 'playing' && index === 1} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* 💡 プレイヤーのフィールド */}
        <div className={styles.fieldSection}>
          <span className={styles.fieldLabel}>YOUR HAND</span>
          <div className={styles.cardStack}>
            {deck.map((pokemon, index) => (
              <div 
                key={index} 
                className={styles.cardWrapper}
                style={{ transform: `translateX(${index * 45}px)` }} 
              >
                <BJPokemonCard pokemon={pokemon} />
              </div>
            ))}
          </div>
        </div>
        
        {loading && <div className={styles.loadingLabel}>ドロー中...</div>}
      </div>

      {gameState === 'playing' && (
        <div className={styles.btnArea}>
          <button className={`${styles.actionBtn} ${styles.hit}`} onClick={drawPlayerPokemon} disabled={loading}>
            もう1匹ドロー（Hit）
          </button>
          <button className={`${styles.actionBtn} ${styles.stand}`} onClick={handleStand} disabled={loading || deck.length < 2}>
            ここでスタンド（Stand）
          </button>
        </div>
      )}

      <button className={styles.backBtn} onClick={() => navigate("/home")}>
        ホームへ戻る
      </button>
    </div>
  );
}

export default BlackjackGame;