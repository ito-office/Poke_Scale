import { useNavigate } from "react-router-dom";

import styles from "./Top.module.css";
import topBackground from "../../assets/images/top/top-background.png";

export default function Top() {
  const navigate = useNavigate();

  return (
    <main
      className={styles.top}
      style={{
        backgroundImage: `url(${topBackground})`,
      }}
    >
      {/* 背景を少し暗くする */}
      {/* <div className={styles.overlay}></div> */}

      {/* タイトル画面 */}
      <section className={styles.content}>

        {/* ゲームスタート */}
        <button
          type="button"
          aria-label="ゲームスタート"
          className={styles.startButton}
          onClick={() => navigate("/home")}
        />


        {/* 設定 */}
        <button
          type="button"
          aria-label="設定"
          className={styles.settingButton}
          onClick={() => navigate("/settings")}
        />

        {/* 会社情報 */}
        <button
          type="button"
          aria-label="会社情報"
          className={styles.companyButton}
          onClick={() => navigate("/company")}
        />

        {/* 利用規約 */}
        <button
          type="button"
          aria-label="利用規約"
          className={styles.policyButton}
          onClick={() => navigate("/terms")}
        />

      </section>
    </main>
  );
}