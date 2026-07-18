import { structures } from "@/lib/content/structures";
import { chorales } from "@/lib/content/groups";
import { mediaItems } from "@/lib/content/media";

export interface SearchEntry {
  title: string;
  kind: string;
  href: string;
}

export const searchIndex: SearchEntry[] = [
  { title: "Accueil", kind: "Page", href: "/" },
  { title: "Projet de construction — le nouveau temple", kind: "Page", href: "/projet" },
  { title: "Événements & programme de la semaine", kind: "Page", href: "/evenements" },
  { title: "Nos pasteurs", kind: "Page", href: "/pasteurs" },
  { title: "Nous contacter — localisation & annexes", kind: "Page", href: "/contact" },
  { title: "Médiathèque", kind: "Page", href: "/medias" },
  { title: "Verset calendaire — Pain quotidien", kind: "Ressource", href: "/" },
  { title: "Guide annuel du lecteur de la Bible — Pain quotidien", kind: "Ressource", href: "/" },
  { title: "Étude thématique de la Parole de Dieu — Pain quotidien", kind: "Ressource", href: "/" },
  ...structures.map((s) => ({
    title: `Structure ${s.id}`,
    kind: "Structure",
    href: `/structures/${s.slug}`,
  })),
  ...chorales.map((c) => ({ title: c.name, kind: c.kind, href: "/groupes" })),
  ...mediaItems.map((m) => ({
    title: m.title,
    kind: "Vidéo",
    href: `/medias?categorie=${encodeURIComponent(m.category)}`,
  })),
];

export function search(query: string, limit = 8): SearchEntry[] {
  const q = query.trim().toLowerCase();
  const results = q
    ? searchIndex.filter((entry) => entry.title.toLowerCase().includes(q))
    : searchIndex.slice(0, 6);
  return results.slice(0, limit);
}
