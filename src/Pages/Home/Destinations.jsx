import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const places = [
  { name: "Dubai, UAE", img: "destinations/dubai.png" },
  { name: "Egypt", img: "destinations/egypt.jpg" },
  { name: "Italy", img: "destinations/italy.jpg" },
  { name: "Paris, France", img: "destinations/paris.png" },
];

export default function Destinations() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="bg-white py-12 px-6 max-w-6xl mx-auto">

      {/* header */}
      <div className="flex justify-between pb-8 bg-white">
        <div>
          <h2 className="text-3xl! font-bold! text-teal-700! text-left">
            Top Destinations
          </h2>
          <p className="text-gray-500 font-bold ">
            Explore amazing places around the world
          </p>
        </div>

        <button className="text-teal-600 text-sm hover:underline">
          View all →
        </button>
      </div>

      {/* grid */}
      <div className="grid md:grid-cols-3 gap-4 ">

        {/* big image */}
        <div
          className="md:col-span-2 md:row-span-1 rounded-xl overflow-hidden h-110 "
          data-aos="fade-right"
        >
          <img
            loading="lazy"
            src={places[0].img}
            alt={places[0].name}
            className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
          />

          <h3 className="mt-2 text-lg font-semibold">
            {places[0].name}
          </h3>
        </div>

        {/* right side */}
        <div className="flex flex-col gap-4">

          {/* top right */}
          <div
            className="rounded-xl overflow-hidden  md:h-52"
            data-aos="fade-left"
          >
            <img
              loading="lazy"
              src={places[1].img}
              alt={places[1].name}
              className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
            />

            <p className="mt-2 font-medium">
              {places[1].name}
            </p>
          </div>

          {/* bottom two */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            {places.slice(2).map((place, i) => (
              <div
                key={i}
                className="rounded-xl "
                data-aos="fade-up"
              >
                <img
                  loading="lazy"
                  src={place.img}
                  alt={place.name}
                  className="w-full h-50 object-cover transform hover:scale-110 transition duration-500 rounded-xl"
                />

                <p className="mt-2 text-sm">
                  {place.name}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}