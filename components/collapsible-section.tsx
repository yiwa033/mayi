"use client";

import { PropsWithChildren, useState } from "react";

export function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: PropsWithChildren<{ title: string; defaultOpen?: boolean }>) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="panel">
      <div className="collapsible-header">
        <div className="panel-title">{title}</div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen((v) => !v)}>
          {open ? "收起" : "展开"}
        </button>
      </div>
      {open ? <div className="collapsible-body">{children}</div> : null}
    </section>
  );
}
