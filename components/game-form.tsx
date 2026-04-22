import { GameItem, GameStatus } from "@/lib/types";

interface Props {
  draft: Omit<GameItem, "id">;
  onChange: (next: Omit<GameItem, "id">) => void;
  onSubmit: () => void;
  editingId?: string;
}

export function GameForm({ draft, onChange, onSubmit, editingId }: Props) {
  const setField = (field: keyof Omit<GameItem, "id">, value: string) => {
    onChange({ ...draft, [field]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className="field"
        title="游戏名称"
        placeholder="游戏名称（必填）"
        value={draft.name}
        onChange={(e) => setField("name", e.target.value)}
      />
      <input
        className="field"
        title="游戏编码"
        placeholder="游戏编码"
        value={draft.code}
        onChange={(e) => setField("code", e.target.value)}
      />
      <select
        className="field"
        aria-label="游戏状态"
        value={draft.status}
        onChange={(e) => setField("status", e.target.value as GameStatus)}
      >
        <option value="enabled">启用</option>
        <option value="disabled">停用</option>
      </select>
      <input
        className="field"
        title="备注"
        placeholder="备注"
        value={draft.note}
        onChange={(e) => setField("note", e.target.value)}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={onSubmit}
      >
        {editingId ? "保存编辑" : "新增游戏"}
      </button>
    </div>
  );
}
