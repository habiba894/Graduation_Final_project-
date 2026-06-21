import useFavoriteStore from "../../stores/favoriteStore";

const defaultRestaurantImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop";

const RestaurantsSection = ({ restaurants, countryName, loading }) => {
  const favoriteRestaurants = useFavoriteStore((state) => state.restaurants);
  const addRestaurant = useFavoriteStore((state) => state.addRestaurant);
  const removeRestaurant = useFavoriteStore((state) => state.removeRestaurant);

  const isFavorite = (restaurant) =>
    favoriteRestaurants.some(
      (f) =>
        f.id === restaurant.id &&
        String(f.country || "").toLowerCase().trim() ===
          String(countryName || "").toLowerCase().trim()
    );

  const toggleFavorite = (restaurant) => {
    if (isFavorite(restaurant)) {
      removeRestaurant(countryName, restaurant.id);
    } else {
      addRestaurant({
        id: restaurant.id,
        name: restaurant.name,
        image: restaurant.image,
        country: countryName,
      });
    }
  };

  return (
    <section className="py-12 bg-gray-50 w-full">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="flex justify-between items-end mb-10" data-aos="fade-up">
          <div>
            <h2 className="text-3xl font-bold text-gray-600 mb-1">Popular Restaurants</h2>
            <p className="text-lg text-gray-600">Exceptional dining across {countryName}</p>
          </div>
          <button className="hidden md:flex items-center text-orange-600 hover:text-orange-700 transition-colors">
            View All
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-lg"></div>)}
          </div>
        )}

        {!loading && restaurants.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <div
                key={r.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                data-aos="fade-up"
                data-aos-delay={r.id * 50}
              >

                <div className="relative h-48 overflow-hidden shrink-0">
                  <img
                    loading="lazy"
                    src={`/${r.image}`}
                    alt={r.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultRestaurantImage; }}
                  />


                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(r); }}
                    className={`absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 ${isFavorite(r) ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                      }`}
                    aria-label={isFavorite(r) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <svg className="w-5 h-5" fill={isFavorite(r) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                <div className="p-5 grow flex flex-col">
                  {/* ⭐ السطر الأول: الاسم + الريتنج */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-600 line-clamp-1">{r.name}</h3>
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-600">{r.stars}.0</span>
                    </div>
                  </div>

                  {/* 🍽️ نوع الأكل (بدون خلفية دائرية - نص بسيط) */}
                  <div className="mb-3">
                    <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <span className="text-gray-400">🍽️</span>
                      {r.kindOfFood}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-1.5 text-gray-500 flex-1 min-w-0">
                      <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm line-clamp-1">{r.location}</span>
                    </div>

                    <button
                      className="px-5 py-2 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 hover:cursor-pointer transition-colors shadow-md hover:shadow-lg text-sm"
                      onClick={() => window.open(r.instagram, '_blank', 'noopener,noreferrer')}
                    >
                      Instagram
                    </button>
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

export default RestaurantsSection;