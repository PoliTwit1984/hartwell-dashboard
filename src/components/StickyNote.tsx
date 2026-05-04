"use client";

import { useEffect, useState } from "react";

type Props = {
  storageKey: string;
  placeholder?: string;
};

export function StickyNote({ storageKey, placeholder }: Props) {
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setNote(stored);
    } catch {
      // localStorage unavailable (SSR / privacy mode) — silently no-op
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (note.trim()) localStorage.setItem(storageKey, note);
      else localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [note, storageKey, hydrated]);

  if (!hydrated) return null;

  if (editing) {
    return (
      <div className="mt-3">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={() => setEditing(false)}
          autoFocus
          rows={3}
          placeholder={placeholder ?? "Add a note (saved locally)"}
          className="w-full bg-yellow-50 border border-yellow-200 rounded p-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="mt-3 text-left w-full text-xs text-zinc-500 italic hover:text-zinc-700 transition-colors"
    >
      {note ? (
        <span className="block bg-yellow-50 border border-yellow-200 rounded p-2 not-italic text-zinc-800 whitespace-pre-wrap">
          {note}
        </span>
      ) : (
        <span>+ Add manager note (saved locally to this browser)</span>
      )}
    </button>
  );
}
