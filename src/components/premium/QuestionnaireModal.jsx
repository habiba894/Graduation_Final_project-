// src/components/premium/QuestionnaireModal.jsx
import { useEffect, useState } from "react";
import { FaTimes, FaArrowRight, FaChevronLeft, FaLock } from "react-icons/fa";
import { PiMapTrifold } from "react-icons/pi";
import { QUESTIONNAIRE } from "../../utils/premiumData";
import { getQuestionIcon } from "../../utils/questionIcons";

const TOTAL = QUESTIONNAIRE.length;

const QuestionnaireModal = ({ open, onClose, onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Reset to step 1 each time the modal is freshly opened
  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setAnswers({});
    }
  }, [open]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const question = QUESTIONNAIRE[stepIndex];
  const selected = answers[question.id];

  const handleSelect = (label) => {
    setAnswers((prev) => ({ ...prev, [question.id]: label }));
  };

  const handleNext = () => {
    if (stepIndex < TOTAL - 1) {
      setStepIndex((i) => i + 1);
    } else {
      onComplete?.(answers);
      onClose();
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 md:p-6 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
              <PiMapTrifold className="text-purple-700 text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base md:text-lg">
                Create Your Personalized Travel Plan
              </h3>
              <p className="text-gray-500 text-sm mt-0.5">
                Answer 10 quick questions so we can create the perfect plan for you.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-700 transition shrink-0 ml-2"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-5 md:px-6 pt-5 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 mr-1">
            Step {stepIndex + 1} of {TOTAL}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {QUESTIONNAIRE.map((q, idx) => {
              const isDone = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              return (
                <span
                  key={q.id}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                    isCurrent
                      ? "bg-green-500 text-white"
                      : isDone
                      ? "bg-purple-200 text-purple-800"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {idx + 1}
                </span>
              );
            })}
          </div>
        </div>

        {/* Question */}
        <div className="p-5 md:p-6">
          <h4 className="font-bold text-gray-900 text-base md:text-lg mb-4">
            {stepIndex + 1}. {question.question}
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {question.options.map((opt) => {
              const Icon = getQuestionIcon(opt.icon);
              const active = selected === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => handleSelect(opt.label)}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 py-4 px-2 transition ${
                    active
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <Icon className={`text-xl ${active ? "text-green-700" : "text-gray-700"}`} />
                  <span
                    className={`text-xs md:text-sm font-medium text-center ${
                      active ? "text-green-800" : "text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Back / Next */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="flex items-center gap-1.5 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-semibold px-4 py-2 rounded-full text-sm hover:bg-gray-50 transition"
            >
              <FaChevronLeft className="text-xs" /> Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!selected}
              className="flex items-center gap-1.5 bg-green-600 disabled:opacity-50 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-full text-sm transition"
            >
              {stepIndex === TOTAL - 1 ? "Finish" : "Next"} <FaArrowRight className="text-xs" />
            </button>
          </div>

          {/* Footer note */}
          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <FaLock className="text-[10px]" /> Your answers are safe and secure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireModal;
