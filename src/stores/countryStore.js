import { create } from "zustand";

const initialState = {
    hotels: [],
    places: [],
    images: [],
    details: {},
    restaurants: [],
};

const useCountryStore = create((set) => ({
    countryDetails: null,

    setCountryDetails: (data) =>
        set({ countryDetails: data, }),

    clearCountryDetails: () =>
        set({ countryDetails: initialState, }),
}));

export default useCountryStore;