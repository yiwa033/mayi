"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { getLocal, setLocal } from "@/lib/storage";

const SIDEBAR_KEY = "finance_ui_sidebar_collapsed";
const navItems = [
  { href: "/", label: "首页", short: "首" },
  { href: "/rd", label: "研发对账", short: "研" },
  { href: "/channel", label: "渠道对账", short: "渠" },
  { href: "/games", label: "游戏管理", short: "游" },
];

const pageTitleMap: Record<string, string> = {
  "/": "网站首页",
  "/rd": "研发对账",
  "/channel": "渠道对账",
  "/games": "游戏管理",
};

export function AdminShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() =>
    getLocal<boolean>(SIDEBAR_KEY, false),
  );

  useEffect(() => {
    setLocal<boolean>(SIDEBAR_KEY, collapsed);
  }, [collapsed]);

  const title = useMemo(() => {
    if (pathname in pageTitleMap) return pageTitleMap[pathname];
    return "财务对账系统";
  }, [pathname]);

  return (
    <div className="admin-layout">
      <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
        <div className="sidebar-top">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? "展开" : "折叠"}
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${active ? "is-active" : ""}`}
                title={item.label}
              >
                <span className="sidebar-link-icon">{item.short}</span>
                <span className="sidebar-link-text">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="admin-main-wrap">
        <header className="topbar">
          <div className="topbar-left">{title}</div>
          <div className="topbar-right" />
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
