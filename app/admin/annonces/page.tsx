"use client";
import { useEffect, useState } from "react";

interface Annonce { id: string; text: string; date: string; active: boolean; }

export default function AnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/annonces");
    setAnnonces(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await fetch("/api/admin/annonces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, date: new Date().toLocaleDateString("fr-FR"), active: true }),
    });
    setText("");
    await load();
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/annonces", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Annonces</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Nouvelle annonce</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Texte de l'annonce..."
            rows={2}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 self-end"
          >
            Publier
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {annonces.length === 0 && (
          <p className="text-sm text-gray-400 p-5">Aucune annonce pour le moment.</p>
        )}
        {annonces.map((a) => (
          <div key={a.id} className="flex items-start justify-between p-4 gap-4">
            <div>
              <p className="text-sm text-gray-800">{a.text}</p>
              <p className="text-xs text-gray-400 mt-1">{a.date}</p>
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              className="text-xs text-red-500 hover:text-red-700 shrink-0"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
