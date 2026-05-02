import React from 'react';
import styles from './NextRace.module.css';

interface RaceData {
  name: string;
  location: string;
  date: string;
  round: string;
  isLive: boolean;
  circuitImage: string;
}

interface NextRaceProps {
  nextRace: RaceData | null;
}

export const NextRace: React.FC<NextRaceProps> = ({ nextRace }) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.leftContent}>
            <div className={styles.headerRow}>
              <span
                className={`${styles.badge} ${
                  nextRace?.isLive ? styles.badgeLive : styles.badgeIntel
                }`}
              >
                {nextRace?.isLive ? "RACE WEEKEND ACTIVE" : "LIVE INTEL"}
              </span>
              <div className={styles.divider}></div>
            </div>
            <h2 className={styles.title}>
              {nextRace?.isLive ? "CURRENT:" : "DESTINATION:"}
              <br />
              <span className={styles.highlight}>
                {nextRace?.name || "FETCHING..."}
              </span>
            </h2>
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <p className={styles.statLabel}>Round</p>
                <p className={styles.statValue}>
                  {nextRace?.round || "..."}
                </p>
              </div>
              <div className={styles.statBoxPrimary}>
                <p className={styles.statLabelPrimary}>Race Day</p>
                <p className={styles.statValuePrimary}>
                  {nextRace?.date || "..."}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.imageContainer}>
            <img
              alt={
                nextRace?.name
                  ? `Circuit map of ${nextRace.name}`
                  : "Formula 1 Race Circuit Map"
              }
              className={styles.image}
              src={nextRace?.circuitImage}
              loading="lazy"
              width="800"
              height="600"
            />
            <div className={styles.watermark}>
              STATUS: {nextRace?.isLive ? "LIVE" : "IDLE"}
              <br />
              SOURCE: OPENF1_DATA
              <br />
              TRACK: {nextRace?.location}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
