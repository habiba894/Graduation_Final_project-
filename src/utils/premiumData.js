// src/utils/premiumData.js

// 🎒 Lightweight "smart" packing logic — country + season based.
// No API call required; swap generatePackingList's body for a real
// fetch/AI call later without touching any component code.
export const COUNTRIES = [
  { code: "FR", name: "France", flag: "🇫🇷", climate: "temperate" },
  { code: "IT", name: "Italy", flag: "🇮🇹", climate: "mediterranean" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", climate: "desert" },
  { code: "JP", name: "Japan", flag: "🇯🇵", climate: "temperate" },
  { code: "AE", name: "UAE", flag: "🇦🇪", climate: "desert" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", climate: "temperate" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", climate: "tropical" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", climate: "alpine" },
];

const BASE_ITEMS = ["Passport & Documents", "Phone Charger", "Toiletries Bag"];

const CLIMATE_ITEMS = {
  temperate: ["Jacket", "Umbrella", "Sunscreen", "Light Sweater"],
  mediterranean: ["Sunscreen", "Light Sweater", "Sunglasses", "Comfortable Shoes"],
  desert: ["Sunscreen", "Sunglasses", "Light Scarf", "Refillable Water Bottle"],
  tropical: ["Umbrella", "Sunscreen", "Insect Repellent", "Light Breathable Clothing"],
  alpine: ["Jacket", "Thermal Layer", "Sunscreen", "Sturdy Boots"],
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

const adviceFor = (climate, months) => {
  const isWinterish = months.some((m) => [10, 11, 0, 1, 2].includes(m));
  const isSummerish = months.some((m) => [5, 6, 7, 8].includes(m));

  if (climate === "desert" && isSummerish) {
    return "Expect intense heat — pack light, breathable fabrics and stay hydrated.";
  }
  if (climate === "alpine" && isWinterish) {
    return "Cold conditions expected — layer up and bring waterproof footwear.";
  }
  if (isWinterish && isSummerish) {
    return "Expert mixed weather — prepare for rain and pack adaptable layers.";
  }
  if (isWinterish) {
    return "Cooler temperatures expected — pack warm layers and a waterproof jacket.";
  }
  return "Mild, pleasant conditions expected — pack light layers just in case.";
};

/**
 * generatePackingList
 * Returns { items: string[], advice: string }
 * Swap this implementation for a real AI/API call later — the
 * call signature (country, startDate, endDate) can stay the same.
 */
export function generatePackingList({ country, startDate, endDate }) {
  const countryData = COUNTRIES.find((c) => c.name === country) || COUNTRIES[0];
  const months = monthsBetween(startDate, endDate);
  const climateItems = CLIMATE_ITEMS[countryData.climate] || CLIMATE_ITEMS.temperate;

  const items = Array.from(new Set([...BASE_ITEMS, ...climateItems])).slice(0, 6);

  return {
    items,
    advice: adviceFor(countryData.climate, months),
  };
}

// 🗺️ Trip Planner mock data
export const BUDGET_OPTIONS = ["Low", "Medium", "High"];
export const TRAVEL_STYLE_OPTIONS = ["Relax", "Explore", "Adventure", "Luxury"];
export const INTEREST_OPTIONS = ["Food", "Culture", "Shopping", "Nature", "Nightlife", "History"];

const STYLE_DAY_TEMPLATES = {
  Relax: [
    { day: 1, title: "Explore city center & local cuisine" },
    { day: 2, title: "Museums & cultural attractions" },
    { day: 3, title: "Free day & shopping" },
  ],
  Explore: [
    { day: 1, title: "Walking tour of historic districts" },
    { day: 2, title: "Day trip to nearby landmarks" },
    { day: 3, title: "Local markets & hidden gems" },
  ],
  Adventure: [
    { day: 1, title: "Outdoor activity & scenic hike" },
    { day: 2, title: "Adrenaline excursion (kayaking/climbing)" },
    { day: 3, title: "Recovery day & local cuisine" },
  ],
  Luxury: [
    { day: 1, title: "Private guided city tour" },
    { day: 2, title: "Fine dining & spa experience" },
    { day: 3, title: "Boutique shopping & sunset cruise" },
  ],
};

/**
 * generateTripPlan
 * Returns { days: { day, title }[] }
 * Swap this implementation for a real AI/API call later.
 */
export function generateTripPlan({ destination, budget, travelStyle, interests }) {
  const template = STYLE_DAY_TEMPLATES[travelStyle] || STYLE_DAY_TEMPLATES.Relax;
  return {
    destination,
    budget,
    travelStyle,
    interests,
    days: template,
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
