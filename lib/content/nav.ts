import { structures } from "@/lib/content/structures";

export const primaryNav = [
  { label: "Accueil", href: "/" },
  { label: "Événements", href: "/evenements" },
  { label: "Médias", href: "/medias" },
] as const;

export const structuresMenu = structures.map((s) => ({
  label: s.id,
  href: `/structures/${s.slug}`,
}));

export const groupesMenu = [
  { label: "Cellule d'intercession", sub: "Prière & intercession", href: "/groupes" },
  { label: "Louange & adoration", sub: "6 chorales et groupes", href: "/groupes" },
  { label: "Action sociale", sub: "Solidarité & entraide", href: "/groupes" },
];
