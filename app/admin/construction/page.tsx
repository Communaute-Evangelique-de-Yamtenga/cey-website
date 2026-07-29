"use client";
import { useEffect, useState, useRef } from "react";

interface TempleImage { id: string; url: string; caption: string; }
interface ChantierPhoto { id: string; url: string; caption: string; ordre: number; }

export default function ConstructionPage() {
  const [templeImg, setTempleImg] = useState<TempleImage | null>(null);
  const [chantierPhotos, setChantierPhotos] = useState<ChantierPhoto[]>([]);
  const [uploading, setUploading] = useState<"temple" | "chantier" | null>(null);
  const [editingCaption, setEditingCaption] = useState<{ id: string; caption: string } | null>(null);

  const templeRef = useRef<HTMLInputElement>(null);
  const chantierRef = useRef<HTMLInputElement>(null);

  async function load() {
    const [t, c] = await Promise.all([
      fetch("/api/admin/temple-image").then((r) => r.json()),
      fetch("/api/admin/chantier-photos").then((r) => r.json()),
    ]);
    setTempleImg(t);
    setChantierPhotos(Array.isArray(c) ? c : []);
  }

  useEffect(() => { load(); }, []);

  async function uploadFile(file: File, folder: string): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", `cey/${folder}`);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok || data.error) { alert("Erreur upload : " + (data.error ?? res.status)); return null; }
    return data.url;
  }

  async function handleTempleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("temple");
    const url = await uploadFile(file, "temple");
    if (!url) { setUploading(null); return; }
    await fetch("/api/admin/temple-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, caption: "" }),
    });
    await load();
    setUploading(null);
    if (templeRef.current) templeRef.current.value = "";
  }

  async function handleTempleDelete() {
    await fetch("/api/admin/temple-image", { method: "DELETE" });
    setTempleImg(null);
  }

  async function handleChantierUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading("chantier");
    for (const file of files) {
      const url = await uploadFile(file, "chantier");
      await fetch("/api/admin/chantier-photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, caption: "", ordre: chantierPhotos.length }),
      });
    }
    await load();
    setUploading(null);
  }

  async function handleChantierDelete(id: string) {
    await fetch("/api/admin/chantier-photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  async function saveCaption(id: string, caption: string) {
    await fetch("/api/admin/chantier-photos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, caption }),
    });
    setEditingCaption(null);
    await load();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Construction</h1>

      {/* Section 1 — Image du temple (home) */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-800">Image du nouveau temple</h2>
            <p className="text-xs text-gray-400 mt-0.5">Affichée sur la page d'accueil — 1 seule image</p>
          </div>
          <div>
            <input ref={templeRef} type="file" accept="image/*" onChange={handleTempleUpload} className="hidden" />
            <button
              onClick={() => templeRef.current?.click()}
              disabled={uploading === "temple"}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading === "temple" ? "Upload..." : templeImg ? "Remplacer" : "+ Ajouter"}
            </button>
          </div>
        </div>
        {templeImg ? (
          <div className="relative group w-full max-w-md">
            <img src={templeImg.url} alt="temple" className="w-full h-52 object-cover rounded-lg" />
            <button
              onClick={handleTempleDelete}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs hidden group-hover:flex items-center justify-center"
            >×</button>
          </div>
        ) : (
          <div className="w-full max-w-md h-52 rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">
            Aucune image
          </div>
        )}
      </div>

      {/* Section 2 — Photos du chantier (page projet) */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-800">Photos du chantier</h2>
            <p className="text-xs text-gray-400 mt-0.5">Affichées sur la page Projet — plusieurs photos possibles</p>
          </div>
          <div>
            <input ref={chantierRef} type="file" accept="image/*" multiple onChange={handleChantierUpload} className="hidden" />
            <button
              onClick={() => chantierRef.current?.click()}
              disabled={uploading === "chantier"}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading === "chantier" ? "Upload..." : "+ Ajouter des photos"}
            </button>
          </div>
        </div>

        {chantierPhotos.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune photo du chantier.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {chantierPhotos.map((p) => (
              <div key={p.id} className="group relative">
                <img src={p.url} alt={p.caption} className="w-full h-28 object-cover rounded-lg" />
                <button
                  onClick={() => handleChantierDelete(p.id)}
                  className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center"
                >×</button>
                {editingCaption?.id === p.id ? (
                  <div className="mt-1 flex gap-1">
                    <input
                      value={editingCaption.caption}
                      onChange={(e) => setEditingCaption({ id: p.id, caption: e.target.value })}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                    <button onClick={() => saveCaption(p.id, editingCaption.caption)} className="text-xs text-blue-600 font-medium">✓</button>
                  </div>
                ) : (
                  <p
                    onClick={() => setEditingCaption({ id: p.id, caption: p.caption ?? "" })}
                    className="mt-1 text-xs text-gray-400 truncate cursor-pointer hover:text-gray-600"
                  >
                    {p.caption || "Ajouter une légende..."}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
