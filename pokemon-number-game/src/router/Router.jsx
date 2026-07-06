import { Routes, Route } from "react-router-dom";

import Layout from "../components/common/Layout/Layout";

import Top from "../pages/Top/Top";
import Home from "../pages/Home/Home";
import Blackjack from "../pages/Blackjack/Blackjack";
import Poker from "../pages/Poker/Poker";

export default function Router() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Top />} />
        <Route path="/home" element={<Home />} />
        <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/poker" element={<Poker />} />
      </Route>
    </Routes>
  );
}