import React, { useEffect, useState } from "react";

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
  round: number;
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
}

const PODCAST_LINKS: PodcastLinks = {
  spotify:
    "https://open.spotify.com/show/5kwWL1UZ3CJOz60IOARv6k?si=84a2d71187574e05",
  apple: "https://podcasts.apple.com/us/podcast/circuitosychisme/id1890278405",
  instagram: "https://www.instagram.com/circuitosychisme/",
  tiktok: "https://www.tiktok.com/@circuitosychisme",
};

const APPLE_ID = "1890278405";

// Helper to format duration from ms to "MM mins"
const formatDuration = (ms: number | undefined): string => {
  if (!ms) return "0 MINUTES OF DRAMA";
  const mins = Math.floor(ms / 60000);
  return `${mins} MINUTES OF DRAMA`;
};

// Helper to strip HTML tags
const stripHtml = (html: string | undefined): string => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

const App: React.FC = () => {
  const [view, setView] = useState<"home" | "episodes">("home");
  const [nextRace, setNextRace] = useState<RaceData | null>(null);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");

    // Injecting Tailwind CDN and Fonts
    const assets = [
      { type: "script", src: "https://cdn.tailwindcss.com" },
      {
        type: "link",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap",
      },
      {
        type: "link",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
      },
    ];

    assets.forEach((asset) => {
      if (asset.type === "script" && asset.src) {
        const s = document.createElement("script");
        s.src = asset.src;
        document.head.appendChild(s);
      } else if (asset.type === "link" && asset.href) {
        const l = document.createElement("link");
        l.rel = "stylesheet";
        l.href = asset.href;
        document.head.appendChild(l);
      }
    });

    const configScript = document.createElement("script");
    configScript.innerHTML = `
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              primary: '#ff89ab',
              secondary: '#00f4fe',
              tertiary: '#c47fff',
              'primary-dim': '#e30071',
              'secondary-container': '#00696e',
              'on-surface': '#f8f5fd',
              'surface-container-highest': '#25252c',
              'on-primary-fixed': '#000000',
              'on-surface-variant': '#acaab1',
              'surface-container': '#19191f',
            }
          }
        }
      }
    `;
    document.head.appendChild(configScript);

    // Fetch Live Race Intel
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
                .replace(/Grand Prix/gi, "")
                .replace(/F1/gi, "")
                .trim()
                .toUpperCase(),
              location: meeting.location.toUpperCase(),
              round: meetingIndex + 1,
              date: raceDay
                .toLocaleDateString("en-US", { month: "short", day: "numeric" })
                .toUpperCase(),
              isLive:
                now >= startDate &&
                now <= new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000),
              circuitImage:
                "https://images.unsplash.com/photo-1547547743-162e07172087?q=80&w=2000&auto=format&fit=crop",
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
    <div className="bg-[#0e0e13] text-[#f8f5fd] font-['Newsreader'] selection:bg-[#00f4fe] selection:text-[#0e0e13] overflow-x-hidden min-h-screen">
      <style>{`
        :root { --primary: #ff89ab; --secondary: #00f4fe; --tertiary: #c47fff; }
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .font-body { font-family: 'Newsreader', serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .tape-edge {
          mask-image: linear-gradient(90deg, transparent 2px, black 2px, black calc(100% - 2px), transparent calc(100% - 2px));
          clip-path: polygon(0% 10%, 5% 0%, 10% 8%, 15% 2%, 20% 10%, 25% 4%, 30% 9%, 35% 1%, 40% 7%, 45% 3%, 50% 10%, 55% 5%, 60% 8%, 65% 2%, 70% 9%, 75% 4%, 80% 7%, 85% 2%, 90% 10%, 95% 5%, 100% 10%, 100% 90%, 95% 100%, 90% 90%, 85% 98%, 80% 92%, 75% 100%, 70% 91%, 65% 97%, 60% 90%, 55% 96%, 50% 90%, 45% 97%, 40% 92%, 35% 100%, 30% 91%, 25% 96%, 20% 90%, 15% 98%, 10% 92%, 5% 100%, 0% 90%);
        }
      `}</style>

      <nav className="fixed top-0 w-full z-50 flex justify-between items-center py-16 px-6 md:px-10 bg-slate-950/80 backdrop-blur-xl h-20 -rotate-1 origin-left border-b-4 border-cyan-400 shadow-[8px_8px_0px_0px_rgba(255,137,171,0.3)]">
        <div
          onClick={() => setView("home")}
          className="text-2xl md:text-3xl font-black italic tracking-tighter text-pink-500 hover:skew-x-12 transition-transform font-headline cursor-pointer"
        >
          Circuitos y Chisme
        </div>
        <div className="hidden lg:flex gap-8 items-center font-headline uppercase tracking-tighter text-slate-100">
          <a
            href={PODCAST_LINKS.spotify}
            target="_blank"
            className="hover:text-pink-400 hover:-rotate-2 transition-all"
          >
            Spotify
          </a>
          <a
            href={PODCAST_LINKS.apple}
            target="_blank"
            className="hover:text-pink-400 hover:-rotate-2 transition-all"
          >
            Apple Podcasts
          </a>
        </div>
        <a
          href={PODCAST_LINKS.apple}
          target="_blank"
          className="bg-[#ff89ab] text-black font-headline font-black px-4 md:px-6 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
        >
          SUBSCRIBE
        </a>
      </nav>

      <main className="pt-32">
        {view === "home" ? (
          <>
            <section className="relative min-h-[80vh] md:min-h-[921px] flex flex-col items-center justify-center px-6 overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute top-10 -left-20 w-96 h-96 bg-[#ff89ab] rounded-full blur-[120px]"></div>
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-[#00f4fe] rounded-full blur-[100px]"></div>
              </div>
              <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-4">
                <div className="md:col-span-7 flex flex-col justify-center">
                  <h1 className="font-headline font-black italic leading-[0.8] tracking-tighter uppercase mb-4">
                    <span className="block text-6xl md:text-[12rem] -rotate-2 text-[#ff89ab] drop-shadow-[10px_10px_0px_rgba(0,244,254,0.5)]">
                      LIGHTS
                    </span>
                    <span className="block text-5xl md:text-[10rem] rotate-1 text-[#f8f5fd] bg-[#00696e] w-fit px-4 ml-4 md:ml-12 tape-edge">
                      OUT &
                    </span>
                    <span className="block text-7xl md:text-[14rem] -rotate-3 text-[#00f4fe] drop-shadow-[12px_12px_0px_rgba(255,137,171,0.5)]">
                      CHISME
                    </span>
                    <span className="block text-4xl md:text-8xl self-end font-body italic lowercase text-[#c47fff]">
                      ...on!
                    </span>
                  </h1>
                </div>
                <div className="md:col-span-5 relative group">
                  <div className="absolute -top-10 -right-10 bg-[#ff89ab] w-full h-full -rotate-3 z-0"></div>
                  <div className="relative z-10 border-4 border-[#f8f5fd] p-2 bg-[#0e0e13] rotate-2 group-hover:rotate-0 transition-transform duration-300">
                    <img
                      alt="Hosts"
                      className="w-full h-[400px] md:h-[600px] object-cover filter contrast-125"
                      src="https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/71/6a/52/716a52f4-716b-1936-e087-f14d8479e00b/mza_4833214539150036616.jpg/1200x1200bb.jpg"
                    />
                    <div className="absolute -bottom-6 -left-6 bg-[#00f4fe] text-[#0e0e13] font-headline font-black p-4 text-xl md:text-2xl -rotate-6 border-2 border-[#0e0e13] shadow-lg">
                      New Episodes Weekly!
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-24 px-6 relative">
              <div className="max-w-7xl mx-auto">
                <div className="bg-[#25252c] border-t-8 border-l-8 border-[#00f4fe] p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                    <div className="flex gap-2 items-center">
                      <span
                        className={`font-headline font-bold px-3 py-1 text-sm uppercase ${nextRace?.isLive ? "bg-green-500 text-black animate-pulse" : "bg-[#ff6e84] text-[#490013]"}`}
                      >
                        {nextRace?.isLive
                          ? "RACE WEEKEND ACTIVE"
                          : "LIVE INTEL"}
                      </span>
                      <div className="h-1 flex-1 bg-[#acaab1]/20"></div>
                    </div>
                    <h2 className="font-headline font-black text-5xl md:text-9xl uppercase tracking-tighter leading-none italic text-[#f8f5fd]">
                      {nextRace?.isLive ? "CURRENT:" : "DESTINATION:"}
                      <br />
                      <span className="text-[#00f4fe]">
                        {nextRace?.name || "FETCHING..."}
                      </span>
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      <div className="border-2 border-[#acaab1] px-6 py-4 text-center">
                        <p className="text-xs font-headline uppercase text-[#acaab1]">
                          Round
                        </p>
                        <p className="text-4xl font-headline font-black text-[#f8f5fd]">
                          {nextRace?.round || "..."}
                        </p>
                      </div>
                      <div className="border-2 border-[#00f4fe] px-6 py-4 bg-[#00f4fe]/10 text-center">
                        <p className="text-xs font-headline uppercase text-[#00f4fe]">
                          Race Day
                        </p>
                        <p className="text-4xl font-headline font-black text-[#00f4fe]">
                          {nextRace?.date || "..."}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px] flex items-center justify-center bg-black/20">
                    <img
                      alt={nextRace?.name || "Race Circuit"}
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_20px_rgba(0,244,254,0.3)] transition-all duration-500 hover:scale-110"
                      src={nextRace?.circuitImage}
                    />
                    <div className="absolute top-0 right-0 p-4 font-headline text-[#00f4fe] opacity-50 text-[10px] text-right">
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

            <section className="py-24 bg-[#e30071] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-8 bg-[#0e0e13] -translate-y-1/2 rotate-1"></div>
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative group">
                  <div className="aspect-square bg-[#25252c] border-8 border-black shadow-[20px_20px_0px_0px_#00f4fe] p-8 flex flex-col justify-between overflow-hidden">
                    <img
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={
                        latestEpisode?.artworkUrl600 ||
                        "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/71/6a/52/716a52f4-716b-1936-e087-f14d8479e00b/mza_4833214539150036616.jpg/600x600bb.jpg"
                      }
                      alt="Latest Episode"
                    />
                    <div className="relative z-10">
                      <span className="bg-[#0e0e13] text-[#ff89ab] font-headline font-black px-4 py-1 uppercase text-lg inline-block -rotate-2">
                        LATEST EPISODE
                      </span>
                    </div>
                    <div className="relative z-10 flex items-center gap-6">
                      <a
                        href={latestEpisode?.previewUrl}
                        target="_blank"
                        className="w-20 h-20 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl"
                      >
                        <span className="material-symbols-outlined text-4xl text-[#ff89ab]">
                          play_arrow
                        </span>
                      </a>
                      <span className="bg-[#0e0e13] text-[#ff89ab] font-headline font-black px-4 py-1 uppercase text-lg inline-block -rotate-2">
                        {formatDuration(latestEpisode?.trackTimeMillis)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <h3 className="font-headline font-black text-4xl md:text-5xl text-white uppercase italic leading-tight">
                    {latestEpisode?.trackName || "Loading latest chisme..."}
                  </h3>
                  <h4 className="font-body italic text-2xl md:text-3xl text-black leading-tight line-clamp-4">
                    "{stripHtml(latestEpisode?.description)}"
                  </h4>
                  <div className="flex flex-col gap-4">
                    <a
                      className="bg-[#0e0e13] text-[#f8f5fd] p-6 font-headline font-black flex justify-between items-center hover:bg-[#00f4fe] hover:text-[#0e0e13] transition-colors group"
                      href={PODCAST_LINKS.spotify}
                      target="_blank"
                    >
                      LISTEN ON SPOTIFY{" "}
                      <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                        arrow_forward
                      </span>
                    </a>
                    <a
                      className="bg-[#0e0e13] text-[#f8f5fd] p-6 font-headline font-black flex justify-between items-center hover:bg-[#00f4fe] hover:text-[#0e0e13] transition-colors group"
                      href={PODCAST_LINKS.apple}
                      target="_blank"
                    >
                      LISTEN ON APPLE{" "}
                      <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                        arrow_forward
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-24 px-6 bg-[#0e0e13]">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <a
                    href={PODCAST_LINKS.tiktok}
                    target="_blank"
                    className="col-span-1 md:col-span-3 bg-[#00f4fe] p-10 min-h-[400px] flex flex-col justify-end -rotate-1 relative group hover:rotate-0 transition-transform cursor-pointer shadow-[15px_15px_0px_0px_#ff89ab]"
                  >
                    <span className="material-symbols-outlined absolute top-10 right-10 text-8xl text-black/20 group-hover:scale-110 group-hover:text-black/40 transition-all">
                      video_library
                    </span>
                    <h5 className="font-headline font-black text-6xl md:text-8xl text-[#0e0e13] uppercase leading-none">
                      TIKTOK
                    </h5>
                    <p className="font-headline font-bold text-black/80 mt-4 text-xl">
                      Behind the scenes & Race weekend chisme
                    </p>
                  </a>
                  <a
                    href={PODCAST_LINKS.instagram}
                    target="_blank"
                    className="col-span-1 md:col-span-2 bg-[#ff89ab] p-10 min-h-[400px] flex flex-col justify-end rotate-2 relative group hover:rotate-0 transition-transform cursor-pointer shadow-[15px_15px_0px_0px_#00f4fe]"
                  >
                    <span className="material-symbols-outlined absolute top-10 right-10 text-6xl text-black/20 group-hover:scale-110 group-hover:text-black/40 transition-all">
                      alternate_email
                    </span>
                    <h5 className="font-headline font-black text-4xl md:text-6xl text-[#0e0e13] uppercase leading-none">
                      INSTAGRAM
                    </h5>
                    <p className="font-headline font-bold text-black/80 mt-4 text-lg">
                      Daily updates & Paddock life
                    </p>
                  </a>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-40">
            {loading && (
              <p className="text-[#00f4fe] animate-pulse">
                Scanning the paddock...
              </p>
            )}
            <p className="text-[#acaab1] font-headline">
              The Paddock Archive is currently private.
            </p>
            <button
              onClick={() => setView("home")}
              className="mt-4 text-[#00f4fe] underline font-headline uppercase"
            >
              Return Home
            </button>
          </div>
        )}
      </main>

      <footer className="w-full mt-20 border-t-8 border-black bg-pink-500 p-10 relative overflow-hidden min-h-[300px] flex flex-col justify-end">
        <div className="absolute top-0 left-0 whitespace-nowrap opacity-10 select-none pointer-events-none">
          <span className="font-headline font-black text-[10rem] md:text-[15rem] text-black uppercase leading-none">
            UNDERGROUND UNDERGROUND
          </span>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="text-black font-black text-4xl md:text-6xl font-headline italic leading-none">
            CIRCUITOS
            <br />& CHISME
          </div>
          <p className="font-headline font-black text-xs uppercase text-black/60">
            ©2024 THE PADDOCK UNDERGROUND
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
