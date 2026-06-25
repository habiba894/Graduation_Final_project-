// src/components/premium/PackingAssistant.jsx
import { useState } from "react";
import { FaCheckCircle, FaLightbulb, FaSuitcaseRolling } from "react-icons/fa";
import { COUNTRIES, generatePackingList } from "../../utils/premiumData";

const PackingAssistant = () => {
  const [country, setCountry] = useState("France");
  const [startDate, setStartDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("2026-07-07");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(generatePackingList({ country, startDate, endDate }));
      setLoading(false);
    }, 450);
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-md border border-gray-100 transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <FaSuitcaseRolling className="text-purple-700 text-xl md:text-2xl" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              1. Smart Packing Assistant
            </h3>
            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
              Premium
            </span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Get packing recommendations based on your destination, travel dates, and weather forecast
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-purple-900 hover:bg-purple-950 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
      >
        {loading ? (
          "Generating..."
        ) : (
          <>
            <span>✨</span> Generate Packing List
          </>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className="mt-5 bg-purple-50/60 border border-purple-100 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800 mb-3">Recommended Items</p>
            <div className="flex flex-wrap gap-2.5">
              {result.items.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-700"
                >
                  <FaCheckCircle className="text-purple-600 text-xs" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5 md:max-w-55 md:border-l md:border-purple-100 md:pl-5">
            <FaLightbulb className="text-yellow-500 text-lg shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-800">Advice</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{result.advice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackingAssistant;
