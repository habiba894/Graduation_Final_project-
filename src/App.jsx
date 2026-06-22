import { useEffect, Suspense } from "react";
import { Toaster } from "react-hot-toast";

import AOS from "aos";
import "aos/dist/aos.css";

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./utils/routes";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "14px",
              background: "#fff",
              color: "#1a3c34",
              fontWeight: "600",
              padding: "14px 18px",
            },
            success: {
              iconTheme: {
                primary: "#22a05a",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#e8472a",
                secondary: "#fff",
              },
            },
          }}
        />

        <Suspense fallback={<div />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}