import React from 'react';
import styles from './Socials.module.css';

interface SocialsProps {
  podcastLinks: {
    spotify: string;
    apple: string;
    instagram: string;
    tiktok: string;
  };
}

export const Socials: React.FC<SocialsProps> = ({ podcastLinks }) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <a
            href={podcastLinks.tiktok}
            target="_blank"
            rel="noreferrer"
            className={styles.tiktokCard}
          >
            <span
              className={`material-symbols-outlined ${styles.tiktokIcon}`}
              aria-hidden="true"
            >
              video_library
            </span>
            <h5 className={styles.cardTitle}>
              TIKTOK
            </h5>
            <p className={styles.cardDesc}>
              Behind the scenes & Race weekend chisme
            </p>
          </a>
          <a
            href={podcastLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className={styles.igCard}
          >
            <span
              className={`material-symbols-outlined ${styles.igIcon}`}
              aria-hidden="true"
            >
              alternate_email
            </span>
            <h5 className={styles.cardTitleSmall}>
              INSTAGRAM
            </h5>
            <p className={styles.cardDescSmall}>
              Daily updates & Paddock life
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};
