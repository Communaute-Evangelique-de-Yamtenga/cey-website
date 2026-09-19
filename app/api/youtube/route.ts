import { type VideoExt, deduplicateByDuration, fillGapsWithFacebook, filterVideos, sortVideosByTitleDate } from "@/lib/youtube-utils";

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE = "https://www.googleapis.com/youtube/v3";

export const playlists = {
    culte:        { id: "PLZQId5viBilA", label: "Cultes de dimanche",   url: "https://www.youtube.com/playlist?list=PLZQId5viBilA" },
    louange:      { id: "PLW7583L8vUEc", label: "Louange & Adoration",  url: "https://www.youtube.com/playlist?list=PLW7583L8vUEc" },
    etude:        { id: "PLYNdK2z5pYzY", label: "Études bibliques",     url: "https://www.youtube.com/playlist?list=PLYNdK2z5pYzY" },
    enseignement: { id: null,            label: "Enseignements",         url: null },
    priere:       { id: "PLOI8TP0FOde4", label: "Mois de prière",       url: "https://www.youtube.com/playlist?list=PLOI8TP0FOde4" },
};

async function getAllFacebookVideos(): Promise<VideoExt[]> {
    const token = process.env.FACEBOOK_ACCESS_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const fields = "title,description,created_time,thumbnails,permalink_url";
    const base = `https://graph.facebook.com/${pageId}/videos?fields=${fields}&limit=100&access_token=${token}`;
    const liveBase = `https://graph.facebook.com/${pageId}/live_videos?fields=${fields}&limit=100&access_token=${token}`;
    const opts = { next: { revalidate: 3600 } };

    if (!token || !pageId) throw new Error("Configuration Facebook manquante");

    const fetchJson = async (url: string) => {
        try {
            const res = await fetch(url, opts);
            if (!res.ok) {
                const payload = await res.json().catch(() => ({}));
                return { error: { message: payload?.error?.message ?? `Erreur Facebook (${res.status})` } };
            }
            return await res.json();
        } catch (error) {
            return { error: { message: error instanceof Error ? error.message : "requête refusée" } };
        }
    };

    const [dataLive, dataUploaded, dataArchive] = await Promise.all([
        fetchJson(liveBase),
        fetchJson(`${base}&type=UPLOADED`),
        fetchJson(`${base}&type=TAGGED`),
    ]);

    const validSources = [dataLive, dataUploaded, dataArchive].filter((source) => !source?.error);

    if (validSources.length === 0) {
        const firstError = [dataLive, dataUploaded, dataArchive].find((source) => source?.error)?.error;
        throw new Error(`Facebook: ${firstError?.message ?? "requête refusée"}`);
    }

    const seen = new Set<string>();
    return [...(dataLive?.data ?? []), ...(dataUploaded?.data ?? []), ...(dataArchive?.data ?? [])]
        .filter(v => {
            if (seen.has(v.id) || (!v.title && !v.description)) return false;
            seen.add(v.id);
            return true;
        })
        .map((v: { id: string; title?: string; description?: string; thumbnails?: { data: { uri: string }[] } }) => ({
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

async function getVideoDetails(videoIds: string[]): Promise<Record<string, { date: string; duration: number; publishedAt: string }>> {
    if (!videoIds.length) return {};
    const res = await fetch(`${BASE}/videos?part=snippet,contentDetails&id=${videoIds.join(",")}&key=${API_KEY}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data.error) throw new Error(`YouTube: ${data.error.message ?? "requête refusée"}`);
    const map: Record<string, { date: string; duration: number; publishedAt: string }> = {};
    for (const item of data.items ?? []) {
        const m = (item.contentDetails?.duration ?? "").match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        map[item.id] = {
            date: new Date(item.snippet.publishedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
            duration: m ? parseInt(m[1] ?? "0") * 3600 + parseInt(m[2] ?? "0") * 60 + parseInt(m[3] ?? "0") : 0,
            publishedAt: item.snippet.publishedAt,
        };
    }
    return map;
}

async function getPlaylistVideos(playlistId: string, maxResults = 12): Promise<VideoExt[]> {
    const res = await fetch(`${BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    if (data.error) throw new Error(`YouTube: ${data.error.message ?? "requête refusée"}`);
    const items = (data.items ?? []).filter((item: { snippet?: { title?: string; resourceId?: { videoId?: string } } }) => {
        const title = item.snippet?.title?.trim().toLowerCase() ?? "";
        const videoId = item.snippet?.resourceId?.videoId;
        return Boolean(videoId) && title !== "deleted video" && title !== "private video";
    }).slice(0, maxResults);
    const videoIds = items.map((item: { snippet: { resourceId: { videoId: string } } }) => item.snippet.resourceId.videoId);
    const details = await getVideoDetails(videoIds);
    return items
        .map((item: { snippet: { title: string; thumbnails?: Partial<Record<"medium" | "high" | "default", { url: string }>>; resourceId: { videoId: string } } }) => {
            const id = item.snippet.resourceId.videoId;
            return {
                videoId: id,
                title: item.snippet.title,
                date: details[id]?.date ?? "",
                duration: details[id]?.duration ?? 0,
                publishedAt: details[id]?.publishedAt ?? "",
                thumbnail: item.snippet.thumbnails?.medium?.url
                    ?? item.snippet.thumbnails?.high?.url
                    ?? item.snippet.thumbnails?.default?.url
                    ?? "",
                url: `https://www.youtube.com/watch?v=${id}`,
                source: "youtube",
            };
        })
        .sort((a: VideoExt, b: VideoExt) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());
}

export async function GET() {
    try {
        const [culteYT, louangeYT, etudeYT, priereYT, allFB] = await Promise.all([
            getPlaylistVideos(playlists.culte.id!, 15),
            getPlaylistVideos(playlists.louange.id!),
            getPlaylistVideos(playlists.etude.id!),
            getPlaylistVideos(playlists.priere.id!, 50),
            getAllFacebookVideos(),
        ]);

        const culteFB       = filterVideos(allFB, ["culte du dimanche", "culte en français", "culte en commun"], ["priere", "prière", "louange", "étude", "etude"], true, Math.max(0, 15 - culteYT.length));
        const louangeFB     = filterVideos(allFB, ["louange", "adoration", "chorale", "groupe musical", "célébrons", "pâques", "musical"], ["priere", "prière", "31 jours"], false, Math.max(0, 3 - louangeYT.length));
        const etudeFB       = filterVideos(allFB, ["etude biblique", "étude biblique"], [], true, Math.max(0, 3 - etudeYT.length));
        const enseignementFB = filterVideos(allFB, ["enseignement"], ["priere", "prière", "31 jours"], true, 3);

        const culte  = sortVideosByTitleDate(deduplicateByDuration([...culteYT, ...culteFB]));
        const louange = sortVideosByTitleDate(deduplicateByDuration([...louangeYT, ...louangeFB]));
        const etude  = sortVideosByTitleDate(deduplicateByDuration([...etudeYT, ...etudeFB]));
        const filled = fillGapsWithFacebook(priereYT, allFB, ["31 jours", "priere", "prière", "jeudi", "veillée"]);
        const priere = sortVideosByTitleDate(deduplicateByDuration(filled));

        const classifiedIds = new Set([...culteFB, ...louangeFB, ...etudeFB, ...enseignementFB].map(v => v.videoId));
        const autres = allFB.filter(v => {
            if (classifiedIds.has(v.videoId)) return false;
            const t = (v.title_raw ?? "").toLowerCase();
            return !["prière", "priere", "31 jours", "jeudi", "veillée", "culte", "dimanche", "étude", "etude", "biblique", "louange", "adoration", "chorale"].some(k => t.includes(k));
        }).slice(0, 6);

        return Response.json({ teaser: [culte[0], louange[0], etude[0]].filter(Boolean), culte, louange, etude, priere, enseignement: sortVideosByTitleDate(enseignementFB), autres: sortVideosByTitleDate(autres) });
    } catch (error) {
        console.error("Media API error");
        return Response.json({ error: "Impossible de charger les vidéos" }, { status: 502 });
    }
}
