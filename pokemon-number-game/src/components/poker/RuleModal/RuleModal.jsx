import React from 'react';
import styles from './RuleModal.module.css';

export default function RuleModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>🎮 遊び方 ＆ ボーナス一覧</h2>
        
        <section className={styles.section}>
          <h3>❓ ルール</h3>
          <p>ポケモンの身長を合計し、CPUより高得点を目指そう！</p>
        </section>

        <section className={styles.section}>
          <h3>📏 ボーナス一覧</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>コンボ名</th>
                <th>条件</th>
                <th>効果</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>👑 伝説降臨</strong></td>
                <td>伝説ポケモンを1匹以上含む</td>
                <td>1匹: ×2 / 2匹: ×5 / 3匹: ×10<br/>4匹: ×50 / 5匹: ×100 (最終スコア)</td>
              </tr>
              <tr>
                <td><strong>🧲 シンクロ</strong></td>
                <td>同じ身長が2匹以上</td>
                <td>2匹: ×2 / 3匹: ×3 / 4匹: ×4<br/>5匹: ×5 (合計身長)</td>
              </tr>
              <tr>
                <td><strong>🐭 ちびちびコンボ</strong></td>
                <td>1m未満が3匹以上</td>
                <td>ちびちびポケモンの合計身長 ×3</td>
              </tr>
            </tbody>
          </table>
        </section>

        <button className={styles.closeBtn} onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}