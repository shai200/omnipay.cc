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
  { href: "#compost", label: "Compost" },
  { href: "#apiary", label: "Apiary" },
  { href: "#tunnels", label: "Tunnels" },
  { href: "#mill", label: "Mill" },
  { href: "#creek", label: "Creek" },
  { href: "#barn", label: "Barn" },
  { href: "#cellar", label: "Cellar" },
  { href: "#workshop", label: "Workshop" },
  { href: "#greenhouse", label: "Greenhouse" },
  { href: "#woodlot", label: "Woodlot" },
  { href: "#dairy", label: "Dairy" },
  { href: "#smokehouse", label: "Smokehouse" },
  { href: "#sugarhouse", label: "Sugarhouse" },
  { href: "#pack-shed", label: "Pack shed" },
  { href: "#machine-shed", label: "Machine shed" },
  { href: "#henhouse", label: "Henhouse" },
  { href: "#sheepfold", label: "Sheepfold" },
  { href: "#goat-yard", label: "Goat yard" },
  { href: "#pig-paddock", label: "Pig paddock" },
  { href: "#duck-pond", label: "Duck pond" },
  { href: "#turkey-run", label: "Turkey run" },
  { href: "#rabbit-warren", label: "Rabbit warren" },
  { href: "#goose-yard", label: "Goose yard" },
  { href: "#horse-paddock", label: "Horse paddock" },
  { href: "#cattle-yard", label: "Cattle yard" },
  { href: "#berry-patch", label: "Berry patch" },
  { href: "#vineyard", label: "Vineyard" },
  { href: "#hop-yard", label: "Hop yard" },
  { href: "#lavender-field", label: "Lavender field" },
  { href: "#sunflower-field", label: "Sunflower field" },
  { href: "#pumpkin-patch", label: "Pumpkin patch" },
  { href: "#cornfield", label: "Cornfield" },
  { href: "#wheat-field", label: "Wheat field" },
  { href: "#rye-field", label: "Rye field" },
  { href: "#oat-field", label: "Oat field" },
  { href: "#barley-field", label: "Barley field" },
  { href: "#spelt-field", label: "Spelt field" },
  { href: "#buckwheat-field", label: "Buckwheat field" },
  { href: "#millet-field", label: "Millet field" },
  { href: "#quinoa-field", label: "Quinoa field" },
  { href: "#sorghum-field", label: "Sorghum field" },
  { href: "#amaranth-field", label: "Amaranth field" },
  { href: "#teff-field", label: "Teff field" },
  { href: "#flax-field", label: "Flax field" },
  { href: "#hemp-field", label: "Hemp field" },
  { href: "#sesame-field", label: "Sesame field" },
  { href: "#mustard-field", label: "Mustard field" },
  { href: "#safflower-field", label: "Safflower field" },
  { href: "#camelina-field", label: "Camelina field" },
  { href: "#canola-field", label: "Canola field" },
  { href: "#soybean-field", label: "Soybean field" },
  { href: "#peanut-field", label: "Peanut field" },
  { href: "#chickpea-field", label: "Chickpea field" },
  { href: "#lentil-field", label: "Lentil field" },
  { href: "#fava-field", label: "Fava field" },
  { href: "#lupin-field", label: "Lupin field" },
  { href: "#mung-field", label: "Mung field" },
  { href: "#adzuki-field", label: "Adzuki field" },
  { href: "#black-bean-field", label: "Black bean field" },
  { href: "#kidney-bean-field", label: "Kidney bean field" },
  { href: "#navy-bean-field", label: "Navy bean field" },
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
