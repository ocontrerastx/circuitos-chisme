import React from 'react';
import styles from './Nav.module.css';

interface NavProps {
  setView: (view: "home" | "episodes" | "live") => void;
  podcastLinks: {
    spotify: string;
    apple: string;
    instagram: string;
    tiktok: string;
  };
}

export const Nav: React.FC<NavProps> = ({ setView, podcastLinks }) => {
  return (
    <nav className={styles.nav}>
      <div
        onClick={() => setView("home")}
        className={styles.logo}
      >
        Circuitos y Chisme
      </div>
      <div className={styles.links}>
        <a
          href={podcastLinks.spotify}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
          aria-label="Listen on Spotify"
        >
          Spotify
        </a>
        <a
          href={podcastLinks.apple}
          target="_blank"
          rel="noreferrer"
          className={styles.link}
          aria-label="Listen on Apple Podcasts"
        >
          Apple Podcasts
        </a>
      </div>
      <a
        href={podcastLinks.apple}
        target="_blank"
        rel="noreferrer"
        className={styles.subscribe}
        aria-label="Subscribe on Apple Podcasts"
      >
        SUBSCRIBE
      </a>
    </nav>
  );
};
