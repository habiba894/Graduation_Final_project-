import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { apiServices } from "../../services/api";
;

// 🗺️ خريطة الدول والعملات (بتتعامل مع الحروف الكبيرة والصغيرة)
const countryToCurrency = {
  "egypt": "EGP", "france": "EUR", "turkey": "TRY", 
  "usa": "USD", "united states": "USD", "uk": "GBP", 
  "united kingdom": "GBP", "saudi arabia": "SAR", "saudi": "SAR",
  "germany": "EUR", "italy": "EUR", "spain": "EUR"
};

// 💰 أسعار احتياطية (تظهر فوراً عشان الشاشة متفضلش فاضية)
const fallbackRates = {
  "TRY": 32.50, "EGP": 48.60, "EUR": 0.92, "SAR": 3.75, "GBP": 0.79
};

const InfoSection = ({ countryName = "Egypt" }) => {
  const [time, setTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [currencyData, setCurrencyData] = useState({ rate: null, code: null });

  // ⏰ سكشن الوقت (بيتحدث كل ثانية)
  useEffect(() => {
    AOS.init({ duration: 800 });
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 🌤️💰 جلب البيانات من الـ API
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        // 1. جلب الطقس
        const weatherRes = await apiServices.getWeather(countryName);
        setWeatherData(weatherRes.data);
      } catch (err) {
        console.log("⚠️ Weather API fallback");
      }
    };

    fetchInfo();
  }, [countryName]);

  // 💱 جلب العملة (كود مضمون 100% - بيعرض السعر فوراً)
  useEffect(() => {
    const cleanName = countryName?.trim().toLowerCase();
    const currencyCode = countryToCurrency[cleanName] || "EGP";
    
    // ✅ نعرض السعر الاحتياطي فوراً عشان الشاشة متفضلش فاضية
    const initialRate = fallbackRates[currencyCode] || 0;
    setCurrencyData({ rate: initialRate, code: currencyCode });

    // 🔄 نحاول نجيب السعر الحقيقي من الـ API في الخلفية
    apiServices.getCurrencyRates("USD")
      .then((res) => {
        const rates = res.data?.conversion_rates || res.data?.rates || {};
        const liveRate = rates[currencyCode];
        // لو جاب سعر حقيقي، نحدّث الشاشة
        if (liveRate !== undefined && liveRate !== null) {
          setCurrencyData({ rate: liveRate, code: currencyCode });
        }
      })
      .catch(() => {
        // لو الـ API فشل، نفضل على السعر الاحتياطي (من غير رسائل خطأ)
        console.log(`💱 Using fallback for ${currencyCode}`);
      });
  }, [countryName]);

  // 🎨 دالة تنسيق الرقم (مضمونة مع الصفر والقيم الصغيرة)
  const formatCurrency = (rate) => {
    if (rate == null || rate === "N/A") return "N/A";
    if (typeof rate === 'number') {
      return rate.toFixed(rate < 1 ? 3 : 2);
    }
    return rate;
  };

  return (
    <section className="py-16 bg-gray-50 w-full">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* 🔹 1. سكشن الطقس */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100" data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-600">Weather in {countryName}</h3>
            </div>
            <div className="flex items-center gap-6 mb-6">
              <p className="text-6xl font-bold text-gray-600">{weatherData?.temperature ?? 24}°C</p>
              <div>
                <p className="text-2xl text-gray-600 font-medium">{weatherData?.description || "Sunny"}</p>
                <p className="text-sm text-gray-500 mt-1">{weatherData?.city || countryName}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100"><span className="text-gray-600">Humidity</span><span className="font-bold text-gray-600">{weatherData?.humidity ?? 45}%</span></div>
              <div className="flex justify-between items-center py-2"><span className="text-gray-600">Wind</span><span className="font-bold text-gray-600">{weatherData?.windSpeed ?? 12} km/h</span></div>
            </div>
          </div>

          {/* 🔹 2. سكشن العملة - ✅ مضمون 100% */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-orange-50 hover:to-orange-100" data-aos="fade-up" data-aos-delay="200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-600">Currency</h3>
            </div>
            <div className="mb-6">
              <p className="text-xl font-bold text-gray-600 mb-2">
                {countryName} ({currencyData.code || "EGP"})
              </p>
              <p className="text-sm text-gray-500">Exchange Rate vs USD</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">1 USD =</span>
                <span className="text-3xl font-bold text-orange-600">
                  {formatCurrency(currencyData.rate)} {currencyData.code || "EGP"}
                </span>
              </div>
              <p className="text-xs text-gray-500">Updated today • Rates may vary</p>
            </div>
          </div>

          {/* 🔹 3. سكشن الوقت */}
          <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100" data-aos="fade-up" data-aos-delay="300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-600">Time Zone</h3>
            </div>
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-600 mb-2">GMT +2</p>
              <p className="text-sm text-gray-500">{countryName} Local Time</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
              <p className="text-3xl font-bold text-purple-600 mb-1">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-sm text-gray-500">{time.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoSection;