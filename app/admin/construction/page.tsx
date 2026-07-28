"use client";
import { useEffect, useState, useRef } from "react";

interface Construction { id: string; raised: number; goal: number; currency: string; milestones: { label: string; detail: string; status: "done" | "current" | "upcoming" }[]; photos: string[]; }

export default function ConstructionPage() {
  const [data, setData] = useState<Construction | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/construction");
    setData(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    await fetch("/api/admin/construction", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
  }

  async function handleUploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "cey/construction");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    const updated = { ...data, photos: [...(data.photos || []), url] };
    setData(updated);
    await fetch("/api/admin/construction", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setUploading(false);
  }

  function removePhoto(url: string) {
    if (!data) return;
    setData({ ...data, photos: data.photos.filter((p) => p !== url) });
  }

  if (!data) return <p className="text-sm text-gray-400">Chargement...</p>;

  const percent = Math.round((data.raised / data.goal) * 100);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Projet de construction</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financement */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Financement</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Montant collecté ({data.currency})</label>
              <input
                type="number"
                value={data.raised}
                onChange={(e) => setData({ ...data, raised: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Objectif ({data.currency})</label>
              <input
                type="number"
                value={data.goal}
                onChange={(e) => setData({ ...data, goal: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(percent, 100)}%` }} />
            </div>
            <p className="text-xs text-gray-500">{percent}% atteint</p>
          </div>
        </div>

        {/* Jalons */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Jalons</h2>
          <div className="space-y-3">
            {data.milestones.map((m, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  value={m.status}
                  onChange={(e) => {
                    const ms = [...data.milestones];
                    ms[i] = { ...ms[i], status: e.target.value as "done" | "current" | "upcoming" };
                    setData({ ...data, milestones: ms });
                  }}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none"
                >
                  <option value="done">✅ Terminé</option>
                  <option value="current">🔄 En cours</option>
                  <option value="upcoming">⏳ À venir</option>
                </select>
                <span className="text-sm text-gray-700">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
        {saving ? "Enregistrement..." : "Enregistrer"}
      </button>

      {/* Photos */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Photos du chantier</h2>
          <div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUploadPhoto} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {uploading ? "Upload..." : "+ Ajouter une photo"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(data.photos || []).map((url) => (
            <div key={url} className="relative group">
              <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
              <button
                onClick={() => removePhoto(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center"
              >×</button>
            </div>
          ))}
          {(data.photos || []).length === 0 && <p className="text-sm text-gray-400 col-span-4">Aucune photo.</p>}
        </div>
      </div>
    </div>
  );
}
