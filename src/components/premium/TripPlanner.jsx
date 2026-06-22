// src/components/premium/TripPlanner.jsx
import { useState } from "react";
import { FaMapMarkedAlt, FaCheckCircle } from "react-icons/fa";
import {
  COUNTRIES,
  BUDGET_OPTIONS,
  TRAVEL_STYLE_OPTIONS,
  INTEREST_OPTIONS,
  generateTripPlan,
} from "../../utils/premiumData";

const MAX_INTERESTS = 3;

const TripPlanner = ({ onOpenQuestionnaire }) => {
  const [destination, setDestination] = useState("Italy");
  const [budget, setBudget] = useState("Medium");
  const [travelStyle, setTravelStyle] = useState("Relax");
  const [interests, setInterests] = useState(["Food", "Culture"]);
  const [plan, setPlan] = useState(null);

  const toggleInterest = (interest) => {
    setInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest);
      }
      if (prev.length >= MAX_INTERESTS) return prev;
      return [...prev, interest];
    });
  };

  const handleGeneratePlan = () => {
    const result = generateTripPlan({ destination, budget, travelStyle, interests });
    setPlan(result);
    // Per the spec: Generate Plan triggers the Travel Questionnaire modal
    // so we can refine the plan with the 10-step profile.
    onOpenQuestionnaire?.();
  };

  return (
    <div className="bg-green-50/60 rounded-2xl p-5 sm:p-6 md:p-8 border border-green-100">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <FaMapMarkedAlt className="text-green-700 text-xl md:text-2xl" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">2. Trip Planner</h3>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              Premium
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Create a personalized travel plan based on your preferences and interests.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Destination</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Budget</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            {BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Travel Style</label>
          <select
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            {TRAVEL_STYLE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interests */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Interests (select up to {MAX_INTERESTS})
        </label>
        <div className="flex flex-wrap gap-2.5">
          {INTEREST_OPTIONS.map((interest) => {
            const active = interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition ${
                  active
                    ? "bg-green-100 border-green-300 text-green-800"
                    : "bg-white border-gray-200 text-gray-600 hover:border-green-200"
                }`}
              >
                {interest}
                {active && <FaCheckCircle className="text-green-600 text-xs" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGeneratePlan}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
      >
        <span>✨</span> Generate Plan
      </button>

      {/* Preview */}
      {plan && (
        <div className="mt-5 bg-green-50 border border-green-100 rounded-2xl p-4 md:p-5">
          <p className="text-green-800 font-bold mb-3">Your Trip Plan (Preview)</p>
          <div className="flex flex-col gap-2.5">
            {plan.days.map((d) => (
              <div key={d.day} className="flex items-center gap-3">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full shrink-0">
                  Day {d.day}
                </span>
                <span className="text-sm text-gray-700">{d.title}</span>
              </div>
            ))}
          </div>
          <p className="text-green-700 text-xs font-semibold mt-3 text-right">
            Full itinerary, maps & tips in premium
          </p>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
