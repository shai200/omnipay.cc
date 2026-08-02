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

const machineShedWork = [
  {
    name: "Tractor bay",
    rhythm: "Out before dawn",
    detail:
      "The small tractor and wagon live under timber, not wrapped in a dealer tarp. Grease points get a wipe before the pack-shed haul; mud stays on the apron, not in the shop.",
  },
  {
    name: "Cover season",
    rhythm: "Frost to seed order",
    detail:
      "When the field rests, machines rest dry — belts checked, hitch pins oiled, and the mobile coop frame staged for Jonah’s first pasture move.",
  },
  {
    name: "Parts crib",
    rhythm: "Labeled, farm-only",
    detail:
      "Filters, shear bolts, and spare drip fittings in one locked bay. Neighbors borrow through the workshop ledger; nothing leaves without chalk and a return date before planting week.",
  },
] as const;

const henhouseWork = [
  {
    name: "Nest boxes",
    rhythm: "Before the gate opens",
    detail:
      "Clean straw, one hen at a time, and yolks that still carry pasture light. Eggs leave for the pack shed before the Saturday board is chalked — never under grocery fluorescents.",
  },
  {
    name: "Roost loft",
    rhythm: "Dusk lock-in",
    detail:
      "Timber perches above the scratch floor; fox wire tight to the sill. Jonah counts heads when the cattle move, then latches the loft before the lane goes dark.",
  },
  {
    name: "Mobile coop",
    rhythm: "With the cattle clock",
    detail:
      "The wheeled house follows rest paddocks so hens work fresh grass and leave fertilizer where the next cover crop wants it. Machine-shed frame, pasture purpose.",
  },
] as const;

const sheepfoldWork = [
  {
    name: "Fold gate",
    rhythm: "After the cattle leave",
    detail:
      "A small flock works the paddock Jonah just rested — close grazing that cleans seed heads and leaves a tighter sward for the next cover. Gates stay quiet; dogs stay home.",
  },
  {
    name: "Lambing shed",
    rhythm: "Late winter nights",
    detail:
      "Timber stalls for soft landings when the prairie is still hard. Ewes go back to grass as soon as the weather allows — the shed is the pause, not a feedlot.",
  },
  {
    name: "Wool weeks",
    rhythm: "Spring shear, autumn felt",
    detail:
      "Fleece leaves for a local mill; a few blankets and yarn skeins return to the stand. No industrial clip — just what the flock grew on Northfield rain and rest paddocks.",
  },
] as const;

const goatYardWork = [
  {
    name: "Brush browse",
    rhythm: "After the sheep fold",
    detail:
      "Goats take the woody edges the flock leaves — willow shoots, thistle, and fence-line scrub — so the next cover crop faces clean ground, not a thicket.",
  },
  {
    name: "Kidding pen",
    rhythm: "Late winter soft landings",
    detail:
      "A dry timber pen beside the sheepfold when the prairie is still hard. Does return to browse as soon as weather allows — the pen is the pause, not a barn factory.",
  },
  {
    name: "Cheese days",
    rhythm: "Small-batch weekends",
    detail:
      "Fresh chèvre and a few aged wheels for the stand — milk from browse, not a feedlot ration. Leah chalks the board when the wheels are ready; the waiting list is short on purpose.",
  },
] as const;

const pigPaddockWork = [
  {
    name: "Root wallow",
    rhythm: "After the goat browse",
    detail:
      "A small drove works the soft ground the goats leave — acorn mast, windfall, and clover strips — so the next cover crop seeds into turned earth, not a hardpan crust.",
  },
  {
    name: "Farrow hut",
    rhythm: "Quiet spring nights",
    detail:
      "Low timber huts on deep bedding when the prairie is still cold. Sows return to the paddock as soon as weather allows — the hut is the pause, not a confinement barn.",
  },
  {
    name: "Smokehouse weeks",
    rhythm: "Autumn cure, winter board",
    detail:
      "Whole animals for the smokehouse lane — bacon, ham, and lard for the stand after the pack shed has done its quiet work. Leah chalks cuts when the cure is honest; no anonymous freezer truck.",
  },
] as const;

const duckPondWork = [
  {
    name: "Reed margin",
    rhythm: "After the pig paddock",
    detail:
      "A shallow pond edged in cattail and soft rush — ducks work snails and mosquito larvae so the creek below stays clearer, and the wet edge never hardens into bare mud.",
  },
  {
    name: "Nest raft",
    rhythm: "Quiet spring mornings",
    detail:
      "Floating timber rafts with deep straw when the prairie frost still bites. Hens brood on water, not a confinement pen — the raft is the pause, then birds return to the reed margin.",
  },
  {
    name: "Egg mornings",
    rhythm: "Twice a week to the stand",
    detail:
      "Rich yolks for the board after the pack shed has sorted cartons — Leah chalks duck eggs beside hen eggs when the count is honest. No anonymous warehouse carton; just what the pond grew.",
  },
] as const;

const turkeyRunWork = [
  {
    name: "Range lane",
    rhythm: "After the duck pond",
    detail:
      "A wide grass corridor between the reed margin and the windbreak — turkeys work ticks and grasshoppers so the next cattle pass finds cleaner pasture, not a bug bloom.",
  },
  {
    name: "Brush roost",
    rhythm: "Dusk lock-in",
    detail:
      "Low timber roosts under hawthorn and cedar when the prairie goes dark. Birds return to the lane at first light — the roost is the pause, not a confinement barn.",
  },
  {
    name: "Feast weeks",
    rhythm: "Late autumn board",
    detail:
      "Whole birds for the holiday table after the pack shed has done its quiet work — Leah chalks names when the count is honest. No anonymous freezer truck; just what the range grew on Northfield rain.",
  },
] as const;

const rabbitWarrenWork = [
  {
    name: "Clover lane",
    rhythm: "After the turkey run",
    detail:
      "A narrow strip of clover and chicory beside the range lane — rabbits graze the soft understory so the next cover crop faces clean ground, not a weed mat the cattle would ignore.",
  },
  {
    name: "Nest boxes",
    rhythm: "Quiet spring nights",
    detail:
      "Timber nest boxes under the hawthorn edge when frost still bites. Does kindle on deep straw, then return to the clover lane — the box is the pause, not a battery cage.",
  },
  {
    name: "Market fryers",
    rhythm: "Saturday board",
    detail:
      "A few fryers for the stand after the pack shed has done its quiet work — Leah chalks cuts when the count is honest. No anonymous freezer truck; just what the warren grew on Northfield clover.",
  },
] as const;

const gooseYardWork = [
  {
    name: "Wet meadow",
    rhythm: "After the rabbit warren",
    detail:
      "A shallow meadow between the clover lane and the creek — geese graze soft grass and weed seed so the next flood pulse finds cleaner banks, not a mat the ducks would choke on.",
  },
  {
    name: "Guard flock",
    rhythm: "Dawn and dusk watch",
    detail:
      "A small gaggle that announces fox and hawk before the henhouse wakes. They return to the wet meadow at first light — the yard is their beat, not a confinement pen.",
  },
  {
    name: "Feather weeks",
    rhythm: "Late summer board",
    detail:
      "A few birds and down for the stand after the pack shed has done its quiet work — Leah chalks names when the count is honest. No anonymous freezer truck; just what the yard grew on Northfield rain.",
  },
] as const;

const horsePaddockWork = [
  {
    name: "Draft lane",
    rhythm: "After the goose yard",
    detail:
      "A soft lane between the wet meadow and the machine shed — draft horses pull the light cultivator so spring beds open without a diesel cloud the CSA kids would taste all afternoon.",
  },
  {
    name: "Harness wall",
    rhythm: "Quiet barn evenings",
    detail:
      "Collars and traces hang by number on the north wall of the barn. Jonah checks fit before dawn work — the paddock is rest and water, not a parking lot for idle iron.",
  },
  {
    name: "Work weeks",
    rhythm: "Spring and autumn board",
    detail:
      "A few days of horse-drawn soil work when the ground is honest — Leah chalks which beds the team opened. No anonymous tractor hour; just what the paddock pulled on Northfield clay.",
  },
] as const;

const cattleYardWork = [
  {
    name: "Grazing strip",
    rhythm: "After the horse paddock",
    detail:
      "A narrow strip of mixed grass beside the draft lane — cattle finish the understory the horses leave soft, so the next pasture pulse finds clean sod, not a mat the sheepfold would ignore.",
  },
  {
    name: "Mineral trough",
    rhythm: "Quiet dawn checks",
    detail:
      "A low trough under the willow edge when frost still bites. Jonah fills salt and kelp before the strip opens — the yard is a pause for health, not a confinement lot.",
  },
  {
    name: "Finish weeks",
    rhythm: "Autumn board",
    detail:
      "A few beeves for the stand after the pack shed has done its quiet work — Leah chalks cuts when the count is honest. No anonymous freezer truck; just what the yard finished on Northfield grass.",
  },
] as const;

const berryPatchWork = [
  {
    name: "Cane rows",
    rhythm: "After the cattle yard",
    detail:
      "A low belt of raspberry and blackcurrant on the sunny side of the grazing strip — birds nest in the edges, and the canes drink the runoff the cattle leave soft without flooding the orchard windbreak.",
  },
  {
    name: "Pick mornings",
    rhythm: "Quiet dawn flats",
    detail:
      "Shallow flats under the willow shade when dew still holds. Leah weighs by the pint before the stand opens — the patch is a harvest lane, not a U-pick free-for-all that tramples next year’s crowns.",
  },
  {
    name: "Preserve weeks",
    rhythm: "High summer board",
    detail:
      "A few jars and freezer pints for the farm table after the pack shed has done its quiet work — Leah chalks batches when the count is honest. No anonymous freezer truck; just what the canes finished on Northfield sun.",
  },
] as const;

const vineyardWork = [
  {
    name: "Trellis rows",
    rhythm: "After the berry patch",
    detail:
      "A short belt of hybrid grapes on the warm south slope past the cane rows — leaves catch the same prairie light the berries finish on, and the vines drink deep without starving the orchard windbreak.",
  },
  {
    name: "Cluster mornings",
    rhythm: "Quiet dawn clips",
    detail:
      "Hand clips under the wire when dew still holds. Mara thins green clusters before the stand opens — the vineyard is a finish lane, not a tourist crush that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Press weeks",
    rhythm: "Early autumn board",
    detail:
      "A few small presses for the farm table after the pack shed has done its quiet work — Leah chalks batches when the sugar is honest. No anonymous tanker; just what the trellis finished on Northfield clay.",
  },
] as const;

const hopYardWork = [
  {
    name: "Bine rows",
    rhythm: "After the vineyard",
    detail:
      "A narrow belt of cascade and willamette on the lee side of the trellis — bines climb the same prairie light the grapes finish on, and the roots drink deep without starving the orchard windbreak.",
  },
  {
    name: "Cone mornings",
    rhythm: "Quiet dawn picks",
    detail:
      "Hand picks under the string when dew still holds. Jonah strips ripe cones before the stand opens — the hop yard is a finish lane, not a brewery tour that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Dry weeks",
    rhythm: "Late summer board",
    detail:
      "A few kiln trays for the farm table after the pack shed has done its quiet work — Leah chalks batches when the aroma is honest. No anonymous pellet mill; just what the bine finished on Northfield clay.",
  },
] as const;

const lavenderFieldWork = [
  {
    name: "Spike rows",
    rhythm: "After the hop yard",
    detail:
      "A soft belt of English lavender on the warm gravel edge past the bines — spikes catch the same prairie light the hops finish on, and the roots drink deep without starving the orchard windbreak.",
  },
  {
    name: "Bloom mornings",
    rhythm: "Quiet dawn cuts",
    detail:
      "Hand cuts under the bees when dew still holds. Mara shears full spikes before the stand opens — the lavender field is a finish lane, not a photo meadow that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Bundle weeks",
    rhythm: "High summer board",
    detail:
      "A few drying racks for the farm table after the pack shed has done its quiet work — Leah chalks bundles when the scent is honest. No anonymous oil still; just what the spike finished on Northfield clay.",
  },
] as const;

const sunflowerFieldWork = [
  {
    name: "Stalk rows",
    rhythm: "After the lavender field",
    detail:
      "A tall belt of prairie sunflowers on the warm gravel edge past the spikes — heads catch the same late light the lavender finishes on, and the stalks drink deep without shading the orchard windbreak into damp.",
  },
  {
    name: "Head mornings",
    rhythm: "Quiet dawn cuts",
    detail:
      "Hand cuts when the faces lean and dew still holds. Mara shears ripe heads before the stand opens — the sunflower field is a finish lane, not a selfie maze that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Press weeks",
    rhythm: "Late summer board",
    detail:
      "A few seed trays for the farm table after the pack shed has done its quiet work — Leah chalks presses when the oil is honest. No anonymous commodity bin; just what the stalk finished on Northfield clay.",
  },
] as const;

const pumpkinPatchWork = [
  {
    name: "Vine rows",
    rhythm: "After the sunflower field",
    detail:
      "A low belt of pie pumpkins on the warm gravel edge past the stalks — vines catch the same autumn light the sunflowers finish on, and the leaves shade the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Cure mornings",
    rhythm: "Quiet dawn cuts",
    detail:
      "Hand cuts when the rind hardens and dew still holds. Mara shears ripe fruit before the stand opens — the pumpkin patch is a finish lane, not a hayride maze that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Cellar weeks",
    rhythm: "Early autumn board",
    detail:
      "A few cure racks for the farm table after the pack shed has done its quiet work — Leah chalks crates when the flesh is honest. No anonymous wholesale bin; just what the vine finished on Northfield clay.",
  },
] as const;

const cornfieldWork = [
  {
    name: "Ear rows",
    rhythm: "After the pumpkin patch",
    detail:
      "A tall belt of sweet corn on the warm gravel edge past the vines — ears catch the same autumn light the pumpkins finish on, and the leaves shade the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Tassel mornings",
    rhythm: "Quiet dawn cuts",
    detail:
      "Hand picks when the silk browns and dew still holds. Mara shears ripe ears before the stand opens — the cornfield is a finish lane, not a maze that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Crib weeks",
    rhythm: "Mid-autumn board",
    detail:
      "A few dry cribs for the farm table after the pack shed has done its quiet work — Leah chalks sacks when the kernels are honest. No anonymous feed bin; just what the ear finished on Northfield clay.",
  },
] as const;

const wheatFieldWork = [
  {
    name: "Head rows",
    rhythm: "After the cornfield",
    detail:
      "A long belt of prairie wheat on the warm gravel edge past the ears — heads catch the same late light the corn finishes on, and the straw drinks deep without crowding the orchard windbreak into damp.",
  },
  {
    name: "Bind mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand binds when the awns dry and dew still holds. Mara ties ripe sheaves before the stand opens — the wheat field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Mill weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks flour when the grind is honest. No anonymous commodity bin; just what the head finished on Northfield clay.",
  },
] as const;

const ryeFieldWork = [
  {
    name: "Culm rows",
    rhythm: "After the wheat field",
    detail:
      "A winter belt of rye on the warm gravel edge past the wheat — culms catch the same late light the heads finish on, and the roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Shock mornings",
    rhythm: "Quiet dawn binds",
    detail:
      "Hand shocks when the awns dry and frost still holds. Mara ties ripe shocks before the stand opens — the rye field is a finish lane, not a cover-crop parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Bake weeks",
    rhythm: "Deep autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks rye flour when the grind is honest. No anonymous commodity bin; just what the culm finished on Northfield clay.",
  },
] as const;

const oatFieldWork = [
  {
    name: "Panicle rows",
    rhythm: "After the rye field",
    detail:
      "A soft belt of oats on the warm gravel edge past the rye — panicles catch the same late light the culms finish on, and the straw drinks deep without crowding the orchard windbreak into damp.",
  },
  {
    name: "Flail mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand flails when the hulls dry and dew still holds. Mara ties ripe sheaves before the stand opens — the oat field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Porridge weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks oat groats when the grind is honest. No anonymous commodity bin; just what the panicle finished on Northfield clay.",
  },
] as const;

const barleyFieldWork = [
  {
    name: "Spike rows",
    rhythm: "After the oat field",
    detail:
      "A malt belt of barley on the warm gravel edge past the oats — spikes catch the same late light the panicles finish on, and the awns drink deep without crowding the orchard windbreak into damp.",
  },
  {
    name: "Scythe mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand scythes when the awns dry and dew still holds. Mara ties ripe sheaves before the stand opens — the barley field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Malt weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks pot barley when the grind is honest. No anonymous commodity bin; just what the spike finished on Northfield clay.",
  },
] as const;

const speltFieldWork = [
  {
    name: "Hull rows",
    rhythm: "After the barley field",
    detail:
      "An ancient belt of spelt on the warm gravel edge past the barley — hulls catch the same late light the spikes finish on, and the deep roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Cradle mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand cradles when the hulls dry and dew still holds. Mara ties ripe sheaves before the stand opens — the spelt field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Loaf weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks spelt flour when the grind is honest. No anonymous commodity bin; just what the hull finished on Northfield clay.",
  },
] as const;

const buckwheatFieldWork = [
  {
    name: "Raceme rows",
    rhythm: "After the spelt field",
    detail:
      "A short-season belt of buckwheat on the warm gravel edge past the spelt — racemes catch the same late light the hulls finish on, and the quick roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Sickle mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand sickles when the seeds dry and dew still holds. Mara ties ripe sheaves before the stand opens — the buckwheat field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Groats weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks buckwheat groats when the grind is honest. No anonymous commodity bin; just what the raceme finished on Northfield clay.",
  },
] as const;

const milletFieldWork = [
  {
    name: "Head rows",
    rhythm: "After the buckwheat field",
    detail:
      "A drought-tough belt of millet on the warm gravel edge past the buckwheat — seedheads catch the same late light the racemes finish on, and the shallow roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Bundle mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand knives when the heads dry and dew still holds. Mara ties ripe bundles before the stand opens — the millet field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Flatbread weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks millet flour when the grind is honest. No anonymous commodity bin; just what the head finished on Northfield clay.",
  },
] as const;

const quinoaFieldWork = [
  {
    name: "Plume rows",
    rhythm: "After the millet field",
    detail:
      "A cool-season belt of quinoa on the warm gravel edge past the millet — seed plumes catch the same late light the heads finish on, and the deep roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Strip mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand strips when the plumes dry and dew still holds. Mara ties ripe bundles before the stand opens — the quinoa field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Bowl weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks quinoa when the rinse is honest. No anonymous commodity bin; just what the plume finished on Northfield clay.",
  },
] as const;

const sorghumFieldWork = [
  {
    name: "Panicle rows",
    rhythm: "After the quinoa field",
    detail:
      "A heat-loving belt of sorghum on the warm gravel edge past the quinoa — seed panicles catch the same late light the plumes finish on, and the deep roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Knife mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand knives when the panicles dry and dew still holds. Mara ties ripe bundles before the stand opens — the sorghum field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Syrup weeks",
    rhythm: "Late autumn board",
    detail:
      "A few pressed jugs for the farm table after the pack shed has done its quiet work — Leah chalks sorghum syrup when the boil is honest. No anonymous commodity bin; just what the panicle finished on Northfield clay.",
  },
] as const;

const amaranthFieldWork = [
  {
    name: "Tassel rows",
    rhythm: "After the sorghum field",
    detail:
      "A crimson belt of amaranth on the warm gravel edge past the sorghum — seed tassels catch the same late light the panicles finish on, and the deep roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Hand mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand harvest when the tassels dry and dew still holds. Mara ties ripe heads before the stand opens — the amaranth field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Porridge weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks amaranth porridge when the rinse is honest. No anonymous commodity bin; just what the tassel finished on Northfield clay.",
  },
] as const;

const teffFieldWork = [
  {
    name: "Spikelet rows",
    rhythm: "After the amaranth field",
    detail:
      "A fine belt of teff on the warm gravel edge past the amaranth — seed spikelets catch the same late light the tassels finish on, and the shallow roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Comb mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand combs when the spikelets dry and dew still holds. Mara ties ripe sheaves before the stand opens — the teff field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Injera weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-mill sacks for the farm table after the pack shed has done its quiet work — Leah chalks teff injera when the ferment is honest. No anonymous commodity bin; just what the spikelet finished on Northfield clay.",
  },
] as const;

const flaxFieldWork = [
  {
    name: "Boll rows",
    rhythm: "After the teff field",
    detail:
      "A blue-flowered belt of flax on the warm gravel edge past the teff — seed bolls catch the same late light the spikelets finish on, and the slender roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the bolls dry and dew still holds. Mara ties ripe stems before the stand opens — the flax field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Linseed weeks",
    rhythm: "Late autumn board",
    detail:
      "A few cold-press jugs for the farm table after the pack shed has done its quiet work — Leah chalks linseed oil when the press is honest. No anonymous commodity bin; just what the boll finished on Northfield clay.",
  },
] as const;

const hempFieldWork = [
  {
    name: "Bract rows",
    rhythm: "After the flax field",
    detail:
      "A soft-sage belt of hemp on the warm gravel edge past the flax — seed bracts catch the same late light the bolls finish on, and the deep roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Strip mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand strip when the bracts dry and dew still holds. Mara ties ripe stalks before the stand opens — the hemp field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Hempseed weeks",
    rhythm: "Late autumn board",
    detail:
      "A few cold-press jugs for the farm table after the pack shed has done its quiet work — Leah chalks hempseed oil when the press is honest. No anonymous commodity bin; just what the bract finished on Northfield clay.",
  },
] as const;

const sesameFieldWork = [
  {
    name: "Capsule rows",
    rhythm: "After the hemp field",
    detail:
      "A warm-gold belt of sesame on the gravel edge past the hemp — seed capsules catch the same late light the bracts finish on, and the slender roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Shake mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand shake when the capsules dry and dew still holds. Mara ties ripe stems before the stand opens — the sesame field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Tahini weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-ground jars for the farm table after the pack shed has done its quiet work — Leah chalks sesame tahini when the mill is honest. No anonymous commodity bin; just what the capsule finished on Northfield clay.",
  },
] as const;

const mustardFieldWork = [
  {
    name: "Silique rows",
    rhythm: "After the sesame field",
    detail:
      "A sharp-yellow belt of mustard on the gravel edge past the sesame — seed siliques catch the same late light the capsules finish on, and the quick roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the siliques dry and dew still holds. Mara ties ripe stems before the stand opens — the mustard field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Mustard weeks",
    rhythm: "Late autumn board",
    detail:
      "A few stone-ground jars for the farm table after the pack shed has done its quiet work — Leah chalks whole-grain mustard when the mill is honest. No anonymous commodity bin; just what the silique finished on Northfield clay.",
  },
] as const;

const safflowerFieldWork = [
  {
    name: "Achene rows",
    rhythm: "After the mustard field",
    detail:
      "A thistle-gold belt of safflower on the gravel edge past the mustard — seed achenes catch the same late light the siliques finish on, and the deep taproots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Cut mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand cut when the achenes dry and dew still holds. Mara ties ripe stems before the stand opens — the safflower field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Safflower weeks",
    rhythm: "Late autumn board",
    detail:
      "A few cold-pressed bottles for the farm table after the pack shed has done its quiet work — Leah chalks safflower oil when the press is honest. No anonymous commodity bin; just what the achene finished on Northfield clay.",
  },
] as const;

const camelinaFieldWork = [
  {
    name: "Silicle rows",
    rhythm: "After the safflower field",
    detail:
      "A pale-gold belt of camelina on the gravel edge past the safflower — seed silicles catch the same late light the achenes finish on, and the shallow roots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the silicles dry and dew still holds. Mara ties ripe stems before the stand opens — the camelina field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Camelina weeks",
    rhythm: "Late autumn board",
    detail:
      "A few cold-pressed bottles for the farm table after the pack shed has done its quiet work — Leah chalks camelina oil when the press is honest. No anonymous commodity bin; just what the silicle finished on Northfield clay.",
  },
] as const;

const canolaFieldWork = [
  {
    name: "Silique rows",
    rhythm: "After the camelina field",
    detail:
      "A cool-gold belt of canola on the gravel edge past the camelina — seed siliques catch the same late light the silicles finish on, and the taproots knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Swath mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand swath when the siliques dry and dew still holds. Mara ties ripe stems before the stand opens — the canola field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Canola weeks",
    rhythm: "Late autumn board",
    detail:
      "A few cold-pressed bottles for the farm table after the pack shed has done its quiet work — Leah chalks canola oil when the press is honest. No anonymous commodity bin; just what the silique finished on Northfield clay.",
  },
] as const;

const soybeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the canola field",
    detail:
      "A soft-green belt of soybeans on the gravel edge past the canola — seed pods catch the same late light the siliques finish on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Cut mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand cut when the pods rattle and dew still holds. Mara ties ripe stems before the stand opens — the soybean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Soybean weeks",
    rhythm: "Late autumn board",
    detail:
      "A few miso crocks and cold-pressed bottles for the farm table after the pack shed has done its quiet work — Leah chalks soybean oil when the press is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const peanutFieldWork = [
  {
    name: "Peg rows",
    rhythm: "After the soybean field",
    detail:
      "A warm-gold belt of peanuts on the gravel edge past the soybeans — pegs set into the same late light the pods finish on, and the vines knit the clay without crowding the orchard windbreak into damp.",
  },
  {
    name: "Dig mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand dig when the pegs firm and dew still holds. Mara lifts ripe vines before the stand opens — the peanut field is a finish lane, not a digger parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Peanut weeks",
    rhythm: "Late autumn board",
    detail:
      "A few roasted jars and cold-pressed bottles for the farm table after the pack shed has done its quiet work — Leah chalks peanut oil when the press is honest. No anonymous commodity bin; just what the peg finished on Northfield clay.",
  },
] as const;

const chickpeaFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the peanut field",
    detail:
      "A pale-gold belt of chickpeas on the gravel edge past the peanuts — seed pods catch the same late light the pegs finish on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods dry and dew still holds. Mara ties ripe stems before the stand opens — the chickpea field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Chickpea weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and hummus crocks for the farm table after the pack shed has done its quiet work — Leah chalks chickpea flour when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const lentilFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the chickpea field",
    detail:
      "A soft-green belt of lentils on the gravel edge past the chickpeas — flat pods catch the same late light the chickpea stems finish on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods rattle and dew still holds. Mara ties ripe stems before the stand opens — the lentil field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Lentil weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and stew crocks for the farm table after the pack shed has done its quiet work — Leah chalks green and red lentils when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const favaFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the lentil field",
    detail:
      "A deep-green belt of fava beans on the gravel edge past the lentils — upright pods catch the same late light the lentil flats finish on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods thicken and dew still holds. Mara ties ripe stems before the stand opens — the fava field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Fava weeks",
    rhythm: "Late autumn board",
    detail:
      "A few fresh pods and dry jars for the farm table after the pack shed has done its quiet work — Leah chalks broad beans when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const lupinFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the fava field",
    detail:
      "A cream-and-violet belt of sweet lupins on the gravel edge past the favas — upright spikes catch the same late light the fava pods finish on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods rattle and dew still holds. Mara ties ripe stems before the stand opens — the lupin field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Lupin weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and porridge sacks for the farm table after the pack shed has done its quiet work — Leah chalks sweet lupin when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const mungFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the lupin field",
    detail:
      "A soft-jade belt of mung beans on the gravel edge past the lupins — slender pods catch the same late light the lupin spikes finish on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods dull and dew still holds. Mara ties ripe stems before the stand opens — the mung field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Mung weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and sprout trays for the farm table after the pack shed has done its quiet work — Leah chalks whole mung when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const adzukiFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the mung field",
    detail:
      "A deep-burgundy belt of adzuki beans on the gravel edge past the mungs — short pods catch the same late light the mung jade finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods rattle and dew still holds. Mara ties ripe stems before the stand opens — the adzuki field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Adzuki weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and sweet paste crocks for the farm table after the pack shed has done its quiet work — Leah chalks whole adzuki when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const blackBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the adzuki field",
    detail:
      "An ink-black belt of black beans on the gravel edge past the adzukis — glossy pods catch the same late light the burgundy finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods dull and dew still holds. Mara ties ripe stems before the stand opens — the black bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Black bean weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and stew sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole black bean when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const kidneyBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the black bean field",
    detail:
      "A deep-crimson belt of kidney beans on the gravel edge past the black beans — curved pods catch the same late light the ink black finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods rattle and dew still holds. Mara ties ripe stems before the stand opens — the kidney bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Kidney bean weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and chili sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole kidney bean when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const navyBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the kidney bean field",
    detail:
      "A cool-white belt of navy beans on the gravel edge past the kidneys — small pods catch the same late light the deep crimson finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods pale and dew still holds. Mara ties ripe stems before the stand opens — the navy bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Navy bean weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and soup sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole navy bean when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const pintoBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the navy bean field",
    detail:
      "A mottled-cream belt of pinto beans on the gravel edge past the navies — freckled pods catch the same late light the cool white finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods freckle and dew still holds. Mara ties ripe stems before the stand opens — the pinto bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Pinto bean weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and refried sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole pinto bean when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const limaBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the pinto bean field",
    detail:
      "A pale-green belt of lima beans on the gravel edge past the pintos — flat pods catch the same late light the mottled cream finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods plump and dew still holds. Mara ties ripe stems before the stand opens — the lima bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Lima bean weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and butter-bean sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole lima bean when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const greatNorthernBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the lima bean field",
    detail:
      "A soft-ivory belt of great northern beans on the gravel edge past the limas — oval pods catch the same late light the pale green finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods dry and dew still holds. Mara ties ripe stems before the stand opens — the great northern bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Great northern weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and casserole sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole great northern when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const cannelliniBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the great northern bean field",
    detail:
      "A creamy-white belt of cannellini beans on the gravel edge past the great northerns — slender pods catch the same late light the soft ivory finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods thin and dew still holds. Mara ties ripe stems before the stand opens — the cannellini bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Cannellini weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and minestrone sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole cannellini when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const cranberryBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the cannellini bean field",
    detail:
      "A mottled-rose belt of cranberry beans on the gravel edge past the cannellinis — freckled pods catch the same late light the creamy white finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods blush and dew still holds. Mara ties ripe stems before the stand opens — the cranberry bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Cranberry weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and stew sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole cranberry when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const anasaziBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the cranberry bean field",
    detail:
      "A painted maroon-and-white belt of Anasazi beans on the gravel edge past the cranberries — heirloom pods catch the same late light the mottled rose finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods dry and dew still holds. Mara ties ripe stems before the stand opens — the Anasazi bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Anasazi weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and chili sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole Anasazi when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const mayocobaBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the Anasazi bean field",
    detail:
      "A warm canary-yellow belt of Mayocoba beans on the gravel edge past the Anasazis — pale gold pods catch the same late light the painted maroon finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods soft-yellow and dew still holds. Mara ties ripe stems before the stand opens — the Mayocoba bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Mayocoba weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and refried sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole Mayocoba when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const flageoletBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the Mayocoba bean field",
    detail:
      "A pale celadon belt of Flageolet beans on the gravel edge past the Mayocobas — mint-green pods catch the same late light the canary gold finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods soft-green and dew still holds. Mara ties ripe stems before the stand opens — the Flageolet bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Flageolet weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and cassoulet sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole Flageolet when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const calypsoBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the Flageolet bean field",
    detail:
      "An ink-and-ivory belt of Calypso beans on the gravel edge past the Flageolets — half-moon pods catch the same late light the pale celadon finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods ink-split and dew still holds. Mara ties ripe stems before the stand opens — the Calypso bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Calypso weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and soup sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole Calypso when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const tigersEyeBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the Calypso bean field",
    detail:
      "An amber-swirl belt of Tiger's Eye beans on the gravel edge past the Calypsos — caramel-striped pods catch the same late light the ink-and-ivory finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods amber-stripe and dew still holds. Mara ties ripe stems before the stand opens — the Tiger's Eye bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Tiger's Eye weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and chili sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole Tiger's Eye when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const jacobsCattleBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the Tiger's Eye bean field",
    detail:
      "A mottled-maroon belt of Jacob's Cattle beans on the gravel edge past the Tiger's Eyes — trout-spotted pods catch the same late light the amber swirl finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods trout-spot and dew still holds. Mara ties ripe stems before the stand opens — the Jacob's Cattle bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Jacob's Cattle weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and baked-bean sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole Jacob's Cattle when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const appaloosaBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the Jacob's Cattle bean field",
    detail:
      "A piebald-cream belt of Appaloosa beans on the gravel edge past the Jacob's Cattle — ink-spotted pods catch the same late light the mottled maroon finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods ink-spot and dew still holds. Mara ties ripe stems before the stand opens — the Appaloosa bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Appaloosa weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and chili sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole Appaloosa when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const eyeOfTheGoatBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the Appaloosa bean field",
    detail:
      "An ochre-tan belt of Eye of the Goat beans on the gravel edge past the Appaloosas — dark-eye pods catch the same late light the piebald cream finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods show the goat-eye and dew still holds. Mara ties ripe stems before the stand opens — the Eye of the Goat bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Eye of the Goat weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and stew sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole Eye of the Goat when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const christmasLimaBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the Eye of the Goat bean field",
    detail:
      "A scarlet-and-cream belt of Christmas Lima beans on the gravel edge past the Eye of the Goat — mottled pods catch the same late light the ochre eye finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods blush scarlet-cream and dew still holds. Mara ties ripe stems before the stand opens — the Christmas Lima bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Christmas Lima weeks",
    rhythm: "Late autumn board",
    detail:
      "A few dry jars and holiday stew sacks for the farm table after the pack shed has done its quiet work — Leah chalks whole Christmas Lima when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
  },
] as const;

const dragonTongueBeanFieldWork = [
  {
    name: "Pod rows",
    rhythm: "After the Christmas Lima bean field",
    detail:
      "A streaked yellow-and-purple belt of Dragon Tongue beans on the gravel edge past the Christmas Limas — wax pods catch the same late light the scarlet cream finishes on, and the nodules knit the clay with nitrogen without crowding the orchard windbreak into damp.",
  },
  {
    name: "Pull mornings",
    rhythm: "Quiet dawn sheaves",
    detail:
      "Hand pull when the pods show purple streaks and dew still holds. Mara ties ripe stems before the stand opens — the Dragon Tongue bean field is a finish lane, not a combine parade that packs the clay into a path the CSA kids would track indoors.",
  },
  {
    name: "Dragon Tongue weeks",
    rhythm: "Late autumn board",
    detail:
      "A few fresh snap baskets and dry jars for the farm table after the pack shed has done its quiet work — Leah chalks whole Dragon Tongue when the mill is honest. No anonymous commodity bin; just what the pod finished on Northfield clay.",
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
            <a href="#machine-shed" className="transition hover:text-[var(--foreground)]">
              Machine shed
            </a>
            <a href="#henhouse" className="transition hover:text-[var(--foreground)]">
              Henhouse
            </a>
            <a href="#sheepfold" className="transition hover:text-[var(--foreground)]">
              Sheepfold
            </a>
            <a href="#goat-yard" className="transition hover:text-[var(--foreground)]">
              Goat yard
            </a>
            <a href="#pig-paddock" className="transition hover:text-[var(--foreground)]">
              Pig paddock
            </a>
            <a href="#duck-pond" className="transition hover:text-[var(--foreground)]">
              Duck pond
            </a>
            <a href="#turkey-run" className="transition hover:text-[var(--foreground)]">
              Turkey run
            </a>
            <a href="#rabbit-warren" className="transition hover:text-[var(--foreground)]">
              Rabbit warren
            </a>
            <a href="#goose-yard" className="transition hover:text-[var(--foreground)]">
              Goose yard
            </a>
            <a href="#horse-paddock" className="transition hover:text-[var(--foreground)]">
              Horse paddock
            </a>
            <a href="#cattle-yard" className="transition hover:text-[var(--foreground)]">
              Cattle yard
            </a>
            <a href="#berry-patch" className="transition hover:text-[var(--foreground)]">
              Berry patch
            </a>
            <a href="#vineyard" className="transition hover:text-[var(--foreground)]">
              Vineyard
            </a>
            <a href="#hop-yard" className="transition hover:text-[var(--foreground)]">
              Hop yard
            </a>
            <a href="#lavender-field" className="transition hover:text-[var(--foreground)]">
              Lavender field
            </a>
            <a href="#sunflower-field" className="transition hover:text-[var(--foreground)]">
              Sunflower field
            </a>
            <a href="#pumpkin-patch" className="transition hover:text-[var(--foreground)]">
              Pumpkin patch
            </a>
            <a href="#cornfield" className="transition hover:text-[var(--foreground)]">
              Cornfield
            </a>
            <a href="#wheat-field" className="transition hover:text-[var(--foreground)]">
              Wheat field
            </a>
            <a href="#rye-field" className="transition hover:text-[var(--foreground)]">
              Rye field
            </a>
            <a href="#oat-field" className="transition hover:text-[var(--foreground)]">
              Oat field
            </a>
            <a href="#barley-field" className="transition hover:text-[var(--foreground)]">
              Barley field
            </a>
            <a href="#spelt-field" className="transition hover:text-[var(--foreground)]">
              Spelt field
            </a>
            <a href="#buckwheat-field" className="transition hover:text-[var(--foreground)]">
              Buckwheat field
            </a>
            <a href="#millet-field" className="transition hover:text-[var(--foreground)]">
              Millet field
            </a>
            <a href="#quinoa-field" className="transition hover:text-[var(--foreground)]">
              Quinoa field
            </a>
            <a href="#sorghum-field" className="transition hover:text-[var(--foreground)]">
              Sorghum field
            </a>
            <a href="#amaranth-field" className="transition hover:text-[var(--foreground)]">
              Amaranth field
            </a>
            <a href="#teff-field" className="transition hover:text-[var(--foreground)]">
              Teff field
            </a>
            <a href="#flax-field" className="transition hover:text-[var(--foreground)]">
              Flax field
            </a>
            <a href="#hemp-field" className="transition hover:text-[var(--foreground)]">
              Hemp field
            </a>
            <a href="#sesame-field" className="transition hover:text-[var(--foreground)]">
              Sesame field
            </a>
            <a href="#mustard-field" className="transition hover:text-[var(--foreground)]">
              Mustard field
            </a>
            <a href="#safflower-field" className="transition hover:text-[var(--foreground)]">
              Safflower field
            </a>
            <a href="#camelina-field" className="transition hover:text-[var(--foreground)]">
              Camelina field
            </a>
            <a href="#canola-field" className="transition hover:text-[var(--foreground)]">
              Canola field
            </a>
            <a href="#soybean-field" className="transition hover:text-[var(--foreground)]">
              Soybean field
            </a>
            <a href="#peanut-field" className="transition hover:text-[var(--foreground)]">
              Peanut field
            </a>
            <a href="#chickpea-field" className="transition hover:text-[var(--foreground)]">
              Chickpea field
            </a>
            <a href="#lentil-field" className="transition hover:text-[var(--foreground)]">
              Lentil field
            </a>
            <a href="#fava-field" className="transition hover:text-[var(--foreground)]">
              Fava field
            </a>
            <a href="#lupin-field" className="transition hover:text-[var(--foreground)]">
              Lupin field
            </a>
            <a href="#mung-field" className="transition hover:text-[var(--foreground)]">
              Mung field
            </a>
            <a href="#adzuki-field" className="transition hover:text-[var(--foreground)]">
              Adzuki field
            </a>
            <a href="#black-bean-field" className="transition hover:text-[var(--foreground)]">
              Black bean field
            </a>
            <a href="#kidney-bean-field" className="transition hover:text-[var(--foreground)]">
              Kidney bean field
            </a>
            <a href="#navy-bean-field" className="transition hover:text-[var(--foreground)]">
              Navy bean field
            </a>
            <a href="#pinto-bean-field" className="transition hover:text-[var(--foreground)]">
              Pinto bean field
            </a>
            <a href="#lima-bean-field" className="transition hover:text-[var(--foreground)]">
              Lima bean field
            </a>
            <a href="#great-northern-bean-field" className="transition hover:text-[var(--foreground)]">
              Great northern bean field
            </a>
            <a href="#cannellini-bean-field" className="transition hover:text-[var(--foreground)]">
              Cannellini bean field
            </a>
            <a href="#cranberry-bean-field" className="transition hover:text-[var(--foreground)]">
              Cranberry bean field
            </a>
            <a href="#anasazi-bean-field" className="transition hover:text-[var(--foreground)]">
              Anasazi bean field
            </a>
            <a href="#mayocoba-bean-field" className="transition hover:text-[var(--foreground)]">
              Mayocoba bean field
            </a>
            <a href="#flageolet-bean-field" className="transition hover:text-[var(--foreground)]">
              Flageolet bean field
            </a>
            <a href="#calypso-bean-field" className="transition hover:text-[var(--foreground)]">
              Calypso bean field
            </a>
            <a href="#tigers-eye-bean-field" className="transition hover:text-[var(--foreground)]">
              Tiger&apos;s Eye bean field
            </a>
            <a href="#jacobs-cattle-bean-field" className="transition hover:text-[var(--foreground)]">
              Jacob&apos;s Cattle bean field
            </a>
            <a href="#appaloosa-bean-field" className="transition hover:text-[var(--foreground)]">
              Appaloosa bean field
            </a>
            <a href="#eye-of-the-goat-bean-field" className="transition hover:text-[var(--foreground)]">
              Eye of the Goat bean field
            </a>
            <a href="#christmas-lima-bean-field" className="transition hover:text-[var(--foreground)]">
              Christmas Lima bean field
            </a>
            <a href="#dragon-tongue-bean-field" className="transition hover:text-[var(--foreground)]">
              Dragon Tongue bean field
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

        {/* Machine shed — one job: keep field iron dry and ready */}
        <section
          id="machine-shed"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -left-20 bottom-8 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Iron and timber
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A machine shed that keeps the field iron ready.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Tractor bay, cover season, and parts crib — the quiet shelter
              between mud weeks and the next dawn haul to the pack shed.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {machineShedWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20machine%20shed"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the machine shed
            </a>
          </div>
        </section>

        {/* Henhouse — one job: pasture eggs on the cattle clock */}
        <section id="henhouse" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_360px_at_75%_35%,rgba(198,164,90,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Nest and roost
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A henhouse that follows the cattle clock.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Nest boxes, roost loft, and mobile coop — gold yolks that track
              Jonah’s pasture moves, then ride the pack-shed share lane before
              the stand board opens.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {henhouseWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20henhouse"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the henhouse
            </a>
          </div>
        </section>

        {/* Sheepfold — one job: flock after cattle, wool for the stand */}
        <section
          id="sheepfold"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--sky)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Fold and fleece
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A sheepfold that finishes what the cattle start.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Fold gate, lambing shed, and wool weeks — a small flock on rest
              paddocks, then fleece that finds the stand after the mill and
              pack-shed share lanes have done their work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {sheepfoldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20sheepfold"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the sheepfold
            </a>
          </div>
        </section>

        {/* Goat yard — one job: browse edges, soft landings, cheese for the stand */}
        <section id="goat-yard" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_360px_at_25%_40%,rgba(198,164,90,0.12),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Browse and chèvre
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A goat yard that finishes the fence line.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Brush browse, kidding pen, and cheese days — a small herd on the
              woody edges after the sheepfold, then chèvre that finds the stand
              once the dairy and pack-shed lanes have done their quiet work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {goatYardWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20goat%20yard"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the goat yard
            </a>
          </div>
        </section>

        {/* Pig paddock — one job: root after browse, cure for the stand */}
        <section
          id="pig-paddock"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--sky)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Root and wallow
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A pig paddock that finishes the rotation.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Root wallow, farrow hut, and smokehouse weeks — a small drove on
              soft ground after the goat yard, then cuts that find the stand
              once the smokehouse and pack-shed lanes have done their quiet work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {pigPaddockWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20pig%20paddock"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the pig paddock
            </a>
          </div>
        </section>

        {/* Duck pond — one job: wet edge after rooting, eggs for the stand */}
        <section id="duck-pond" className="relative border-t border-[var(--line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_360px_at_70%_35%,rgba(143,180,201,0.14),transparent_55%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Water and wing
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A duck pond that finishes the wet edge.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Reed margin, nest raft, and egg mornings — a small flock on soft
              water after the pig paddock, then yolks that find the stand once
              the pack-shed lane has done its quiet sorting work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {duckPondWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20duck%20pond"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the duck pond
            </a>
          </div>
        </section>

        {/* Turkey run — one job: range after the wet edge, feast birds for the stand */}
        <section
          id="turkey-run"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Range and feather
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A turkey run that finishes the poultry lane.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Range lane, brush roost, and feast weeks — a small flock on open
              grass after the duck pond, then birds that find the stand once the
              pack-shed lane has done its quiet autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {turkeyRunWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20turkey%20run"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the turkey run
            </a>
          </div>
        </section>

        {/* Rabbit warren — one job: clover after the poultry lane, fryers for the stand */}
        <section
          id="rabbit-warren"
          className="relative overflow-hidden border-t border-[var(--line)]"
        >
          <div className="pointer-events-none absolute -left-16 bottom-10 h-72 w-72 rounded-full bg-[var(--leaf)]/15 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Clover and quiet
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A rabbit warren that finishes the small livestock lane.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Clover lane, nest boxes, and market fryers — a small warren on soft
              understory after the turkey run, then cuts that find the stand once
              the pack-shed lane has done its quiet Saturday work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {rabbitWarrenWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20rabbit%20warren"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the rabbit warren
            </a>
          </div>
        </section>

        {/* Goose yard — one job: wet meadow after the warren, guard flock + feather weeks */}
        <section
          id="goose-yard"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-20 top-8 h-80 w-80 rounded-full bg-[var(--sky)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Meadow and wing
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A goose yard that finishes the waterfowl lane.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Wet meadow, guard flock, and feather weeks — a small gaggle on soft
              grass after the rabbit warren, then birds that find the stand once
              the pack-shed lane has done its quiet summer work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {gooseYardWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20goose%20yard"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the goose yard
            </a>
          </div>
        </section>

        {/* Horse paddock — one job: draft lane after the goose yard, harness wall + work weeks */}
        <section
          id="horse-paddock"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 bottom-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Draft and quiet
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A horse paddock that finishes the draft lane.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Draft lane, harness wall, and work weeks — a small team on soft
              footing after the goose yard, then beds that open without diesel
              once the machine-shed calendar has room for horse-drawn days.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {horsePaddockWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20horse%20paddock"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the horse paddock
            </a>
          </div>
        </section>

        {/* Cattle yard — one job: grazing strip after the horse paddock, mineral trough + finish weeks */}
        <section
          id="cattle-yard"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#14251b]"
        >
          <div className="pointer-events-none absolute -right-20 top-8 h-80 w-80 rounded-full bg-[var(--sky)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--sky)]">
              Herd and clay
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A cattle yard that finishes the herd lane.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Grazing strip, mineral trough, and finish weeks — a small herd on
              soft grass after the horse paddock, then beeves that find the
              stand once the pack-shed lane has done its quiet autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {cattleYardWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20cattle%20yard"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the cattle yard
            </a>
          </div>
        </section>

        {/* Berry patch — one job: cane rows after the cattle yard, pick mornings + preserve weeks */}
        <section
          id="berry-patch"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 bottom-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Cane and sun
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A berry patch that finishes the summer lane.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Cane rows, pick mornings, and preserve weeks — a low belt of fruit
              after the cattle yard, then jars that find the farm table once the
              pack-shed lane has done its quiet high-summer work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {berryPatchWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20berry%20patch"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the berry patch
            </a>
          </div>
        </section>

        {/* Vineyard — one job: trellis rows after the berry patch, cluster mornings + press weeks */}
        <section
          id="vineyard"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Wire and warm slope
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A vineyard that finishes the cane lane.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Trellis rows, cluster mornings, and press weeks — a short belt of
              fruit after the berry patch, then small batches that find the farm
              table once the pack-shed lane has done its quiet early-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {vineyardWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20vineyard"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the vineyard
            </a>
          </div>
        </section>

        {/* Hop yard — one job: bine rows after the vineyard, cone mornings + dry weeks */}
        <section
          id="hop-yard"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 bottom-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Bine and kiln air
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A hop yard that finishes the vine lane.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Bine rows, cone mornings, and dry weeks — a narrow belt of aroma
              after the vineyard, then kiln trays that find the farm table once
              the pack-shed lane has done its quiet late-summer work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {hopYardWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20hop%20yard"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the hop yard
            </a>
          </div>
        </section>

        {/* Lavender field — one job: spike rows after the hop yard, bloom mornings + bundle weeks */}
        <section
          id="lavender-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Spike and dry air
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A lavender field that finishes the bine lane.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Spike rows, bloom mornings, and bundle weeks — a soft belt of scent
              after the hop yard, then drying racks that find the farm table once
              the pack-shed lane has done its quiet high-summer work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {lavenderFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20lavender%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the lavender field
            </a>
          </div>
        </section>

        {/* Sunflower field — one job: stalk rows after the lavender field, head mornings + press weeks */}
        <section
          id="sunflower-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Stalk and prairie sun
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A sunflower field that finishes the lavender belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Stalk rows, head mornings, and press weeks — a tall belt of gold
              after the lavender field, then seed trays that find the farm table once
              the pack-shed lane has done its quiet late-summer work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {sunflowerFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20sunflower%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the sunflower field
            </a>
          </div>
        </section>

        {/* Pumpkin patch — one job: vine rows after the sunflower field, cure mornings + cellar weeks */}
        <section
          id="pumpkin-patch"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Vine and autumn light
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A pumpkin patch that finishes the sunflower belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Vine rows, cure mornings, and cellar weeks — a low belt of orange
              after the sunflower field, then cure racks that find the farm table once
              the pack-shed lane has done its quiet early-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {pumpkinPatchWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20pumpkin%20patch"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the pumpkin patch
            </a>
          </div>
        </section>

        {/* Cornfield — one job: ear rows after the pumpkin patch, tassel mornings + crib weeks */}
        <section
          id="cornfield"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Ear and prairie wind
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A cornfield that finishes the pumpkin belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Ear rows, tassel mornings, and crib weeks — a tall belt of gold
              after the pumpkin patch, then dry cribs that find the farm table once
              the pack-shed lane has done its quiet mid-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {cornfieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20cornfield"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the cornfield
            </a>
          </div>
        </section>

        {/* Wheat field — one job: head rows after the cornfield, bind mornings + mill weeks */}
        <section
          id="wheat-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Head and prairie gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A wheat field that finishes the corn belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Head rows, bind mornings, and mill weeks — a long belt of gold
              after the cornfield, then stone-mill sacks that find the farm table once
              the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {wheatFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20wheat%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the wheat field
            </a>
          </div>
        </section>

        {/* Rye field — one job: culm rows after the wheat field, shock mornings + bake weeks */}
        <section
          id="rye-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Culm and winter gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A rye field that finishes the wheat belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Culm rows, shock mornings, and bake weeks — a winter belt of gold
              after the wheat field, then stone-mill sacks that find the farm table once
              the pack-shed lane has done its quiet deep-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {ryeFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20rye%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the rye field
            </a>
          </div>
        </section>

        {/* Oat field — one job: panicle rows after the rye field, flail mornings + porridge weeks */}
        <section
          id="oat-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Panicle and soft gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              An oat field that finishes the rye belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Panicle rows, flail mornings, and porridge weeks — a soft belt of gold
              after the rye field, then stone-mill sacks that find the farm table once
              the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {oatFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20oat%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the oat field
            </a>
          </div>
        </section>

        {/* Barley field — one job: spike rows after the oat field, scythe mornings + malt weeks */}
        <section
          id="barley-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Spike and malt gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A barley field that finishes the oat belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Spike rows, scythe mornings, and malt weeks — a malt belt of gold
              after the oat field, then stone-mill sacks that find the farm table once
              the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {barleyFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20barley%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the barley field
            </a>
          </div>
        </section>

        {/* Spelt field — one job: hull rows after the barley field, cradle mornings + loaf weeks */}
        <section
          id="spelt-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Hull and ancient gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A spelt field that finishes the barley belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Hull rows, cradle mornings, and loaf weeks — an ancient belt of gold
              after the barley field, then stone-mill sacks that find the farm table once
              the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {speltFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20spelt%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the spelt field
            </a>
          </div>
        </section>

        {/* Buckwheat field — one job: raceme rows after the spelt field, sickle mornings + groats weeks */}
        <section
          id="buckwheat-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Raceme and dark honey
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A buckwheat field that finishes the spelt belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Raceme rows, sickle mornings, and groats weeks — a short-season belt of
              dark honey after the spelt field, then stone-mill sacks that find the farm
              table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {buckwheatFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20buckwheat%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the buckwheat field
            </a>
          </div>
        </section>

        {/* Millet field — one job: head rows after the buckwheat field, bundle mornings + flatbread weeks */}
        <section
          id="millet-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Head and warm bronze
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A millet field that finishes the buckwheat belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Head rows, bundle mornings, and flatbread weeks — a drought-tough belt of
              warm bronze after the buckwheat field, then stone-mill sacks that find the farm
              table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {milletFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20millet%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the millet field
            </a>
          </div>
        </section>

        {/* Quinoa field — one job: plume rows after the millet field, strip mornings + bowl weeks */}
        <section
          id="quinoa-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Plume and cool ivory
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A quinoa field that finishes the millet belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Plume rows, strip mornings, and bowl weeks — a cool-season belt of
              cool ivory after the millet field, then stone-mill sacks that find the farm
              table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {quinoaFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20quinoa%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the quinoa field
            </a>
          </div>
        </section>

        {/* Sorghum field — one job: panicle rows after the quinoa field, knife mornings + syrup weeks */}
        <section
          id="sorghum-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Panicle and amber cane
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A sorghum field that finishes the quinoa belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Panicle rows, knife mornings, and syrup weeks — a heat-loving belt of
              amber cane after the quinoa field, then pressed jugs that find the farm
              table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {sorghumFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20sorghum%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the sorghum field
            </a>
          </div>
        </section>

        {/* Amaranth field — one job: tassel rows after the sorghum field, hand mornings + porridge weeks */}
        <section
          id="amaranth-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Tassel and deep crimson
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              An amaranth field that finishes the sorghum belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Tassel rows, hand mornings, and porridge weeks — a heat-loving belt of
              deep crimson after the sorghum field, then stone-mill sacks that find the
              farm table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {amaranthFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20amaranth%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the amaranth field
            </a>
          </div>
        </section>

        {/* Teff field — one job: spikelet rows after the amaranth field, comb mornings + injera weeks */}
        <section
          id="teff-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Spikelet and warm bronze
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A teff field that finishes the amaranth belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Spikelet rows, comb mornings, and injera weeks — a heat-loving belt of
              warm bronze after the amaranth field, then stone-mill sacks that find the
              farm table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {teffFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20teff%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the teff field
            </a>
          </div>
        </section>

        {/* Flax field — one job: boll rows after the teff field, pull mornings + linseed weeks */}
        <section
          id="flax-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Boll and cool indigo
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A flax field that finishes the teff belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Boll rows, pull mornings, and linseed weeks — a heat-loving belt of
              cool indigo after the teff field, then cold-press jugs that find the
              farm table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {flaxFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20flax%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the flax field
            </a>
          </div>
        </section>

        {/* Hemp field — one job: bract rows after the flax field, strip mornings + hempseed weeks */}
        <section
          id="hemp-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Bract and soft sage
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A hemp field that finishes the flax belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Bract rows, strip mornings, and hempseed weeks — a heat-loving belt of
              soft sage after the flax field, then cold-press jugs that find the
              farm table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {hempFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20hemp%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the hemp field
            </a>
          </div>
        </section>

        {/* Sesame field — one job: capsule rows after the hemp field, shake mornings + tahini weeks */}
        <section
          id="sesame-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Capsule and warm gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A sesame field that finishes the hemp belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Capsule rows, shake mornings, and tahini weeks — a heat-loving belt of
              warm gold after the hemp field, then stone-ground jars that find the
              farm table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {sesameFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20sesame%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the sesame field
            </a>
          </div>
        </section>

        {/* Mustard field — one job: silique rows after the sesame field, pull mornings + mustard weeks */}
        <section
          id="mustard-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Silique and sharp yellow
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A mustard field that finishes the sesame belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Silique rows, pull mornings, and mustard weeks — a heat-loving belt of
              sharp yellow after the sesame field, then stone-ground jars that find the
              farm table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {mustardFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20mustard%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the mustard field
            </a>
          </div>
        </section>

        {/* Safflower field — one job: achene rows after the mustard field, cut mornings + safflower weeks */}
        <section
          id="safflower-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Achene and thistle gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A safflower field that finishes the mustard belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Achene rows, cut mornings, and safflower weeks — a drought-tough belt of
              thistle gold after the mustard field, then cold-pressed bottles that find the
              farm table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {safflowerFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20safflower%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the safflower field
            </a>
          </div>
        </section>

        {/* Camelina field — one job: silicle rows after the safflower field, pull mornings + camelina weeks */}
        <section
          id="camelina-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Silicle and pale gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A camelina field that finishes the safflower belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Silicle rows, pull mornings, and camelina weeks — a cool-season belt of
              pale gold after the safflower field, then cold-pressed bottles that find the
              farm table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {camelinaFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20camelina%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the camelina field
            </a>
          </div>
        </section>

        {/* Canola field — one job: silique rows after the camelina field, swath mornings + canola weeks */}
        <section
          id="canola-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Silique and cool gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A canola field that finishes the camelina belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Silique rows, swath mornings, and canola weeks — a cool-season belt of
              cool gold after the camelina field, then cold-pressed bottles that find the
              farm table once the pack-shed lane has done its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {canolaFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20canola%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the canola field
            </a>
          </div>
        </section>

        {/* Soybean field — one job: pod rows after the canola field, cut mornings + soybean weeks */}
        <section
          id="soybean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and soft green-gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A soybean field that finishes the canola belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, cut mornings, and soybean weeks — a cool-season belt of
              soft green-gold after the canola field, then miso crocks and cold-pressed
              bottles that find the farm table once the pack-shed lane has done its quiet
              late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {soybeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20soybean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the soybean field
            </a>
          </div>
        </section>

        {/* Peanut field — one job: peg rows after the soybean field, dig mornings + peanut weeks */}
        <section
          id="peanut-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Peg and warm gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A peanut field that finishes the soybean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Peg rows, dig mornings, and peanut weeks — a warm-season belt of
              warm gold after the soybean field, then roasted jars and cold-pressed
              bottles that find the farm table once the pack-shed lane has done its quiet
              late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {peanutFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20peanut%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the peanut field
            </a>
          </div>
        </section>

        {/* Chickpea field — one job: pod rows after the peanut field, pull mornings + chickpea weeks */}
        <section
          id="chickpea-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and pale gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A chickpea field that finishes the peanut belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and chickpea weeks — a cool-season belt of
              pale gold after the peanut field, then dry jars and hummus crocks
              that find the farm table once the pack-shed lane has done its quiet
              late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {chickpeaFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20chickpea%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the chickpea field
            </a>
          </div>
        </section>

        {/* Lentil field — one job: pod rows after the chickpea field, pull mornings + lentil weeks */}
        <section
          id="lentil-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and soft green
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A lentil field that finishes the chickpea belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and lentil weeks — a cool-season belt of
              soft green after the chickpea field, then dry jars and stew crocks
              that find the farm table once the pack-shed lane has done its quiet
              late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {lentilFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20lentil%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the lentil field
            </a>
          </div>
        </section>

        {/* Fava field — one job: pod rows after the lentil field, pull mornings + fava weeks */}
        <section
          id="fava-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and deep green
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A fava field that finishes the lentil belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and fava weeks — a cool-season belt of
              deep green after the lentil field, then fresh pods and dry jars
              that find the farm table once the pack-shed lane has done its quiet
              late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {favaFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20fava%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the fava field
            </a>
          </div>
        </section>

        {/* Lupin field — one job: pod rows after the fava field, pull mornings + lupin weeks */}
        <section
          id="lupin-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and cream violet
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A lupin field that finishes the fava belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and lupin weeks — a cool-season belt of
              cream and violet after the fava field, then dry jars and porridge
              sacks that find the farm table once the pack-shed lane has done its
              quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {lupinFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20lupin%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the lupin field
            </a>
          </div>
        </section>

        {/* Mung field — one job: pod rows after the lupin field, pull mornings + mung weeks */}
        <section
          id="mung-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and soft jade
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A mung field that finishes the lupin belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and mung weeks — a warm-season belt of
              soft jade after the lupin field, then dry jars and sprout trays
              that find the farm table once the pack-shed lane has done its
              quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {mungFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20mung%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the mung field
            </a>
          </div>
        </section>

        {/* Adzuki field — one job: pod rows after the mung field, pull mornings + adzuki weeks */}
        <section
          id="adzuki-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and deep burgundy
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              An adzuki field that finishes the mung belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and adzuki weeks — a warm-season belt of
              deep burgundy after the mung field, then dry jars and sweet paste
              crocks that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {adzukiFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20adzuki%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the adzuki field
            </a>
          </div>
        </section>

        {/* Black bean field — one job: pod rows after the adzuki field, pull mornings + black bean weeks */}
        <section
          id="black-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and ink black
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A black bean field that finishes the adzuki belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and black bean weeks — a warm-season belt of
              ink black after the adzuki field, then dry jars and stew sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {blackBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20black%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the black bean field
            </a>
          </div>
        </section>

        {/* Kidney bean field — one job: pod rows after the black bean field, pull mornings + kidney bean weeks */}
        <section
          id="kidney-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and deep crimson
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A kidney bean field that finishes the black bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and kidney bean weeks — a warm-season belt of
              deep crimson after the black bean field, then dry jars and chili sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {kidneyBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20kidney%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the kidney bean field
            </a>
          </div>
        </section>

        {/* Navy bean field — one job: pod rows after the kidney bean field, pull mornings + navy bean weeks */}
        <section
          id="navy-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and cool white
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A navy bean field that finishes the kidney bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and navy bean weeks — a warm-season belt of
              cool white after the kidney bean field, then dry jars and soup sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {navyBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20navy%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the navy bean field
            </a>
          </div>
        </section>

        {/* Pinto bean field — one job: pod rows after the navy bean field, pull mornings + pinto bean weeks */}
        <section
          id="pinto-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and mottled cream
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A pinto bean field that finishes the navy bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and pinto bean weeks — a warm-season belt of
              mottled cream after the navy bean field, then dry jars and refried sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {pintoBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20pinto%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the pinto bean field
            </a>
          </div>
        </section>

        {/* Lima bean field — one job: pod rows after the pinto bean field, pull mornings + lima bean weeks */}
        <section
          id="lima-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and pale green
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A lima bean field that finishes the pinto bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and lima bean weeks — a warm-season belt of
              pale green after the pinto bean field, then dry jars and butter-bean sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {limaBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20lima%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the lima bean field
            </a>
          </div>
        </section>

        {/* Great northern bean field — one job: pod rows after the lima bean field, pull mornings + great northern weeks */}
        <section
          id="great-northern-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#101f18]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and soft ivory
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A great northern bean field that finishes the lima bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and great northern weeks — a warm-season belt of
              soft ivory after the lima bean field, then dry jars and casserole sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {greatNorthernBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20great%20northern%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the great northern bean field
            </a>
          </div>
        </section>

        {/* Cannellini bean field — one job: pod rows after the great northern bean field, pull mornings + cannellini weeks */}
        <section
          id="cannellini-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and creamy white
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A cannellini bean field that finishes the great northern bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and cannellini weeks — a warm-season belt of
              creamy white after the great northern bean field, then dry jars and minestrone sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {cannelliniBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20cannellini%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the cannellini bean field
            </a>
          </div>
        </section>

        {/* Cranberry bean field — one job: pod rows after the cannellini bean field, pull mornings + cranberry weeks */}
        <section
          id="cranberry-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#101f18]"
        >
          <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and mottled rose
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A cranberry bean field that finishes the cannellini bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and cranberry weeks — a warm-season belt of
              mottled rose after the cannellini bean field, then dry jars and stew sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {cranberryBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20cranberry%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the cranberry bean field
            </a>
          </div>
        </section>

        {/* Anasazi bean field — one job: pod rows after the cranberry bean field, pull mornings + Anasazi weeks */}
        <section
          id="anasazi-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and painted maroon
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              An Anasazi bean field that finishes the cranberry bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Anasazi weeks — a warm-season belt of
              painted maroon after the cranberry bean field, then dry jars and chili sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {anasaziBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Anasazi%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Anasazi bean field
            </a>
          </div>
        </section>

        {/* Mayocoba bean field — one job: pod rows after the Anasazi bean field, pull mornings + Mayocoba weeks */}
        <section
          id="mayocoba-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and canary gold
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A Mayocoba bean field that finishes the Anasazi bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Mayocoba weeks — a warm-season belt of
              canary gold after the Anasazi bean field, then dry jars and refried sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {mayocobaBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Mayocoba%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Mayocoba bean field
            </a>
          </div>
        </section>

        {/* Flageolet bean field — one job: pod rows after the Mayocoba bean field, pull mornings + Flageolet weeks */}
        <section
          id="flageolet-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and pale celadon
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A Flageolet bean field that finishes the Mayocoba bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Flageolet weeks — a warm-season belt of
              pale celadon after the Mayocoba bean field, then dry jars and cassoulet sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {flageoletBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Flageolet%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Flageolet bean field
            </a>
          </div>
        </section>

        {/* Calypso bean field — one job: pod rows after the Flageolet bean field, pull mornings + Calypso weeks */}
        <section
          id="calypso-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and ink-and-ivory
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A Calypso bean field that finishes the Flageolet bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Calypso weeks — a warm-season belt of
              ink-and-ivory after the Flageolet bean field, then dry jars and soup sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {calypsoBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Calypso%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Calypso bean field
            </a>
          </div>
        </section>

        {/* Tiger's Eye bean field — one job: pod rows after the Calypso bean field, pull mornings + Tiger's Eye weeks */}
        <section
          id="tigers-eye-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and amber swirl
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A Tiger&apos;s Eye bean field that finishes the Calypso bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Tiger&apos;s Eye weeks — a warm-season belt of
              amber swirl after the Calypso bean field, then dry jars and chili sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {tigersEyeBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Tiger%27s%20Eye%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Tiger&apos;s Eye bean field
            </a>
          </div>
        </section>

        {/* Jacob's Cattle bean field — one job: pod rows after the Tiger's Eye bean field, pull mornings + Jacob's Cattle weeks */}
        <section
          id="jacobs-cattle-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and mottled maroon
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A Jacob&apos;s Cattle bean field that finishes the Tiger&apos;s Eye bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Jacob&apos;s Cattle weeks — a warm-season belt of
              mottled maroon after the Tiger&apos;s Eye bean field, then dry jars and baked-bean sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {jacobsCattleBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Jacob%27s%20Cattle%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Jacob&apos;s Cattle bean field
            </a>
          </div>
        </section>

        {/* Appaloosa bean field — one job: pod rows after the Jacob's Cattle bean field, pull mornings + Appaloosa weeks */}
        <section
          id="appaloosa-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and piebald cream
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              An Appaloosa bean field that finishes the Jacob&apos;s Cattle bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Appaloosa weeks — a warm-season belt of
              piebald cream after the Jacob&apos;s Cattle bean field, then dry jars and chili sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {appaloosaBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Appaloosa%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Appaloosa bean field
            </a>
          </div>
        </section>

        {/* Eye of the Goat bean field — one job: pod rows after the Appaloosa bean field, pull mornings + Eye of the Goat weeks */}
        <section
          id="eye-of-the-goat-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and ochre eye
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              An Eye of the Goat bean field that finishes the Appaloosa bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Eye of the Goat weeks — a warm-season belt of
              ochre tan after the Appaloosa bean field, then dry jars and stew sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {eyeOfTheGoatBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Eye%20of%20the%20Goat%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Eye of the Goat bean field
            </a>
          </div>
        </section>

        {/* Christmas Lima bean field — one job: pod rows after the Eye of the Goat bean field, pull mornings + Christmas Lima weeks */}
        <section
          id="christmas-lima-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and scarlet cream
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A Christmas Lima bean field that finishes the Eye of the Goat bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Christmas Lima weeks — a warm-season belt of
              scarlet cream after the Eye of the Goat bean field, then dry jars and holiday stew sacks
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {christmasLimaBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Christmas%20Lima%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Christmas Lima bean field
            </a>
          </div>
        </section>

        {/* Dragon Tongue bean field — one job: pod rows after the Christmas Lima bean field, pull mornings + Dragon Tongue weeks */}
        <section
          id="dragon-tongue-bean-field"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[#0f1f16]"
        >
          <div className="pointer-events-none absolute -left-16 top-10 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
              Pod and purple streak
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-fraunces)] text-3xl font-semibold md:text-5xl">
              A Dragon Tongue bean field that finishes the Christmas Lima bean belt.
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--muted)] md:text-lg">
              Pod rows, pull mornings, and Dragon Tongue weeks — a warm-season belt of
              streaked yellow after the Christmas Lima bean field, then fresh snap baskets and dry jars
              that find the farm table once the pack-shed lane has done
              its quiet late-autumn work.
            </p>
            <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12">
              {dragonTongueBeanFieldWork.map((item, i) => (
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
              href="mailto:hello@northfield.farm?subject=Northfield%20Dragon%20Tongue%20bean%20field"
              className="mt-12 inline-block rounded-sm border border-[var(--line)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Ask about the Dragon Tongue bean field
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
