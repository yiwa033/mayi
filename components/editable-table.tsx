import { ReactNode } from "react";

export function EditableTable({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="table-panel">
      <div className="table-wrap">
        <table className="data-table">
          <thead>{header}</thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
