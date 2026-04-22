import { PropsWithChildren } from "react";

export function FilterToolbar({ children }: PropsWithChildren) {
  return <section className="panel filter-toolbar">{children}</section>;
}
