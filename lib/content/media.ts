import type { MediaItem } from "@/lib/types";

export const mediaCategories = [
  "Cultes de dimanche",
  "Louanges & Adoration",
  "Études bibliques",
  "Mois de prière",
  "Enseignements",
  "Autres",
] as const;

export const mediaItems: MediaItem[] = [
  { title: "Culte de dimanche — 28 juin 2026", category: "Cultes de dimanche", duration: "2 h 45", date: "28 juin 2026" },
  { title: "Soirée pascale 2026 — Chorale Maranatha", category: "Louanges & Adoration", duration: "24 min", date: "5 avril 2026" },
  { title: "Étude thématique — séance 5", category: "Études bibliques", duration: "1 h 05", date: "24 juin 2026" },
  { title: "Prière de jeudi — intercession", category: "Prières de jeudi", duration: "1 h 30", date: "25 juin 2026" },
  { title: "Veillée de prière — nuit du 30 mai", category: "Veillées de prière", duration: "3 h 20", date: "30 mai 2026" },
];

/** Featured clips shown on the home page teaser. */
export const mediaTeaser: MediaItem[] = [mediaItems[0], mediaItems[1], mediaItems[2], mediaItems[6]];
