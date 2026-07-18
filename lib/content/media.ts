import type { MediaItem } from "@/lib/types";

export const mediaCategories = [
  "Mix",
  "Louanges & Adoration",
  "Cultes de dimanche",
  "Études bibliques",
  "Prières de jeudi",
  "Veillées de prière",
  "Enseignements",
] as const;

export const mediaItems: MediaItem[] = [
  { title: "Culte de dimanche — 28 juin 2026", category: "Cultes de dimanche", duration: "2 h 45", date: "28 juin 2026" },
  { title: "Soirée pascale 2026 — Chorale Maranatha", category: "Louanges & Adoration", duration: "24 min", date: "5 avril 2026" },
  { title: "Étude thématique — séance 5", category: "Études bibliques", duration: "1 h 05", date: "24 juin 2026" },
  { title: "Prière de jeudi — intercession", category: "Prières de jeudi", duration: "1 h 30", date: "25 juin 2026" },
  { title: "Veillée de prière — nuit du 30 mai", category: "Veillées de prière", duration: "3 h 20", date: "30 mai 2026" },
  { title: "Prestation — Vase d'honneur", category: "Louanges & Adoration", duration: "12 min", date: "14 juin 2026" },
  { title: "Enseignement — la vie de disciple", category: "Enseignements", duration: "48 min", date: "17 juin 2026" },
  { title: "Mix louange — spécial chorales", category: "Mix", duration: "35 min", date: "1 juin 2026" },
  { title: "Culte de dimanche — 21 juin 2026", category: "Cultes de dimanche", duration: "2 h 38", date: "21 juin 2026" },
  { title: "Prestation — Les Soldats du Christ", category: "Louanges & Adoration", duration: "18 min", date: "10 mai 2026" },
  { title: "Enseignement — la prière qui transforme", category: "Enseignements", duration: "52 min", date: "3 mai 2026" },
  { title: "Koedmonba — louange en mooré", category: "Louanges & Adoration", duration: "21 min", date: "26 avril 2026" },
];

/** Featured clips shown on the home page teaser. */
export const mediaTeaser: MediaItem[] = [mediaItems[0], mediaItems[1], mediaItems[2], mediaItems[6]];
