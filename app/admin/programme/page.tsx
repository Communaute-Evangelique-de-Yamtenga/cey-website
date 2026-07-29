"use client";
import { useEffect, useState } from "react";

interface ProgramItem { id: string; day: string; title: string; hours: string; ordre: number; }

const empty = { day: "", title: "", hours: "", ordre: 0 };

export default function ProgrammePage() {
  const [items, setItems] = useState<ProgramItem[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/programme");
    setItems(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await fetch("/api/admin/programme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editing, ...form }),
      });
      setEditing(null);
    } else {
      await fetch("/api/admin/programme", {
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
    await fetch("/api/admin/programme", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  function startEdit(item: ProgramItem) {
    setEditing(item.id);
    setForm({ day: item.day, title: item.title, hours: item.hours, ordre: item.ordre });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Programme hebdomadaire</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">{editing ? "Modifier" : "Ajouter un créneau"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} placeholder="Jour (ex: MARDI)" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre (ex: Étude Biblique)" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} placeholder="Horaires (ex: 19h00 – 20h30)" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="number" value={form.ordre} onChange={(e) => setForm({ ...form, ordre: Number(e.target.value) })} placeholder="Ordre d'affichage" className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex gap-2 col-span-2">
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {editing ? "Mettre à jour" : "Ajouter"}
            </button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm(empty); }} className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {items.length === 0 && <p className="text-sm text-gray-400 p-5">Aucun créneau.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-red-500">{item.day}</span>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{item.title}</p>
              <p className="text-xs text-gray-400">{item.hours}</p>
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
