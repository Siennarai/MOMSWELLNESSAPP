import React, { useState, useEffect, useCallback } from "react";
import {
  Home, UtensilsCrossed, Dumbbell, Sparkles, BookOpen,
  Droplets, Beef, CheckCircle2, Circle, Moon, Heart,
  Flame, Wind, Waves, Activity, Leaf, Clock, ChevronRight,
  X, ShoppingCart, Sun, ArrowRight, Coffee, Soup, Plus, Minus
} from "lucide-react";

/* ============================================================
   PALETTE  — "Sage & Terracotta wellness retreat"
   warm, calming, nature-inspired, luxurious, not clinical
   ============================================================ */
const C = {
  cream: "#F6F1E7",
  paper: "#FBF8F1",
  sage: "#7C8B6F",
  sageDeep: "#5E6B52",
  sageSoft: "#E4E8DC",
  terracotta: "#C97B5A",
  terraSoft: "#F0DBCE",
  clay: "#A85A3E",
  honey: "#E0A458",
  ink: "#3A3A33",
  inkSoft: "#6B6B5F",
  rose: "#C98A8A",
  sky: "#8AA3B0",
  white: "#FFFFFF",
};

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY = "'Nunito Sans', system-ui, sans-serif";

/* ============================================================
   MEAL DATABASE
   Every meal: name, type, kcal, protein, time, recipe object
   Honors: vegetarian, no garlic, no bell peppers, cooked tomatoes
   only, no quinoa/chickpeas/pineapple/chia/eggplant.
   ============================================================ */

const MEALS = {
  // ---------- BREAKFASTS (lower fat, protein-forward) ----------
  b_skyr: {
    id: "b_skyr", type: "breakfast", name: "Vanilla Skyr & Berry Bowl",
    kcal: 320, protein: 28, time: "5 min", tag: "no-cook",
    desc: "Thick Icelandic skyr layered with warm berry compote and toasted oats.",
    ingredients: [
      "1 cup plain skyr (or Greek yogurt 0–2%)",
      "1/2 cup mixed berries (frozen, warmed)",
      "1/3 cup rolled oats, lightly toasted",
      "1 tsp honey",
      "1 tbsp ground flaxseed",
      "Pinch of cinnamon",
    ],
    steps: [
      "Warm the berries in a small pan for 2–3 min until jammy.",
      "Toast oats dry in a pan until fragrant, ~2 min.",
      "Spoon skyr into a bowl, swirl in honey and cinnamon.",
      "Top with warm berries, oats and flaxseed.",
    ],
    subs: "Swap skyr for a high-protein soy yogurt to keep it vegan.",
  },
  b_shake: {
    id: "b_shake", type: "breakfast", name: "Cozy Cocoa Protein Shake",
    kcal: 290, protein: 32, time: "3 min", tag: "shake",
    desc: "Your daily shake — chocolate, banana and a hint of cinnamon. Tastes like dessert.",
    ingredients: [
      "1 scoop chocolate or vanilla protein powder (~25 g protein)",
      "1 cup soy milk (highest-protein plant milk)",
      "1/2 frozen banana",
      "1 tbsp cocoa powder",
      "1 tbsp ground flaxseed",
      "Ice + pinch of cinnamon",
    ],
    steps: [
      "Add everything to a blender.",
      "Blend 30–45 seconds until creamy.",
      "Pour and enjoy cold, or warm gently for a cocoa-style drink.",
    ],
    subs: "Use pea protein for extra digestive ease; add 1/2 cup oats to make it a fuller meal.",
  },
  b_tofu_scramble: {
    id: "b_tofu_scramble", type: "breakfast", name: "Golden Turmeric Tofu Scramble",
    kcal: 340, protein: 30, time: "12 min", tag: "savory",
    desc: "Silky scrambled tofu with turmeric, spinach and warm flatbread — liver-friendly and filling.",
    ingredients: [
      "200 g firm tofu, crumbled",
      "1 big handful spinach",
      "1/2 tsp turmeric",
      "1/4 tsp cumin",
      "1 tbsp nutritional yeast",
      "1 small wholewheat flatbread",
      "Pinch of black salt (kala namak) for an 'eggy' note",
    ],
    steps: [
      "Crumble tofu into a non-stick pan over medium heat.",
      "Add turmeric, cumin, nutritional yeast and a splash of water.",
      "Cook 5–6 min, then fold in spinach until wilted.",
      "Warm the flatbread and serve alongside.",
    ],
    subs: "No garlic used — flavor comes from cumin & turmeric. Add a spoon of cooked tomato if you like.",
  },
  b_overnight_oats: {
    id: "b_overnight_oats", type: "breakfast", name: "Rice-Pudding Overnight Oats",
    kcal: 360, protein: 26, time: "5 min + overnight", tag: "make-ahead",
    desc: "Inspired by the rice pudding she loves — creamy, cinnamony, made the night before.",
    ingredients: [
      "1/2 cup rolled oats",
      "2/3 cup soy milk",
      "1/2 scoop vanilla protein powder",
      "2 tbsp Greek yogurt",
      "1/4 tsp cinnamon + pinch nutmeg",
      "1 tsp maple syrup, raisins to top",
    ],
    steps: [
      "Stir everything together in a jar.",
      "Refrigerate overnight.",
      "In the morning, top with raisins and a little extra cinnamon.",
    ],
    subs: "Warm it for 60 sec for a true rice-pudding feel.",
  },
  b_cottage_toast: {
    id: "b_cottage_toast", type: "breakfast", name: "Whipped Cottage Cheese Toast",
    kcal: 310, protein: 27, time: "6 min", tag: "savory",
    desc: "Whipped cottage cheese on sourdough with cucumber and a drizzle of olive oil.",
    ingredients: [
      "3/4 cup cottage cheese, whipped smooth",
      "1 slice hearty sourdough",
      "Cucumber ribbons",
      "Fresh dill + cracked pepper",
      "Light drizzle olive oil",
    ],
    steps: [
      "Blend cottage cheese until smooth and fluffy.",
      "Toast the sourdough.",
      "Spread, top with cucumber, dill and pepper.",
    ],
    subs: "Use whipped tofu + nutritional yeast for a vegan version.",
  },

  // ---------- LUNCHES ----------
  l_lentil_soup: {
    id: "l_lentil_soup", type: "lunch", name: "Cozy Red Lentil & Coconut Soup",
    kcal: 420, protein: 24, time: "25 min", tag: "soup",
    desc: "Velvety, golden, deeply comforting — and a quiet protein powerhouse.",
    ingredients: [
      "1 cup red lentils",
      "1 can light coconut milk",
      "1 carrot + 1 celery stalk, diced",
      "1 tsp ginger, grated",
      "1 tsp turmeric + 1 tsp cumin",
      "4 cups veg broth, squeeze of lime",
    ],
    steps: [
      "Soften carrot, celery and ginger in a pot, 5 min.",
      "Add spices, lentils, broth and coconut milk.",
      "Simmer 18–20 min until lentils break down.",
      "Blend half for creaminess; finish with lime.",
    ],
    subs: "Stir in spinach for extra greens. No garlic needed — ginger carries it.",
  },
  l_panini: {
    id: "l_panini", type: "lunch", name: "Caprese-Style Halloumi Panini",
    kcal: 470, protein: 31, time: "12 min", tag: "sandwich",
    desc: "Pressed panini with grilled halloumi, cooked tomato spread and basil.",
    ingredients: [
      "2 thick slices halloumi, grilled",
      "1 ciabatta roll",
      "2 tbsp cooked tomato / passata spread",
      "Fresh basil leaves",
      "Handful baby spinach",
      "Light brush of olive oil",
    ],
    steps: [
      "Grill halloumi slices until golden, 2 min each side.",
      "Spread cooked tomato inside the roll.",
      "Layer halloumi, basil and spinach.",
      "Press in a panini pan until crisp.",
    ],
    subs: "Swap halloumi for grilled tofu or a veggie patty.",
  },
  l_buddha: {
    id: "l_buddha", type: "lunch", name: "Edamame & Brown Rice Power Bowl",
    kcal: 450, protein: 28, time: "15 min", tag: "bowl",
    desc: "Warm brown rice, edamame, sesame tofu and a ginger-tahini drizzle.",
    ingredients: [
      "3/4 cup cooked brown rice",
      "1 cup shelled edamame",
      "100 g baked tofu cubes",
      "Shredded carrot + cucumber",
      "Ginger-tahini dressing (tahini, ginger, lime, soy)",
      "Sesame seeds",
    ],
    steps: [
      "Warm rice and edamame.",
      "Add tofu and fresh veg to the bowl.",
      "Whisk dressing and drizzle generously.",
      "Finish with sesame seeds.",
    ],
    subs: "Use farro instead of rice for variety (no quinoa).",
  },
  l_greek_pita: {
    id: "l_greek_pita", type: "lunch", name: "Greek Pita & Tzatziki Plate",
    kcal: 440, protein: 26, time: "10 min", tag: "mezze",
    desc: "Warm pita, cool tzatziki, marinated white beans and crisp salad — a favorite combo.",
    ingredients: [
      "1 wholewheat pita, warmed",
      "1/2 cup tzatziki (Greek yogurt, cucumber, dill)",
      "3/4 cup white beans, herb-marinated",
      "Cherry tomatoes (cooked/roasted), olives",
      "Cucumber + romaine",
    ],
    steps: [
      "Roast the tomatoes 8 min so they're cooked, not raw.",
      "Toss beans with lemon, olive oil and dill.",
      "Warm the pita and assemble the plate.",
    ],
    subs: "Add grilled halloumi for more protein. No garlic in the tzatziki — dill and lemon do the work.",
  },
  l_dal: {
    id: "l_dal", type: "lunch", name: "Comforting Spinach Dal with Rice",
    kcal: 430, protein: 25, time: "30 min", tag: "indian",
    desc: "Soft yellow dal folded with spinach, warm spices and basmati — pure comfort.",
    ingredients: [
      "1 cup yellow moong dal",
      "2 handfuls spinach",
      "1 tsp ginger, 1 tsp cumin seeds",
      "1/2 tsp turmeric",
      "Cooked tomato, 3/4 cup basmati rice",
      "Fresh coriander + lemon",
    ],
    steps: [
      "Simmer dal with turmeric and ginger until soft, 20 min.",
      "Bloom cumin seeds in a little oil, add cooked tomato.",
      "Stir the tempering into the dal with spinach.",
      "Serve over basmati with coriander and lemon.",
    ],
    subs: "Use red lentils if moong isn't available.",
  },

  // ---------- DINNERS (cozy comfort food) ----------
  d_pasta: {
    id: "d_pasta", type: "dinner", name: "Creamy Tomato & White Bean Pasta",
    kcal: 520, protein: 27, time: "20 min", tag: "italian",
    desc: "Silky cooked-tomato sauce blended with white beans for a high-protein, creamy bowl.",
    ingredients: [
      "100 g pasta (penne or rigatoni)",
      "1 cup white beans, blended into the sauce",
      "1.5 cups passata / cooked tomato",
      "Splash of cream or cashew cream",
      "Fresh basil, oregano",
      "Parmesan or vegan parm",
    ],
    steps: [
      "Cook pasta to al dente.",
      "Simmer passata with herbs 8 min.",
      "Blend in white beans + cream until silky.",
      "Toss with pasta, top with parmesan and basil.",
    ],
    subs: "Use lentil or chickpea-free protein pasta for extra grams.",
  },
  d_curry: {
    id: "d_curry", type: "dinner", name: "Paneer & Pea Tikka Masala",
    kcal: 540, protein: 33, time: "30 min", tag: "indian",
    desc: "Golden paneer in a cooked-tomato cashew gravy with peas, served over rice.",
    ingredients: [
      "180 g paneer, cubed (or tofu)",
      "1 cup peas",
      "1.5 cups cooked tomato gravy",
      "2 tbsp cashew cream",
      "Garam masala, ginger, cumin",
      "3/4 cup basmati rice",
    ],
    steps: [
      "Pan-sear paneer until golden; set aside.",
      "Simmer cooked-tomato gravy with spices + ginger, 10 min.",
      "Stir in cashew cream and peas.",
      "Return paneer; warm through and serve over rice.",
    ],
    subs: "Tofu makes it vegan; both hit the protein target.",
  },
  d_stirfry: {
    id: "d_stirfry", type: "dinner", name: "Ginger-Sesame Tofu Stir-Fry",
    kcal: 480, protein: 30, time: "18 min", tag: "asian",
    desc: "Crispy tofu, broccoli and snap peas in a glossy ginger-sesame sauce over rice.",
    ingredients: [
      "200 g firm tofu, pressed & cubed",
      "Broccoli, snap peas, bok choy",
      "Ginger-sesame-soy sauce (no garlic)",
      "1 tsp cornstarch to thicken",
      "3/4 cup jasmine rice",
      "Sesame seeds + spring onion",
    ],
    steps: [
      "Crisp tofu in a hot pan until golden on all sides.",
      "Stir-fry veg 4–5 min, keeping them bright.",
      "Add sauce + cornstarch slurry; toss to glaze.",
      "Serve over rice with sesame and spring onion.",
    ],
    subs: "Swap rice for soba noodles for a change.",
  },
  d_flatbread: {
    id: "d_flatbread", type: "dinner", name: "Whipped Feta & Spinach Flatbread",
    kcal: 500, protein: 26, time: "22 min", tag: "flatbread",
    desc: "Crisp flatbread with whipped feta, wilted spinach and roasted cooked tomatoes.",
    ingredients: [
      "1 wholewheat flatbread base",
      "3/4 cup whipped feta (feta + Greek yogurt)",
      "Wilted spinach",
      "Roasted cherry tomatoes (cooked)",
      "Pine nuts, oregano, lemon zest",
    ],
    steps: [
      "Whip feta with yogurt until smooth.",
      "Spread on flatbread; add spinach and roasted tomatoes.",
      "Bake 10–12 min at 200°C until edges crisp.",
      "Finish with pine nuts, oregano and lemon zest.",
    ],
    subs: "Add a side of white beans tossed in lemon for more protein.",
  },
  d_veggie_burger: {
    id: "d_veggie_burger", type: "dinner", name: "Black Bean Veggie Burger & Slaw",
    kcal: 510, protein: 29, time: "20 min", tag: "burger",
    desc: "Hearty black bean patty on a soft bun with a creamy yogurt slaw.",
    ingredients: [
      "1 black bean veggie patty (high-protein)",
      "1 soft wholegrain bun",
      "Greek-yogurt slaw (cabbage, carrot, dill)",
      "Sliced avocado",
      "Cooked-tomato relish",
    ],
    steps: [
      "Cook the patty until crisp and hot through.",
      "Toss slaw with Greek yogurt, lemon and dill.",
      "Build the burger with avocado and relish.",
    ],
    subs: "Wrap in lettuce or a flatbread instead of a bun.",
  },
  d_miso_soup: {
    id: "d_miso_soup", type: "dinner", name: "Miso Noodle Soup with Tofu",
    kcal: 460, protein: 28, time: "20 min", tag: "soup",
    desc: "Soothing miso broth with udon, silken tofu, greens and mushrooms — gentle on digestion.",
    ingredients: [
      "2 tbsp white miso paste",
      "150 g silken tofu, cubed",
      "Udon or soba noodles",
      "Shiitake mushrooms + bok choy",
      "Ginger, spring onion, nori",
    ],
    steps: [
      "Simmer mushrooms and ginger in broth, 6 min.",
      "Add noodles and greens; cook till tender.",
      "Off heat, whisk in miso (don't boil it).",
      "Add tofu, top with spring onion and nori.",
    ],
    subs: "Add edamame for an extra protein lift.",
  },

  // ---------- SNACKS ----------
  s_yogurt: {
    id: "s_yogurt", type: "snack", name: "Honey-Cinnamon Greek Yogurt",
    kcal: 180, protein: 18, time: "2 min", tag: "sweet",
    desc: "Thick Greek yogurt, a little honey, cinnamon and crushed walnuts.",
    ingredients: ["1 cup Greek yogurt", "1 tsp honey", "Cinnamon", "1 tbsp walnuts"],
    steps: ["Stir and enjoy. That's it."],
    subs: "Soy yogurt + protein powder for vegan.",
  },
  s_edamame: {
    id: "s_edamame", type: "snack", name: "Sea-Salt Steamed Edamame",
    kcal: 150, protein: 17, time: "6 min", tag: "savory",
    desc: "Warm edamame pods with flaky sea salt — fiber, protein and a satisfying ritual.",
    ingredients: ["1.5 cups edamame in pods", "Flaky sea salt", "Squeeze of lime"],
    steps: ["Steam 5 min.", "Toss with salt and lime."],
    subs: "Sprinkle with a little chili flake if you like warmth.",
  },
  s_cottage: {
    id: "s_cottage", type: "snack", name: "Cottage Cheese & Cucumber Cups",
    kcal: 140, protein: 16, time: "3 min", tag: "savory",
    desc: "Crisp cucumber rounds topped with herby cottage cheese.",
    ingredients: ["3/4 cup cottage cheese", "Cucumber", "Dill + pepper"],
    steps: ["Spoon cottage cheese onto cucumber rounds.", "Top with dill."],
    subs: "Whipped tofu works for vegan.",
  },
  s_shake: {
    id: "s_shake", type: "snack", name: "Berry Vanilla Protein Shake",
    kcal: 200, protein: 26, time: "3 min", tag: "shake",
    desc: "A lighter shake option for afternoons — berries, vanilla protein, soy milk.",
    ingredients: ["1 scoop vanilla protein", "1 cup soy milk", "1/2 cup frozen berries"],
    steps: ["Blend until smooth."],
    subs: "Add a handful of spinach — you won't taste it.",
  },
  s_hummus: {
    id: "s_hummus", type: "snack", name: "White Bean Dip & Veg",
    kcal: 190, protein: 12, time: "5 min", tag: "savory",
    desc: "Creamy white bean dip (no chickpeas) with crunchy veg and warm pita strips.",
    ingredients: ["1 cup white beans", "Tahini, lemon, cumin", "Cucumber + carrot", "Pita strips"],
    steps: ["Blend beans, tahini, lemon and cumin.", "Serve with veg and pita."],
    subs: "Thin with a little olive oil for dipping.",
  },
};

const mealList = (type) => Object.values(MEALS).filter((m) => m.type === type);

/* The default weekly calendar (ids) */
const WEEK = [
  { day: "Monday", b: "b_shake", l: "l_lentil_soup", d: "d_pasta", s: "s_edamame" },
  { day: "Tuesday", b: "b_tofu_scramble", l: "l_greek_pita", d: "d_stirfry", s: "s_yogurt" },
  { day: "Wednesday", b: "b_skyr", l: "l_buddha", d: "d_curry", s: "s_shake" },
  { day: "Thursday", b: "b_overnight_oats", l: "l_panini", d: "d_flatbread", s: "s_cottage" },
  { day: "Friday", b: "b_cottage_toast", l: "l_dal", d: "d_veggie_burger", s: "s_hummus" },
  { day: "Saturday", b: "b_shake", l: "l_lentil_soup", d: "d_miso_soup", s: "s_yogurt" },
  { day: "Sunday", b: "b_skyr", l: "l_greek_pita", d: "d_pasta", s: "s_edamame" },
];

/* ============================================================
   FITNESS WEEK — longevity-focused, not overwhelming
   ============================================================ */
const FITNESS = [
  { day: "Monday", focus: "Strength + Pilates", icon: "dumbbell", color: C.terracotta,
    items: ["Full-body strength, 30–40 min (legs + back focus)", "Pilates class at the studio", "5-min mobility cool-down"],
    note: "Strength is your anti-aging anchor — it protects muscle, bone and metabolism." },
  { day: "Tuesday", focus: "Zone 2 Cardio", icon: "wind", color: C.sky,
    items: ["30–40 min brisk walk, easy bike, or swim", "Keep it conversational — you can still talk", "Optional 10-min evening stretch"],
    note: "Zone 2 builds your aerobic base and supports steady, all-day energy." },
  { day: "Wednesday", focus: "Strength + Mobility", icon: "dumbbell", color: C.terracotta,
    items: ["Upper-body & core strength, 30 min", "10-min hip + shoulder mobility flow"],
    note: "Two strength days a week is the sweet spot for recomposition." },
  { day: "Thursday", focus: "Pilates + Gentle Yoga", icon: "waves", color: C.sage,
    items: ["Pilates class at the studio", "15-min restorative yoga in the evening"],
    note: "Yoga calms the nervous system and supports recovery and sleep." },
  { day: "Friday", focus: "HIIT (short & joyful)", icon: "flame", color: C.honey,
    items: ["15–20 min: 30s effort / 90s easy, repeat 6–8x", "Low-impact options: bike, rower, fast incline walk"],
    note: "Short bursts boost heart health & fat-burning without wrecking recovery." },
  { day: "Saturday", focus: "Long Zone 2 + Fun", icon: "wind", color: C.sky,
    items: ["45–60 min nature walk, hike or leisurely cycle", "Make it social or scenic — movement you enjoy"],
    note: "The best longevity exercise is the one you'll keep doing." },
  { day: "Sunday", focus: "Rest & Recovery", icon: "moon", color: C.rose,
    items: ["Full rest or a gentle 20-min stroll", "Foam roll, stretch, warm bath", "Prep meals for the week ahead"],
    note: "Recovery is when muscle is actually built. Rest is productive." },
];

/* ============================================================
   EDUCATION CARDS — the "why"
   ============================================================ */
const LEARN = [
  { id: "protein", icon: "beef", color: C.terracotta, title: "Why Protein Matters More After 50",
    body: "After menopause, the body becomes a little less efficient at building muscle — a phenomenon called anabolic resistance. Eating enough protein (and spreading it across the day) directly fights age-related muscle loss, keeps you strong and mobile, supports a steady metabolism, and helps you feel full and satisfied. Aiming for ~25–35 g per meal makes the 100 g daily goal easy and keeps muscles well-fed." },
  { id: "zone2", icon: "wind", color: C.sky, title: "Zone 2 Cardio, Explained Simply",
    body: "Zone 2 is gentle, steady cardio where you can still hold a conversation — think brisk walking or easy cycling. It trains your body to burn fat efficiently, builds the foundation of your heart and lung fitness, and leaves you energized rather than drained. It's one of the most powerful (and pleasant) tools for long-term health and energy." },
  { id: "strength", icon: "dumbbell", color: C.terracotta, title: "Strength Training & Recomposition",
    body: "Lifting weights tells your body to keep and build muscle even while you lose fat — that's 'body recomposition.' More muscle means a higher resting metabolism, stronger bones, better balance, and a body that handles daily life with ease. Two to three focused sessions a week is plenty; progress comes from consistency, not punishing workouts." },
  { id: "hiit", icon: "flame", color: C.honey, title: "What HIIT Actually Does",
    body: "HIIT alternates short bursts of effort with easy recovery. It improves heart health and insulin sensitivity in a time-efficient way and keeps your metabolism humming after you finish. The key at 50 is to keep sessions short and low-impact — quality over quantity. Once or twice a week is the sweet spot." },
  { id: "recovery", icon: "moon", color: C.rose, title: "Recovery: Where the Magic Happens",
    body: "Your body doesn't get stronger during a workout — it gets stronger while recovering from one. Sleep, rest days, gentle movement, hydration and protein all help muscles repair and grow. Prioritizing recovery means more energy, fewer injuries, and steadier progress over the long run." },
  { id: "alcohol", icon: "leaf", color: C.sage, title: "Alcohol, Recovery & Your Body — Gently",
    body: "This is shared with warmth, never judgment. Alcohol can make it harder for the body to build muscle and recover, can disrupt deep sleep, and asks a lot of the liver — the organ that quietly does so much for energy, mood and metabolism. Even small, gradual reductions can pay off: better sleep, steadier energy, easier fat loss and a liver that gets room to heal. Pairing drinks with water, having a few alcohol-free days each week, and leaning on the cozy meals here are kind, doable first steps. Progress, not perfection." },
  { id: "liver", icon: "heart", color: C.terracotta, title: "Loving Your Liver",
    body: "The liver is remarkably resilient and can heal with support. Foods that help include leafy greens, cruciferous veg (broccoli), beans and lentils, berries, turmeric, and plenty of water. Staying hydrated, moving daily, prioritizing sleep, and easing up on alcohol all give the liver space to repair. Many of the meals in this plan were chosen with exactly this in mind." },
  { id: "sleep", icon: "moon", color: C.sky, title: "Sleep — Your Secret Weapon",
    body: "Good sleep regulates appetite hormones, sharpens mood, and is when muscle repair peaks. A calming wind-down (dim lights, no screens, a warm herbal tea), a consistent bedtime, and a cool dark room work wonders. If evenings feel restless, gentle yoga or a warm bath can ease the transition." },
];

/* ============================================================
   STORAGE HELPERS  (localStorage, with try/catch)
   ============================================================ */
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

function loadDay() {
  try {
    const raw = localStorage.getItem(`day:${todayKey()}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function saveDay(data) {
  try {
    localStorage.setItem(`day:${todayKey()}`, JSON.stringify(data));
  } catch (e) {
    /* fail silently */
  }
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
const iconFor = (name, props = {}) => {
  const map = { dumbbell: Dumbbell, wind: Wind, waves: Waves, flame: Flame,
    moon: Moon, beef: Beef, leaf: Leaf, heart: Heart };
  const Cmp = map[name] || Activity;
  return <Cmp {...props} />;
};

function ProgressRing({ value, max, size = 92, stroke = 9, color, label, sub }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.sageSoft} strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.4,0,.2,1)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: C.ink, fontWeight: 600, lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 10, color: C.inkSoft }}>/ {max}</span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.ink }}>{label}</div>
        <div style={{ fontSize: 10, color: C.inkSoft }}>{sub}</div>
      </div>
    </div>
  );
}

/* ============================================================
   MEAL MODAL
   ============================================================ */
function MealModal({ meal, onClose }) {
  if (!meal) return null;
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(58,58,51,0.45)", backdropFilter: "blur(4px)",
      zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeIn .2s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: C.paper, width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto",
        borderRadius: "26px 26px 0 0", padding: "26px 24px 90px", boxShadow: "0 -10px 50px rgba(0,0,0,.25)",
        animation: "slideUp .3s cubic-bezier(.4,0,.2,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
            color: C.terracotta }}>{meal.type} · {meal.tag}</span>
          <button onClick={onClose} style={{ background: C.sageSoft, border: "none", borderRadius: 999,
            width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer" }}>
            <X size={18} color={C.sageDeep} />
          </button>
        </div>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 27, color: C.ink, margin: "2px 0 8px", lineHeight: 1.1 }}>{meal.name}</h2>
        <p style={{ color: C.inkSoft, fontSize: 15, lineHeight: 1.5, margin: "0 0 16px" }}>{meal.desc}</p>

        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {[
            { label: "Protein", val: `${meal.protein} g`, color: C.terracotta, ic: <Beef size={16} /> },
            { label: "Calories", val: meal.kcal, color: C.sage, ic: <Flame size={16} /> },
            { label: "Time", val: meal.time, color: C.sky, ic: <Clock size={16} /> },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, background: C.white, borderRadius: 16, padding: "12px 8px",
              textAlign: "center", border: `1px solid ${C.sageSoft}` }}>
              <div style={{ color: s.color, display: "flex", justifyContent: "center", marginBottom: 4 }}>{s.ic}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.ink }}>{s.val}</div>
              <div style={{ fontSize: 11, color: C.inkSoft }}>{s.label}</div>
            </div>
          ))}
        </div>

        <Section title="Ingredients" icon={<ShoppingCart size={16} color={C.sage} />}>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {meal.ingredients.map((ing, i) => (
              <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "7px 0",
                borderBottom: i < meal.ingredients.length - 1 ? `1px solid ${C.sageSoft}` : "none" }}>
                <Leaf size={14} color={C.sage} style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: 14.5, color: C.ink }}>{ing}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="How to make it" icon={<Soup size={16} color={C.terracotta} />}>
          <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none", counterReset: "step" }}>
            {meal.steps.map((st, i) => (
              <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 999, background: C.terraSoft,
                  color: C.clay, fontWeight: 800, fontSize: 13, display: "grid", placeItems: "center" }}>{i + 1}</span>
                <span style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.5, paddingTop: 2 }}>{st}</span>
              </li>
            ))}
          </ol>
        </Section>

        <div style={{ background: C.sageSoft, borderRadius: 16, padding: "14px 16px", marginTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1,
            color: C.sageDeep, marginBottom: 4 }}>Make it yours</div>
          <p style={{ margin: 0, fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{meal.subs}</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        {icon}
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: C.ink, margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* meal pill used in calendar + dashboard */
function MealPill({ id, slot, onClick }) {
  const m = MEALS[id];
  if (!m) return null;
  const slotColor = { breakfast: C.honey, lunch: C.sage, dinner: C.terracotta, snack: C.sky }[m.type];
  return (
    <button onClick={() => onClick(m)} style={{
      width: "100%", textAlign: "left", background: C.white, border: `1px solid ${C.sageSoft}`,
      borderRadius: 14, padding: "11px 13px", cursor: "pointer", display: "flex",
      alignItems: "center", gap: 11, transition: "transform .15s, box-shadow .15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(124,139,111,.18)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
      <div style={{ width: 8, alignSelf: "stretch", borderRadius: 6, background: slotColor, minHeight: 38 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {slot && <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: slotColor }}>{slot}</div>}
        <div style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, lineHeight: 1.2,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.name}</div>
        <div style={{ fontSize: 11.5, color: C.inkSoft }}>{m.protein} g protein · {m.kcal} kcal</div>
      </div>
      <ChevronRight size={18} color={C.inkSoft} style={{ flexShrink: 0 }} />
    </button>
  );
}

/* ============================================================
   AFFIRMATIONS
   ============================================================ */
const AFFIRMATIONS = [
  "Strong, steady, and showing up for yourself today. 🌿",
  "Every nourishing choice is a gift to your future self.",
  "Rest is part of the work. Be gentle with yourself.",
  "You're building a body that carries you through a long, full life.",
  "Small steps, repeated kindly, become big changes.",
  "Your liver, your muscles, your mind — all healing with each good day.",
  "Progress, not perfection. You're exactly where you need to be.",
];

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [tab, setTab] = useState("home");
  const [modalMeal, setModalMeal] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // tracked state for today
  const [water, setWater] = useState(0);          // glasses, goal 8
  const [protein, setProtein] = useState(0);      // grams, goal 100
  const [habits, setHabits] = useState({});        // {id:true}
  const [meals, setMeals] = useState({});          // {breakfast:true,...}

  const affirmation = AFFIRMATIONS[new Date().getDate() % AFFIRMATIONS.length];

  // load persisted
  useEffect(() => {
    const d = loadDay();
    if (d) {
      setWater(d.water || 0);
      setProtein(d.protein || 0);
      setHabits(d.habits || {});
      setMeals(d.meals || {});
    }
    setLoaded(true);
  }, []);

  // persist whenever something changes (after initial load)
  useEffect(() => {
    if (loaded) saveDay({ water, protein, habits, meals });
  }, [water, protein, habits, meals, loaded]);

  const toggleHabit = (id) => setHabits((h) => ({ ...h, [id]: !h[id] }));
  const toggleMeal = (slot) => setMeals((m) => ({ ...m, [slot]: !m[slot] }));

  const HABITS = [
    { id: "protein", label: "Hit my protein goal", icon: <Beef size={18} /> },
    { id: "move", label: "Moved my body", icon: <Activity size={18} /> },
    { id: "veg", label: "Ate greens or veg", icon: <Leaf size={18} /> },
    { id: "sleep", label: "Wind-down before bed", icon: <Moon size={18} /> },
    { id: "water", label: "Stayed hydrated", icon: <Droplets size={18} /> },
    { id: "kind", label: "Was kind to myself", icon: <Heart size={18} /> },
  ];

  const habitsDone = Object.values(habits).filter(Boolean).length;

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.cream, minHeight: "100vh",
      maxWidth: 600, margin: "0 auto", position: "relative", color: C.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Nunito+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(30px); opacity:.6 } to { transform: translateY(0); opacity:1 } }
        @keyframes popIn { from { transform: scale(.96); opacity:0 } to { transform: scale(1); opacity:1 } }
        ::-webkit-scrollbar { width: 0 }
      `}</style>

      <div style={{ padding: "0 18px 110px", animation: "fadeIn .4s ease" }}>
        {tab === "home" && (
          <HomeView {...{ affirmation, water, setWater, protein, setProtein, habits, toggleHabit,
            HABITS, habitsDone, meals, toggleMeal, setModalMeal }} />
        )}
        {tab === "meals" && <MealsView setModalMeal={setModalMeal} />}
        {tab === "fitness" && <FitnessView />}
        {tab === "wellness" && <WellnessView />}
        {tab === "learn" && <LearnView />}
      </div>

      <MealModal meal={modalMeal} onClose={() => setModalMeal(null)} />

      {/* Bottom nav */}
      <nav style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 600, background: "rgba(251,248,241,.92)", backdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.sageSoft}`, display: "flex", justifyContent: "space-around",
        padding: "8px 4px 10px", zIndex: 50 }}>
        {[
          { id: "home", label: "Today", icon: Home },
          { id: "meals", label: "Meals", icon: UtensilsCrossed },
          { id: "fitness", label: "Move", icon: Dumbbell },
          { id: "wellness", label: "Wellness", icon: Sparkles },
          { id: "learn", label: "Learn", icon: BookOpen },
        ].map((n) => {
          const active = tab === n.id;
          const Ic = n.icon;
          return (
            <button key={n.id} onClick={() => setTab(n.id)} style={{
              background: "none", border: "none", cursor: "pointer", display: "flex",
              flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 8px",
              flex: 1 }}>
              <div style={{ background: active ? C.sage : "transparent", borderRadius: 999,
                padding: "6px 14px", transition: "background .2s" }}>
                <Ic size={20} color={active ? C.white : C.inkSoft} />
              </div>
              <span style={{ fontSize: 10.5, fontWeight: active ? 800 : 600,
                color: active ? C.sageDeep : C.inkSoft }}>{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ---------------- HOME / TODAY ---------------- */
function HomeView({ affirmation, water, setWater, protein, setProtein, habits, toggleHabit,
  HABITS, habitsDone, meals, toggleMeal, setModalMeal }) {
  const today = WEEK[(new Date().getDay() + 6) % 7]; // Mon=0
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      <header style={{ paddingTop: 26, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, color: C.sage, marginBottom: 2 }}>
          <Sun size={16} /><span style={{ fontSize: 13, fontWeight: 700 }}>{greeting}, beautiful</span>
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, margin: "2px 0 0", lineHeight: 1.05, color: C.ink }}>
          Today's a fresh, gentle start.
        </h1>
      </header>

      {/* Affirmation banner */}
      <div style={{ background: `linear-gradient(135deg, ${C.sage}, ${C.sageDeep})`, borderRadius: 22,
        padding: "20px 22px", color: C.white, marginBottom: 18, position: "relative", overflow: "hidden",
        boxShadow: "0 10px 30px rgba(94,107,82,.3)" }}>
        <Leaf size={90} style={{ position: "absolute", right: -16, bottom: -22, opacity: .14 }} />
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
          opacity: .85, marginBottom: 6 }}>Daily intention</div>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 19, lineHeight: 1.35, margin: 0, fontWeight: 500 }}>{affirmation}</p>
      </div>

      {/* Tracking rings */}
      <div style={{ background: C.paper, borderRadius: 22, padding: "20px 16px", marginBottom: 16,
        border: `1px solid ${C.sageSoft}`, display: "flex", justifyContent: "space-around" }}>
        <ProgressRing value={protein} max={100} color={C.terracotta} label="Protein" sub="grams" />
        <ProgressRing value={water} max={8} color={C.sky} label="Water" sub="glasses" />
        <ProgressRing value={habitsDone} max={6} color={C.sage} label="Habits" sub="done" />
      </div>

      {/* Quick add protein + water */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <Stepper label="Add protein" unit="g" color={C.terracotta} icon={<Beef size={18} />}
          onMinus={() => setProtein((p) => Math.max(0, p - 10))}
          onPlus={() => setProtein((p) => p + 10)} value={`${protein} g`} />
        <Stepper label="Add water" unit="glass" color={C.sky} icon={<Droplets size={18} />}
          onMinus={() => setWater((w) => Math.max(0, w - 1))}
          onPlus={() => setWater((w) => Math.min(12, w + 1))} value={`${water} / 8`} />
      </div>

      {/* Today's meals */}
      <SectionHeader title="Today's menu" subtitle={today.day} />
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 22 }}>
        {[
          { slot: "breakfast", id: today.b, label: "Breakfast" },
          { slot: "lunch", id: today.l, label: "Lunch" },
          { slot: "dinner", id: today.d, label: "Dinner" },
          { slot: "snack", id: today.s, label: "Snack" },
        ].map((row) => (
          <div key={row.slot} style={{ display: "flex", gap: 9, alignItems: "stretch" }}>
            <button onClick={() => toggleMeal(row.slot)} style={{ background: "none", border: "none",
              cursor: "pointer", display: "grid", placeItems: "center", padding: 0 }}>
              {meals[row.slot]
                ? <CheckCircle2 size={26} color={C.sage} />
                : <Circle size={26} color={C.sageSoft} />}
            </button>
            <div style={{ flex: 1, opacity: meals[row.slot] ? .6 : 1, transition: "opacity .2s" }}>
              <MealPill id={row.id} slot={row.label} onClick={setModalMeal} />
            </div>
          </div>
        ))}
      </div>

      {/* Habit checklist */}
      <SectionHeader title="Daily habits" subtitle="Tiny wins add up" />
      <div style={{ background: C.paper, borderRadius: 22, padding: 8, border: `1px solid ${C.sageSoft}` }}>
        {HABITS.map((h, i) => {
          const done = habits[h.id];
          return (
            <button key={h.id} onClick={() => toggleHabit(h.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none",
              border: "none", borderBottom: i < HABITS.length - 1 ? `1px solid ${C.sageSoft}` : "none",
              padding: "13px 12px", cursor: "pointer", textAlign: "left" }}>
              <span style={{ color: done ? C.sage : C.inkSoft, display: "grid", placeItems: "center",
                width: 34, height: 34, borderRadius: 12, background: done ? C.sageSoft : C.cream,
                transition: "all .2s" }}>{h.icon}</span>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 700,
                color: done ? C.inkSoft : C.ink, textDecoration: done ? "line-through" : "none" }}>{h.label}</span>
              {done ? <CheckCircle2 size={22} color={C.sage} /> : <Circle size={22} color={C.sageSoft} />}
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 22, color: C.inkSoft, fontSize: 13 }}>
        <Heart size={14} color={C.rose} style={{ verticalAlign: "middle", marginRight: 5 }} />
        Made with love. Your progress saves automatically.
      </div>
    </>
  );
}

function Stepper({ label, value, onPlus, onMinus, color, icon }) {
  return (
    <div style={{ flex: 1, background: C.paper, borderRadius: 18, padding: "13px 12px",
      border: `1px solid ${C.sageSoft}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, color, marginBottom: 9 }}>
        {icon}<span style={{ fontSize: 12.5, fontWeight: 800, color: C.ink }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <button onClick={onMinus} style={stepBtn(C.cream, C.inkSoft)}><Minus size={16} /></button>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontWeight: 600, color: C.ink }}>{value}</span>
        <button onClick={onPlus} style={stepBtn(color, C.white)}><Plus size={16} /></button>
      </div>
    </div>
  );
}
const stepBtn = (bg, fg) => ({ width: 34, height: 34, borderRadius: 12, background: bg, color: fg,
  border: "none", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 });

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, margin: 0, color: C.ink }}>{title}</h2>
      {subtitle && <span style={{ fontSize: 13, fontWeight: 700, color: C.sage }}>{subtitle}</span>}
    </div>
  );
}

/* ---------------- MEALS ---------------- */
function MealsView({ setModalMeal }) {
  const [view, setView] = useState("calendar"); // calendar | swaps | grocery
  return (
    <>
      <header style={{ paddingTop: 26, marginBottom: 16 }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, margin: 0, color: C.ink }}>Nourishment</h1>
        <p style={{ color: C.inkSoft, margin: "4px 0 0", fontSize: 15 }}>Cozy, high-protein, plant-based meals you'll look forward to.</p>
      </header>

      <div style={{ display: "flex", gap: 7, background: C.paper, padding: 5, borderRadius: 16,
        marginBottom: 18, border: `1px solid ${C.sageSoft}` }}>
        {[["calendar", "Weekly Plan"], ["swaps", "Swap Options"], ["grocery", "Grocery & Prep"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} style={{
            flex: 1, padding: "9px 4px", borderRadius: 12, border: "none", cursor: "pointer",
            fontSize: 12.5, fontWeight: 800, background: view === k ? C.sage : "transparent",
            color: view === k ? C.white : C.inkSoft, transition: "all .2s" }}>{l}</button>
        ))}
      </div>

      {view === "calendar" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "popIn .3s ease" }}>
          {WEEK.map((d) => {
            const dayProtein = MEALS[d.b].protein + MEALS[d.l].protein + MEALS[d.d].protein + MEALS[d.s].protein;
            return (
              <div key={d.day}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 9 }}>
                  <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 19, margin: 0, color: C.sageDeep }}>{d.day}</h3>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.terracotta,
                    background: C.terraSoft, padding: "3px 10px", borderRadius: 999 }}>{dayProtein} g protein</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <MealPill id={d.b} slot="Breakfast" onClick={setModalMeal} />
                  <MealPill id={d.l} slot="Lunch" onClick={setModalMeal} />
                  <MealPill id={d.d} slot="Dinner" onClick={setModalMeal} />
                  <MealPill id={d.s} slot="Snack" onClick={setModalMeal} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "swaps" && (
        <div style={{ animation: "popIn .3s ease" }}>
          {[
            ["breakfast", "Breakfast swaps", "Lower-fat & protein-first, perfect after a workout", C.honey],
            ["lunch", "Lunch swaps", "Soups, sandwiches & bowls to mix and match", C.sage],
            ["dinner", "Cozy dinner alternatives", "Warm, comforting, satisfying", C.terracotta],
            ["snack", "High-protein snacks", "Quick grabs that keep you full", C.sky],
          ].map(([type, title, sub, color]) => (
            <div key={type} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, margin: 0, color: C.ink }}>{title}</h3>
              </div>
              <p style={{ fontSize: 13, color: C.inkSoft, margin: "0 0 11px 18px" }}>{sub}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {mealList(type).map((m) => <MealPill key={m.id} id={m.id} onClick={setModalMeal} />)}
              </div>
            </div>
          ))}

          {/* takeout swaps */}
          <div style={{ background: C.paper, borderRadius: 20, padding: "18px 18px", border: `1px solid ${C.sageSoft}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Coffee size={18} color={C.clay} />
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 19, margin: 0, color: C.ink }}>Smart takeout swaps</h3>
            </div>
            {[
              ["Indian", "Dal, paneer tikka or saag with brown rice — skip the cream-heavy korma.", "Big protein from lentils & paneer."],
              ["Greek", "Veggie gyro plate with tzatziki, white beans & salad in a pita.", "Easy 25–30 g protein."],
              ["Italian", "Tomato-based pasta with white beans or a bean-rich minestrone.", "Choose marinara over Alfredo."],
              ["Asian", "Tofu stir-fry, edamame, miso soup & steamed (not fried) sides.", "Steamed > deep-fried for the liver."],
            ].map(([cuisine, what, why]) => (
              <div key={cuisine} style={{ padding: "11px 0", borderBottom: `1px solid ${C.sageSoft}` }}>
                <div style={{ fontWeight: 800, fontSize: 14.5, color: C.sageDeep }}>{cuisine}</div>
                <div style={{ fontSize: 14, color: C.ink, margin: "2px 0" }}>{what}</div>
                <div style={{ fontSize: 12.5, color: C.terracotta, fontWeight: 700 }}>✓ {why}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "grocery" && <GroceryView />}
    </>
  );
}

function GroceryView() {
  const groups = [
    { title: "Protein heroes", color: C.terracotta, items: ["Firm tofu & silken tofu", "Paneer", "Halloumi & feta", "Greek yogurt & skyr", "Cottage cheese", "Edamame (shelled & pods)", "Red lentils, moong dal, white beans", "Black bean veggie patties", "Protein powder (vanilla & chocolate)"] },
    { title: "Grains & cozy carbs", color: C.honey, items: ["Rolled oats", "Basmati & brown rice", "Pasta (penne/rigatoni)", "Udon & soba noodles", "Wholewheat pita & flatbread", "Sourdough & ciabatta"] },
    { title: "Produce", color: C.sage, items: ["Spinach & romaine", "Broccoli, snap peas, bok choy", "Carrots, celery, cucumber", "Cherry tomatoes (to roast)", "Bananas & mixed berries", "Ginger, fresh herbs (dill, basil, coriander)"] },
    { title: "Pantry & flavor", color: C.sky, items: ["Light coconut milk", "Passata / cooked tomato", "Tahini", "Soy milk (high-protein)", "Miso paste", "Soy sauce, sesame oil & seeds", "Turmeric, cumin, garam masala, cinnamon", "Olive oil, honey, maple syrup", "Walnuts, pine nuts, ground flaxseed"] },
  ];
  const prep = [
    "Cook a big pot of brown rice & a batch of basmati — portion into containers.",
    "Press & bake a tray of tofu cubes for fast bowls and stir-fries.",
    "Simmer a double batch of red lentil soup; it freezes beautifully.",
    "Whip a tub of feta and a tub of cottage cheese for quick toasts & flatbreads.",
    "Pre-mix overnight oats jars for 3 mornings.",
    "Roast a tray of cherry tomatoes (so they're always 'cooked' & ready).",
    "Portion protein-shake dry mixes into jars — just add milk & blend.",
  ];
  return (
    <div style={{ animation: "popIn .3s ease" }}>
      <SectionHeader title="Grocery list" subtitle="One calm shop" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
        {groups.map((g) => (
          <div key={g.title} style={{ background: C.paper, borderRadius: 18, padding: "15px 16px",
            border: `1px solid ${C.sageSoft}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: g.color }} />
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, margin: 0, color: C.ink }}>{g.title}</h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {g.items.map((it) => (
                <span key={it} style={{ fontSize: 13, background: C.cream, color: C.ink,
                  padding: "5px 11px", borderRadius: 999, border: `1px solid ${C.sageSoft}` }}>{it}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Sunday meal prep" subtitle="~1 hour, calmer week" />
      <div style={{ background: C.paper, borderRadius: 20, padding: "8px 8px", border: `1px solid ${C.sageSoft}` }}>
        {prep.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "13px 12px",
            borderBottom: i < prep.length - 1 ? `1px solid ${C.sageSoft}` : "none" }}>
            <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 999, background: C.sageSoft,
              color: C.sageDeep, fontWeight: 800, fontSize: 13, display: "grid", placeItems: "center" }}>{i + 1}</span>
            <span style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.45 }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FITNESS ---------------- */
function FitnessView() {
  const todayIdx = (new Date().getDay() + 6) % 7;
  return (
    <>
      <header style={{ paddingTop: 26, marginBottom: 16 }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, margin: 0, color: C.ink }}>Move with joy</h1>
        <p style={{ color: C.inkSoft, margin: "4px 0 0", fontSize: 15 }}>A balanced, longevity-first week. Strong body, calm mind.</p>
      </header>

      <div style={{ background: `linear-gradient(135deg, ${C.terracotta}, ${C.clay})`, borderRadius: 20,
        padding: "16px 18px", color: C.white, marginBottom: 20, boxShadow: "0 8px 24px rgba(168,90,62,.28)" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", opacity: .9 }}>The balance</div>
        <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.5 }}>
          2 strength days build & protect muscle · Zone 2 fuels energy · a little HIIT sharpens the heart ·
          Pilates & yoga keep you mobile · and rest is where it all comes together.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {FITNESS.map((f, i) => {
          const isToday = i === todayIdx;
          return (
            <div key={f.day} style={{ background: C.paper, borderRadius: 20, padding: "16px 17px",
              border: isToday ? `2px solid ${f.color}` : `1px solid ${C.sageSoft}`,
              position: "relative", boxShadow: isToday ? `0 8px 22px ${f.color}33` : "none" }}>
              {isToday && <span style={{ position: "absolute", top: -10, right: 16, background: f.color,
                color: C.white, fontSize: 10.5, fontWeight: 800, padding: "3px 11px", borderRadius: 999,
                letterSpacing: .5 }}>TODAY</span>}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 11 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: `${f.color}22`,
                  color: f.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {iconFor(f.icon, { size: 23 })}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: C.inkSoft, textTransform: "uppercase",
                    letterSpacing: .5 }}>{f.day}</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, color: C.ink, lineHeight: 1.1 }}>{f.focus}</div>
                </div>
              </div>
              <ul style={{ margin: "0 0 11px", paddingLeft: 0, listStyle: "none" }}>
                {f.items.map((it, j) => (
                  <li key={j} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 6 }}>
                    <ArrowRight size={15} color={f.color} style={{ marginTop: 3, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.4 }}>{it}</span>
                  </li>
                ))}
              </ul>
              <div style={{ background: C.cream, borderRadius: 12, padding: "10px 12px",
                fontSize: 13, color: C.inkSoft, lineHeight: 1.45, fontStyle: "italic" }}>
                💡 {f.note}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: C.sageSoft, borderRadius: 18, padding: "16px 18px", marginTop: 18 }}>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, margin: "0 0 6px", color: C.sageDeep }}>A gentle reminder</h3>
        <p style={{ margin: 0, fontSize: 14, color: C.ink, lineHeight: 1.5 }}>
          Your active job already gives you a wonderful movement base — all this walking counts.
          On a tired day, a 20-minute walk and some stretching is a complete win. Consistency beats intensity, always.
        </p>
      </div>
    </>
  );
}

/* ---------------- WELLNESS ---------------- */
function WellnessView() {
  const cards = [
    { icon: <Moon size={22} />, color: C.sky, title: "Sleep sanctuary",
      tips: ["Aim for a consistent bedtime — your body loves rhythm.", "Dim lights & screens 45 min before bed.", "A warm herbal tea (chamomile, ginger) signals wind-down.", "Cool, dark room = deeper, more restorative sleep."] },
    { icon: <Leaf size={22} />, color: C.sage, title: "Liver love",
      tips: ["Leafy greens, broccoli, beans & berries are quietly protective.", "Stay well-hydrated — water helps everything flush & function.", "Turmeric & ginger (all over this plan) are gentle allies.", "Each alcohol-free day gives your liver room to repair."] },
    { icon: <Heart size={22} />, color: C.rose, title: "Recovery rituals",
      tips: ["Protein within a couple hours of training feeds muscle.", "Gentle stretching or foam rolling eases soreness.", "A warm bath with Epsom salts soothes body & mind.", "Rest days aren't lazy — they're when you get stronger."] },
    { icon: <Wind size={22} />, color: C.terracotta, title: "Steady energy & mood",
      tips: ["Protein + fiber at each meal keeps energy even — no crashes.", "A short morning walk in daylight lifts mood & sets your clock.", "Stay hydrated; even mild dehydration dips energy & focus.", "Slow, deep breaths (4 in, 6 out) calm the whole system."] },
  ];
  return (
    <>
      <header style={{ paddingTop: 26, marginBottom: 16 }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, margin: 0, color: C.ink }}>Wellness & recovery</h1>
        <p style={{ color: C.inkSoft, margin: "4px 0 0", fontSize: 15 }}>Gentle, science-backed care for body and mind.</p>
      </header>

      {/* Supportive note about alcohol/cannabis — warm, non-judgmental */}
      <div style={{ background: `linear-gradient(135deg, ${C.sage}, ${C.sageDeep})`, borderRadius: 22,
        padding: "20px 22px", color: C.white, marginBottom: 20, boxShadow: "0 10px 28px rgba(94,107,82,.28)" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.2, textTransform: "uppercase",
          opacity: .85, marginBottom: 7 }}>A note, with warmth</div>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55 }}>
          You don't have to change everything at once. If easing back on alcohol feels right, even a few
          alcohol-free days a week can mean better sleep, steadier energy, and a liver that gets to heal.
          Be patient and kind with yourself — small, gentle steps are real progress, and you deserve to feel good.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {cards.map((c) => (
          <div key={c.title} style={{ background: C.paper, borderRadius: 20, padding: "17px 18px",
            border: `1px solid ${C.sageSoft}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `${c.color}22`,
                color: c.color, display: "grid", placeItems: "center" }}>{c.icon}</div>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, margin: 0, color: C.ink }}>{c.title}</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
              {c.tips.map((t, i) => (
                <li key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start",
                  padding: "7px 0", borderBottom: i < c.tips.length - 1 ? `1px solid ${C.sageSoft}` : "none" }}>
                  <span style={{ color: c.color, marginTop: 2, flexShrink: 0 }}>✦</span>
                  <span style={{ fontSize: 14, color: C.ink, lineHeight: 1.45 }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 20, fontSize: 12.5, color: C.inkSoft, lineHeight: 1.5,
        padding: "0 10px" }}>
        This guide offers general wellness support and isn't a substitute for medical care.
        Given the liver history, checking in with a doctor about a recovery plan is a loving step worth taking.
      </div>
    </>
  );
}

/* ---------------- LEARN ---------------- */
function LearnView() {
  const [open, setOpen] = useState(null);
  return (
    <>
      <header style={{ paddingTop: 26, marginBottom: 16 }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, margin: 0, color: C.ink }}>The why</h1>
        <p style={{ color: C.inkSoft, margin: "4px 0 0", fontSize: 15 }}>Understanding the reasons makes habits stick. Tap any card.</p>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {LEARN.map((l) => {
          const isOpen = open === l.id;
          return (
            <div key={l.id} style={{ background: C.paper, borderRadius: 18, border: `1px solid ${C.sageSoft}`,
              overflow: "hidden", transition: "all .2s" }}>
              <button onClick={() => setOpen(isOpen ? null : l.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, background: "none",
                border: "none", padding: "15px 16px", cursor: "pointer", textAlign: "left" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${l.color}22`,
                  color: l.color, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {iconFor(l.icon, { size: 21 })}
                </div>
                <span style={{ flex: 1, fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600,
                  color: C.ink, lineHeight: 1.2 }}>{l.title}</span>
                <ChevronRight size={20} color={C.inkSoft}
                  style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s", flexShrink: 0 }} />
              </button>
              {isOpen && (
                <div style={{ padding: "0 18px 18px 70px", animation: "fadeIn .3s ease" }}>
                  <p style={{ margin: 0, fontSize: 14.5, color: C.inkSoft, lineHeight: 1.6 }}>{l.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background: C.terraSoft, borderRadius: 18, padding: "17px 18px", marginTop: 18 }}>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18, margin: "0 0 6px", color: C.clay }}>Your protein, simplified</h3>
        <p style={{ margin: 0, fontSize: 14, color: C.ink, lineHeight: 1.5 }}>
          100 g a day sounds like a lot, but it's really just ~25–30 g at each meal plus a snack or shake.
          A protein shake, Greek yogurt, tofu, paneer, edamame and beans do most of the heavy lifting —
          easily, deliciously, every day.
        </p>
      </div>
    </>
  );
}
