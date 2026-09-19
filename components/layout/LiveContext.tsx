"use client";

import { createContext, useContext, useEffect, useState } from "react";

type LiveData = { live: false } | { live: true; platform: string; title: string; url: string };

const LiveContext = createContext<LiveData>({ live: false });

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<LiveData>({ live: false });

  useEffect(() => {
    const check = () =>
      fetch("/api/live").then((r) => r.json()).then(setData).catch(() => {});
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  return <LiveContext.Provider value={data}>{children}</LiveContext.Provider>;
}

export function useLive() {
  return useContext(LiveContext);
}
