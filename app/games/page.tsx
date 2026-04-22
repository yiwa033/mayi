"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { GameForm } from "@/components/game-form";
import { PageHeader } from "@/components/page-header";
import { FilterToolbar } from "@/components/filter-toolbar";
import { getLocal, setLocal } from "@/lib/storage";
import { GameItem } from "@/lib/types";

const GAMES_KEY = "finance_games";

const emptyDraft: Omit<GameItem, "id"> = {
  name: "",
  code: "",
  status: "enabled",
  note: "",
};

export default function GamesPage() {
  const [games, setGames] = useState<GameItem[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<string>("");

  useEffect(() => {
    setGames(getLocal<GameItem[]>(GAMES_KEY, []));
  }, []);

  useEffect(() => {
    setLocal(GAMES_KEY, games);
  }, [games]);

  const sortedGames = useMemo(() => [...games], [games]);

  const handleSubmit = () => {
    if (!draft.name.trim()) return;
    if (editingId) {
      setGames((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...draft } : item)),
      );
      setEditingId("");
    } else {
      setGames((prev) => [...prev, { id: crypto.randomUUID(), ...draft }]);
    }
    setDraft(emptyDraft);
  };

  const handleEdit = (item: GameItem) => {
    setEditingId(item.id);
    setDraft({
      name: item.name,
      code: item.code,
      status: item.status,
      note: item.note,
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("确认删除该游戏吗？")) return;
    setGames((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="page-root">
      <PageHeader title="游戏管理" description="本地游戏库（localStorage）" />
      <FilterToolbar>
        <GameForm draft={draft} onChange={setDraft} onSubmit={handleSubmit} editingId={editingId} />
      </FilterToolbar>
      <div className="table-panel">
        <div className="table-wrap">
          <table className="data-table min-w-[900px]">
            <thead>
            <tr>
              <th>游戏名称</th>
              <th>游戏编码</th>
              <th>状态</th>
              <th>备注</th>
              <th className="op-col">操作</th>
            </tr>
            </thead>
            <tbody>
            {sortedGames.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.code}</td>
                <td>
                  {item.status === "enabled" ? "启用" : "停用"}
                </td>
                <td>{item.note}</td>
                <td className="op-col">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => handleEdit(item)}
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm ml-1"
                    onClick={() => handleDelete(item.id)}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
            {sortedGames.length === 0 ? (
              <tr>
                <td className="empty-text" colSpan={5}>
                  暂无游戏，请先新增
                </td>
              </tr>
            ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
