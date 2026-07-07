// src/pages/PokedexPage/PokedexPage.jsx
import React, { useState, useEffect } from 'react';
import { PokedexView, PokemonModal } from '../../components/Pokedex'; 
import { getPokemonJpName } from '../../data/pokemonNamesJp';

export default function PokedexPage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(40);
  
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [activeTab, setActiveTab] = useState('発見一覧');
  const [selectedRegion, setSelectedRegion] = useState('カントー');
  const [sortOrder, setSortOrder] = useState('large');
  const [hideUncaptured, setHideUncaptured] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // 💡 【新設】検索窓の入力を管理

  useEffect(() => {
    async function fetchAllPokemon() {
      try {
        setLoading(true);
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const baseData = await res.json();
        
        const pokemonDetailsPromises = baseData.results.map(async (p, index) => {
          const id = index + 1;
          const paddedId = String(id).padStart(3, '0');
          const displayName = getPokemonJpName(id, p.name);

          let realHeight = (id % 5) * 0.4 + 0.3;
          let realWeight = (id % 7) * 12.5 + 4.5;

          try {
            if (id <= 151 || id === 249 || id === 384 || id === 906 || id === 1008) {
              const detailRes = await fetch(p.url);
              const detailData = await detailRes.json();
              realHeight = detailData.height / 10;
              realWeight = detailData.weight / 10;
            }
          } catch (e) {
            console.warn(`ID:${id} の詳細データの取得に失敗しました。`);
          }

          return {
            id: paddedId,
            rawId: id,
            name: displayName,
            englishName: p.name, // 💡 英語名でも検索できるように追加
            imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            height: parseFloat(realHeight.toFixed(1)),
            weight: parseFloat(realWeight.toFixed(1)),
            region: getRegionById(id),
            isLegendary: id === 150 || id === 249 || id === 384 || id === 1008,
            isCaptured: id % 3 !== 0 // 現在の発見済みのダミーロジック
          };
        });

        const formatted = await Promise.all(pokemonDetailsPromises);
        setPokemonList(formatted);
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAllPokemon();
  }, []);

  function getRegionById(id) {
    if (id <= 151) return 'カントー';
    if (id <= 251) return 'ジョウト';
    if (id <= 386) return 'ホウエン';
    if (id <= 493) return 'シンオウ';
    if (id <= 649) return 'イッシュ';
    if (id <= 721) return 'カロス';
    if (id <= 809) return 'アローラ';
    if (id <= 898) return 'ガラル';
    return 'パルデア';
  }

  // 💡 【自動連動】1025匹の中で「isCapturedがtrue」の合計数をリアルタイム計算
  const capturedCount = pokemonList.filter(p => p.isCaptured).length;

  // --- フィルタリングとソートのリアルタイム処理 ---
  let filteredPokemons = [...pokemonList];

  // 💡 【新設】検索窓の絞り込みを最優先で適用（日本語名、英語名、IDのいずれかでヒット）
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filteredPokemons = filteredPokemons.filter(p => 
      p.name.includes(query) || 
      p.englishName.toLowerCase().includes(query) ||
      p.id.includes(query)
    );
  }

  // タブごとの切り替え
  if (activeTab === '発見一覧') {
    if (hideUncaptured) {
      filteredPokemons = filteredPokemons.filter(p => p.isCaptured);
    }
    filteredPokemons.sort((a, b) => a.rawId - b.rawId);
  } else {
    filteredPokemons = filteredPokemons.filter(p => p.isCaptured);

    if (activeTab === '伝説') {
      filteredPokemons = filteredPokemons.filter(p => p.isLegendary);
    } else if (activeTab === '地方') {
      filteredPokemons = filteredPokemons.filter(p => p.region === selectedRegion);
    } else if (activeTab === '身長') {
      filteredPokemons.sort((a, b) => sortOrder === 'large' ? b.height - a.height : a.height - b.height);
    } else if (activeTab === '体重') {
      filteredPokemons.sort((a, b) => sortOrder === 'large' ? b.weight - a.weight : a.weight - b.weight);
    }
  }

  const displayedPokemons = filteredPokemons.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 40, filteredPokemons.length));
  };

  // タブやソートが変わったらスクロール制限をリセット
  useEffect(() => {
    setVisibleCount(40);
  }, [activeTab, selectedRegion, sortOrder, searchQuery]); // 💡 検索時もリセット

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', fontSize: '20px', fontWeight: 'bold' }}>ポケモンのデータをよみこみ中... 🦖</div>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <PokedexView 
        pokemons={displayedPokemons}
        totalCount={filteredPokemons.length}
        visibleCount={visibleCount}
        loadMore={loadMore}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        hideUncaptured={hideUncaptured}
        setHideUncaptured={setHideUncaptured}
        onSelectPokemon={setSelectedPokemon} 
        searchQuery={searchQuery}         // 💡 引っ越し先へ渡す
        setSearchQuery={setSearchQuery}   // 💡 引っ越し先へ渡す
        capturedCount={capturedCount}     // 💡 連動したGET数を渡す
      />

      {selectedPokemon && (
        <PokemonModal 
          pokemon={selectedPokemon} 
          onClose={() => setSelectedPokemon(null)} 
        />
      )}
    </div>
  );
}