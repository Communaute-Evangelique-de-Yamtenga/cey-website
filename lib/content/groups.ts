import type { ChoraleGroup } from "@/lib/types";

export const chorales: ChoraleGroup[] = [
  { name: "Chorale Maranatha", kind: "Chorale", initials: "M", accent: "blue" },
  { name: "Chorale Ipéné", kind: "Chorale", initials: "I", accent: "red" },
  { name: "Chorale Shalom", kind: "Chorale", initials: "S", accent: "navy" },
  { name: "Vase d'honneur", kind: "Groupe de louange", initials: "V", accent: "red" },
  { name: "Koedmonba", kind: "Groupe de louange", initials: "K", accent: "navy" },
  { name: "Les Soldats du Christ", kind: "Groupe de louange", initials: "SC", accent: "blue" },
];

export const prayerCell = {
  label: "Prière",
  title: "Cellule d'intercession",
  description:
    "Un groupe qui porte l'église, les familles et les demandes de prière devant Dieu, semaine après semaine.",
  schedule: "Prière de jeudi · 18h30 — Veillées le dernier vendredi du mois",
};

export const socialAction = {
  label: "Solidarité",
  title: "Action sociale",
  description:
    "Visites, entraide et soutien aux personnes en difficulté — l'église au service du quartier de Yamtenga.",
  schedule: "Interventions ponctuelles — voir les annonces",
};
