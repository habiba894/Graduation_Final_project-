import useFavoriteStore from "../../stores/favoriteStore";

const defaultPlaceImage = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80";
const PopularPlacesSection = ({ places, countryName, loading }) => {
  const favoritePlaces = useFavoriteStore((state) => state.places);
  const addPlace = useFavoriteStore((state) => state.addPlace);
  const removePlace = useFavoriteStore((state) => state.removePlace);

  const isFavorite = (place) =>
    favoritePlaces.some(
      (f) =>
        f.id === place.id &&
        String(f.country || "").toLowerCase().trim() ===
          String(countryName || "").toLowerCase().trim()
    );

  const toggleFavorite = (place) => {
    if (isFavorite(place)) {
      removePlace(countryName, place.id);
    } else {
      addPlace({
        id: place.id,
        name: place.name,
        image: place.image,
        link: place.link,
        country: countryName,
      });
    }
  };

  const handleImageError = (placeName, e) => {
    console.warn(`⚠️ Image failed to load: ${placeName}`);
    e.target.src = defaultPlaceImage;
    e.target.onerror = null;
  };

  return (
    <section id="popular-places" className="bg-gray-50 w-full pt-8 scroll-mt-24">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="flex justify-between items-end mb-12" data-aos="fade-up">
          <div className="ml-4 md:ml-8">
            <h2 className="text-4xl font-bold text-gray-600 mb-2">Popular Places</h2>
            <p className="text-xl text-gray-600">Must-visit destinations that capture the essence of {countryName}</p>
          </div>
          <button className="hidden md:flex items-center text-orange-600 text-xl hover:text-orange-700 hover:underline hover:cursor-pointer transition-colors">
            View All
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse shadow-lg"></div>
            ))}
          </div>
        )}

        {!loading && places.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {places.map((place) => (
              <div
                key={place.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={place.id * 100}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    loading="lazy"
                    src={`/${place.image}`}  // ✅ الصورة المحلية مباشرة
                    alt={place.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => handleImageError(place.name, e)}
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(place);
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 ${isFavorite(place) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                      }`}
                    aria-label={isFavorite(place) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <svg className="w-5 h-5" fill={isFavorite(place) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-600 mb-2">{place.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{place.description}</p>

                  <div className="flex justify-between items-center">
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(place.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 font-semibold text-sm flex items-center gap-1 hover:underline hover:cursor-pointer"
                      title={`View ${place.name} on Google Maps`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Explore
                    </a>

                    <a
                      href={place.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 hover:cursor-pointer transition-colors shadow-md hover:shadow-lg text-sm flex items-center gap-1"
                      title={`Learn more about ${place.name}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Learn More
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ رسالة لو مفيش أماكن */}
        {!loading && places.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600 text-lg">No places available at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularPlacesSection;