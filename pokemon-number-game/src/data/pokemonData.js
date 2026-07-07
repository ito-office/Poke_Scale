// src/data/pokemonData.js

// 地方ごとの図鑑番号の範囲（APIで地方ごとに絞り込むために使います）
export const regionRanges = {
  'カントー': { start: 1, end: 151 },
  'ジョウト': { start: 152, end: 251 },
  'ホウエン': { start: 252, end: 386 },
  'シンオウ': { start: 387, end: 493 },
  'イッシュ': { start: 494, end: 649 },
  'カロス':   { start: 650, end: 721 },
  'アローラ': { start: 722, end: 809 },
  'ガラル':   { start: 810, end: 898 },
  'パルデア': { start: 899, end: 1025 }
};

// 算数博士用の比較対象
export const comparisonTargets = [
  { id: "pikachu", name: "ピカチュウ", height: 0.4, weight: 6.0, unit: "匹分" },
  { id: "randoseru", name: "🎒 ランドセル", height: 0.3, weight: 1.2, unit: "個分" },
  { id: "bus", name: "🚌 バス", height: 3.2, weight: 10000.0, unit: "台分" },
];