import type { ChurchEvent, ProgramItem } from "@/lib/types";

export const upcomingEvents: ChurchEvent[] = [
  {
    day: "12",
    month: "JUIL",
    title: "Évangélisation de quartier",
    description: "Programme spécial — terrain de Yamtenga · 15h00",
    tag: "Évangélisation",
    tagAccent: "red",
  },
  {
    day: "20",
    month: "JUIL",
    title: "Culte d'action de grâces",
    description: "À l'issue du culte de dimanche",
    tag: "Action de grâces",
    tagAccent: "blue",
  },
  {
    day: "26",
    month: "JUIL",
    title: "Bénédiction nuptiale",
    description: "Temple principal · 10h00",
    tag: "Mariage",
    tagAccent: "navy",
  },
];

export const weeklyProgram: ProgramItem[] = [
  { day: "Dimanche", title: "Culte d'adoration", hours: "8h30 – 11h30" },
  { day: "Mercredi", title: "Étude biblique", hours: "18h30" },
  { day: "Jeudi", title: "Prière de jeudi", hours: "18h30" },
  { day: "Vendredi", title: "Veillée de prière (dernier du mois)", hours: "21h00" },
  {
    day: "Samedi",
    title: "Répétitions des chorales & activités des groupes",
    hours: "15h00",
  },
];
