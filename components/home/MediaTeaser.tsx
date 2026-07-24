import { MediaTeaserClient } from "./MediaTeaserClient";

type YTVideo = { videoId: string; title: string; date: string; thumbnail: string; url: string; source?: string };

export async function MediaTeaser() {
  const res = await fetch("http://localhost:3000/api/youtube", { cache: "no-store" });
  const data = await res.json();
  const videos: YTVideo[] = data.teaser ?? [];

  return <MediaTeaserClient videos={videos} />;
}
