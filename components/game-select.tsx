import { SearchableSelect } from "@/components/searchable-select";
import { GameItem } from "@/lib/types";

export function GameSelect({
  value,
  games,
  onChange,
  placeholder,
  title,
}: {
  value: string;
  games: GameItem[];
  onChange: (next: string) => void;
  placeholder?: string;
  title?: string;
}) {
  return (
    <SearchableSelect
      value={value}
      options={games.map((item) => item.name)}
      onChange={onChange}
      placeholder={placeholder ?? "选择或输入游戏名称"}
      title={title ?? "游戏名称"}
    />
  );
}
