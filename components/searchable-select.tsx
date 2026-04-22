"use client";

import { useMemo, useState } from "react";

interface SearchableSelectProps {
  value: string;
  options: string[];
  onChange: (next: string) => void;
  placeholder?: string;
  title?: string;
}

export function SearchableSelect({
  value,
  options,
  onChange,
  placeholder,
  title,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((item) => item.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <div className="searchable-select">
      <input
        className="field searchable-input"
        title={title}
        placeholder={placeholder}
        value={value}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onBlur={() => {
          setTimeout(() => setOpen(false), 120);
        }}
        onChange={(e) => {
          const next = e.target.value;
          onChange(next);
          setQuery(next);
          setOpen(true);
        }}
      />
      {open ? (
        <div className="searchable-panel">
          <input
            className="field searchable-filter"
            placeholder="搜索游戏名称"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="searchable-options">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="searchable-option"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  {item}
                </button>
              ))
            ) : (
              <div className="searchable-empty">无匹配游戏，可直接手输</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
