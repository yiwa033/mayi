import Link from "next/link";
import { PageHeader } from "@/components/page-header";

const entries = [
  { href: "/rd", label: "研发对账" },
  { href: "/channel", label: "渠道对账" },
  { href: "/games", label: "游戏管理" },
];

export default function HomePage() {
  return (
    <div className="page-root">
      <PageHeader title="首页" description="极简财务对账系统（本地版）" />
      <section className="panel">
        <div className="grid max-w-[960px] grid-cols-3 gap-10">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="rounded-[8px] border border-slate-200 bg-white px-4 py-8 text-center text-sm hover:bg-slate-50"
          >
            {entry.label}
          </Link>
        ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-title">系统说明</div>
        <p className="page-desc">
          本系统为极简对账工具，当前版本仅支持本地保存
        </p>
      </section>
    </div>
  );
}
