"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/rd", label: "研发对账" },
  { href: "/channel", label: "渠道对账" },
  { href: "/games", label: "游戏管理" },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-slate-300 bg-white">
      <div className="mx-auto flex h-12 w-full max-w-[1280px] items-center justify-between px-4">
        <Link href="/" className="text-sm font-semibold text-slate-900">
          网站首页
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-sm border px-3 py-1 ${
                  active
                    ? "border-sky-400 bg-sky-50 text-sky-700"
                    : "border-transparent text-slate-700 hover:border-slate-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
