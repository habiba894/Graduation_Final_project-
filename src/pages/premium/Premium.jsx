// src/pages/Premium.jsx
import { useState } from "react";
import { FaCalendarAlt, FaCrown, FaLock, FaMedal } from "react-icons/fa";
import premiumBg from "../../assets/premium-bg.png";
import PackingAssistant from "../../components/premium/PackingAssistant";
import QuestionnaireModal from "../../components/premium/QuestionnaireModal";
import TravelQuestionnaire from "../../components/premium/TravelQuestionnaire";
import TripPlanner from "../../components/premium/TripPlanner";
import UpgradeBanner from "../../components/premium/UpgradeBanner";
import { useAuth } from "../../context/AuthContext";

const formatMemberSince = (dateStr) => {
  if (!dateStr) return "Jun 2026";
  const d = new Date(dateStr);
  if (Number.isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const Premium = () => {
  const { user, updateUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const isPremium = !!user?.isPremium;
  const memberSince = formatMemberSince(user?.memberSince || user?.createdAt);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2800);
  };

  const handleUpgrade = () => {
    updateUser({ ...user, isPremium: true });
    showToast("🎉 Welcome to Premium! Tools unlocked.");
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* 🍞 Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-200 bg-gray-900 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* Hero */}
      <div className="relative w-full">
        <div className="relative h-75 sm:h-90 md:h-105 w-full overflow-hidden">
          <img
            src={premiumBg}
            alt="Cairo skyline at sunset"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Stronger, consistent darkening so text stays legible over any photo */}
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/45 to-black/20" />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-10 h-full flex flex-col justify-center">
            <FaCrown className="text-orange-400 text-2xl md:text-3xl mb-4 drop-shadow-lg" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
              Premium Features
            </h1>
            <p className="text-gray-100 text-sm sm:text-base md:text-lg mt-3 max-w-md drop-shadow">
              Unlock smart tools and personalized travel experiences.
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 md:-mt-9 relative z-20">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 px-5 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-y-4 gap-x-3">
            <div className="flex items-center gap-2.5">
              <FaCalendarAlt className="text-orange-400" />
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
                  Member Since
                </p>
                <p className="text-sm font-bold text-gray-800">{memberSince}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-100 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <FaMedal className="text-orange-400" />
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
                  Membership
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {isPremium ? "Premium" : "Standard"}
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-gray-100 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-full ${isPremium ? "bg-green-500" : "bg-gray-300"}`}
              />
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
                  Status
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {isPremium ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-6">
        <div className="relative">
          <div className={!isPremium ? "pointer-events-none blur-[3px] select-none" : ""}>
            <PackingAssistant />
          </div>
          {!isPremium && <LockedOverlay onUpgrade={handleUpgrade} />}
        </div>

        <div className="relative">
          <div className={!isPremium ? "pointer-events-none blur-[3px] select-none" : ""}>
            <TripPlanner onOpenQuestionnaire={() => setModalOpen(true)} />
          </div>
          {!isPremium && <LockedOverlay onUpgrade={handleUpgrade} />}
        </div>

        {/* <div className="relative">
          <div className={!isPremium ? "pointer-events-none blur-[3px] select-none" : ""}>
            <TravelQuestionnaire onOpenModal={() => setModalOpen(true)} />
          </div>
          {!isPremium && <LockedOverlay onUpgrade={handleUpgrade} />}
        </div> */}

        <UpgradeBanner onUpgrade={handleUpgrade} />
      </div>

      {/* Popup stepper modal (Trip Planner → Generate Plan, or questionnaire "Open full stepper") */}
     /* <QuestionnaireModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={() => showToast("✅ Your travel profile is ready!")}
      />
    </div>
  );
};

const LockedOverlay = ({ onUpgrade }) => (
  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/40">
    <div className="bg-white shadow-lg border border-gray-100 rounded-2xl px-6 py-5 flex flex-col items-center gap-3 text-center">
      <div className="w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center">
        <FaLock className="text-orange-400" />
      </div>
      <p className="text-sm font-bold text-gray-800">Premium Only</p>
      <button
        onClick={onUpgrade}
        className="bg-[#d14b30] hover:scale-105 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-md transition"
      >
        Upgrade Now
      </button>
    </div>
  </div>
);

export default Premium;
