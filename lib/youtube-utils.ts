export type Video = { videoId: string; title: string; date: string; thumbnail: string; url: string; source?: string };
export type VideoExt = Video & { title_raw?: string; description?: string; duration?: number; publishedAt?: string };

export function extractDayFromTitle(title: string): number | null {
    const m = title.match(/(\d{1,2})\s*(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i)
        ?? title.match(/(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+(\d{1,2})/i);
    if (!m) return null;
    const day = parseInt(m[1]);
    return isNaN(day) ? null : day;
}

export function deduplicateByDuration(videos: VideoExt[]): Video[] {
    const result: VideoExt[] = [];
    for (const v of videos) {
        const isDuplicate = result.some(r => {
            if (r.duration && v.duration) return Math.abs(r.duration - v.duration) < 60;
            const dayR = extractDayFromTitle(r.title);
            const dayV = extractDayFromTitle(v.title);
            if (dayR !== null && dayV !== null) return dayR === dayV;
            const extractKey = (t: string) => {
                const nums = t.match(/\d+/g) ?? [];
                return nums.filter(n => n.length <= 2 || n.length === 4).join("-");
            };
            const rKey = extractKey(r.title);
            const vKey = extractKey(v.title);
            return rKey.length > 3 && rKey === vKey;
        });
        if (!isDuplicate) result.push(v);
    }
    return result;
}

export function fillGapsWithFacebook(ytVideos: VideoExt[], fbVideos: VideoExt[], keywords: string[]): VideoExt[] {
    const result: VideoExt[] = [...ytVideos];
    for (let i = 0; i < result.length - 1; i++) {
        const dayA = extractDayFromTitle(result[i].title);
        const dayB = extractDayFromTitle(result[i + 1].title);
        if (dayA === null || dayB === null || dayA - dayB <= 1) continue;
        for (let missingDay = dayA - 1; missingDay > dayB; missingDay--) {
            const fbMatch = fbVideos.find(v => {
                const rawTitle = v.title_raw ?? v.title ?? "";
                const title = rawTitle.toLowerCase();
                return extractDayFromTitle(rawTitle) === missingDay && keywords.some(k => title.includes(k.toLowerCase()));
            });
            if (fbMatch) {
                result.splice(i + 1, 0, { ...fbMatch, duration: undefined, publishedAt: undefined });
                i++;
            }
        }
    }
    return result;
}

export function filterVideos(all: VideoExt[], keywords: string[], exclude: string[] = [], titleOnly = false, needed = 3): Video[] {
    const seenTitles = new Set<string>();
    return all.filter(v => {
        const searchText = titleOnly ? (v.title_raw ?? "").toLowerCase() : `${v.title_raw ?? ""} ${v.description ?? ""}`.toLowerCase();
        const fullText = `${v.title_raw ?? ""} ${v.description ?? ""}`.toLowerCase();
        const titleKey = (v.title_raw ?? "").trim().toLowerCase();
        if (titleKey && seenTitles.has(titleKey)) return false;
        if (titleKey) seenTitles.add(titleKey);
        return keywords.some(k => searchText.includes(k.toLowerCase())) && !exclude.some(e => fullText.includes(e.toLowerCase()));
    }).slice(0, needed);
}
