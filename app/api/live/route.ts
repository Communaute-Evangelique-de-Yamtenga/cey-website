const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UC12juMtC3bxgttNQB-9hWkA";

export async function GET() {
    try {
        const [ytRes, fbRes] = await Promise.all([
            fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`, { next: { revalidate: 60 } }),
            fetch(`https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/live_videos?status=LIVE&fields=title,description,permalink_url&access_token=${process.env.FACEBOOK_ACCESS_TOKEN}`, { next: { revalidate: 60 } }),
        ]);

        const [ytData, fbData] = await Promise.all([ytRes.json(), fbRes.json()]);

        const ytLive = ytData.items?.[0];
        const fbLive = fbData.data?.[0];

        if (ytLive) {
            return Response.json({
                live: true,
                platform: "youtube",
                title: ytLive.snippet.title,
                url: `https://www.youtube.com/watch?v=${ytLive.id.videoId}`,
            });
        }

        if (fbLive) {
            const permalink = fbLive.permalink_url ?? "";
            const url = permalink.startsWith("http") ? permalink : `https://www.facebook.com${permalink}`;
            return Response.json({
                live: true,
                platform: "facebook",
                title: fbLive.title ?? fbLive.description?.slice(0, 80) ?? "En direct",
                url,
            });
        }

        return Response.json({ live: false });
    } catch {
        return Response.json({ live: false });
    }
}
