import { Search } from "lucide-react";
import type { ChangeEventHandler } from "react";
import React from "react";

export function SearchArticles({
  onChange,
  label,
  value,
  suggestions = [],
  onSuggestionClick,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
  label: string;
  value?: string;
  suggestions?: string[];
  onSuggestionClick?: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={label}
          className="block w-full rounded-2xl border border-gray-200 bg-white px-12 py-3 text-gray-900 outline-none focus:border-cyan-600 focus:ring-2 focus:ring-cyan-500/20 dark:border-gray-700 dark:bg-background dark:text-slate-100 transition-all"
        />
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && value && suggestions.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-background animate-in fade-in slide-in-from-top-1">
          <ul className="max-h-60 overflow-auto p-2">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    onSuggestionClick?.(suggestion);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-cyan-50 dark:text-gray-200 dark:hover:bg-cyan-900/20 rounded-xl transition-colors"
                >
                  <Search className="mr-3 h-3.5 w-3.5 text-gray-400" />
                  <span className="truncate">{suggestion}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
