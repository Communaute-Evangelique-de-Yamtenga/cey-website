const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE = "https://www.googleapis.com/youtube/v3";
const FB_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

type Video = { videoId: string; title: string; date: string; thumbnail: string; url: string; source?: string };

async function getAllFacebookVideos(): Promise<(Video & { title_raw?: string; description?: string })[]> {
    const token = process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const fields = "title,description,created_time,thumbnails,permalink_url";
    const [resLive, resUploaded] = await Promise.all([
        fetch(`https://graph.facebook.com/${pageId}/videos?fields=${fields}&type=live&limit=50&access_token=${token}`, { next: { revalidate: 3600 } }),
        fetch(`https://graph.facebook.com/${pageId}/videos?fields=${fields}&type=uploaded&limit=50&access_token=${token}`, { next: { revalidate: 3600 } }),
    ]);
    const [dataLive, dataUploaded] = await Promise.all([resLive.json(), resUploaded.json()]);
    const seen = new Set<string>();
    const all = [...(dataLive.data ?? []), ...(dataUploaded.data ?? [])].filter(v => {
        if (seen.has(v.id)) return false;
        seen.add(v.id);
        return true;
    });
    return all.map((v: { id: string; title?: string; description?: string; thumbnails?: { data: { uri: string }[] } }) => ({
        videoId: v.id,
        title: v.title ?? v.description?.slice(0, 60) ?? "Vidéo",
        title_raw: v.title,
        description: v.description,
        date: "",
        thumbnail: v.thumbnails?.data?.[0]?.uri ?? "",
        url: `https://www.facebook.com/${pageId}/videos/${v.id}`,
        source: "facebook",
    }));
}

function filterVideos(all: (Video & { title_raw?: string; description?: string })[], keywords: string[], exclude: string[] = [], titleOnly = false, needed = 3): Video[] {
    return all.filter(v => {
        const searchText = titleOnly ? (v.title_raw ?? "").toLowerCase() : `${v.title_raw ?? ""} ${v.description ?? ""}`.toLowerCase();
        const fullText = `${v.title_raw ?? ""} ${v.description ?? ""}`.toLowerCase();
        return keywords.some(k => searchText.includes(k.toLowerCase())) && !exclude.some(e => fullText.includes(e.toLowerCase()));
    }).slice(0, needed);
}


export const playlists = {
    culte: { id: "PLZQId5viBilA", label: "Cultes de dimanche", url: "https://www.youtube.com/playlist?list=PLZQId5viBilA", fbKeyword: "culte" },
    louange: { id: "PLW7583L8vUEc", label: "Louange & Adoration", url: "https://www.youtube.com/playlist?list=PLW7583L8vUEc", fbKeyword: "louange" },
    etude: { id: "PLYNdK2z5pYzY", label: "Études bibliques", url: "https://www.youtube.com/playlist?list=PLYNdK2z5pYzY", fbKeyword: "étude biblique" },
    enseignement: { id: null, label: "Enseignements", url: null, fbKeyword: "enseignement" },
    priere: { id: "PLOI8TP0FOde4", label: "Mois de prière", url: "https://www.youtube.com/playlist?list=PLOI8TP0FOde4", fbKeyword: "mois de prière" },
    priereJeudi: { id: null, label: "Prière du jeudi", url: null, fbKeyword: "prière du jeudi" },
    veillee: { id: null, label: "Veillée de prière", url: null, fbKeyword: "veillée" },
};

type Video = { videoId: string; title: string; date: string; thumbnail: string; url: string };

async function getFacebookVideos(keyword: string, maxResults = 12): Promise<Video[]> {
    try {
        const res = await fetch(
            `https://graph.facebook.com/${FB_PAGE_ID}/videos?fields=title,description,source,created_time&access_token=${FB_TOKEN}&limit=${maxResults}`,
            { cache: "no-store" }
        );
        const data = await res.json();
        return (data.data ?? [])
            .filter((v: { title?: string; description?: string }) =>
                v.title?.toLowerCase().includes(keyword.toLowerCase()) ||
                v.description?.toLowerCase().includes(keyword.toLowerCase())
            )
            .map((v: { id: string; title?: string; created_time: string; source: string }) => ({
                videoId: v.id,
                title: v.title ?? "",
                date: new Date(v.created_time).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
                thumbnail: "",
                url: `https://www.facebook.com/watch/?v=${v.id}`,
            }));
    } catch {
        return [];
    }
}

async function getVideoPublishedDates(videoIds: string[]): Promise<Record<string, string>> {
    if (videoIds.length === 0) return {};
    const res = await fetch(
        `${BASE}/videos?part=snippet&id=${videoIds.join(",")}&key=${API_KEY}`,
        { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const map: Record<string, string> = {};
    for (const item of data.items ?? []) {
        map[item.id] = new Date(item.snippet.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    }
    return map;
}

async function getPlaylistVideos(playlistId: string, maxResults = 12) {
    const res = await fetch(
        `${BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`,
        { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    const items = data.items ?? [];
    const videoIds = items.map((item: { snippet: { resourceId: { videoId: string } } }) => item.snippet.resourceId.videoId);
    const dates = await getVideoPublishedDates(videoIds);
    return items.map((item: {
        snippet: {
            title: string;
            thumbnails: { medium: { url: string } };
            resourceId: { videoId: string };
        };
    }) => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        date: dates[item.snippet.resourceId.videoId] ?? "",
        thumbnail: item.snippet.thumbnails.medium.url,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
        source: "youtube",
    }));
}

export async function GET() {
    try {
        const [culteYT, louangeYT, etudeYT, priereYT, allFB] = await Promise.all([
            getPlaylistVideos(playlists.culte.id!),
            getPlaylistVideos(playlists.louange.id!),
            getPlaylistVideos(playlists.etude.id!),
            getPlaylistVideos(playlists.priere.id!),
            getAllFacebookVideos(),
        ]);

        const culteFB    = filterVideos(allFB, ["culte", "dimanche"], ["priere", "prière", "louange", "étude"], false, Math.max(0, 3 - culteYT.length));
        const louangeFB  = filterVideos(allFB, ["louange", "adoration", "chorale", "groupe musical", "célébrons", "pâques", "musical"], ["priere", "prière", "31 jours"], false, Math.max(0, 3 - louangeYT.length));
        const etudeFB    = filterVideos(allFB, ["étude", "etude", "biblique"], ["kader", "bouda", "union"], false, Math.max(0, 3 - etudeYT.length));
        const priereFB   = filterVideos(allFB, ["prière", "priere", "jeudi", "veillée"], [], false, Math.max(0, 3 - priereYT.length));
        const enseignementFB = filterVideos(allFB, ["enseignement"], ["priere", "prière", "31 jours"], true, 3);

        const culte       = [...culteYT, ...culteFB];
        const louange     = [...louangeYT, ...louangeFB];
        const etude       = [...etudeYT, ...etudeFB];
        const priere      = [...priereYT, ...priereFB];
        const enseignement = enseignementFB;

        // Autres = toutes les vidéos FB non classées dans les sections ci-dessus
        const classifiedIds = new Set([
            ...culteFB, ...louangeFB, ...etudeFB, ...priereFB, ...enseignementFB
        ].map(v => v.videoId));
        // Exclure aussi les vidéos FB qui matchent les mots-clés de prière même si priereYT était plein
        const autresRaw = allFB.filter(v => {
            if (classifiedIds.has(v.videoId)) return false;
            const text = `${v.title_raw ?? ""} ${v.description ?? ""}`.toLowerCase();
            return ![
                "prière", "priere", "31 jours", "jeudi", "veillée",
                "culte", "dimanche",
            ].some(k => text.includes(k));
        });
        const autres = autresRaw.slice(0, 6);

        const teaser = [culte[0], louange[0], etude[0]].filter(Boolean);

        return Response.json({ teaser, culte, louange, etude, priere, enseignement, autres });
    } catch {
        return Response.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
