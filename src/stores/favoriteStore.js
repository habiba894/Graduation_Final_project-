import { create } from "zustand";
import { persist } from "zustand/middleware";

// ======================================================
// KEY HELPER
// ======================================================
// Root cause of the cross-country bug: items were matched by `id`
// alone, but each country has its own hotels/restaurants/places
// that restart numbering from 1. "Hotel #1 in Egypt" and
// "Hotel #1 in France" are different items but had the same id.
//
// Fix: every match/add/remove now uses a composite key built from
// BOTH the country name AND the item id. Country is lowercased so
// "Egypt" and "egypt" can't create two separate favorites.
const makeKey = (country, id) =>
  `${String(country || "")
    .toLowerCase()
    .trim()}::${id}`;

const matchesItem = (item, country, id) =>
  makeKey(item.country, item.id) === makeKey(country, id);

const useFavoriteStore = create(
  persist(
    (set, get) => ({
      hotels: [],
      restaurants: [],
      places: [],

      // ======================================================
      // HOTELS
      // ======================================================
      addHotel: (hotel) =>
        set((state) => ({
          hotels: state.hotels.some((item) =>
            matchesItem(item, hotel.country, hotel.id),
          )
            ? state.hotels
            : [...state.hotels, hotel],
        })),

      removeHotel: (country, hotelId) =>
        set((state) => ({
          hotels: state.hotels.filter(
            (item) => !matchesItem(item, country, hotelId),
          ),
        })),

      isHotelFavorite: (country, hotelId) =>
        get().hotels.some((item) => matchesItem(item, country, hotelId)),

      getHotels: () => get().hotels,

      // ======================================================
      // RESTAURANTS
      // ======================================================
      addRestaurant: (restaurant) =>
        set((state) => ({
          restaurants: state.restaurants.some((item) =>
            matchesItem(item, restaurant.country, restaurant.id),
          )
            ? state.restaurants
            : [...state.restaurants, restaurant],
        })),

      removeRestaurant: (country, restaurantId) =>
        set((state) => ({
          restaurants: state.restaurants.filter(
            (item) => !matchesItem(item, country, restaurantId),
          ),
        })),

      isRestaurantFavorite: (country, restaurantId) =>
        get().restaurants.some((item) =>
          matchesItem(item, country, restaurantId),
        ),

      getRestaurants: () => get().restaurants,

      // ======================================================
      // PLACES
      // ======================================================
      addPlace: (place) =>
        set((state) => ({
          places: state.places.some((item) =>
            matchesItem(item, place.country, place.id),
          )
            ? state.places
            : [...state.places, place],
        })),

      removePlace: (country, placeId) =>
        set((state) => ({
          places: state.places.filter(
            (item) => !matchesItem(item, country, placeId),
          ),
        })),

      isPlaceFavorite: (country, placeId) =>
        get().places.some((item) => matchesItem(item, country, placeId)),

      getPlaces: () => get().places,

      // ======================================================
      // CLEAR ALL
      // ======================================================
      clearFavorites: () =>
        set({
          hotels: [],
          places: [],
          restaurants: [],
        }),
    }),
    {
      name: "favorites-storage",
      version: 2,
      migrate: (persistedState, version) => {
        // v1 stored items without a reliable composite key context.
        // We can't recover the original country for old entries,
        // so we drop stale favorites once on upgrade rather than
        // risk silently merging items from different countries.
        if (version < 2) {
          return { hotels: [], restaurants: [], places: [] };
        }
        return persistedState;
      },
    },
  ),
);

export default useFavoriteStore;
