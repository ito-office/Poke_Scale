import styles from "./Home.module.css";

import homeBackground from "../../assets/images/home/home-background.png";

import pokedexButton from "../../assets/images/home/pokedex-button.png";
import pokerButton from "../../assets/images/home/poker-button.png";
import blackjackButton from "../../assets/images/home/blackjack-button.png";
import hallOfFameButton from "../../assets/images/home/halloffame-button.png";

import MenuButton from "../../components/dashboard/MenuButton/MenuButton";

export default function Home() {
  return (
    <main
      className={styles.home}
      style={{
        backgroundImage: `url(${homeBackground})`,
      }}
    >
      <section className={styles.container}>

        <MenuButton
          image={pokedexButton}
          alt="図鑑"
          to="/pokedex"
          className={styles.pokedex}
        />

        <MenuButton
          image={hallOfFameButton}
          alt="殿堂入り"
          to="/halloffame"
          className={styles.hallOfFame}
        />

        <MenuButton
          image={pokerButton}
          alt="ポーカー"
          to="/poker"
          className={styles.poker}
        />

        <MenuButton
          image={blackjackButton}
          alt="ブラックジャック"
          to="/blackjack"
          className={styles.blackjack}
        />

        {/* 次のPart */}
        {/* <RandomPokemonCard /> */}

      </section>
    </main>
  );
}