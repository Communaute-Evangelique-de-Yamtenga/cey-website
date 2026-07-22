export async function GET() {
    const token = process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;

    const fallback = {
        text: "« Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire. »",
        reference: "Jean 15 : 5",
        url: "https://bible.com/bible/93/jhn.15.5.LSG",
        image: null,
        studyTitle: "L'homme, un être libre ?",
        studyVerses: ["« Jamais nous n'avons été esclaves de personne… Si donc le Fils [de Dieu] vous affranchit, vous serez réellement libres. » (Jean 8. 33-36)"],
        studyParagraphs: ["« Être libre, c'est faire ce que je veux quand je veux », entend-on souvent. Notre société est devenue plus permissive que par le passé — mais sommes-nous plus heureux pour autant ?"],
        studySource: "https://editeurbpc.com/calendriers/la-bonne-semence",
        guideReading: "Psaumes 46 – 50",
    };

    try {
        const url = `https://graph.facebook.com/${pageId}/posts?fields=message,attachments{media}&access_token=${token}`;
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();

        if (!data.data) return Response.json(fallback);

        const post = data.data.find((p: { message: string }) =>
            p.message?.toLowerCase().includes("verset calendaire")
        );
        const studyPost = data.data?.find((p: { message: string }) =>
            p.message?.toLowerCase().includes("étude thématique")
        );

        if (!post) return Response.json(fallback);

        const lines = post.message.split("\n").filter(Boolean);
        const bibleUrl = lines.find((l: string) => l.startsWith("https://bible.com")) ?? null;
        const reference = lines.find((l: string) => /^[A-ZÀ-Ü]/.test(l) && !l.includes("VERSET") && !l.includes("Béni") && l.trim() !== "LSG") ?? null;
        const rawText = lines.find((l: string) => l.startsWith("[")) ?? null;
        const text = rawText ? rawText.replace(/^\[\d+\]\s*/, "") : null;
        const image = post.attachments?.data?.[0]?.media?.image?.src ?? null;

        const studyLines = studyPost?.message?.split("\n").filter(Boolean) ?? [];
        const studyTitle = studyLines.find((l: string) =>
            !l.includes("ÉTUDE") && !l.includes("(") && !l.includes("editeurbpc") &&
            l.trim().length > 3 && !/^–/.test(l.trim())
        ) ?? null;
        const studyTitleIndex = studyTitle ? studyLines.indexOf(studyTitle) : -1;
        const studyVerses = studyLines.slice(1, studyTitleIndex > 0 ? studyTitleIndex : undefined).filter((l: string) => /\(Luc|Jean|Mat|Marc|Rom|Ps|Dan|Gen|Ex|Actes|Ap|1Co|2Co|Gal|Eph|Phil|Col|1Th|2Th|1Ti|2Ti|Tit|Phm|Héb|Jac|1Pi|2Pi|1Jn|2Jn|3Jn|Jud|Nb|Dt|Jos|Jug|Rut|1Sa|2Sa|1Ro|2Ro|1Ch|2Ch|Esd|Né|Est|Job|Pr|Ec|Ca|És|Jér|Lam|Éz|Os|Joël|Am|Ab|Jon|Mi|Na|Ha|So|Ag|Za|Mal/.test(l));
        const studyParagraphs = studyTitleIndex >= 0 ? studyLines.slice(studyTitleIndex + 1).filter((l: string) => !l.includes("editeurbpc")) : [];
        const studySource = studyLines.find((l: string) => l.includes("editeurbpc.com")) ?? null;

        const guidePost = data.data?.find((p: { message: string }) =>
            p.message?.toLowerCase().includes("guide annuel")
        );
        const guideLines = guidePost?.message?.split("\n").filter(Boolean) ?? [];
        const guideReading = guideLines[guideLines.length - 1] ?? fallback.guideReading;

        return Response.json({ text, reference, url: bibleUrl, image, studyTitle, studyVerses, studyParagraphs, studySource, guideReading });
    } catch {
        return Response.json(fallback);
    }
}
