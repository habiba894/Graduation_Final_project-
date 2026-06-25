// src/utils/premiumData.js

// 🎒 Smart packing guide — country + season specific.
// Acts like a travel guide: practical, generic items (clothing, documents,
// electronics, health) rather than weather-dependent gear like umbrellas.
// No API call required; swap generatePackingList's body for a real
// fetch/AI call later without touching any component code.
export const COUNTRIES = [
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
];

const BASE_ITEMS = ["Passport & Documents", "Phone Charger", "Toiletries Bag"];

// season buckets: "summer" (May–Sep), "winter" (Dec–Feb), "shoulder" (rest)
const SEASON_ITEMS = {
  Egypt: {
    summer: ["Lightweight cotton clothing", "Sunscreen", "Sunglasses", "Refillable water bottle"],
    winter: ["Light jacket", "Long-sleeve layers", "Comfortable walking shoes", "Sunscreen"],
    shoulder: ["Breathable layers", "Comfortable walking shoes", "Sunscreen", "Sunglasses"],
  },
  France: {
    summer: ["Light layers", "Comfortable walking shoes", "Sunglasses", "Day bag"],
    winter: ["Warm coat", "Thermal layers", "Gloves & scarf", "Insulated boots"],
    shoulder: ["Light jacket", "Layered clothing", "Comfortable walking shoes", "Day bag"],
  },
  Turkey: {
    summer: ["Lightweight clothing", "Sunscreen", "Sunglasses", "Comfortable sandals"],
    winter: ["Warm jacket", "Layered clothing", "Comfortable walking shoes", "Scarf"],
    shoulder: ["Light layers", "Comfortable walking shoes", "Day bag", "Sunglasses"],
  },
};

const getSeason = (months) => {
  const isSummer = months.some((m) => [4, 5, 6, 7, 8].includes(m)); // May–Sep
  const isWinter = months.some((m) => [11, 0, 1].includes(m)); // Dec–Feb
  if (isSummer && !isWinter) return "summer";
  if (isWinter && !isSummer) return "winter";
  return "shoulder";
};

const monthsBetween = (start, end) => {
  const a = new Date(start);
  const b = new Date(end);
  if (Number.isNaN(a) || Number.isNaN(b)) return [];
  const months = [];
  const cur = new Date(a.getFullYear(), a.getMonth(), 1);
  while (cur <= b) {
    months.push(cur.getMonth());
    cur.setMonth(cur.getMonth() + 1);
  }
  return months;
};

const ADVICE = {
  Egypt: {
    summer: "Expect intense heat — stick to breathable fabrics and pace your sightseeing around the cooler hours.",
    winter: "Days are mild but evenings cool down — bring something warm for the night.",
    shoulder: "Temperatures stay comfortable — light layers will cover most of the day.",
  },
  France: {
    summer: "Warm, pleasant days — light layers are enough, with something for cooler evenings.",
    winter: "Cold throughout — prioritize warm layers and insulated footwear.",
    shoulder: "Mild but variable — layering is the easiest way to stay comfortable.",
  },
  Turkey: {
    summer: "Hot and sunny — lightweight, breathable clothing will serve you best.",
    winter: "Cold, especially inland — pack proper layers and a warm jacket.",
    shoulder: "Comfortable temperatures — a light layer covers most of the trip.",
  },
};

const adviceFor = (country, season) =>
  ADVICE[country]?.[season] || "Pack light layers that adapt easily through the day.";

/**
 * generatePackingList
 * Returns { items: string[], advice: string }
 * Swap this implementation for a real AI/API call later — the
 * call signature (country, startDate, endDate) can stay the same.
 */
export function generatePackingList({ country, startDate, endDate }) {
  const countryData = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0];
  const months = monthsBetween(startDate, endDate);
  const season = getSeason(months);
  const seasonItems =
    SEASON_ITEMS[countryData.name]?.[season] || SEASON_ITEMS.Egypt.shoulder;

  const items = Array.from(new Set([...BASE_ITEMS, ...seasonItems])).slice(0, 7);

  return {
    items,
    advice: adviceFor(countryData.name, season),
  };
}

// 🗺️ Trip Planner — recommends the best-fit country from budget, travel
// style, and interests (no destination picker, no questionnaire needed).
export const BUDGET_OPTIONS = ["Low", "Medium", "High"];
export const TRAVEL_STYLE_OPTIONS = ["Relax", "Explore", "Adventure", "Luxury"];
export const INTEREST_OPTIONS = ["Food", "Culture", "Shopping", "Nature", "Nightlife", "History"];

// Each country's profile scores 0–3 against every criterion. Higher = better fit.
const COUNTRY_PROFILES = {
  Egypt: {
    flag: "🇪🇬",
    budget: { Low: 3, Medium: 2, High: 1 },
    travelStyle: { Relax: 2, Explore: 3, Adventure: 3, Luxury: 1 },
    interests: { Food: 2, Culture: 3, Shopping: 1, Nature: 2, Nightlife: 1, History: 3 },
    tagline: "ancient history, desert adventure, and Red Sea relaxation",
  },
  France: {
    flag: "🇫🇷",
    budget: { Low: 1, Medium: 2, High: 3 },
    travelStyle: { Relax: 2, Explore: 3, Adventure: 1, Luxury: 3 },
    interests: { Food: 3, Culture: 3, Shopping: 3, Nature: 1, Nightlife: 2, History: 2 },
    tagline: "world-class food, culture, and refined city life",
  },
  Turkey: {
    flag: "🇹🇷",
    budget: { Low: 2, Medium: 3, High: 2 },
    travelStyle: { Relax: 3, Explore: 3, Adventure: 2, Luxury: 2 },
    interests: { Food: 3, Culture: 3, Shopping: 2, Nature: 2, Nightlife: 3, History: 3 },
    tagline: "a mix of coastline, history, and vibrant city nightlife",
  },
};

/**
 * scoreCountry
 * Weighs budget + travel style + interests (each 0–3) into one number.
 * Interests are averaged so picking 1 or 3 interests doesn't skew the scale.
 */
function scoreCountry(profile, { budget, travelStyle, interests }) {
  const budgetScore = profile.budget[budget] ?? 1;
  const styleScore = profile.travelStyle[travelStyle] ?? 1;

  const interestScores = (interests || []).map((i) => profile.interests[i] ?? 1);
  const interestScore = interestScores.length
    ? interestScores.reduce((sum, s) => sum + s, 0) / interestScores.length
    : 1.5;

  // Travel style and interests matter most for "fit"; budget is a softer filter.
  return budgetScore * 1 + styleScore * 1.5 + interestScore * 1.5;
}

/**
 * recommendCountry
 * Returns { country, flag, tagline, reason } for the single best-fit
 * destination out of COUNTRIES, given the user's budget/style/interests.
 * Swap this implementation for a real AI/API call later — the call
 * signature can stay the same.
 */
export function recommendCountry({ budget, travelStyle, interests }) {
  const ranked = Object.entries(COUNTRY_PROFILES)
    .map(([country, profile]) => ({
      country,
      flag: profile.flag,
      tagline: profile.tagline,
      score: scoreCountry(profile, { budget, travelStyle, interests }),
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];

  const article = (word) => (/^[aeiou]/i.test(word) ? "an" : "a");
  const interestPart = interests?.length
    ? ` and your interest in ${interests.join(", ").toLowerCase()}`
    : "";

  return {
    country: best.country,
    flag: best.flag,
    tagline: best.tagline,
    reason: `Based on ${article(budget)} ${budget.toLowerCase()} budget, ${article(
      travelStyle
    )} ${travelStyle.toLowerCase()} travel style${interestPart}, ${best.country} is your best fit — known for ${best.tagline}.`,
  };
}

// 📋 Travel Questionnaire — 10 questions
// `icon` is a key consumed by QUESTION_ICONS in the component (react-icons).
export const QUESTIONNAIRE = [
  {
    id: 1,
    question: "What's the purpose of your trip?",
    options: [
      { label: "Relaxation", icon: "relaxation" },
      { label: "Adventure", icon: "adventure" },
      { label: "Business", icon: "business" },
      { label: "Family Vacation", icon: "family" },
    ],
  },
  {
    id: 2,
    question: "Who's traveling with you?",
    options: [
      { label: "Solo", icon: "solo" },
      { label: "Partner", icon: "partner" },
      { label: "Family", icon: "family" },
      { label: "Friends", icon: "friends" },
    ],
  },
  {
    id: 3,
    question: "What's your ideal trip pace?",
    options: [
      { label: "Slow & Relaxed", icon: "relaxation" },
      { label: "Balanced", icon: "balanced" },
      { label: "Packed & Active", icon: "adventure" },
      { label: "Spontaneous", icon: "spontaneous" },
    ],
  },
  {
    id: 4,
    question: "What's your accommodation preference?",
    options: [
      { label: "Budget Hostel", icon: "hostel" },
      { label: "Mid-range Hotel", icon: "hotel" },
      { label: "Luxury Resort", icon: "luxury" },
      { label: "Local Stay", icon: "local" },
    ],
  },
  {
    id: 5,
    question: "How important is food exploration?",
    options: [
      { label: "Top Priority", icon: "food" },
      { label: "Nice to Have", icon: "nice" },
      { label: "Not Important", icon: "notimportant" },
      { label: "Dietary Restrictions", icon: "dietary" },
    ],
  },
  {
    id: 6,
    question: "What's your preferred climate?",
    options: [
      { label: "Warm & Sunny", icon: "sunny" },
      { label: "Cool & Mild", icon: "mild" },
      { label: "Cold & Snowy", icon: "snowy" },
      { label: "No Preference", icon: "any" },
    ],
  },
  {
    id: 7,
    question: "How do you like to get around?",
    options: [
      { label: "Walking", icon: "walking" },
      { label: "Public Transport", icon: "transport" },
      { label: "Rental Car", icon: "car" },
      { label: "Private Driver", icon: "driver" },
    ],
  },
  {
    id: 8,
    question: "What's your daily budget range?",
    options: [
      { label: "Under $50", icon: "budget" },
      { label: "$50–150", icon: "midbudget" },
      { label: "$150–300", icon: "highbudget" },
      { label: "$300+", icon: "luxury" },
    ],
  },
  {
    id: 9,
    question: "Which activities excite you most?",
    options: [
      { label: "Nature & Outdoors", icon: "nature" },
      { label: "Museums & History", icon: "history" },
      { label: "Nightlife", icon: "nightlife" },
      { label: "Shopping", icon: "shopping" },
    ],
  },
  {
    id: 10,
    question: "How far in advance do you usually plan?",
    options: [
      { label: "Months Ahead", icon: "planahead" },
      { label: "A Few Weeks", icon: "weeks" },
      { label: "Last Minute", icon: "lastminute" },
      { label: "Still Deciding", icon: "deciding" },
    ],
  },
];