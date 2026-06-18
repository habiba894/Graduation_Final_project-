import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const CTA = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div
      className="ctaSec bg-white py-10 md:py-20"
      data-aos="fade-up"
      data-aos-anchor-placement="top-bottom"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        
        <div className="p-6 md:p-12 lg:p-16 rounded-2xl text-white bg-linear-to-r from-[#EE5E44] to-[#1B6D7E] text-center">
          
          {/* TITLE */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Ready to book your next horizon?
          </h2>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4">
            
            <button
              className="bg-[#1B6D7E] text-white px-5 py-3 md:py-4 rounded-full w-full sm:w-auto"
              data-aos="fade-up"
              data-aos-anchor-placement="center-bottom"
            >
              Start Planning My Trip
            </button>

            <button
              className="bg-[#EE5E44] px-5 py-3 md:py-4 rounded-full w-full sm:w-auto"
              data-aos="fade-up"
              data-aos-anchor-placement="center-bottom"
            >
              Contact a Concierge
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CTA;