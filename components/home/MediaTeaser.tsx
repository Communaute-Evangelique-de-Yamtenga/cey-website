import { MediaTeaserClient } from "./MediaTeaserClient";

type YTVideo = { videoId: string; title: string; date: string; thumbnail: string; url: string; source?: string };

export async function MediaTeaser() {
  const res = await fetch("http://localhost:3000/api/youtube", { cache: "no-store" });
  const data = await res.json();

  return (
    <MediaTeaserClient
      culte={data.culte?.[0] ?? null}
      louange={data.louange?.[0] ?? null}
      etude={data.etude?.[0] ?? null}
      priere={data.priere?.[0] ?? null}
    />
  );
}
