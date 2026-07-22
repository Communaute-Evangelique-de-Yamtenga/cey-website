const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE = "https://www.googleapis.com/youtube/v3";

export const playlists = {
    culte: { id: "PLZQId5viBilA", label: "Cultes de dimanche", url: "https://www.youtube.com/playlist?list=PLZQId5viBilA" },
    louange: { id: "PLW7583L8vUEc", label: "Louange & Adoration", url: "https://www.youtube.com/playlist?list=PLW7583L8vUEc" },
    etude: { id: "PLYNdK2z5pYzY", label: "Études bibliques", url: "https://www.youtube.com/playlist?list=PLYNdK2z5pYzY" },
    enseignement: { id: null, label: "Enseignements", url: null },
    priere: { id: "PLOI8TP0FOde4", label: "Mois de prière", url: "https://www.youtube.com/playlist?list=PLOI8TP0FOde4" },
};

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
        const [culte, louange, etude, priere] = await Promise.all([
            getPlaylistVideos(playlists.culte.id!),
            getPlaylistVideos(playlists.louange.id!),
            getPlaylistVideos(playlists.etude.id!),
            getPlaylistVideos(playlists.priere.id!),
        ]);

        // teaser : 1 vidéo par catégorie disponible
        const teaser = [culte[0], louange[0], etude[0]].filter(Boolean);

        return Response.json({ teaser, culte, louange, etude, priere });
    } catch {
        return Response.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
