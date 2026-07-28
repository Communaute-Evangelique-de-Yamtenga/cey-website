"use client";
import { useEffect, useState, useRef } from "react";

interface Pasteur { id: string; name: string; role: string; description: string; photo: string; ordre: number; }

const empty = { name: "", role: "", description: "", photo: "", ordre: 0 };

export default function PasteursPage() {
  const [items, setItems] = useState<Pasteur[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/pasteurs");
    setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "cey/pasteurs");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    setForm((f) => ({ ...f, photo: url }));
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await fetch("/api/admin/pasteurs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
      setEditing(null);
    } else {
      await fetch("/api/admin/pasteurs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm(empty);
    await load();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/pasteurs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  function startEdit(p: Pasteur) {
    setEditing(p.id);
    setForm({ name: p.name, role: p.role, description: p.description, photo: p.photo, ordre: p.ordre });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pasteurs</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">{editing ? "Modifier le pasteur" : "Ajouter un pasteur"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom complet" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Rôle (ex: Pasteur principal)" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description / ministère" rows={2} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2 resize-none" />
          <input type="number" value={form.ordre} onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })} placeholder="Ordre d'affichage" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
              {uploading ? "Upload..." : "Photo"}
            </button>
            {form.photo && <img src={form.photo} alt="" className="w-10 h-10 rounded-full object-cover" />}
          </div>
          <div className="flex gap-2 col-span-2">
            <button type="submit" disabled={loading || uploading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {editing ? "Mettre à jour" : "Ajouter"}
            </button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3">
            {p.photo ? (
              <img src={p.photo} alt={p.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">👤</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
              <p className="text-xs text-gray-500">{p.role}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => startEdit(p)} className="text-xs text-blue-500 hover:text-blue-700">Modifier</button>
                <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
