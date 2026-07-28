"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: "⊞" },
  { href: "/admin/annonces", label: "Annonces", icon: "📢" },
  { href: "/admin/evenements", label: "Événements", icon: "📅" },
  { href: "/admin/pasteurs", label: "Pasteurs", icon: "👤" },
  { href: "/admin/construction", label: "Construction", icon: "🏗️" },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: "👥" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (pathname === "/admin/login") return <>{children}</>;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-white border-r border-gray-200 flex flex-col transition-all duration-200`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          {sidebarOpen && <span className="font-bold text-gray-800 text-sm">CEY Admin</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-gray-600 ml-auto">
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
