// src/components/premium/TravelQuestionnaire.jsx
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { QUESTIONNAIRE } from "../../utils/premiumData";
import { getQuestionIcon } from "../../utils/questionIcons";

const TOTAL = QUESTIONNAIRE.length;

const TravelQuestionnaire = ({ onOpenModal }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = QUESTIONNAIRE[stepIndex];
  const selected = answers[question.id];

  const goNext = () => {
    if (stepIndex < TOTAL - 1) setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const handleSelect = (label) => {
    setAnswers((prev) => ({ ...prev, [question.id]: label }));
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm hover:shadow-md border border-gray-100 transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">3. Travel Questionnaire</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Step {stepIndex + 1} of {TOTAL}</span>
          <div className="flex items-center gap-1">
            {QUESTIONNAIRE.map((q, idx) => (
              <span
                key={q.id}
                className={`w-1.5 h-1.5 rounded-full ${
                  idx === stepIndex ? "bg-purple-700" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Answer 10 quick questions so we can create the perfect plan for you
      </p>

      {/* Question row with side arrows (matches mockup nav style) */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          aria-label="Previous question"
          className="w-9 h-9 rounded-full bg-gray-100 disabled:opacity-40 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition shrink-0"
        >
          <FaChevronLeft className="text-xs" />
        </button>

        <div className="flex-1">
          <p className="text-center font-semibold text-gray-800 mb-4 text-sm md:text-base">
            {stepIndex + 1}. {question.question}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {question.options.map((opt) => {
              const Icon = getQuestionIcon(opt.icon);
              const active = selected === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelect(opt.label)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 py-4 px-2 transition ${
                    active ? "border-purple-300 bg-purple-50" : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <Icon className={`text-xl ${active ? "text-purple-700" : "text-gray-700"}`} />
                  <span className={`text-xs md:text-sm font-medium text-center ${active ? "text-purple-800" : "text-gray-700"}`}>
                    {opt.label}
                  </span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={stepIndex === TOTAL - 1}
          aria-label="Next question"
          className="w-9 h-9 rounded-full bg-purple-900 disabled:opacity-40 flex items-center justify-center text-white hover:bg-purple-950 transition shrink-0"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>

      {/* Next CTA + open full modal */}
      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          type="button"
          onClick={onOpenModal}
          className="text-sm font-semibold text-purple-800 hover:underline"
        >
          Open full stepper →
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={stepIndex === TOTAL - 1}
          className="bg-purple-900 disabled:opacity-50 hover:bg-purple-950 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition flex items-center gap-2"
        >
          Next <FaChevronRight className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default TravelQuestionnaire;
