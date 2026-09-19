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
  { day: "MARDI", title: "Etude Biblique", hours: "19h00  – 20h30" },
  { day: "Mercredi", title: "Prière d'intercession et de délivrance", hours: "A partir de 9h30" },
  { day: "Jeudi", title: "Prière d'édification et pour les besoins", hours: "19h00-21h00" },
  {
    day: "Vendredi/Samedi",
    title: "Répétitions des chorales & activités des groupes",
    hours: "19h – 21h",
  },
  { day: "Dernier Vendredi du mois", title: "Veillée de prière (dernier du mois)", hours: "21h00" },
  {
    day: "Dimanche",
    title: "Culte en français",
    hours: "	07h30 – 10h00",
  },
  {
    day: "Dimanche(mooré)",
    title: "Culte en mooré",
    hours: "	10h15 – 12h15",
  },
  {
    day: "1ᵉʳ Dimanche de chaque mois",
    title: "Culte en commun",
    hours: "07h30 – 11h00",
  },
];
