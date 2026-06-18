import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
const Card = ({ image, title, description, rating, price }) => {
 useEffect(() => {
  AOS.init({ duration: 800, once: true });
}, []);
  return (
    <div className="w-[300px] bg-white rounded-2xl shadow-sm overflow-hidden "data-aos="zoom-in">
      {/* Image */}
      <div className="h-[180px] w-full overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title + Rating */}
        <div className="flex justify-between mb-1">
          <h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>

          <div className=" gap-1 text-[13px] text-[#94492E]">
            <span className="text-[#94492E] text-[14px]">★</span>
            {rating}
          </div>
        </div>

        <p className="text-[13px] text-left text-gray-500 mb-7!">{description}</p>

        {/* Price + Button */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-gray-500 uppercase text-left tracking-wide">
              Price
            </p>
            <p className="text-[15px] font-semibold text-blue-600">
              ${price}
              <span className="text-gray-500 text-[12px] font-normal">
                /night
              </span>
            </p>
          </div>

          <button className="bg-[#EE5E44] text-white text-[12px] px-8! py-1.5 rounded-full hover:bg-orange-600 transition">
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
