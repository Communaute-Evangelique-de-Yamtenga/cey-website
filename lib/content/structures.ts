import type { BureauRole, Structure } from "@/lib/types";

export const structures: Structure[] = [
  {
    id: "JAD",
    slug: "jad",
    full: "Jeunesse des Assemblées de Dieu",
    publicCible: "Adolescents & jeunes de l'église",
    rendezVous: "Samedi · 15h00",
    photo: "/JAD_images/bureau.png",
    description:
      "La structure de la jeunesse de l'église : elle rassemble, forme et accompagne les jeunes dans leur marche avec Dieu.",
    mission:
      "Elle organise les rencontres des jeunes, le camp biblique annuel et les sorties d'évangélisation, et accompagne chaque jeune dans sa vie spirituelle, ses études et ses projets.",
    upcoming: [
      {
        title: "Sortie d'évangélisation",
        date: "Sam. 12 juillet",
        description:
          "Programme spécial sur le terrain de Yamtenga — invitez vos proches.",
      },
      {
        title: "Camp biblique annuel",
        date: "Vacances — à venir",
        description:
          "Inscriptions ouvertes : une semaine de formation biblique et de communion.",
      },
      {
        title: "Rencontre hebdomadaire des jeunes",
        date: "Chaque samedi · 15h00",
        description: "Louange, enseignement et partage entre jeunes au temple.",
      },
    ],
    past: [
      {
        title: "Camp biblique 2025",
        date: "Vacances 2025",
        description: "Ajoutez une photo et un mot sur ce moment fort des jeunes.",
      },
      {
        title: "Sortie d'évangélisation",
        date: "Date à préciser",
        description: "Ajoutez une photo et un court récit de cette sortie.",
      },
      {
        title: "Temps fort à renseigner",
        date: "Date à préciser",
        description: "Ajoutez une photo et un court récit de ce moment.",
      },
    ],
  },
  {
    id: "MHEB",
    slug: "mheb",
    full: "Signification du sigle à compléter",
    publicCible: "À préciser",
    rendezVous: "Jour & heure à préciser",
    photo: null,
    description:
      "Présentation de la structure MHEB — mission, vision et activités à compléter avec vos textes.",
    mission:
      "Décrivez ici la mission de la structure, son fonctionnement et sa place dans la vie de l'église.",
    upcoming: genericUpcoming(),
    past: genericPast(),
  },
  {
    id: "ASC",
    slug: "asc",
    full: "Signification du sigle à compléter",
    publicCible: "À préciser",
    rendezVous: "Jour & heure à préciser",
    photo: null,
    description:
      "Présentation de la structure ASC — mission, vision et activités à compléter avec vos textes.",
    mission:
      "Décrivez ici la mission de la structure, son fonctionnement et sa place dans la vie de l'église.",
    upcoming: genericUpcoming(),
    past: genericPast(),
  },
  {
    id: "DENAD",
    slug: "denad",
    full: "Signification du sigle à compléter",
    publicCible: "À préciser",
    rendezVous: "Jour & heure à préciser",
    photo: null,
    description:
      "Présentation de la structure DENAD — mission, vision et activités à compléter avec vos textes.",
    mission:
      "Décrivez ici la mission de la structure, son fonctionnement et sa place dans la vie de l'église.",
    upcoming: genericUpcoming(),
    past: genericPast(),
  },
];

function genericUpcoming() {
  return [
    {
      title: "Rencontre régulière",
      date: "Jour à préciser",
      description: "Décrivez cette activité : contenu, déroulement et public concerné.",
    },
    {
      title: "Formations & retraites",
      date: "À préciser",
      description: "Décrivez les temps de formation et de ressourcement de la structure.",
    },
    {
      title: "Projets & sorties",
      date: "À préciser",
      description: "Décrivez les projets, sorties et actions menés par la structure.",
    },
  ];
}

function genericPast() {
  return [
    {
      title: "Temps fort à renseigner",
      date: "Date à préciser",
      description: "Ajoutez une photo et un court récit de ce moment.",
    },
    {
      title: "Sortie ou action menée",
      date: "Date à préciser",
      description: "Ajoutez une photo et un court récit de cette activité.",
    },
    {
      title: "Célébration ou fête",
      date: "Date à préciser",
      description: "Ajoutez une photo et un court récit de cette célébration.",
    },
  ];
}

export const bureauRoles: BureauRole[] = [
  {
    role: "Responsable",
    mission: "Coordonne la structure et représente ses membres auprès de l'église.",
  },
  {
    role: "Secrétaire",
    mission: "Organise les rencontres et tient les comptes rendus.",
  },
  {
    role: "Trésorier(ère)",
    mission: "Gère les cotisations et les finances de la structure.",
  },
];

export function getStructureBySlug(slug: string): Structure | undefined {
  return structures.find((s) => s.slug === slug);
}
