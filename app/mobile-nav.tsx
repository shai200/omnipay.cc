"use client";

import { useEffect, useId, useState } from "react";

const links = [
  { href: "#practice", label: "Practice" },
  { href: "#land", label: "Land" },
  { href: "#harvest", label: "Harvest" },
  { href: "#seasons", label: "Seasons" },
  { href: "#csa", label: "CSA" },
  { href: "#stewards", label: "Stewards" },
  { href: "#field-days", label: "Field days" },
  { href: "#table", label: "Table" },
  { href: "#haul", label: "Haul" },
  { href: "#pasture", label: "Pasture" },
  { href: "#orchard", label: "Orchard" },
  { href: "#visit", label: "Visit" },
] as const;

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--line)] text-[var(--foreground)]"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? "Close" : "Menu"}</span>
        <span aria-hidden className="flex flex-col gap-1.5">
          <span
            className={`block h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </span>
      </button>

      {open ? (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full border-b border-[var(--line)] bg-[#0f1f16]/95 backdrop-blur-md"
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-2 text-base text-[var(--muted)] transition hover:text-[var(--foreground)]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#visit"
              className="mt-2 rounded-sm bg-[var(--accent)] px-4 py-2.5 text-center text-sm font-semibold text-[#1a2418]"
              onClick={() => setOpen(false)}
            >
              Plan a visit
            </a>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
