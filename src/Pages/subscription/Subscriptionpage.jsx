import React, { useEffect, useState } from "react";
import { createPaymentSession } from "../../api/paymentApi";
import toast from "react-hot-toast";
import {
  ShieldCheckIcon,
  ArrowPathIcon,
  DevicePhoneMobileIcon,
  MinusIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import heropic from "../../assets/about-us.png";
import AOS from "aos";
import "aos/dist/aos.css";

const accent = "#e8472a";
const dark = "#1a3c34";

const weeklyFeatures = [
  "Packing tips",
  "Offline mode",
  "Simulate trip plan",
];

const compareRows = [
  { label: "Packing tips", weekly: true, monthly: true },
  { label: "Offline mode", weekly: true, monthly: true },
  { label: "Simulate trip plan", weekly: true, monthly: true },
  { label: "All features", weekly: false, monthly: true },
  { label: "Cancel anytime", weekly: true, monthly: true },
  { label: "Priority support", weekly: false, monthly: true },
];

const trustItems = [
  {
    Icon: ShieldCheckIcon,
    title: "Secure Payment",
    desc: "Your payment is safe with us.",
  },
  {
    Icon: ArrowPathIcon,
    title: "Cancel Anytime",
    desc: "Change or cancel your plan at any time.",
  },
  {
    Icon: DevicePhoneMobileIcon,
    title: "24 / 7 Support",
    desc: "We are here to help you anytime.",
  },
];

const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
    />
  </svg>
);

export default function SubscriptionPage() {
  const [billing, setBilling] = useState("monthly");
  const [paymentLoading, setPaymentLoading] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  const weeklyPrice = billing === "monthly" ? 10 : 8;
  const monthlyPrice = billing === "monthly" ? 20 : 16;

const handlePayment = async (planType, amount) => {
  try {
    setPaymentLoading(planType);

    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    if (!storedUser) {
      toast.error("Please login first");
      return;
    }

    const userId =
      storedUser?._id ||
      storedUser?.id ||
      storedUser?.userId;

    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    const response = await createPaymentSession({
      userId,
      planType,
      amount,
    });

    console.log("Payment Session Response:", response);

    const paymentUrl = response?.paymentUrl;

    if (!paymentUrl) {
      throw new Error("Payment URL not received");
    }

    window.location.href = paymentUrl;
  } catch (error) {
    console.error("Payment Error:", error);

    toast.error(
      error?.response?.data?.message ||
      error?.message ||
      "Payment failed"
    );
  } finally {
    setPaymentLoading(null);
  }
};

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* 🎨 HERO SECTION */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: "50vh",
          minHeight: "350px",
          maxHeight: "500px",
        }}
      >
        <img
          src={heropic}
          alt="WanderLust travel"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            transform: "scale(1.06)",
            transition: "transform 8s ease-out",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,60,52,0.88) 0%, rgba(26,60,52,0.60) 45%, rgba(0,0,0,0.22) 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 55%)",
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            top: "10%",
            left: "58%",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,71,42,0.20) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "12%",
            left: "4%",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto left-0 right-0">
          <div
            data-aos="fade-down"
            className="inline-flex items-center gap-2 mb-7 self-start px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(10px)",
            }}
          >
            <MapPinIcon className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">
              WanderLust Premium
            </span>
          </div>

          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-white font-extrabold leading-[1.06] mb-5"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
              textShadow: "0 2px 40px rgba(0,0,0,0.25)",
            }}
          >
            Subscription
            <br />
            <span style={{ color: "#ff8c6e" }}>Plans</span> Built
            <br className="hidden sm:block" /> for Explorers
          </h1>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-28"
          style={{
            background:
              "linear-gradient(to top, #ffffff 0%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-4 pb-24">
        <div className="text-center mb-10" data-aos="fade-up">
          <h2
            className="text-3xl md:text-4xl font-extrabold"
            style={{ color: dark }}
          >
            Choose Your Plan
          </h2>
          <p className="text-gray-400 mt-3 text-sm max-w-sm mx-auto leading-relaxed">
            Unlock premium features and make your trips even more unforgettable.
          </p>
        </div>

        <div
          data-aos="zoom-in"
          className="flex items-center justify-center gap-3 mb-12"
        >
          <div
            className="flex items-center rounded-full p-1"
            style={{
              backgroundColor: "#f3f3f3",
              border: "1px solid #e8e8e8",
            }}
          >
            {["monthly", "yearly"].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all duration-300"
                style={
                  billing === b
                    ? {
                        backgroundColor: "#fff",
                        color: dark,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
                      }
                    : { color: "#999" }
                }
              >
                {b}
              </button>
            ))}
          </div>

          {billing === "yearly" && (
            <span
              data-aos="fade-left"
              className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
              style={{ backgroundColor: "#22a05a" }}
            >
              Save 20%
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <div
            data-aos="fade-right"
            className="rounded-3xl border p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group"
            style={{ borderColor: "#ececec" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: "#fff5f3",
                border: "1px solid #fdd5cc",
              }}
            >
              <CalendarDaysIcon
                className="w-6 h-6"
                style={{ color: accent }}
              />
            </div>

            <h3
              className="text-xl font-bold mb-1"
              style={{ color: dark }}
            >
              Weekly Plan
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              Perfect for short getaways
            </p>

            <div className="flex items-baseline gap-1 mb-7">
              <span
                className="text-5xl font-extrabold"
                style={{ color: dark }}
              >
                ${weeklyPrice}
              </span>
              <span className="text-gray-400 text-sm">/ week</span>
            </div>

            <ul className="flex flex-col gap-3.5 mb-9">
              {weeklyFeatures.map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm text-gray-600"
                >
                  <CheckCircleSolid
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: accent }}
                  />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePayment("WEEKLY", weeklyPrice)}
              disabled={paymentLoading}
              className="mt-auto w-full py-3.5 rounded-full border-2 font-semibold text-sm transition-all duration-300 hover:bg-orange-50 hover:scale-[1.02] disabled:opacity-60"
              style={{
                borderColor: accent,
                color: accent,
              }}
            >
              {paymentLoading === "WEEKLY" ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  Processing...
                </span>
              ) : (
                "Choose Weekly"
              )}
            </button>
          </div>

          <div
            data-aos="fade-left"
            className="rounded-3xl p-8 flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
            style={{
              border: `2px solid ${accent}`,
              backgroundColor: "#fff9f8",
            }}
          >
            <div
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,71,42,0.08) 0%, transparent 70%)",
              }}
            />

            <div className="absolute top-4 right-4">
              <span
                className="text-xs font-bold px-4 py-1.5 rounded-full text-white"
                style={{ backgroundColor: accent }}
              >
                Most Popular
              </span>
            </div>

            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
              style={{
                backgroundColor: "#fff0ed",
                border: "1px solid #fdd5cc",
              }}
            >
              <SparklesIcon
                className="w-6 h-6"
                style={{ color: accent }}
              />
            </div>

            <h3
              className="text-xl font-bold mb-1"
              style={{ color: dark }}
            >
              Monthly Plan
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              Everything you need for the perfect trip
            </p>

            <div className="flex items-baseline gap-1 mb-7">
              <span
                className="text-5xl font-extrabold"
                style={{ color: dark }}
              >
                ${monthlyPrice}
              </span>
              <span className="text-gray-400 text-sm">/ month</span>
            </div>

            <ul className="flex flex-col gap-3.5 mb-9">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <CheckCircleSolid
                  className="w-5 h-5 shrink-0"
                  style={{ color: accent }}
                />
                All features included
              </li>
            </ul>

            <button
              onClick={() => handlePayment("MONTHLY", monthlyPrice)}
              disabled={paymentLoading}
              className="mt-auto w-full py-3.5 rounded-full font-bold text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              style={{
                backgroundColor: accent,
                boxShadow: "0 6px 24px rgba(232,71,42,0.35)",
              }}
            >
              {paymentLoading === "MONTHLY" ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner />
                  Processing...
                </span>
              ) : (
                "Choose Monthly"
              )}
            </button>
          </div>
        </div>

        <div
          data-aos="fade-up"
          className="rounded-3xl border p-8 mb-14"
          style={{ borderColor: "#ececec" }}
        >
          <h3
            className="text-xl font-bold mb-7"
            style={{ color: dark }}
          >
            Compare Plans
          </h3>

          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left pb-4 font-medium text-gray-400 w-1/2">
                  Feature
                </th>
                <th
                  className="text-center pb-4 font-bold w-1/4"
                  style={{ color: dark }}
                >
                  Weekly
                </th>
                <th
                  className="text-center pb-4 font-bold w-1/4"
                  style={{ color: dark }}
                >
                  Monthly
                </th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row) => (
                <tr
                  key={row.label}
                  className="border-t"
                  style={{ borderColor: "#f5f5f5" }}
                >
                  <td className="py-4 text-gray-600 font-medium">
                    {row.label}
                  </td>
                  <td className="py-4 text-center">
                    {row.weekly ? (
                      <CheckCircleSolid
                        className="w-5 h-5 inline-block"
                        style={{ color: accent }}
                      />
                    ) : (
                      <MinusIcon className="w-5 h-5 inline-block text-gray-300" />
                    )}
                  </td>
                  <td className="py-4 text-center">
                    {row.monthly ? (
                      <CheckCircleSolid
                        className="w-5 h-5 inline-block"
                        style={{ color: accent }}
                      />
                    ) : (
                      <MinusIcon className="w-5 h-5 inline-block text-gray-300" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🛡️ Trust Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {trustItems.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              data-aos="zoom-in-up"
              data-aos-delay={i * 120}
              className="flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ borderColor: "#f0f0f0" }}
            >
              <div
                className="shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
                style={{
                  backgroundColor: "#fff5f3",
                  border: "1px solid #fdd5cc",
                }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: accent }}
                />
              </div>
              <div>
                <p
                  className="font-bold text-sm"
                  style={{ color: dark }}
                >
                  {title}
                </p>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        data-aos="fade-up"
        className="relative w-full overflow-hidden"
        style={{ minHeight: "400px" }}
      >
        <img
          src={heropic}
          alt="Explore more"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(26,60,52,0.94) 0%, rgba(26,60,52,0.75) 55%, rgba(26,60,52,0.40) 100%)",
          }}
        />

        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            right: "6%",
            transform: "translateY(-50%)",
            width: "380px",
            height: "380px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(232,71,42,0.22) 0%, transparent 70%)",
            filter: "blur(45px)",
          }}
        />

        <div
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-20
          flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className="flex-1">
            <div
              className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.10)",
                border: "1px solid rgba(255,255,255,0.20)",
                backdropFilter: "blur(8px)",
              }}
            >
              <SparklesIcon className="w-3.5 h-3.5 text-white/70" />
              <span className="text-white/80 text-xs font-semibold tracking-widest uppercase">
                Limited Offer
              </span>
            </div>

            <h2
              className="text-white font-extrabold leading-tight mb-4"
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
              }}
            >
              Ready to explore more?
            </h2>

            <p className="text-white/60 text-base leading-relaxed max-w-md">
              Subscribe now and start your unforgettable
              journey with WanderLust. Your next adventure is
              just one click away.
            </p>
          </div>

          <div className="flex flex-col gap-4 shrink-0 w-full md:w-auto">
            <button
              onClick={() => handlePayment("MONTHLY", monthlyPrice)}
              disabled={paymentLoading}
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-full
              font-bold text-white text-sm transition-all duration-300
              hover:scale-105 active:scale-95 whitespace-nowrap
              disabled:opacity-60"
              style={{
                backgroundColor: accent,
                boxShadow:
                  "0 8px 36px rgba(232,71,42,0.52)",
              }}
            >
              {paymentLoading === "MONTHLY" ? (
                <span className="flex items-center gap-2">
                  <Spinner />
                  Processing...
                </span>
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-full
              font-semibold text-sm text-white transition-all duration-300
              hover:scale-105 active:scale-95 whitespace-nowrap"
              style={{
                background: "rgba(255,255,255,0.12)",
                border:
                  "1.5px solid rgba(255,255,255,0.28)",
                backdropFilter: "blur(10px)",
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}