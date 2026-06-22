// // src/services/api.js
// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'ngrok-skip-browser-warning': 'true',
//   },
// });

// // 🔐 Token Interceptor
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/auth/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // 🌍 Country Service
// export const apiServices = {
//   getCountries: (searchTerm) =>
//     api.get('/countries', { params: searchTerm ? { search: searchTerm } : {} }),
//   getCountryByName: (name) =>
//     api.get(`/countries/${encodeURIComponent(name)}`),
//   getWeather: (countryName) =>
//     api.get('/weather', { params: { country: countryName } }),
//   getCurrencyRates: (baseCode) =>
//     api.get(`/currency/rates/${encodeURIComponent(baseCode)}`),
//   convertCurrency: (amount, from, to) =>
//     api.get('/currency/convert', { params: { amount, from, to } }),
//   getCountryDetails: async (name) => {
//     const response = await api.get(`/countries/${encodeURIComponent(name)}`);
//     return response.data;
//   },
//   // getRestaurants: (country) =>
//   //   api.get('/restaurants', { params: { country } }),
//   // getHotels: (country) =>
//   //   api.get('/hotels', { params: { country } }),
//   // getPopularPlaces: (country) =>
//   //   api.get('/popular-places', { params: { country } }),

//   // 🔐 Auth
//   login: (credentials) => api.post('/auth/login', credentials),
//   register: (userData) => api.post('/auth/signup', userData),
//   verifyToken: (token) => api.get('/auth/verify', {
//     headers: { Authorization: `Bearer ${token}` }
//   }),
// };

// // ✈️ Plans Service (NEW)
// export const plansService = {
//   getUserPlans: async (userId) => {
//     const response = await api.get(`/plans/user/${userId}`);
//     return response.data;
//   },

//   getPlanById: (planId) => api.get(`/plans/${planId}`),
//   createPlan: (planData) => api.post('/plans', planData),
//   updatePlan: (planId, planData) => api.put(`/plans/${planId}`, planData),
//   deletePlan: (planId) => api.delete(`/plans/${planId}`),
//   addPlaceToPlan: (planId, placeData) => api.post(`/plans/${planId}/places`, placeData),
//   removePlaceFromPlan: (planId, placeId) => api.delete(`/plans/${planId}/places/${placeId}`),
// };

// export const profileService = {
//   getUserProfile: async () => {
//     const response = await api.get("/profile");
//     return response.data;
//   },

//   updateUserProfile: async (userData) => {
//     const response = await api.put("/profile", userData);
//     return response.data;
//   },

//   getUserTrips: async () => {
//     const response = await api.get("/profile/plans");
//     return response.data;
//   },

//   getFavoritePlaces: async () => {
//     const response = await api.get("/profile/favorites");
//     return response.data;
//   },

//   toggleFavoritePlace: async (placeId) => {
//     const response = await api.post("/profile/favorites", { placeId, });
//     return response.data;
//   },

//   deleteFavoritePlace: async (placeId) => {
//     const response = await api.delete(`/profile/favorites/${placeId}`);
//     return response.data;
//   }
// }


// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// 🔐 Token Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// 🌍 Country Service
export const apiServices = {
  getCountries: (searchTerm) =>
    api.get('/countries', { params: searchTerm ? { search: searchTerm } : {} }),
  getCountryByName: (name) =>
    api.get(`/countries/${encodeURIComponent(name)}`),
  getWeather: (countryName) =>
    api.get('/weather', { params: { country: countryName } }),
  getCurrencyRates: (baseCode) =>
    api.get(`/currency/rates/${encodeURIComponent(baseCode)}`),
  convertCurrency: (amount, from, to) =>
    api.get('/currency/convert', { params: { amount, from, to } }),
  getCountryDetails: async (name) => {
    const response = await api.get(`/countries/${encodeURIComponent(name)}`);
    return response.data;
  },
  // getRestaurants: (country) =>
  //   api.get('/restaurants', { params: { country } }),
  // getHotels: (country) =>
  //   api.get('/hotels', { params: { country } }),
  // getPopularPlaces: (country) =>
  //   api.get('/popular-places', { params: { country } }),

  // 🔐 Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/signup', userData),
  verifyToken: (token) => api.get('/auth/verify', {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// ✈️ Plans Service (NEW)
export const plansService = {
  getUserPlans: async (userId) => {
    const response = await api.get(`/plans/user/${userId}`);
    return response.data;
  },

  getPlanById: async (planId) => {
    const response = await api.get(`/plans/${planId}`);
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await api.post('/plans', planData);
    return response.data;
  },

  updatePlan: async (planId, planData) => {
    const response = await api.put(`/plans/${planId}`, planData);
    return response.data;
  },

  deletePlan: async (planId) => {
    const response = await api.delete(`/plans/${planId}`);
    return response.data;
  },

  addPlaceToPlan: async (planId, placeData) => {
    const response = await api.post(`/plans/${planId}/places`, placeData);
    return response.data;
  },

  removePlaceFromPlan: async (planId, placeId) => {
    const response = await api.delete(`/plans/${planId}/places/${placeId}`);
    return response.data;
  },
};

export const profileService = {
  getUserProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  updateUserProfile: async (userData) => {
    const response = await api.put("/profile", userData);
    return response.data;
  },

  getUserTrips: async () => {
    const response = await api.get("/profile/plans");
    return response.data;
  },

  getFavoritePlaces: async () => {
    const response = await api.get("/profile/favorites");
    return response.data;
  },

  toggleFavoritePlace: async (placeId) => {
    const response = await api.post("/profile/favorites", { placeId, });
    return response.data;
  },

  deleteFavoritePlace: async (placeId) => {
    const response = await api.delete(`/profile/favorites/${placeId}`);
    return response.data;
  }
}