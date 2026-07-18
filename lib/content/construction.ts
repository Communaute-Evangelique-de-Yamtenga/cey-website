export const constructionProject = {
  raised: 18_500_000,
  goal: 45_000_000,
  currency: "FCFA",
  milestones: [
    { label: "Fondations", detail: "terminées et consacrées.", status: "done" as const },
    { label: "Élévation des murs", detail: "en cours actuellement.", status: "current" as const },
    { label: "Toiture & finitions", detail: "à venir.", status: "upcoming" as const },
  ],
};

export function percentFunded(): number {
  return Math.round((constructionProject.raised / constructionProject.goal) * 100);
}

export function formatFcfa(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount);
}
