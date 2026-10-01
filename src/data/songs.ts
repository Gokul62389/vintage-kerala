import { Song } from '../types/experience';

/**
 * Vintage Kerala evergreen melodies audio track.
 * Downloaded from YouTube: https://www.youtube.com/watch?v=KB4XtZr-7X4
 * (Best Melodies of All Time — Vidyasagar | K. J. Yesudas | K. S. Chithra | Saina Music)
 *
 * Processes in real-time through the Web Audio Lo-Fi tape & Kerala Foley engine.
 */
export const SAMPLE_SONGS: Song[] = [
  {
    id: "vintage-kerala-melodies-lofi",
    title: "Best Melodies of All Time",
    malayalamTitle: "എക്കാലത്തെയും മികച്ച ഗാനങ്ങൾ",
    artist: "Vidyasagar, K. J. Yesudas, K. S. Chithra",
    movie: "Vintage Malayalam Classic Hits (Saina Music)",
    year: 1998,
    audio: "/assets/songs/vintage-kerala-melodies.m4a",
    cover: "/assets/covers/vintage-melodies.jpg",
    duration: 3217, // ~53 minutes of continuous uninterrupted classic melodies
    tags: [
      "malayalam",
      "vintage",
      "lofi",
      "melodies",
      "yesudas",
      "chithra",
      "vidyasagar"
    ],
    recommendedEnvironments: [
      "tea-shop",
      "rainy-home",
      "village-food",
      "ksrtc-window",
      "kerala-ferry",
      "village-bus-stop"
    ]
  }
];
