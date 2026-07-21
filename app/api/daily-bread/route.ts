export async function GET() {
    const token = process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;

    const url = `https://graph.facebook.com/${pageId}/posts?fields=message,attachments{media}&access_token=${token}`;


    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    const post = data.data.find((p: { message: string }) =>
    p.message?.toLowerCase().includes("verset calendaire")
        );
    const studyPost = data.data?.find((p: { message: string }) =>
    p.message?.toLowerCase().includes("étude thématique")
        );

    if (!post) return Response.json({ text: null, reference: null, url: null });

    const lines = post.message.split("\n").filter(Boolean);
    const bibleUrl = lines.find((l: string) => l.startsWith("https://bible.com")) ?? null;
    const reference = lines.find((l: string) => /^[A-ZÀ-Ü]/.test(l) && !l.includes("VERSET") && !l.includes("Béni")) ?? null;
    const rawText = lines.find((l: string) => l.startsWith("[")) ?? null;
    const text = rawText ? rawText.replace(/^\[\d+\]\s*/, "") : null;

    const image = post.attachments?.data?.[0]?.media?.image?.src ?? null;

    const studyLines = studyPost?.message?.split("\n").filter(Boolean) ?? [];
    const studyVerses = studyLines.slice(1).filter((l: string) => /\(Luc|Jean|Mat|Marc|Rom|Ps|Gen|Ex/.test(l));
    const studyTitle = studyLines.find((l: string) =>
      !l.includes("ÉTUDE") && !l.includes("(") && !l.includes("editeurbpc") &&
      l.trim().length > 3 && !/^–/.test(l.trim())
    ) ?? null;
    const studyTitleIndex = studyTitle ? studyLines.indexOf(studyTitle) : -1;
    const studyParagraphs = studyTitleIndex >= 0 ? studyLines.slice(studyTitleIndex + 1).filter((l: string) => !l.includes("editeurbpc")) : [];
    const studySource = studyLines.find((l: string) => l.includes("editeurbpc.com")) ?? null;

    return Response.json({ text, reference, url: bibleUrl, image, studyTitle, studyVerses, studyParagraphs, studySource });
}
