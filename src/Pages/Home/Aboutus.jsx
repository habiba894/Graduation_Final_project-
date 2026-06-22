import {
  BoltIcon,
  GlobeAltIcon,
  MapIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import aboutUsImg from "../../assets/about-us.png";

const stats = [
  { value: "50+", label: "Countries Covered" },
  { value: "10K+", label: "Trips Planned" },
  { value: "98%", label: "Happy Travelers" },
  { value: "24/7", label: "Support Available" },
];

const features = [
  {
    Icon: MapIcon,
    title: "Unified Travel Dashboard",
    desc: "All essential pre-travel information in one place — no switching between apps.",
  },
  {
    Icon: BoltIcon,
    title: "Save Time & Effort",
    desc: "Eliminate confusion and wasted time by getting a clear vision before you travel.",
  },
  {
    Icon: UserCircleIcon,
    title: "Personalized Experience",
    desc: "Your profile saves favorites and plans, tailored to your destination, date, and preferences.",
  },
];

const Aboutus = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <section className="relative w-full bg-white overflow-hidden py-20 px-4 md:px-10 lg:px-20">
      {/* subtle background decoration */}
      <div
        className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #e8472a 0%, transparent 70%)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-5 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #1a3c34 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div
          className="flex items-center gap-2 mb-3"
          data-aos="fade-right"
          data-aos-delay="0"
        >
          <span
            className="inline-block w-8 h-1 rounded-full"
            style={{ backgroundColor: "#e8472a" }}
          />
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "#e8472a" }}
          >
            About WanderLust
          </span>
        </div>

        {/* Main Grid */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          {/* ── LEFT: Text ── */}
          <div className="flex-1 w-full">
            {/* Headline */}
            <h2
              className="text-4xl md:text-5xl font-extrabold leading-tight mb-5"
              style={{ color: "#1a3c34" }}
              data-aos="fade-right"
              data-aos-delay="100"
            >
              Your Complete Guide for a{" "}
              <span style={{ color: "#e8472a" }}>Seamless</span> Travel
              Experience
            </h2>

            {/* Description */}
            <p
              className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-xl"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              WanderLust brings together everything you need before your next
              adventure — weather, currency, country insights, curated trip
              plans, and more — all inside one beautiful, unified dashboard built
              for travelers, students, freelancers, and families alike.
            </p>

            {/* Feature List */}
            <div className="flex flex-col gap-5 mb-10">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 group"
                  data-aos="fade-right"
                  data-aos-delay={300 + i * 100}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: "#fff5f3", border: "1px solid #fdd5cc" }}
                  >
                    <f.Icon className="w-5 h-5" style={{ color: "#e8472a" }} />
                  </div>
                  <div>
                    <p
                      className="font-bold text-base mb-0.5"
                      style={{ color: "#1a3c34" }}
                    >
                      {f.title}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap gap-4"
              data-aos="fade-right"
              data-aos-delay="600"
            >
              <button
                className="px-7 py-3 rounded-full font-semibold text-white text-sm shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                style={{ backgroundColor: "#e8472a" }}
              >
                Start Planning
              </button>
              <button
                className="px-7 py-3 rounded-full font-semibold text-sm border-2 transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  color: "#e8472a",
                  borderColor: "#e8472a",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff5f3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Explore Now
              </button>
            </div>
          </div>

          {/* ── RIGHT: Image ── */}
          <div
            className="flex-1 w-full flex justify-center lg:justify-end"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Decorative ring behind image */}
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, #e8472a22 0%, #1a3c3411 100%)",
                  transform: "rotate(3deg) scale(1.04)",
                  borderRadius: "2rem",
                }}
              />

              {/* Image with floating animation */}
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-12px); }
                }
                .floating-img {
                  animation: float 5s ease-in-out infinite;
                }
              `}</style>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl floating-img">
                <img
                  loading="lazy"
                  src={aboutUsImg}
                  alt="About WanderLust"
                  className="w-full h-full object-cover"
                  style={{ minHeight: "340px", maxHeight: "480px" }}
                />
                {/* Subtle overlay gradient at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-24"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(26,60,52,0.35) 0%, transparent 100%)",
                  }}
                />
              </div>

              {/* Floating badge */}
              <div
                className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3"
                data-aos="zoom-in"
                data-aos-delay="600"
                style={{ border: "1px solid #f0f0f0" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#fff5f3" }}
                >
                  <PaperAirplaneIcon className="w-5 h-5" style={{ color: "#e8472a" }} />
                </div>
                <div>
                  <p
                    className="font-extrabold text-lg leading-none"
                    style={{ color: "#1a3c34" }}
                  >
                    10K+
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">Trips Planned</p>
                </div>
              </div>

              {/* Floating badge top-right */}
              <div
                className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3"
                data-aos="zoom-in"
                data-aos-delay="700"
                style={{ border: "1px solid #f0f0f0" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#fff5f3" }}
                >
                  <GlobeAltIcon className="w-5 h-5" style={{ color: "#e8472a" }} />
                </div>
                <div>
                  <p
                    className="font-extrabold text-lg leading-none"
                    style={{ color: "#1a3c34" }}
                  >
                    50+
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">Countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-6 px-4 rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-default"
              style={{
                border: "1px solid #f0ede9",
                background: "linear-gradient(135deg, #fafafa 0%, #fff5f3 100%)",
              }}
            >
              <span
                className="text-3xl font-extrabold"
                style={{ color: "#e8472a" }}
              >
                {s.value}
              </span>
              <span className="text-gray-500 text-sm mt-1 text-center">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Aboutus;