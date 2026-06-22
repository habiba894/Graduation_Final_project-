import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const splitName = (rawName) => {
  const trimmed = (rawName || "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };

  const hyphenParts = trimmed.split("-").map((p) => p.trim()).filter(Boolean);
  if (hyphenParts.length > 1) {
    return {
      firstName: hyphenParts[0] || "",
      lastName: hyphenParts.slice(1).join(" ") || "",
    };
  }

  const spaceParts = trimmed.split(/\s+/);
  return {
    firstName: spaceParts[0] || "",
    lastName: spaceParts.slice(1).join(" ") || "",
  };
};

const parseUser = (u) => {
  if (!u) return null;
  const parsed = { ...u };

  // Parse name to get firstName and lastName
  if (parsed.name && !parsed.firstName && !parsed.lastName) {
    const { firstName, lastName } = splitName(parsed.name);
    parsed.firstName = firstName;
    parsed.lastName = lastName;
  }

  // If we have firstName and lastName, combine them as firstName lastName
  if (parsed.firstName && parsed.lastName) {
    parsed.name = `${parsed.firstName} ${parsed.lastName}`;
  } else if (parsed.firstName) {
    parsed.name = parsed.firstName;
  } else if (parsed.name) {
    const { firstName, lastName } = splitName(parsed.name);
    parsed.name = parsed.name.trim();
    parsed.firstName = firstName;
    parsed.lastName = lastName;
  }

  // Remove location and phone from cached storage/state
  delete parsed.location;
  delete parsed.phone;

  return parsed;
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      try {
        return parseUser(JSON.parse(cachedUser));
      } catch (e) {
        console.error("Error parsing cached user:", e);
        return null;
      }
    }
    return null;
  });

  const login = (accessToken, userData) => {
    const cleanedUser = parseUser(userData);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(cleanedUser));
    setToken(accessToken);
    setUser(cleanedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("favorites-storage");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const cleanedUser = parseUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(cleanedUser));
    setUser(cleanedUser);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}