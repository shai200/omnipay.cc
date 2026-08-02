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

const apiaryWork = [
  {
    name: "Hedge hives",
    rhythm: "Lee of the windbreak",
    detail:
      "A small yard at the orchard edge — bees work bloom in the rows, then rest out of the prairie gale.",
  },
  {
    name: "Bloom calendar",
    rhythm: "Spring through frost",
    detail:
      "Cover crops, orchard blossom, and pasture clover keep forage close. We plant for bees as carefully as for dinner.",
  },
  {
    name: "Farm honey",
    rhythm: "Late summer jars",
    detail:
      "A light extract for the stand — floral, prairie-clear, and never enough for the whole waiting list.",
  },
] as const;

const highTunnel = [
  {
    name: "Hoop houses",
    rhythm: "Shoulder seasons",
    detail:
      "Two tunnels buffer wind and frost so greens start early and finish late — no heated glass, just plastic and timing.",
  },
  {
    name: "Winter salad",
    rhythm: "December through March",
    detail:
      "Spinach, mâche, and hardy lettuce under cover while the open field rests. Saturday bags still leave the stand.",
  },
  {
    name: "Seed starts",
    rhythm: "Late winter trays",
    detail:
      "Tomatoes, peppers, and brassicas germinate here before the prairie warms. Strong roots, short transplant shock.",
  },
] as const;

const millWork = [
  {
    name: "Stone mill",
    rhythm: "Slow grind, whole berry",
    detail:
      "Prairie wheat cracked on granite — bran stays in, heat stays low, and the flour still smells like the field.",
  },
  {
    name: "Friday grind",
    rhythm: "Bags for the weekend",
    detail:
      "We mill the week’s wheat on Friday so Saturday flour is fresh. Bread cut and a coarser pastry cut leave the stand together.",
  },
  {
    name: "Loaf weeks",
    rhythm: "When the wheat comes in",
    detail:
      "CSA full shares get flour weeks; neighbors bring starters. The mill is why prairie loaf tastes like Northfield, not a bin blend.",
  },
] as const;

const creekWork = [
  {
    name: "Spring rise",
    rhythm: "Snowmelt to May",
    detail:
      "The creek swells and softens the lower pasture. We fence the bank, let willows hold the edge, and wait out the mud before cattle return.",
  },
  {
    name: "Hand irrigation",
    rhythm: "Dry summer weeks",
    detail:
      "A small lift to the high tunnels and market beds — not a flood, just enough so greens don’t bolt early and transplants root before heat.",
  },
  {
    name: "Bank forage",
    rhythm: "Year-round edge",
    detail:
      "Wild mint, willow shade, and bird cover along the water. Pollinators use the corridor between orchard and pasture when the prairie is loud with wind.",
  },
] as const;

const barnWork = [
  {
    name: "Hay loft",
    rhythm: "Cut twice, stack once",
    detail:
      "First-cut alfalfa and second-cut grass dry on the upper floor. Winter feed stays under timber, not in a plastic wrap that blows across the county.",
  },
  {
    name: "Tool bay",
    rhythm: "Mend before plant",
    detail:
      "Sharpen, oil, and hang. The same bay holds seed crates in January and CSA totes in July — a working room, not a showroom.",
  },
  {
    name: "Quiet stalls",
    rhythm: "Calving and storm nights",
    detail:
      "A few stalls for soft landings when pasture weather turns. Cattle still live on grass; the barn is the pause, not the factory floor.",
  },
] as const;

const cellarWork = [
  {
    name: "Cold room",
    rhythm: "Earth-cooled, dark",
    detail:
      "Roots, late apples, and cabbages rest below the frost line. No walk-in freezer hum — just stone, air, and patience until the stand needs them.",
  },
  {
    name: "Winter jars",
    rhythm: "Put up after harvest",
    detail:
      "Tomato sauce, pickled greens, and orchard butter line the shelves. Leah packs a few for full shares when the open field is quiet under snow.",
  },
  {
    name: "Seed crates",
    rhythm: "Labeled for spring",
    detail:
      "Saved wheat, bean, and brassica seed dry cool and dry. The cellar is next year’s field, stacked in crates before the prairie thaws.",
  },
] as const;

const workshopWork = [
  {
    name: "Weld bay",
    rhythm: "Mend before mud",
    detail:
      "Gates, hitch pins, and mobile-coop frames get rebuilt here — steel that stays on the farm instead of a dealer invoice every March.",
  },
  {
    name: "Winter rebuild",
    rhythm: "Frost to seed order",
    detail:
      "When the field rests, the shop works: bearings, belts, and a careful eye on the small tractor so spring doesn’t start with a tow.",
  },
  {
    name: "Parts shelf",
    rhythm: "Labeled, borrowed, returned",
    detail:
      "Bolts, fence clips, and spare drip fittings live in one bay. Neighbors borrow; we keep a chalk ledger so nothing vanishes before planting week.",
  },
] as const;

const greenhouseWork = [
  {
    name: "Seed trays",
    rhythm: "Late winter sow",
    detail:
      "Tomato, pepper, and brassica starts under glass while the prairie is still frozen. Heat mats and a chalk calendar — not a factory grow rack.",
  },
  {
    name: "Hardening benches",
    rhythm: "Week before transplant",
    detail:
      "Trays move outdoors by day, back under glass by night. Seedlings learn wind and chill so the high tunnels don’t shock them in April.",
  },
  {
    name: "Early greens",
    rhythm: "Before the stand opens",
    detail:
      "A first cut of lettuce and herbs for CSA pickup weeks. The greenhouse bridges cellar jars and open-field harvest without a grocery truck.",
  },
] as const;

const woodlotWork = [
  {
    name: "Shade edge",
    rhythm: "Windbreak and rest",
    detail:
      "Oak and ash along the west fence cut the prairie gale before it hits the tunnels. Cattle loaf in the cool strip after noon rotation.",
  },
  {
    name: "Cord wood",
    rhythm: "Late autumn cut",
    detail:
      "Fallen limbs and thinning cuts stack for the workshop stove and spring maple sugar weekend — heat from the land, not a propane truck.",
  },
  {
    name: "Forest forage",
    rhythm: "After rain, before frost",
    detail:
      "Morels in soft springs, wild greens along the ditch, and a quiet path for field-day walks that never leave the fence line.",
  },
] as const;

const dairyWork = [
  {
    name: "Morning milk",
    rhythm: "Dawn in the parlor",
    detail:
      "A small Jersey herd on rotational grass — milk cooled the same hour it leaves the parlor, never trucked across three counties first.",
  },
  {
    name: "Cream room",
    rhythm: "After the first skim",
    detail:
      "Cream rises overnight in shallow pans. Butter churn and cultured cream for CSA weeks — fat from pasture, not a carton aisle.",
  },
  {
    name: "Aged wheels",
    rhythm: "Cellar weeks",
    detail:
      "Cloth-bound cheddar and soft bloomy rounds rest beside the root jars. Field-day tastings start here, not at a grocery counter.",
  },
] as const;

const smokehouseWork = [
  {
    name: "Low smoke",
    rhythm: "Apple and oak",
    detail:
      "A small shed east of the barn — wood from the lot, not pellets from a truck. Heat stays gentle so fat renders clean and bark stays edible.",
  },
  {
    name: "Cure racks",
    rhythm: "Salt, time, cool air",
    detail:
      "Bacon, lardo, and a short run of country ham hang beside the cream room’s chill. Neighbors bring jars; we keep a chalk ledger for the waiting list.",
  },
  {
    name: "Stand jars",
    rhythm: "Saturday morning",
    detail:
      "Smoked paprika salt, rendered fat, and sliced ends for the farm table. Nothing leaves without a date and a name on the lid.",
  },
] as const;

const sugarhouseWork = [
  {
    name: "Tap weeks",
    rhythm: "Late winter thaw",
    detail:
      "When nights freeze and days soften, we tap the maple edge of the woodlot. Lines run short — buckets, not a vacuum truck across three counties.",
  },
  {
    name: "Evaporator pan",
    rhythm: "Steam until dark",
    detail:
      "Cord wood from autumn thinning feeds the pan. Sap becomes syrup in one long afternoon — neighbors take turns stirring while the workshop stove waits its turn.",
  },
  {
    name: "March jars",
    rhythm: "Before the stand opens",
    detail:
      "A small run of amber jars for CSA pickup and the first Saturday board. Labeled by week; gone before the orchard blooms.",
  },
] as const;

const packShedWork = [
  {
    name: "Wash tables",
    rhythm: "Dawn haul in",
    detail:
      "Greens, roots, and orchard fruit hit cold water before the sun climbs. Crates stack by field row — not by grocery category — so Leah can pack shares that still taste like the land.",
  },
  {
    name: "Share lanes",
    rhythm: "Tuesday & Friday",
    detail:
      "Half and full boxes roll down two chalk lines. Pasture eggs nest beside prairie flour weeks; syrup jars from the sugarhouse ride the Friday lane in March.",
  },
  {
    name: "Stand board",
    rhythm: "Before the gate opens",
    detail:
      "What did not fit a share goes on the Saturday board — weighed, priced in pencil, and gone by noon. Nothing sits overnight under plastic lights.",
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
            <a href="#apiary" className="transition hover:text-[var(--foreground)]">
              Apiary
            </a>
            <a href="#tunnels" className="transition hover:text-[var(--foreground)]">
              Tunnels
            </a>
            <a href="#mill" className="transition hover:text-[var(--foreground)]">
              Mill
            </a>
            <a href="#creek" className="transition hover:text-[var(--foreground)]">
              Creek
            </a>
            <a href="#barn" className="transition hover:text-[var(--foreground)]">
              Barn
            </a>
            <a href="#cellar" className="transition hover:text-[var(--foreground)]">
              Cellar
            </a>
            <a href="#workshop" className="transition hover:text-[var(--foreground)]">
              Workshop
            </a>
            <a href="#greenhouse" className="transition hover:text-[var(--foreground)]">
              Greenhouse
            </a>
            <a href="#woodlot" className="transition hover:text-[var(--foreground)]">
              Woodlot
            </a>
            <a href="#dairy" className="transition hover:text-[var(--foreground)]">
              Dairy
            </a>
            <a href="#smokehouse" className="transition hover:text-[var(--foreground)]">
              Smokehouse
            </a>
            <a href="#sugarhouse" className="transition hover:text-[var(--foreground)]">
              Sugarhouse
            </a>
            <a href="#pack-shed" className="transition hover:text-[var(--foreground)]">
              Pack shed
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

        {/* Apiary — one job: pollinators that feed the farm */}
        <section
          id="apiary"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-[var(--sky)]/12 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Wings over the rows
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              An apiary that keeps the orchard and clover working.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Bees stitch the farm together — fruit set in the windbreak, seed
              in the pasture, and a few late jars that taste like midsummer
              light.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {apiaryWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20apiary"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the apiary
            </a>
          </div>
        </section>

        {/* High tunnels — one job: shoulder-season cover */}
        <section id="tunnels" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_380px_at_25%_40%,rgba(63,122,82,0.18),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Under cover
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              High tunnels that stretch the harvest past the frost.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Unheated hoop houses keep soil workable when the prairie locks up —
              early greens out, winter salad in, and strong starts for the open
              field.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {highTunnel.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20high%20tunnels"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the high tunnels
            </a>
          </div>
        </section>

        {/* Mill — one job: grain to bag on the farm */}
        <section
          id="mill"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-16 top-12 h-80 w-80 rounded-full bg-[var(--accent)]/12 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              From grain to bag
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A mill that tastes like prairie wheat, not a warehouse blend.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Stone-milled on the farm — the same wheat in the rows becomes the
              flour in prairie loaf, CSA weeks, and Saturday bags at the stand.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {millWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20mill%20flour"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about mill flour
            </a>
          </div>
        </section>

        {/* Creek — one job: water that feeds the farm */}
        <section id="creek" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_380px_at_75%_30%,rgba(143,180,201,0.16),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Water on the edge
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A creek that keeps pasture soft and tunnels alive.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Eighty acres sit between creek and windbreak — spring rise, careful
              summer lifts, and a living bank that birds and bees still claim.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {creekWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20creek"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the creek
            </a>
          </div>
        </section>

        {/* Barn — one job: timber shelter for hay, tools, and soft landings */}
        <section
          id="barn"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -left-20 bottom-8 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Timber and tools
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A barn that holds the season, not a factory floor.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Hay loft, tool bay, and quiet stalls — the working heart between
              creek and windbreak when weather asks for timber overhead.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {barnWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20barn"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the barn
            </a>
          </div>
        </section>

        {/* Cellar — one job: hold harvest cool until winter needs it */}
        <section id="cellar" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_360px_at_20%_70%,rgba(198,164,90,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Below the frost
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A root cellar that keeps the harvest honest through winter.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Cold room, winter jars, and seed crates — the quiet hold between
              autumn press weeks and the first soil walk in April.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {cellarWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20cellar"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the cellar
            </a>
          </div>
        </section>

        {/* Workshop — one job: mend steel and machines so spring starts ready */}
        <section
          id="workshop"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--sky)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Steel and spare parts
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A workshop that keeps the farm running without a dealer trip.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Weld bay, winter rebuild, and a parts shelf with a chalk ledger —
              mend first, plant second, buy last.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {workshopWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20workshop"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the workshop
            </a>
          </div>
        </section>

        {/* Greenhouse — one job: start seedlings before the prairie thaws */}
        <section id="greenhouse" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_360px_at_80%_30%,rgba(95,168,118,0.14),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Glass and seed trays
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A greenhouse that starts the season before the prairie thaws.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Seed trays, hardening benches, and early greens — the quiet bridge
              from winter seed crates to the first open-field rows.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {greenhouseWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20greenhouse"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the greenhouse
            </a>
          </div>
        </section>

        {/* Woodlot — one job: shade, fuel, and forage at the prairie edge */}
        <section
          id="woodlot"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-[var(--leaf)]/15 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Timber and shade
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A woodlot that softens the wind and feeds the stove.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Shade edge, cord wood, and forest forage — the quiet strip where
              prairie meets timber and the farm still listens to the trees.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {woodlotWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20woodlot"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the woodlot
            </a>
          </div>
        </section>

        {/* Dairy — one job: milk, cream, and wheels from pasture grass */}
        <section id="dairy" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_360px_at_20%_40%,rgba(198,164,90,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Milk and cream
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A dairy that starts with grass and ends on your table.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Morning milk, cream room, and aged wheels — the quiet line from
              rotational pasture to butter, cheese, and Saturday stand bottles.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {dairyWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20dairy"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the dairy
            </a>
          </div>
        </section>

        {/* Smokehouse — one job: low smoke, cure racks, and Saturday jars */}
        <section id="smokehouse" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_360px_at_75%_35%,rgba(198,164,90,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Smoke and cure
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A smokehouse that works on wood from the lot.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Low smoke, cure racks, and stand jars — the quiet line from
              pasture and orchard wood to bacon, lardo, and Saturday fat for
              the farm table.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {smokehouseWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20smokehouse"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the smokehouse
            </a>
          </div>
        </section>

        {/* Sugarhouse — one job: maple from woodlot edge to March jars */}
        <section
          id="sugarhouse"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-16 top-12 h-80 w-80 rounded-full bg-[var(--accent)]/12 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Sap and steam
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A sugarhouse that turns woodlot maple into March jars.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Tap weeks, evaporator pan, and March jars — the short season when
              the woodlot pays in syrup before the prairie greens.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {sugarhouseWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20sugarhouse"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the sugarhouse
            </a>
          </div>
        </section>

        {/* Pack shed — one job: wash, lane shares, and the Saturday board */}
        <section id="pack-shed" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_360px_at_25%_40%,rgba(198,164,90,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Wash and weigh
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A pack shed that turns the dawn haul into shares.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Wash tables, share lanes, and the stand board — the short path from
              field crates to CSA boxes and Saturday produce that still carries
              dew.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {packShedWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20pack%20shed"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the pack shed
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
