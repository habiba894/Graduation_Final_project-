import axios from "axios";

const api = axios.create({
 baseURL: "https://wanderlust-app-eh3t.onrender.com",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createPaymentSession = async ({
  userId,
  planType,
  amount,
}) => {

  console.log("SENDING DATA:", {
    userId,
    planType,
    amount,
  });

  const response = await api.post(
    "/api/payment/create-session",
    {
      userId,
      planType,
      amount,
    }
  );

  return response.data;
};

export default api;