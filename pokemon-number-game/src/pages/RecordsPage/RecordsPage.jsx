// src/pages/RecordsPage/RecordsPage.jsx
import React, { useState } from 'react';
import RecordsView from '../../components/RecordsView/RecordsView';

export default function RecordsPage() {
  const [activeGame, setActiveGame] = useState('ブラック・ジャック');

  // 💡 添付していただいたイメージに基づいたダミーデータ
  const stats = {
    poker: { total: 42, maxWin: 5 },
    blackjack: { total: 100, maxWin: 15 }
  };

  const currentStats = activeGame === 'ブラック・ジャック' ? stats.blackjack : stats.poker;

  // 最小誤差ランキング（TOP3）のダミーデータ
  const rankingData = [
    {
      rank: 1,
      error: "1.0kg",
      target: "お題 : 100kg",
      pokemons: [
        { id: "025", name: "ピカチュウ", weight: "0.6kg", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
        { id: "025", name: "ピカチュウ", weight: "0.6kg", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
        { id: "025", name: "ピカチュウ", weight: "0.6kg", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
        { id: "025", name: "ピカチュウ", weight: "0.6kg", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
        { id: "025", name: "ピカチュウ", weight: "0.6kg", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
      ]
    },
    {
      rank: 2,
      error: "3.0kg",
      target: "お題 : 300kg",
      pokemons: [
        { id: "025", name: "ピカチュウ", weight: "0.6kg", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
        { id: "025", name: "ピカチュウ", weight: "0.6kg", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
        { id: "025", name: "ピカチュウ", weight: "0.6kg", imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
      ]
    }
  ];

  return (
    <RecordsView 
      activeGame={activeGame}
      setActiveGame={setActiveGame}
      stats={currentStats}
      rankings={rankingData}
    />
  );
}