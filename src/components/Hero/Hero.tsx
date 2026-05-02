import React from 'react';
import styles from './Hero.module.css';
import PodcastCoverArt from "../../assets/podcast_cover_art.webp";

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.backgroundBlobs}>
        <div className={styles.blobPink}></div>
        <div className={styles.blobCyan}></div>
      </div>
      <div className={styles.container}>
        <div className={styles.textCol}>
          <h1 className={styles.title}>
            <span className={styles.lights}>LIGHTS</span>
            <span className={`${styles.outAnd} tape-edge`}>OUT &</span>
            <span className={styles.chisme}>CHISME</span>
            <span className={styles.on}>...on!</span>
          </h1>
        </div>
        <div className={styles.imageCol}>
          <div className={styles.imageBackdrop}></div>
          <div className={styles.imageWrapper}>
            <img
              alt="Circuitos y Chisme Podcast Hosts"
              className={styles.image}
              src={PodcastCoverArt}
              fetchPriority="high"
              loading="eager"
              width="1000"
              height="1000"
            />
            <div className={styles.badge}>New Episodes Weekly!</div>
          </div>
        </div>
      </div>
    </section>
  );
};
