export function RowActions({
  onCopy,
  onDelete,
}: {
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="row-actions">
      <button type="button" className="row-action-btn" onClick={onCopy}>
        复制
      </button>
      <button type="button" className="row-action-btn row-action-danger" onClick={onDelete}>
        删除
      </button>
    </div>
  );
}
