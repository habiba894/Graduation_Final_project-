// src/components/premium/UpgradeBanner.jsx
import { FaCrown, FaSuitcase, FaComments, FaHeadset, FaBolt } from "react-icons/fa";

const BENEFITS = [
  {
    icon: FaSuitcase,
    title: "Unlimited Bookings",
    desc: "Plan unlimited trips without limits.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: FaComments,
    title: "Exclusive Discussions",
    desc: "Join premium-only community.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: FaHeadset,
    title: "Priority Support",
    desc: "Get faster help from our team.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: FaBolt,
    title: "Early Access",
    desc: "Be the first to try new features.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

const UpgradeBanner = ({ onUpgrade }) => {
  return (
    <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 md:p-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <FaCrown className="text-orange-400 text-xl" />
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">Why upgrade to premium?</h3>
      </div>
      <p className="text-gray-500 text-sm mb-6">
        Get the most out of your travels with premium Benefits.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {BENEFITS.map((b) => (
          <div
            key={b.title}
            className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 border border-gray-100"
          >
            <div className={`w-10 h-10 rounded-full ${b.bg} flex items-center justify-center`}>
              <b.icon className={`${b.color} text-base`} />
            </div>
            <p className="text-sm font-bold text-gray-800 text-center leading-tight">{b.title}</p>
            <p className="text-xs text-gray-400 text-center leading-snug">{b.desc}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onUpgrade}
        className="bg-[#d14b30] hover:scale-[1.02] text-white font-semibold px-8 py-3 rounded-full shadow-md transition flex items-center gap-2 mx-auto"
      >
        <FaCrown className="text-sm" /> Upgrade Now
      </button>
    </div>
  );
};

export default UpgradeBanner;
