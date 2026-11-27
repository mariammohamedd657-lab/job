"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { configs } from "./config";
import type { QuantificationStatus } from "./status";

const categories = [...new Set(configs.map(config => config.category))];
type Props = {
  selected: string;
  statuses: Record<string, QuantificationStatus>;
  onChange: (id: string) => void;
};

// Browser-rendered options, not an OS-native select menu. The calculator still owns
// the selected problem and all figures; this component owns only menu interaction.
export default function ProblemSelector({ selected, statuses, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(selected);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", time: 0 });
  const current = configs.find(config => config.id === selected)!;
  const optionId = (id: string) => "q-option-" + id;

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const list = menu.current;
    const row = document.getElementById(optionId(active));
    if (!list || !row) return;
    const bounds = list.getBoundingClientRect();
    const item = row.getBoundingClientRect();
    if (item.top < bounds.top) list.scrollTop -= bounds.top - item.top;
    else if (item.bottom > bounds.bottom) list.scrollTop += item.bottom - bounds.bottom;
  }, [open, active]);

  function show() {
    setActive(selected);
    search.current = { text: "", time: 0 };
    setOpen(true);
  }
  function choose(id: string) {
    onChange(id);
    setOpen(false);
    trigger.current?.focus();
  }
  function move(step: number) {
    const index = configs.findIndex(config => config.id === active);
    setActive(configs[Math.max(0, Math.min(configs.length - 1, index + step))].id);
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        if (!open) show();
        else move(event.key === "ArrowDown" ? 1 : -1);
        return;
      case "Home":
      case "End":
        event.preventDefault();
        if (!open) setOpen(true);
        setActive(configs[event.key === "Home" ? 0 : configs.length - 1].id);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(active);
        else show();
        return;
      case "Escape":
        if (open) { event.preventDefault(); setOpen(false); }
        return;
      case "Tab":
        setOpen(false);
        return;
    }
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    const now = Date.now();
    const prefix = (now - search.current.time > 700 ? "" : search.current.text) + event.key.toLowerCase();
    search.current = { text: prefix, time: now };
    const match = configs.find(config => config.name.toLowerCase().startsWith(prefix));
    if (match) { setActive(match.id); setOpen(true); }
  }

  return <div className="q-select-wrap" ref={root}>
    <button type="button" id="q-problem" ref={trigger} className="q-problem-trigger" role="combobox" aria-label="Select a business problem" aria-haspopup="listbox" aria-controls="q-problem-options" aria-expanded={open} aria-activedescendant={open ? optionId(active) : undefined} data-value={selected} data-status={statuses[selected]} onClick={() => open ? setOpen(false) : show()} onKeyDown={keyboard} onBlur={event => { if (event.relatedTarget && !root.current?.contains(event.relatedTarget as Node)) setOpen(false); }}>
      {current.name}
    </button>
    <svg className="q-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
    <div id="q-problem-options" className="q-problem-menu" role="listbox" aria-label="Select a business problem" ref={menu} hidden={!open}>
      {categories.map(category => <div role="group" aria-label={category} key={category}>
        <div className="q-problem-group" aria-hidden="true">{category}</div>
        {configs.filter(config => config.category === category).map(config => <div key={config.id} id={optionId(config.id)} role="option" aria-selected={config.id === selected} data-value={config.id} data-status={statuses[config.id]} data-active={config.id === active} className="q-problem-option" onMouseDown={event => event.preventDefault()} onClick={() => choose(config.id)}>{config.name}</div>)}
      </div>)}
    </div>
  </div>;
}
