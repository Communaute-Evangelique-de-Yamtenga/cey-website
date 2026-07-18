import type { Verse } from "@/lib/types";

export const verses: Verse[] = [
  {
    text: "« Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire. »",
    reference: "Jean 15 : 5",
    url: "https://bible.com/bible/93/jhn.15.5.LSG",
  },
  {
    text: "« L'Éternel est mon berger : je ne manquerai de rien. »",
    reference: "Psaume 23 : 1",
    url: "https://bible.com/bible/93/psa.23.1.LSG",
  },
  {
    text: "« Je puis tout par celui qui me fortifie. »",
    reference: "Philippiens 4 : 13",
    url: "https://bible.com/bible/93/php.4.13.LSG",
  },
];

/** Verse of the day — deterministic pick, cycles through the list by day of year. */
export function verseOfTheDay(date: Date = new Date()): Verse {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start;
  const dayOfYear = Math.floor(diff / 86_400_000);
  return verses[dayOfYear % verses.length];
}

export const annualReadingGuide = {
  label: "Lecture de ce jour",
  reading: "Psaumes 46 – 50",
  note: "Le programme qui conduit toute l'église à travers la Bible en un an.",
};

export const thematicStudy = {
  series: "La Bonne Semence",
  title: "L'homme, un être libre ?",
  excerpt:
    "« Être libre, c'est faire ce que je veux quand je veux », entend-on souvent. Notre société est devenue plus permissive que par le passé — mais sommes-nous plus heureux pour autant ?",
  verse:
    "« Jamais nous n'avons été esclaves de personne ; comment peux-tu dire, toi : “Vous serez rendus libres” ? Jésus leur répondit : … Quiconque pratique le péché est esclave du péché… Si donc le Fils [de Dieu] vous affranchit, vous serez réellement libres. »",
  verseReference: "Jean 8 : 33-36",
  paragraphs: [
    "« Être libre, c'est faire ce que je veux quand je veux », entend-on souvent. On revendique ce droit, estimant que c'est la solution pour trouver le bonheur. Notre société est devenue plus permissive que par le passé, mais sommes-nous plus heureux pour autant ?",
    "Pour être réellement libres, il nous faut être libérés de notre propre volonté, car suivre toutes nos envies c'est finalement être esclaves de nous-mêmes, de notre nature d'être humain pécheur qui est incapable de plaire à Dieu. On emploie le terme « addictions » pour parler d'envies irrépressibles qu'on veut pouvoir satisfaire à tout prix. Être « addict » à ses désirs, quels qu'ils soient, est-ce une vraie liberté ? « Car on est esclave de ce par quoi on est vaincu » (2 Pierre 2. 19).",
    "Mais après avoir posé ce constat, la Bible donne aussi la solution : « Si donc le Fils [de Dieu] vous affranchit, vous serez réellement libres ». Ce terme « affranchi » fait référence à un esclave libéré de son ancienne condition, qui n'est plus asservi à un maître. La mort de Jésus sur la croix nous libère. En l'acceptant comme Sauveur et comme Seigneur de nos vies, nous recevons une nouvelle nature, qui désire accomplir la volonté de Dieu, « bonne, agréable et parfaite » (Romains 12. 2). Le péché n'est plus une puissance qui nous domine ; nous recevons la force de faire le bien, et de trouver notre bonheur dans le fait de chercher à plaire à Jésus en toutes choses. Nous avons été « appelés à la liberté » (Galates 5. 13), et cette liberté se trouve en Christ. Venez à lui si vous êtes encore prisonnier, il vous rendra libre !",
  ],
  sourceUrl: "https://editeurbpc.com/calendriers/la-bonne-semence",
  sourceLabel: "D'autres messages sur editeurbpc.com",
};
