"use client";

import { useEffect } from "react";

type Props = {
  videoId: string;
  source: "youtube" | "facebook";
  url: string;
  title: string;
  onClose: () => void;
};

export function VideoModal({ videoId, source, url, title, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const src =
    source === "youtube"
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
      : `https://www.facebook.com/plugins/video.php?height=314&href=${encodeURIComponent(url)}&show_text=false&width=560&t=0`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 pt-30"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-black">
          <iframe
            src={src}
            title={title}
            width="100%"
            height="100%"
            scrolling="no"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: "none", overflow: "hidden", borderRadius: "6px" }}
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="flex justify-end rounded-b-2xl bg-black/90 px-4 py-2">
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-sm font-semibold"
          >
            ✕ Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
