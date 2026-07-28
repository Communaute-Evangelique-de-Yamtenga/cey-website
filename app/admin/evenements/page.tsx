"use client";
import { useEffect, useState } from "react";

interface Evenement { id: string; title: string; description: string; date: string; tag: string; tag_accent: string; }

const empty = { title: "", description: "", date: "", tag: "", tag_accent: "blue" };

export default function EvenementsPage() {
  const [items, setItems] = useState<Evenement[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/evenements");
    setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await fetch("/api/admin/evenements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
      setEditing(null);
    } else {
      await fetch("/api/admin/evenements", {
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
    await fetch("/api/admin/evenements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  function startEdit(item: Evenement) {
    setEditing(item.id);
    setForm({ title: item.title, description: item.description, date: item.date, tag: item.tag, tag_accent: item.tag_accent });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Événements</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">{editing ? "Modifier l'événement" : "Nouvel événement"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2" />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="Tag (ex: Évangélisation)" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={form.tag_accent} onChange={(e) => setForm({ ...form, tag_accent: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="blue">Bleu</option>
            <option value="red">Rouge</option>
            <option value="navy">Navy</option>
          </select>
          <div className="flex gap-2 col-span-2">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {editing ? "Mettre à jour" : "Ajouter"}
            </button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {items.length === 0 && <p className="text-sm text-gray-400 p-5">Aucun événement.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-400">{item.date} · {item.tag}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="text-xs text-blue-500 hover:text-blue-700">Modifier</button>
              <button onClick={() => handleDelete(item.id)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
