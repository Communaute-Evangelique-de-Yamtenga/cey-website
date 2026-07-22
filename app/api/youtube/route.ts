const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE = "https://www.googleapis.com/youtube/v3";
const FB_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;

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
    }));
}

export async function GET() {
    try {
        async function getCategory(playlistId: string | null, fbKeyword: string): Promise<Video[]> {
            const ytVideos = playlistId ? await getPlaylistVideos(playlistId) : [];
            if (ytVideos.length >= 3) return ytVideos;
            const fbVideos = await getFacebookVideos(fbKeyword);
            const combined = [...ytVideos, ...fbVideos];
            return combined;
        }

        const [culte, louange, etude, enseignement, priere, priereJeudi, veillee] = await Promise.all([
            getCategory(playlists.culte.id, playlists.culte.fbKeyword),
            getCategory(playlists.louange.id, playlists.louange.fbKeyword),
            getCategory(playlists.etude.id, playlists.etude.fbKeyword),
            getCategory(playlists.enseignement.id, playlists.enseignement.fbKeyword),
            getCategory(playlists.priere.id, playlists.priere.fbKeyword),
            getCategory(playlists.priereJeudi.id, playlists.priereJeudi.fbKeyword),
            getCategory(playlists.veillee.id, playlists.veillee.fbKeyword),
        ]);

        const teaser = [culte[0], louange[0], etude[0]].filter(Boolean);

        return Response.json({ teaser, culte, louange, etude, enseignement, priere, priereJeudi, veillee });
    } catch {
        return Response.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
