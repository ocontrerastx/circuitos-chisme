import React, { useEffect, useState } from "react";
import { Nav } from "./components/Nav/Nav";
import { Hero } from "./components/Hero/Hero";
import { NextRace } from "./components/NextRace/NextRace";
import { PodcastEpisodes } from "./components/PodcastEpisodes/PodcastEpisodes";
import { Socials } from "./components/Socials/Socials";
import { Footer } from "./components/Footer/Footer";
import styles from "./App.module.css";

// --- Interfaces for TypeScript Strict Mode ---
interface PodcastLinks {
  spotify: string;
  apple: string;
  instagram: string;
  tiktok: string;
}

interface RaceData {
  name: string;
  location: string;
  round: string; // Fixed: Changed from number to string to match NextRaceProps
  date: string;
  isLive: boolean;
  circuitImage: string;
}

interface PodcastEpisode {
  trackId: number;
  trackName: string;
  trackTimeMillis: number;
  description: string;
  releaseDate: string;
  artworkUrl600: string;
  previewUrl: string;
  collectionViewUrl: string;
  trackViewUrl: string; // Fixed: Added missing property required by PodcastEpisodes
}

const PODCAST_LINKS: PodcastLinks = {
  spotify:
    "https://open.spotify.com/show/5kwWL1UZ3CJOz60IOARv6k?si=84a2d71187574e05",
  apple: "https://podcasts.apple.com/us/podcast/circuitosychisme/id1890278405",
  instagram: "https://www.instagram.com/circuitosychisme/",
  tiktok: "https://www.tiktok.com/@circuitosychisme",
};

const APPLE_ID = "1890278405";

const App: React.FC = () => {
  // Fixed: Added "live" to the union type to match Nav component expectations
  const [view, setView] = useState<"home" | "episodes" | "live">("home");
  const [nextRace, setNextRace] = useState<RaceData | null>(null);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRaceIntel = async () => {
      try {
        const response = await fetch(
          `https://api.openf1.org/v1/meetings?year=${new Date().getFullYear()}`,
        );
        const meetings = await response.json();

        if (meetings && Array.isArray(meetings)) {
          const sortedMeetings = meetings.sort(
            (a, b) =>
              new Date(a.date_start).getTime() -
              new Date(b.date_start).getTime(),
          );
          const now = new Date();
          const currentMeetingIndex = sortedMeetings.findIndex((m) => {
            const startDate = new Date(m.date_start);
            const raceEndBuffer = new Date(startDate);
            raceEndBuffer.setDate(startDate.getDate() + 4);
            return now <= raceEndBuffer;
          });

          const meetingIndex =
            currentMeetingIndex !== -1
              ? currentMeetingIndex
              : sortedMeetings.length - 1;
          const meeting = sortedMeetings[meetingIndex];

          if (meeting) {
            const startDate = new Date(meeting.date_start);
            const raceDay = new Date(startDate);
            raceDay.setDate(startDate.getDate() + 2);
            setNextRace({
              name: meeting.meeting_name
                .replace(/F1/gi, "")
                .replace(/Grand Prix/gi, "GP")
                .trim()
                .toUpperCase(),
              location: meeting.location.toUpperCase(),
              round: (meetingIndex + 1).toString(), // Fixed: Convert to string for the component
              date: raceDay
                .toLocaleDateString("en-US", { month: "short", day: "numeric" })
                .toUpperCase(),
              isLive:
                now >= startDate &&
                now <= new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
              circuitImage: meeting.circuit_image,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch race data", err);
      }
    };

    const fetchPodcasts = () => {
      const callbackName =
        "itunesCallback_" + Math.floor(Math.random() * 1000000);
      (window as any)[callbackName] = (data: any) => {
        if (data.results && data.results.length > 1) {
          setEpisodes(data.results.slice(1));
        }
        setLoading(false);
        delete (window as any)[callbackName];
        document.getElementById(callbackName)?.remove();
      };

      const script = document.createElement("script");
      script.id = callbackName;
      script.src = `https://itunes.apple.com/lookup?id=${APPLE_ID}&entity=podcastEpisode&limit=50&callback=${callbackName}`;
      document.body.appendChild(script);
    };

    fetchRaceIntel();
    fetchPodcasts();
  }, []);

  const latestEpisode = episodes[0];

  return (
    <div className={styles.app}>
      <Nav setView={setView} podcastLinks={PODCAST_LINKS} />

      <main className={styles.main}>
        {view === "home" ? (
          <>
            <Hero />
            <NextRace nextRace={nextRace} />
            <PodcastEpisodes
              latestEpisode={latestEpisode}
              podcastLinks={PODCAST_LINKS}
            />
            <Socials podcastLinks={PODCAST_LINKS} />
          </>
        ) : (
          <div className={styles.emptyState}>
            {loading && (
              <p className={styles.scanningText}>
                Scanning the paddock...
              </p>
            )}
            <p className={styles.privateText}>
              The Paddock Archive is currently private.
            </p>
            <button
              onClick={() => setView("home")}
              className={styles.returnButton}
            >
              Return Home
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
