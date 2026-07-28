"use client";
import { useEffect, useState } from "react";

interface AdminUser { id: string; email: string; role: string; created_at: string; }

const ROLES = ["super_admin", "annonces", "evenements", "pasteurs", "construction"];

export default function UtilisateursPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("annonces");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/utilisateurs");
    setUsers(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/utilisateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (data.error) { setError(data.error); } else { setEmail(""); setPassword(""); await load(); }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/utilisateurs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  }

  const roleLabel: Record<string, string> = {
    super_admin: "Super Admin",
    annonces: "Annonces",
    evenements: "Événements",
    pasteurs: "Pasteurs",
    construction: "Construction",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Utilisateurs admin</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Ajouter un administrateur</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" required minLength={6} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select value={role} onChange={(e) => setRole(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {ROLES.map((r) => <option key={r} value={r}>{roleLabel[r]}</option>)}
          </select>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Création..." : "Créer"}
          </button>
          {error && <p className="text-sm text-red-500 col-span-2">{error}</p>}
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {users.length === 0 && <p className="text-sm text-gray-400 p-5">Aucun utilisateur.</p>}
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-gray-800">{u.email}</p>
              <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{roleLabel[u.role] ?? u.role}</span>
            </div>
            <button onClick={() => handleDelete(u.id)} className="text-xs text-red-500 hover:text-red-700">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}
