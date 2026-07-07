// src/components/Pokedex/FilterSidebar/FilterSidebar.jsx
import React from 'react';
import styles from './FilterSidebar.module.css';

export default function FilterSidebar({ showCapturedOnly, onChangeCapturedFilter }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <h3 className={styles.title}>じょうたい</h3>
        <label className={styles.checkboxLabel}>
          <input 
            type="checkbox" 
            checked={showCapturedOnly}
            onChange={(e) => onChangeCapturedFilter(e.target.checked)}
            className={styles.checkbox} 
          />
          <div className={styles.labelTextContainer}>
            <span className={styles.labelText}>みつけたポケモンのみ</span>
          </div>
        </label>
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>Keywords</h3>
        <div className={styles.tags}>
          {['Spring', 'Smart'].map(tag => (
            <span key={tag} className={styles.tag}>{tag} <button className={styles.tagClose}>×</button></span>
          ))}
        </div>
      </div>
    </aside>
  );
}