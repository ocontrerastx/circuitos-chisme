import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div
        className={styles.watermarkContainer}
        aria-hidden="true"
      >
        <span className={styles.watermark}>
          BOX BOX
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.brand}>
          CIRCUITOS
          <br />Y CHISME
        </div>
        <p className={styles.copyright}>
          ©{new Date().getFullYear()} CIRCUITOS Y CHISME
        </p>
      </div>
    </footer>
  );
};
