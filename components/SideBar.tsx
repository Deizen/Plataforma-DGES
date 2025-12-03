"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-4 space-y-4">
      <h2 className="text-xl font-bold">Panel</h2>

      <nav className="flex flex-col space-y-2">
        <Link href="/">Dashboard</Link>
        <Link href="/carreras">Carreras</Link>
        <Link href="/usuarios">Usuarios</Link>
      </nav>
    </aside>
  );
}