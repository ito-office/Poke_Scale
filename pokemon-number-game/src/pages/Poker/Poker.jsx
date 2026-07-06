import { useNavigate } from "react-router-dom";
import styles from "./Poker.module.css";
import GameBoard from "../../components/poker/GameBoard/GameBoard";

export default function Poker() {
  const navigate = useNavigate();

  return (
    <main className={styles.poker}>
      <GameBoard
        onBackToHome={() => navigate("/home")}
      />
    </main>
  );
}