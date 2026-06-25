import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef, useState } from "react";

import paris from "../../assets/banner/paris.jpg";
import pyramids from "../../assets/banner/pyramids.jpg";
import turkey from "../../assets/banner/turky.jpg";

import { useNavigate } from "react-router-dom";
import RoutesList from "../../utils/routesList";
import HeroSlider from "./HeroSlider";

const images = [pyramids, paris, turkey];

const DESTINATIONS = [
  { name: "Egypt", flag: "🇪🇬" },
  { name: "France", flag: "🇫🇷" },
  { name: "Turkey", flag: "🇹🇷" },
];

const BHero = () => {
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [budget, setBudget] = useState("");
  const [destinationOpen, setDestinationOpen] = useState(false);

  const navigate = useNavigate();
  const destinationRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  // close the destination dropdown when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (destinationRef.current && !destinationRef.current.contains(e.target)) {
        setDestinationOpen(false);
      }
    };
    if (destinationOpen) {
      document.addEventListener("click", handleOutsideClick);
    }
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [destinationOpen]);

  const handleSearch = () => {

    // if (!destination) return;

    navigate(RoutesList.Country(destination.toLowerCase() || "egypt"), {
      state: {
        country: destination,
        travelDate,
        budget,
      },
    });
  };

  return (
    <div className="relative h-screen flex flex-col justify-center px-4 sm:px-6 md:px-12 text-white overflow-hidden">
      {/* background + side thumbnails — isolated, never re-renders this component */}
      <HeroSlider images={images} />

      {/* content */}
      <div className="relative z-30 max-w-full md:max-w-175">
        <h1
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight"
        >
          Your complete guide for a{" "}
          <span className="text-[#d14b30]">seamless</span> travel
          experience
        </h1>

        <div
          data-aos="fade-up"
          data-aos-delay="300"
          className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <button className="bg-[#d14b30] px-5 py-2 rounded-full hover:scale-105 transition">
            Start Planning
          </button>

          <button className="bg-transparent border border-[#d14b30] text-[#d14b30] font-extrabold px-5 py-2 rounded-full hover:scale-105 transition">
            Explore Now
          </button>
        </div>

        {/* search card */}
        <div
          data-aos="fade-up"
          data-aos-delay="500"
          className="mt-10 sm:mt-12 md:mt-15 bg-white text-black p-3 md:p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center gap-3 shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl"
        >
          {/* destination dropdown */}
          <div
            ref={destinationRef}
            className="relative flex-1 px-2 border-b md:border-b-0 md:border-r border-gray-200"
          >
            <p className="text-xs text-teal-900 text-start">
              Destination
            </p>

            <button
              type="button"
              onClick={() => setDestinationOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-2 text-sm text-left py-0.5"
            >
              <span className={destination ? "text-black" : "text-gray-400"}>
                {destination
                  ? `${DESTINATIONS.find((d) => d.name === destination)?.flag || ""} ${destination}`
                  : "Where are you going?"}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-200 ${destinationOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {destinationOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-50">
                {DESTINATIONS.map((d) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => {
                      setDestination(d.name);
                      setDestinationOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 text-left px-3.5 py-2 text-sm transition ${destination === d.name
                        ? "bg-[#d14b30]/10 text-[#d14b30] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-base">{d.flag}</span>
                    {d.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* date */}
          <div className="flex-1 px-2 border-b md:border-b-0 md:border-r border-gray-200">
            <p className="text-xs text-start text-teal-900">
              Travel Dates
            </p>

            <input
              className="w-full outline-none text-sm"
              placeholder="mm/dd/yyyy"
              value={travelDate}
              onChange={(e) =>
                setTravelDate(e.target.value)
              }
            />
          </div>

          {/* budget */}
          <div className="flex-1 px-2">
            <p className="text-xs text-teal-900 text-start">
              Budget
            </p>

            <input
              className="w-full outline-none text-sm"
              placeholder="$1000 - $5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          {/* search btn */}
          <button
            onClick={handleSearch}
            className="bg-[#d14b30] text-white px-3 py-2 rounded-xl hover:scale-105 transition flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line
                x1="20"
                y1="20"
                x2="16.65"
                y2="16.65"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BHero;