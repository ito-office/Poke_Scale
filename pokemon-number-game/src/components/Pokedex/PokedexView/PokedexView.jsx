// src/components/Pokedex/PokedexView/PokedexView.jsx

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PokedexView.module.css";

export default function PokedexView({
  pokemons,
  totalCount,
  visibleCount,
  loadMore,
  activeTab,
  setActiveTab,
  selectedRegion,
  setSelectedRegion,
  sortOrder,
  setSortOrder,
  hideUncaptured,
  setHideUncaptured,
  onSelectPokemon,
  searchQuery,
  setSearchQuery,
  capturedCount,
}) {
  const navigate = useNavigate();

  const tabs = ["発見一覧", "身長", "体重", "地方", "伝説"];

  const regions = [
    "カントー",
    "ジョウト",
    "ホウエン",
    "シンオウ",
    "イッシュ",
    "カロス",
    "アローラ",
    "ガラル",
    "パルデア",
  ];

  const triggerRef = useRef(null);

  useEffect(() => {
    if (visibleCount >= totalCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, [visibleCount, totalCount, loadMore]);

  return (
    <div className={styles.container}>
      {/* ===========================
          ヘッダー
      ============================ */}
      <div className={styles.headerRow}>
        {/* ホームへ戻る */}
        <button
          className={styles.homeButton}
          onClick={() => navigate("/home")}
        >
          ← ホームへ
        </button>

        {/* タイトル */}
        <div className={styles.titleBox}>
          ポケモン図鑑
        </div>

        {/* 検索 */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>

          <input
            type="text"
            placeholder="名前や図鑑番号で検索"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ===========================
          タブ
      ============================ */}
      <div className={styles.subHeaderRow}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${
                activeTab === tab ? styles.tabActive : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.rightControls}>
          {activeTab === "発見一覧" && (
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={hideUncaptured}
                onChange={(e) => setHideUncaptured(e.target.checked)}
                className={styles.toggleInput}
              />

              <span className={styles.toggleText}>
                🔎 未発見をかくす
              </span>
            </label>
          )}

          <div className={styles.badge}>
            GET : {capturedCount}/1025匹
          </div>
        </div>
      </div>

            {/* ===========================
          コントロール
      ============================ */}
      {(activeTab === "身長" || activeTab === "体重") && (
        <div className={styles.sortControl}>
          <button
            className={`${styles.sortBtn} ${
              sortOrder === "large" ? styles.sortBtnActive : ""
            }`}
            onClick={() => setSortOrder("large")}
          >
            {activeTab === "身長" ? "大きい順 ▽" : "重い順 ▽"}
          </button>

          <button
            className={`${styles.sortBtn} ${
              sortOrder === "small" ? styles.sortBtnActive : ""
            }`}
            onClick={() => setSortOrder("small")}
          >
            {activeTab === "身長" ? "小さい順 △" : "軽い順 △"}
          </button>
        </div>
      )}

      {activeTab === "地方" && (
        <div className={styles.regionSelector}>
          {regions.map((region) => (
            <button
              key={region}
              className={`${styles.regionBtn} ${
                selectedRegion === region ? styles.regionBtnActive : ""
              }`}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>
      )}

      {/* ===========================
          ポケモン一覧
      ============================ */}
      <div className={styles.grid}>
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            className={`${styles.card} ${
              !pokemon.isCaptured ? styles.cardUncaptured : ""
            }`}
            onClick={() =>
              pokemon.isCaptured && onSelectPokemon(pokemon)
            }
            style={{
              cursor: pokemon.isCaptured
                ? "pointer"
                : "not-allowed",
            }}
          >
            <div
              className={`${styles.imagePlaceholder} ${
                !pokemon.isCaptured ? styles.silhouette : ""
              }`}
            >
              <img
                src={pokemon.imageUrl}
                alt={pokemon.name}
                className={styles.pokemonImage}
                loading="lazy"
              />
            </div>

            <div className={styles.cardInfo}>
              <div className={styles.pokemonIdName}>
                No.{pokemon.id}{" "}
                {pokemon.isCaptured
                  ? pokemon.name
                  : "？？？？？"}
              </div>

              <div className={styles.pokemonStats}>
                <div
                  style={{
                    color:
                      activeTab === "身長"
                        ? "#f3a673"
                        : "#666",
                  }}
                >
                  身長 :
                  {pokemon.isCaptured
                    ? ` ${pokemon.height}m`
                    : " ---"}
                </div>

                <div
                  style={{
                    color:
                      activeTab === "体重"
                        ? "#f3a673"
                        : "#666",
                  }}
                >
                  体重 :
                  {pokemon.isCaptured
                    ? ` ${pokemon.weight}kg`
                    : " ---"}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#999",
                    marginTop: "4px",
                  }}
                >
                  {pokemon.region}地方
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===========================
          自動読み込み
      ============================ */}
      {totalCount > visibleCount && (
        <div
          ref={triggerRef}
          className={styles.loadingTrigger}
        >
          さらに読み込み中... 🔄
        </div>
      )}
    </div>
  );
}