import { Routes, Route } from "react-router-dom";

import Layout from "../components/common/Layout/Layout";

import Top from "../pages/Top/Top";
import Home from "../pages/Home/Home";
import Blackjack from "../pages/Blackjack/Blackjack";
import Poker from "../pages/Poker/Poker";

// 👇 新しいページをインポート
import PokedexPage from "../pages/PokedexPage/PokedexPage";
import RecordsPage from '../pages/RecordsPage/RecordsPage'; 

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Top />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/poker" element={<Poker />} />

        {/* 👇 図鑑専用のパスを追加 */}
        <Route path="/pokedex" element={<PokedexPage />} />
        <Route path="/halloffame" element={<RecordsPage />} />
      </Route>
    </Routes>
  );
}