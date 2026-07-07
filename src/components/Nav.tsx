"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export function Nav() {
  const path = usePathname();

  const items = [
    { href: "/", label: "Panel", icon: "◈" },
    { href: "/menu", label: "Menú", icon: "☰" },
    { href: "/configuracion", label: "Config", icon: "⚙" },
  ];

  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 z-20 border-t border-line bg-bg/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-1">
        {items.map((item) => {
          const active = path === item.href || path.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-xs font-medium transition-colors ${
                active ? "text-brand" : "text-muted hover:text-ink"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center gap-0.5 rounded-xl px-4 py-2 text-xs font-medium text-muted hover:text-danger"
        >
          <span className="text-lg">⊘</span>
          Salir
        </button>
      </div>
    </nav>
  );
}
