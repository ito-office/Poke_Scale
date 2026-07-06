import BlackjackGame from "../../components/blackjack/BlackjackGame/BlackjackGame";
import styles from "./Blackjack.module.css";

export default function Blackjack() {
  return (
    <main className={styles.blackjack}>
      <BlackjackGame />
    </main>
  );
}