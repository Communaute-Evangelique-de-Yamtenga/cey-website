import { type VideoExt, deduplicateByDuration, extractDayFromTitle, fillGapsWithFacebook, filterVideos } from "@/lib/youtube-utils";

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
    const opts = { next: { revalidate: 3600 } };

    const [resLive, resUploaded, resArchive] = await Promise.all([
        fetch(`${base}&type=live`, opts),
        fetch(`${base}&type=uploaded`, opts),
        fetch(`${base}&type=live_archive`, opts),
    ]);
    const [dataLive, dataUploaded, dataArchive] = await Promise.all([resLive.json(), resUploaded.json(), resArchive.json()]);

    const seen = new Set<string>();
    return [...(dataLive.data ?? []), ...(dataUploaded.data ?? []), ...(dataArchive.data ?? [])]
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
    const res = await fetch(`${BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const items = data.items ?? [];
    const videoIds = items.map((item: { snippet: { resourceId: { videoId: string } } }) => item.snippet.resourceId.videoId);
    const details = await getVideoDetails(videoIds);
    return items
        .map((item: { snippet: { title: string; thumbnails: { medium: { url: string } }; resourceId: { videoId: string } } }) => {
            const id = item.snippet.resourceId.videoId;
            return {
                videoId: id,
                title: item.snippet.title,
                date: details[id]?.date ?? "",
                duration: details[id]?.duration ?? 0,
                publishedAt: details[id]?.publishedAt ?? "",
                thumbnail: item.snippet.thumbnails.medium.url,
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

        const culte  = deduplicateByDuration([...culteYT, ...culteFB]);
        const louange = deduplicateByDuration([...louangeYT, ...louangeFB]);
        const etude  = deduplicateByDuration([...etudeYT, ...etudeFB]);
        // DEBUG 25 juillet
        const filled = fillGapsWithFacebook(priereYT, allFB, ["31 jours", "priere", "prière", "jeudi", "veillée"]);
        const priere = deduplicateByDuration(filled);
        console.log("=== AFTER DEDUP ===", priere.map(v => v.title));
        // trace dedup sur le 25
        const v25 = filled.find(v => v.title.includes("25"));
        if (v25) {
            const before = filled.slice(0, filled.indexOf(v25));
            console.log("=== CHECK 25 vs ===", before.map(r => ({
                title: r.title,
                durationR: r.duration, durationV: v25.duration,
                durationMatch: r.duration && v25.duration ? Math.abs(r.duration - v25.duration) < 300 : "N/A (fallback)",
                dayR: extractDayFromTitle(r.title), dayV: extractDayFromTitle(v25.title),
            })));
        }

        const classifiedIds = new Set([...culteFB, ...louangeFB, ...etudeFB, ...enseignementFB].map(v => v.videoId));
        const autres = allFB.filter(v => {
            if (classifiedIds.has(v.videoId)) return false;
            const t = (v.title_raw ?? "").toLowerCase();
            return !["prière", "priere", "31 jours", "jeudi", "veillée", "culte", "dimanche", "étude", "etude", "biblique", "louange", "adoration", "chorale"].some(k => t.includes(k));
        }).slice(0, 6);

        return Response.json({ teaser: [culte[0], louange[0], etude[0]].filter(Boolean), culte, louange, etude, priere, enseignement: enseignementFB, autres });
    } catch {
        return Response.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
