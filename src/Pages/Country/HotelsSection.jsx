import useFavoriteStore from "../../stores/favoriteStore";

const defaultHotelImg = "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop";

const HotelsSection = ({ hotels, countryName, loading }) => {
  const favoriteHotels = useFavoriteStore((state) => state.hotels);
  const addHotel = useFavoriteStore((state) => state.addHotel);
  const removeHotel = useFavoriteStore((state) => state.removeHotel);

  const isFavorite = (hotel) =>
    favoriteHotels.some(
      (f) =>
        f.id === hotel.id &&
        String(f.country || "").toLowerCase().trim() ===
          String(countryName || "").toLowerCase().trim()
    );

  const toggleFavorite = (hotel) => {
    if (isFavorite(hotel)) {
      removeHotel(countryName, hotel.id);
    } else {
      addHotel({
        id: hotel.id,
        name: hotel.name,
        image: hotel.image,
        price: hotel.price,
        link: hotel.link,
        country: countryName,
      });
    }
  };

  return (
    <section className="bg-gray-50 w-full pt-8">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="flex justify-between items-end mb-12" data-aos="fade-up">
          <div className="ml-4 md:ml-8">
            <h2 className="text-4xl font-bold text-gray-600 mb-2">Popular Hotels</h2>
            <p className="text-xl text-gray-600">Exceptional stays that redefine hospitality in {countryName}</p>
          </div>
          <button className="hidden md:flex items-center text-orange-600 text-xl hover:text-orange-700 hover:underline hover:cursor-pointer transition-colors">
            View All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-96 animate-pulse shadow-lg" />)}
          </div>
        )}

        {!loading && hotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={hotel.id * 100}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    loading="lazy"
                    src={`/${hotel.image}`}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = defaultHotelImg; }}
                  />
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(hotel); }}
                    className={`absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 ${isFavorite(hotel) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                      }`}
                  >
                    <svg className="w-5 h-5" fill={isFavorite(hotel) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-600">{hotel.name}</h3>
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-600">{hotel.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      {hotel.price && (
                        <>
                          <span className="text-2xl font-bold text-orange-600">{hotel.price.split("/")[0]}</span>
                          <span className="text-gray-500 text-sm">/night</span>
                        </>
                      )}
                    </div>
                    <a
                      href={hotel.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 hover:cursor-pointer transition-colors shadow-md hover:shadow-lg text-sm"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HotelsSection;