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

const csaShares = [
  {
    name: "Half share",
    detail: "Feeds 1–2. Greens, eggs, and a weekly staple from the stand.",
  },
  {
    name: "Full share",
    detail: "Feeds 3–4. Adds wheat flour weeks and late-season fruit.",
  },
  {
    name: "Pasture add-on",
    detail: "Eggs every week of the season — hens follow the cattle rotation.",
  },
] as const;

const stewards = [
  {
    name: "Mara Ellison",
    role: "Soil & crops",
    detail:
      "Plans rotations, cover crops, and the wheat calendar. Grew up two counties over.",
  },
  {
    name: "Jonah Reed",
    role: "Pasture & flock",
    detail:
      "Moves cattle and hens on the same clock — rest paddocks, gold yolks, quiet fences.",
  },
  {
    name: "Leah Cho",
    role: "Stand & CSA",
    detail:
      "Runs weekend hours, packs shares, and answers the harvest list before dawn.",
  },
] as const;

const fieldDays = [
  {
    name: "Soil walk",
    when: "First Saturday, April",
    detail:
      "Dig a spadeful with Mara — cover crops, worms, and why we rest paddocks.",
  },
  {
    name: "Pasture morning",
    when: "Midsummer Saturday",
    detail:
      "Follow Jonah’s rotation: move the flock, read the grass, leave the fence quiet.",
  },
  {
    name: "Harvest kitchen",
    when: "Autumn Sunday",
    detail:
      "Leah packs a CSA demo box and cooks what the week actually gave.",
  },
] as const;

const farmTable = [
  {
    name: "Prairie loaf",
    from: "Stone-milled wheat",
    detail:
      "A single rise overnight. Nutty crumb, thick crust — the flour from our mill.",
  },
  {
    name: "Dawn greens",
    from: "Market greens",
    detail:
      "Warm pan, garlic scape, and a soft pasture egg over the day’s pick.",
  },
  {
    name: "Windbreak tart",
    from: "Late apples",
    detail:
      "Heirloom slices, a little honey, and pastry thin enough to taste the orchard.",
  },
] as const;

const weekHaul = [
  {
    name: "Butter lettuce",
    status: "At the stand",
    detail: "Dawn-cut heads — cool, sweet, and gone by noon most Saturdays.",
  },
  {
    name: "Pasture dozen",
    status: "Limited",
    detail: "Eggs from hens on the cattle rotation — yolks deep as harvest light.",
  },
  {
    name: "Stone-milled flour",
    status: "Bags ready",
    detail: "Prairie wheat ground Friday. Bread flour and a coarser pastry cut.",
  },
] as const;

const pastureLife = [
  {
    name: "Cattle rotation",
    rhythm: "Move every few days",
    detail:
      "Small groups graze hard, then leave. Grass recovers; roots deepen; manure lands where it helps.",
  },
  {
    name: "Mobile coop",
    rhythm: "Follows the herd",
    detail:
      "Hens scratch behind the cattle — bugs, seed, and clean paddocks. Yolks track the pasture clock.",
  },
  {
    name: "Rest paddocks",
    rhythm: "Weeks of quiet",
    detail:
      "Empty fields are working fields. Pollinators, birds, and soil biology get their turn undisturbed.",
  },
] as const;

const orchardRows = [
  {
    name: "Heirloom rows",
    season: "Bloom to first frost",
    detail:
      "Old varieties along the windbreak — skins that bruise, flavor that lasts, and cider worth waiting for.",
  },
  {
    name: "Windbreak shelter",
    season: "Year-round work",
    detail:
      "Trees break the prairie gale so greens and pasture keep their water. Birds nest; snow drifts where we want it.",
  },
  {
    name: "Press weeks",
    season: "Late autumn",
    detail:
      "Fallen fruit becomes juice and a small run of hard cider. Neighbors bring jugs; we keep the pulp for compost.",
  },
] as const;

const compostYard = [
  {
    name: "Hot piles",
    rhythm: "Turned weekly",
    detail:
      "Kitchen scraps, orchard pulp, and bedding heat fast. Steam in winter means microbes are still on the clock.",
  },
  {
    name: "Leaf mold",
    rhythm: "Two winters",
    detail:
      "Windbreak leaves rest in quiet bays until they crumble — soft mulch for greens and the orchard drip line.",
  },
  {
    name: "Return to rows",
    rhythm: "Spring dressing",
    detail:
      "Finished compost goes under cover crops and market beds — living soil, not a bag from town.",
  },
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
            <a href="#csa" className="transition hover:text-[var(--foreground)]">
              CSA
            </a>
            <a href="#stewards" className="transition hover:text-[var(--foreground)]">
              Stewards
            </a>
            <a href="#field-days" className="transition hover:text-[var(--foreground)]">
              Field days
            </a>
            <a href="#table" className="transition hover:text-[var(--foreground)]">
              Table
            </a>
            <a href="#haul" className="transition hover:text-[var(--foreground)]">
              Haul
            </a>
            <a href="#pasture" className="transition hover:text-[var(--foreground)]">
              Pasture
            </a>
            <a href="#orchard" className="transition hover:text-[var(--foreground)]">
              Orchard
            </a>
            <a href="#compost" className="transition hover:text-[var(--foreground)]">
              Compost
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

        {/* CSA — one job: how community shares work */}
        <section
          id="csa"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -left-16 bottom-0 h-80 w-80 rounded-full bg-[var(--leaf)]/18 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Community shares
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A season of food, not a shopping cart.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              CSA members reserve a share before planting. You get what the land
              gives that week — pickup at the stand or weekday by appointment.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {csaShares.map((share, i) => (
                <li
                  key={share.name}
                  className="border-t border-[var(--line)] pt-6"
                >
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
                    {share.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {share.detail}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-12 max-w-xl text-sm text-[var(--muted)] md:text-base">
              Season runs spring greens through first frost. Openings fill before
              the ground thaws — join the harvest list and we write when a share
              frees up.
            </p>
            <a
              href="mailto:hello@northfield.farm?subject=Northfield%20CSA%20inquiry"
              className="mt-6 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about a share
            </a>
          </div>
        </section>

        {/* Stewards — one job: who works the land */}
        <section id="stewards" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_380px_at_15%_30%,rgba(198,164,90,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Who farms here
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              Three stewards. One shared clock with the land.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              No absentee owners. The people who plant, graze, and pack the stand
              are the same ones you meet on Saturday morning.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {stewards.map((person, i) => (
                <li
                  key={person.name}
                  className="border-t border-[var(--line)] pt-6"
                >
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")} · {person.role}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
                    {person.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {person.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Field days — one job: community learning on the land */}
        <section
          id="field-days"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-20 top-16 h-72 w-72 rounded-full bg-[var(--sky)]/14 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Learn on the land
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              Field days for neighbors who want to farm with us, not just buy from us.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Small groups, muddy boots, no slides. We open the gates a few times
              a year so the season teaches itself.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {fieldDays.map((day, i) => (
                <li
                  key={day.name}
                  className="border-t border-[var(--line)] pt-6"
                >
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")} · {day.when}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
                    {day.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {day.detail}
                  </p>
                </li>
              ))}
            </ul>
            <a
              href="mailto:hello@northfield.farm?subject=Northfield%20field%20day"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the next field day
            </a>
          </div>
        </section>

        {/* Farm table — one job: cook what the land gave */}
        <section id="table" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_360px_at_80%_10%,rgba(198,164,90,0.14),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              From the farm table
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              Recipes that start in the rows, not the store aisle.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Three plates we cook when the stand is full — wheat, greens, and
              late apples, nothing out of season.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {farmTable.map((dish, i) => (
                <li
                  key={dish.name}
                  className="border-t border-[var(--line)] pt-6"
                >
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")} · {dish.from}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
                    {dish.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {dish.detail}
                  </p>
                </li>
              ))}
            </ul>
            <a
              href="mailto:hello@northfield.farm?subject=Northfield%20farm%20table%20recipes"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask for this week&apos;s recipes
            </a>
          </div>
        </section>

        {/* This week's haul — one job: what is at the stand now */}
        <section
          id="haul"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/12 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              This week&apos;s haul
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              What left the rows for the stand board.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Updated before Saturday open. Quantities shift with weather —
              come early for greens; flour lasts the weekend.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {weekHaul.map((item, i) => (
                <li
                  key={item.name}
                  className="border-t border-[var(--line)] pt-6"
                >
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")} · {item.status}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
            <a
              href="mailto:hello@northfield.farm?subject=Northfield%20this%20week%20haul"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask what is left this week
            </a>
          </div>
        </section>

        {/* Pasture — one job: how herd and flock keep the land working */}
        <section id="pasture" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_380px_at_20%_40%,rgba(63,122,82,0.2),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Herd and flock
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              Animals on a clock with the grass — not a feedlot calendar.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Cattle and hens move together so every paddock gets graze, scratch,
              and rest. The pasture is a crop we harvest with hooves and beaks.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {pastureLife.map((item, i) => (
                <li
                  key={item.name}
                  className="border-t border-[var(--line)] pt-6"
                >
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")} · {item.rhythm}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
            <a
              href="mailto:hello@northfield.farm?subject=Northfield%20pasture%20visit"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask to walk the pasture
            </a>
          </div>
        </section>

        {/* Orchard — one job: windbreak fruit and press weeks */}
        <section
          id="orchard"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[var(--accent)]/14 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Along the windbreak
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              An orchard that shelters the farm and sweetens autumn.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Heirloom trees hold the prairie edge — fruit for the stand, shade
              for the rows, and a few press weeks when neighbors share the
              harvest.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {orchardRows.map((item, i) => (
                <li
                  key={item.name}
                  className="border-t border-[var(--line)] pt-6"
                >
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")} · {item.season}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
            <a
              href="mailto:hello@northfield.farm?subject=Northfield%20orchard%20press"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about press weeks
            </a>
          </div>
        </section>

        {/* Compost — one job: how scraps become living soil */}
        <section id="compost" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_380px_at_75%_30%,rgba(198,164,90,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Back to the soil
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A compost yard that never leaves the farm empty-handed.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              What the stand, kitchen, and orchard leave behind becomes next
              season&apos;s fertility — turned, rested, and returned to the rows.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {compostYard.map((item, i) => (
                <li
                  key={item.name}
                  className="border-t border-[var(--line)] pt-6"
                >
                  <p className="font-[family-name:var(--font-fraunces)] text-sm font-semibold text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")} · {item.rhythm}
                  </p>
                  <h3 className="mt-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                    {item.detail}
                  </p>
                </li>
              ))}
            </ul>
            <a
              href="mailto:hello@northfield.farm?subject=Northfield%20compost%20yard"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask to see the compost yard
            </a>
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
