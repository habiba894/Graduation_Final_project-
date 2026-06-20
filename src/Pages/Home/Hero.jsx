import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useRef, useState } from "react";

import paris from "../../assets/banner/paris.jpg";
import pyramids from "../../assets/banner/pyramids.jpg";
import turkey from "../../assets/banner/turky.jpg";

import { useNavigate } from "react-router-dom";
import RoutesList from "../../utils/routesList";

const images = [pyramids, paris, turkey];

const BHero = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [budget, setBudget] = useState("");

  const navigate = useNavigate();

  const intervalRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [current]);

  const next = () =>
    setCurrent((prev) => (prev + 1) % images.length);

  useEffect(() => {
    if (paused) return;

    intervalRef.current = setInterval(next, 4000);

    return () => clearInterval(intervalRef.current);
  }, [paused]);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;

    const x = (e.clientX / innerWidth - 0.5) * 2;
    const y = (e.clientY / innerHeight - 0.5) * 2;

    setMouse({ x, y });
  };

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
    <div
      className="relative h-screen flex flex-col justify-center px-4 sm:px-6 md:px-12 text-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onMouseMove={handleMouseMove}
    >
      {/* background */}
      <div
        className="absolute inset-0 transition-all duration-1200 ease-out"
        style={{
          backgroundImage: `url(${images[current]})`,
          backgroundSize: "cover",
          backgroundPosition: `${50 + mouse.x * 5}% ${50 + mouse.y * 5
            }%`,
          transform: `scale(1.1) translate(${mouse.x * 20}px, ${mouse.y * 20
            }px)`,
        }}
      />

      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>



      {/* side cards */}
      <div className="hidden md:flex absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 gap-3 lg:gap-4 z-20 overflow-hidden">
        {images.map((img, i) => {
          const index = (current + i + 1) % images.length;

          return (
            <div
              key={i}
              onClick={() => setCurrent(index)}
              className="cursor-pointer w-20 sm:w-24 md:w-28 lg:w-32 h-32 sm:h-40 md:h-48 lg:h-56 rounded-2xl bg-cover bg-center shadow-xl transition-all duration-500"
              style={{
                backgroundImage: `url(${images[index]})`,
                transform: `
                  translateY(${mouse.y * 10}px)
                  scale(${1 - i * 0.1})
                `,
                opacity: 1 - i * 0.3,
              }}
            />
          );
        })}
      </div>

      {/* content */}
      <div
        key={current}
        className="relative z-30 max-w-full md:max-w-175"
      >
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
          {/* destination */}
          <div className="flex-1 px-2 border-b md:border-b-0 md:border-r border-gray-200">
            <p className="text-xs text-teal-900 text-start">
              Destination
            </p>

            <input
              className="w-full outline-none text-sm"
              placeholder="Where are you going?"
              value={destination}
              onChange={(e) =>
                setDestination(e.target.value)
              }
            />
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