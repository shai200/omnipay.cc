import MobileNav from "./mobile-nav";

const practices = [
  {
    title: "Living soil",
    body: "Cover crops, compost, and minimal till keep microbes working so every season starts richer than the last.",
  },
  {
    title: "Seasonal harvest",
    body: "We plant with the weather, not against it — wheat, vegetables, and pasture timed to rain and light.",
  },
  {
    title: "Open fields",
    body: "No factory floors. Walk the rows, see the herd, and know exactly where dinner came from.",
  },
] as const;

const crops = [
  {
    name: "Prairie wheat",
    note: "Stone-milled for bread with a deep, nutty crumb.",
  },
  {
    name: "Market greens",
    note: "Picked at dawn — lettuce, kale, and herbs that still taste like the field.",
  },
  {
    name: "Pasture eggs",
    note: "Hens follow the cattle rotation; yolks as gold as harvest light.",
  },
  {
    name: "Late apples",
    note: "Heirloom trees along the windbreak, crisp through first frost.",
  },
] as const;

const seasons = [
  {
    name: "Spring",
    work: "Soil rest ends. Cover crops turn in; greens and early potatoes go to ground.",
  },
  {
    name: "Summer",
    work: "Long days, irrigation by hand where needed, and the first CSA boxes leave the stand.",
  },
  {
    name: "Autumn",
    work: "Wheat and late apples. Pasture rotation slows; the farm stand runs on weekend harvest.",
  },
  {
    name: "Winter",
    work: "Tools mend, seed orders, and compost heaps work quietly under frost.",
  },
] as const;

const visitSteps = [
  { label: "Arrive", detail: "Gravel lane off County Road 12" },
  { label: "Walk", detail: "Self-guided paths through the rows" },
  { label: "Take home", detail: "Farm stand open Sat–Sun" },
] as const;

const visitHours = [
  { day: "Saturday", hours: "9am – 2pm" },
  { day: "Sunday", hours: "9am – 2pm" },
  { day: "Weekdays", hours: "By appointment for CSA pickup" },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--soil)] text-[var(--foreground)]">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-8">
          <a
            href="#top"
            className="font-[family-name:var(--font-fraunces)] text-xl font-semibold tracking-tight md:text-2xl"
          >
            Northfield
          </a>
          <nav className="hidden items-center gap-8 text-sm text-[var(--muted)] md:flex">
            <a href="#practice" className="transition hover:text-[var(--foreground)]">
              Practice
            </a>
            <a href="#land" className="transition hover:text-[var(--foreground)]">
              Land
            </a>
            <a href="#harvest" className="transition hover:text-[var(--foreground)]">
              Harvest
            </a>
            <a href="#seasons" className="transition hover:text-[var(--foreground)]">
              Seasons
            </a>
            <a href="#visit" className="transition hover:text-[var(--foreground)]">
              Visit
            </a>
          </nav>
          <a
            href="#visit"
            className="hidden rounded-sm bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#1a2418] transition hover:bg-[var(--accent-deep)] hover:text-[var(--foreground)] md:inline-block"
          >
            Plan a visit
          </a>
          <MobileNav />
        </div>
      </header>

      <main id="top">
        {/* Hero — one composition, brand-first, full-bleed field */}
        <section className="relative flex min-h-[100svh] items-end overflow-hidden">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2400&q=80"
              alt="Golden farmland stretching to the horizon at dawn"
              className="hero-pan h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f16] via-[#0f1f16]/55 to-[#0f1f16]/25" />
            <div className="harvest-glow absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--accent)]/25 to-transparent" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-32 md:px-8 md:pb-24">
            <p className="animate-rise font-[family-name:var(--font-fraunces)] text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-7xl lg:text-8xl">
              Northfield
            </p>
            <h1 className="animate-rise-delay mt-4 max-w-2xl font-[family-name:var(--font-fraunces)] text-2xl font-medium leading-snug text-[var(--foreground)] md:text-4xl">
              Farming that feeds the soil first.
            </h1>
            <p className="animate-rise-late mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Regenerative fields on the prairie edge — wheat, greens, pasture,
              and a stand open when the season says so.
            </p>
            <div className="animate-rise-late mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#visit"
                className="rounded-sm bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[#1a2418] transition hover:bg-[var(--accent-deep)] hover:text-[var(--foreground)]"
              >
                Visit the farm
              </a>
              <a
                href="#harvest"
                className="rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                See this season
              </a>
            </div>
          </div>
        </section>

        {/* Practice */}
        <section id="practice" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_0%,rgba(63,122,82,0.22),transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              How we farm
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              One practice: leave the land better than we found it.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Northfield is a working farm, not a showpiece. Every decision —
              what to plant, when to rest a paddock — starts with soil health.
            </p>
            <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {practices.map((item, i) => (
                <div
                  key={item.title}
                  className="crop-sway border-t border-[var(--line)] pt-6"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Land — one job: place story with real visual anchor */}
        <section id="land" className="relative border-t border-[var(--line)]">
          <div className="relative min-h-[70svh] overflow-hidden md:min-h-[80svh]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2400&q=80"
              alt="Green crop rows under open prairie sky"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f16]/90 via-[#0f1f16]/55 to-[#0f1f16]/20" />
            <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-6xl items-end px-6 py-16 md:min-h-[80svh] md:px-8 md:py-24">
              <div className="max-w-xl">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                  The land
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
                  Eighty acres between creek and windbreak.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
                  Contoured rows follow the slope. Pasture rests between
                  grazings. A thin strip of prairie remains wild so birds and
                  pollinators keep their share of the year.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Harvest */}
        <section
          id="harvest"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[var(--leaf)]/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              This season
            </p>
            <h2 className="mt-3 max-w-xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              What comes off the land.
            </h2>
            <p className="mt-4 max-w-xl text-[var(--muted)] md:text-lg">
              Four staples you will find at the stand and in CSA boxes —
              nothing shipped in, nothing forced out of season.
            </p>
            <ul className="mt-14 grid gap-8 sm:grid-cols-2">
              {crops.map((crop) => (
                <li key={crop.name} className="flex gap-4">
                  <span
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]"
                    aria-hidden
                  />
                  <div>
                    <h3 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold">
                      {crop.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                      {crop.note}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Seasons */}
        <section id="seasons" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_360px_at_90%_20%,rgba(143,180,201,0.16),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Year on the land
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              Farming follows the year, not a warehouse clock.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Four turns of work — plant, tend, gather, rest — so the soil and
              the people who work it stay strong.
            </p>
            <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {seasons.map((season, i) => (
                <li
                  key={season.name}
                  className="border-t border-[var(--line)] pt-6"
                >
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
                    {season.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {season.work}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="relative border-t border-[var(--line)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-end md:gap-16 md:px-8 md:py-28">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
                Come by
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
                Walk the rows. Leave with dinner.
              </h2>
              <p className="mt-4 text-[var(--muted)] md:text-lg">
                Saturdays and Sundays, 9am–2pm while crops are in. No tickets —
                just boots and curiosity.
              </p>
              <ol className="mt-10 space-y-6">
                {visitSteps.map((step, i) => (
                  <li key={step.label} className="flex gap-4">
                    <span className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[var(--accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-semibold">{step.label}</p>
                      <p className="text-sm text-[var(--muted)]">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-10 border-t border-[var(--line)] pt-8">
                <p className="font-[family-name:var(--font-fraunces)] text-lg font-semibold">
                  Stand hours
                </p>
                <ul className="mt-4 space-y-3">
                  {visitHours.map((row) => (
                    <li
                      key={row.day}
                      className="flex flex-wrap items-baseline justify-between gap-2 text-sm md:text-base"
                    >
                      <span className="font-medium">{row.day}</span>
                      <span className="text-[var(--muted)]">{row.hours}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden rounded-sm md:min-h-[420px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80"
                alt="Fresh vegetables harvested from open fields"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0f1f16]/50 to-transparent" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[var(--line)] bg-gradient-to-br from-[#1a3324] via-[#14251b] to-[#0f1f16]">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center md:px-8 md:py-24">
            <h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              Ready for the next harvest?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--muted)] md:text-lg">
              Join the Northfield list for CSA openings, stand hours, and when
              the wheat comes in.
            </p>
            <a
              href="mailto:hello@northfield.farm?subject=Northfield%20harvest%20list"
              className="mt-8 inline-block rounded-sm bg-[var(--accent)] px-8 py-3.5 text-sm font-semibold text-[#1a2418] transition hover:bg-[var(--accent-deep)] hover:text-[var(--foreground)]"
            >
              Join the harvest list
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-[family-name:var(--font-fraunces)] text-base text-[var(--foreground)]">
            Northfield
          </p>
          <p>Regenerative farming · prairie edge · open weekends in season</p>
          <p>© {new Date().getFullYear()} Northfield Farms</p>
        </div>
      </footer>
    </div>
  );
}
