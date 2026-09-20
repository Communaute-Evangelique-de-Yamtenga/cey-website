import { MediaTeaserClient } from "./MediaTeaserClient";

export async function MediaTeaser() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cey-website.vercel.app";
  const res = await fetch(`${siteUrl}/api/youtube`, { cache: "no-store" });
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
