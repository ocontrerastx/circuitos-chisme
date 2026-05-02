import React from 'react';
import styles from './PodcastEpisodes.module.css';
import EpisodeCoverArt from "../../assets/episode_cover_art.webp";

interface PodcastEpisode {
  trackName: string;
  description: string;
  releaseDate: string;
  trackTimeMillis: number;
  trackViewUrl: string;
}

interface PodcastEpisodesProps {
  latestEpisode: PodcastEpisode | undefined;
  podcastLinks: {
    spotify: string;
    apple: string;
    instagram: string;
    tiktok: string;
  };
}

export const formatDuration = (millis: number | undefined): string => {
  if (!millis) return "TBA";
  const mins = Math.floor(millis / 60000);
  return `${mins} MINUTES OF DRAMA`;
};

export const stripHtml = (html: string | undefined): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

export const PodcastEpisodes: React.FC<PodcastEpisodesProps> = ({ latestEpisode, podcastLinks }) => {
  return (
    <section className={styles.section}>
      <div className={styles.diagonalStrip}></div>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <div className={styles.card}>
            <img
              className={styles.image}
              src={EpisodeCoverArt}
              alt="Latest Podcast Episode Cover Art"
              loading="lazy"
              width="600"
              height="600"
            />
            <div className={styles.badgeWrapper}>
              <span className={styles.badge}>
                LATEST EPISODE
              </span>
            </div>
            <div className={styles.badgeWrapperBottom}>
              <span className={styles.badge}>
                {formatDuration(latestEpisode?.trackTimeMillis)}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.rightContent}>
          <h3 className={styles.title}>
            {latestEpisode?.trackName || "Loading latest chisme..."}
          </h3>
          <h4 className={styles.description}>
            "{stripHtml(latestEpisode?.description)}"
          </h4>
          <div className={styles.buttons}>
            <a
              className={styles.button}
              href={podcastLinks.spotify}
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on Spotify"
            >
              LISTEN ON SPOTIFY{" "}
              <span
                className={`material-symbols-outlined ${styles.icon}`}
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </a>
            <a
              className={styles.button}
              href={podcastLinks.apple}
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on Apple Podcasts"
            >
              LISTEN ON APPLE{" "}
              <span
                className={`material-symbols-outlined ${styles.icon}`}
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
