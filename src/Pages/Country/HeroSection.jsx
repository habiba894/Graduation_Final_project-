import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import countryData from "../../data/country_data";
import { apiServices } from "../../services/api";
import RoutesList from "../../utils/routesList";

const HeroSectionWithCards = ({ selectedCountry }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const [countryInfoData, setCountryInfoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCountryInfo, setShowCountryInfo] = useState(false);
  const [countryCode, setCountryCode] = useState("eg");

  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const lastFetchedCountry = useRef(null);
  const navigate = useNavigate();

  // 🔹 تحسين useMemo + إضافة تحقق للسلامة
  const slides = useMemo(() => {
    return countryData[selectedCountry].images.map((img, index) => ({
      id: index,
      country: selectedCountry,
      title: countryData[selectedCountry].title,
      subtitle: countryData[selectedCountry].subtitle,
      image: img,
      overlay: countryData[selectedCountry].overlay,
      temperature: countryData[selectedCountry].temperature,
      weather: countryData[selectedCountry].weather,
      city: countryData[selectedCountry].city,
      highlights: countryData[selectedCountry].highlights,
    }));
  }, [selectedCountry]);


  const fetchCountryInfo = useCallback(async (name) => {
    try {
      setLoading(true);
      const response = await apiServices.getCountryByName(name);
      setCountryInfoData(response.data);
      const currencyCode = response.data?.currencies ? Object.keys(response.data.currencies)[0] : null;
      const flagCode = getFlagCode(name, currencyCode);
      setCountryCode(flagCode);
      setShowCountryInfo(true);
    } catch (err) {
      console.error("Error fetching country:", err);
      setShowCountryInfo(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeather = async (countryName) => {
    try {
      setWeatherLoading(true);
      const response = await apiServices.getWeather(countryName);
      setWeatherData({
        temperature: response.data?.temperature,
        description: response.data?.description,
        humidity: response.data?.humidity,
        windSpeed: response.data?.windSpeed,
        city: response.data?.city,
        country: response.data?.country
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  };

  // ✅ 2. تحسين دالة getFlagCode عشان تكون أكثر أماناً
  const getFlagCode = (name, currency) => {
    const map = {
      Egypt: "eg", France: "fr", Turkey: "tr", Italy: "it",
      Spain: "es", Germany: "de", UK: "gb", "United States": "us",
      USA: "us", "United Kingdom": "gb"
    };
    if (map[name]) return map[name];
    if (currency) return currency.toLowerCase();
    const shortName = name.toLowerCase().replace(/\s+/g, '').slice(0, 2);
    return shortName || "xx"; // fallback آمن
  };

  // 🎨 Helper Functions
  const getCapital = (d) => d?.capital?.[0] || "N/A";
  const getPopulation = (p) => p?.toLocaleString("en-US") || "N/A";
  const getLanguages = (l) => l ? Object.values(l).slice(0, 2).join(", ") : "N/A";
  const getCurrencies = (c) => c ? Object.entries(c).map(([code, info]) => `${info.name} (${code})`).slice(0, 1).join(", ") : "N/A";
  const getTimezone = (t) => t?.[0]?.replace("UTC", "GMT") || "N/A";

  useEffect(() => {
    if (selectedCountry) setCurrentSlide(0);
  }, [selectedCountry]);

  useEffect(() => {
    const country = selectedCountry || slides[currentSlide]?.country;
    if (country && country !== lastFetchedCountry.current) {
      lastFetchedCountry.current = country;
      fetchCountryInfo(country);
      fetchWeather(country);
    }
  }, [selectedCountry, currentSlide, slides, fetchCountryInfo]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [currentSlide, isHovered, nextSlide]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextSlide, prevSlide]);

  const current = slides[currentSlide];
  console.log(current.image)
  const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
  const prevSlideData = slides[prevIndex]; // ✅ 4. تعريف متغير للسلامة

  // 🌤️ عرض الداتا
  const displayTemp = weatherData && !weatherLoading
    ? `${Math.round(weatherData.temperature)}°C`
    : current.temperature;
  const displayWeather = weatherData && !weatherLoading
    ? weatherData.description
    : current.weather;
  const displayCity = weatherData?.city || current.city;

  const countryInfoCards = [
    { id: 101, name: "Capital", value: countryInfoData ? getCapital(countryInfoData) : "N/A", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, color: "bg-blue-50 text-blue-600" },
    { id: 102, name: "Population", value: countryInfoData ? getPopulation(countryInfoData.population) : "N/A", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, color: "bg-indigo-50 text-indigo-600" },
    { id: 103, name: "Languages", value: countryInfoData ? getLanguages(countryInfoData.languages) : "N/A", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>, color: "bg-red-50 text-red-600" },
    { id: 104, name: "Currency", value: countryInfoData ? getCurrencies(countryInfoData.currencies) : "N/A", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "bg-yellow-50 text-yellow-600" },
    { id: 105, name: "Timezone", value: countryInfoData ? getTimezone(countryInfoData.timezones) : "N/A", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "bg-purple-50 text-purple-600" },
    { id: 106, name: "Subregion", value: countryInfoData ? (countryInfoData.subregion || countryInfoData.region || "N/A") : "N/A", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "bg-green-50 text-green-600" }
  ];

  return (
    <div className="relative overflow-y-hidden">
      <section
        className="relative h-175 md:h-screen overflow-y-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Layers */}
        <div className="absolute inset-0 transition-opacity duration-700 ease-out">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              // ✅ 5. حماية من undefined باستخدام ?. و ||
              backgroundImage: `url('${prevSlideData?.image || ""}')`,
              transition: 'transform 8s ease-out'
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${prevSlideData?.overlay || ''} opacity-0`} />
        </div>

        {/* Current Slide */}
        <div className="absolute inset-0">
          <img
            src={current.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* <div
            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
            style={{
              backgroundImage: `url('${current.image}')`,
              transform: `scale(${isHovered ? 1.1 : 1.05}) translateX(${isHovered ? (direction * 2) : 0}px)`
            }}
          /> */}
          <div className={`absolute inset-0 bg-gradient-to-br ${current.overlay} transition-all duration-700`} />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent animate-pulse" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          </div>
          <div className="absolute inset-0 opacity-[0.03] bg-[url('image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGRlZnM+PHBhdHRlcm4gaWQ9Im5vaXNlIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0iI2ZmZiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNub2lzZSkiLz48L3N2Zz4=')] pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-6 md:px-12 h-full flex items-center">
          <>{current.image}</>
          <div className="max-w-3xl">
            <h1
              key={`title-${currentSlide}`}
              className="text-7xl md:text-9xl font-black mb-5 leading-none text-white drop-shadow-2xl"
              style={{
                fontFamily: "'Satisfy', cursive",
                animation: 'titleReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                textShadow: "0 10px 40px rgba(0,0,0,0.4)"
              }}
            >
              {current.title}
            </h1>
            <p
              key={`subtitle-${currentSlide}`}
              className="text-2xl md:text-4xl text-white/95 mb-10 font-light leading-relaxed max-w-2xl"
              style={{
                fontFamily: "'Satisfy', cursive",
                animation: 'contentReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards',
                opacity: 0,
                textShadow: "0 4px 20px rgba(0,0,0,0.3)"
              }}
            >
              {current.subtitle}
            </p>

            {/* 🌤️ Weather Card */}
            <div
              key={`weather-${currentSlide}`}
              className="inline-flex items-center gap-6 px-8 py-5 bg-white/15 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl shadow-black/20"
              style={{
                animation: 'contentReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards',
                opacity: 0
              }}
            >
              <div className="flex items-center gap-4 pr-6 border-r border-white/20">
                <div className="relative">
                  <svg className="w-12 h-12 text-amber-300 drop-shadow-lg animate-pulse-slow" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-lg animate-ping" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">
                    {weatherLoading ? <span className="animate-pulse">--°C</span> : displayTemp}
                  </p>
                  <p className="text-sm text-white/80 font-medium capitalize">
                    {weatherLoading ? <span className="animate-pulse">Loading...</span> : displayWeather}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pl-2">
                <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-lg font-semibold text-white">{displayCity}</p>
                  <p className="text-xs text-white/60">{weatherData?.country || current.country}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div
              key={`stats-${currentSlide}`}
              className="mt-8 flex flex-wrap gap-4"
              style={{
                animation: 'contentReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.45s forwards',
                opacity: 0
              }}
            >
              {/* ✅ 6. تحسين key في الـ map */}
              {current.highlights.map((item, i) => (
                <span
                  key={`${current.country}-${i}`}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}

              <button
                onClick={() =>
                  navigate(RoutesList.TripPlan(current.country), {
                    state: { country: current.country, },
                  })
                }
                className="flex items-center gap-2 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold border border-white/30 hover:bg-white/30 hover:gap-3 transition-all duration-300"
              >
                Plan Your Trip
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Triangle Navigation Buttons */}
        <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 group/triangle" aria-label="Previous destination">
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover/triangle:-translate-x-1">
                <path d="M 28 8 L 28 32 L 10 20 Z" className="fill-white/15 stroke-white/40 stroke-1 group-hover/triangle:fill-white/25 transition-all duration-300" />
                <path d="M 28 8 L 28 32 L 10 20 Z" className="fill-transparent stroke-amber-400/60 stroke-[0.5] opacity-0 group-hover/triangle:opacity-100 transition-opacity duration-300" />
              </svg>
            </div>
            <svg className="relative w-5 h-5 md:w-6 md:h-6 text-white/90 group-hover/triangle:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="absolute inset-0 bg-amber-400/0 group-hover/triangle:bg-amber-400/10 rounded-lg transition-colors duration-300" />
          </div>
        </button>

        <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 group/triangle" aria-label="Next destination">
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-lg transition-transform duration-300 group-hover/triangle:translate-x-1">
                <path d="M 12 8 L 12 32 L 30 20 Z" className="fill-white/15 stroke-white/40 stroke-1 group-hover/triangle:fill-white/25 transition-all duration-300" />
                <path d="M 12 8 L 12 32 L 30 20 Z" className="fill-transparent stroke-amber-400/60 stroke-[0.5] opacity-0 group-hover/triangle:opacity-100 transition-opacity duration-300" />
              </svg>
            </div>
            <svg className="relative w-5 h-5 md:w-6 md:h-6 text-white/90 group-hover/triangle:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            <div className="absolute inset-0 bg-amber-400/0 group-hover/triangle:bg-amber-400/10 rounded-lg transition-colors duration-300" />
          </div>
        </button>
      </section>

      {/* Category Cards */}
      <div className="relative z-30 -mt-12 md:-mt-16 lg:-mt-20 pb-8">

        <div className="container mx-auto px-4 md:px-6">
          {showCountryInfo && countryInfoData && !loading && (
            // ✅ 7. تحسين الـ Grid للموبايل (إضافة sm:grid-cols-3)
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {countryInfoCards.map((card) => (
                <div
                  key={`${card.id}-${countryCode}`} // ✅ 8. key أفضل باستخدام الدولة
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-300 
                             hover:shadow-2xl hover:scale-105 hover:border-gray-300
                             active:scale-95 active:shadow-inner
                             border border-gray-200 cursor-default"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${card.color} flex items-center justify-center mx-auto mb-3`}>
                    {card.icon}
                  </div>
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-500 text-center uppercase tracking-wide mb-2">
                    {card.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-gray-800 text-center break-words">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes titleReveal {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(10px); }
          50% { filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes contentReveal {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 10px) scale(1.05); }
        }
        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default HeroSectionWithCards;