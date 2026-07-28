import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ count: annonces }, { count: evenements }, { count: pasteurs }] = await Promise.all([
    supabase.from("annonces").select("*", { count: "exact", head: true }),
    supabase.from("evenements").select("*", { count: "exact", head: true }),
    supabase.from("pasteurs").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Annonces actives", value: annonces ?? 0, icon: "📢", href: "/admin/annonces" },
    { label: "Événements à venir", value: evenements ?? 0, icon: "📅", href: "/admin/evenements" },
    { label: "Pasteurs", value: pasteurs ?? 0, icon: "👤", href: "/admin/pasteurs" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Tableau de bord</h1>
      <p className="text-sm text-gray-500 mb-8">Bienvenue dans l'espace d'administration CEY</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-3xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-1">{s.label}</div>
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Accès rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: "/admin/annonces", label: "Nouvelle annonce", icon: "📢" },
            { href: "/admin/evenements", label: "Nouvel événement", icon: "📅" },
            { href: "/admin/pasteurs", label: "Ajouter un pasteur", icon: "👤" },
            { href: "/admin/construction", label: "Mise à jour chantier", icon: "🏗️" },
            { href: "/admin/utilisateurs", label: "Gérer les admins", icon: "👥" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
