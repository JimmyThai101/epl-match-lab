"use client";

import { useEffect, useId, useRef, useState } from "react";
import { TERMS, type TermId } from "@/lib/glossary";

export function TermTip({ term }: { term: TermId }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const item = TERMS[term];

  useEffect(() => {
    if (!open) {
      return;
    }
    function onDoc(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span ref={root} className="relative inline-flex">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 hover:bg-slate-300"
      >
        ?
        <span className="sr-only">What {item.label} means</span>
      </button>
      {open ? (
        <span
          id={id}
          role="dialog"
          className="absolute left-0 top-6 z-30 w-56 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs leading-5 font-normal text-slate-600 shadow-lg"
        >
          <strong className="block text-slate-900">{item.label}</strong>
          {item.meaning}
        </span>
      ) : null}
    </span>
  );
}
