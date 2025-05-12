// src/context/store/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Admin {
  username: string;
  id: string;
  email: string;
}

export interface AuthState {
  user: Admin | null;
  token: string | null;
  otp_mail: string | null;
  isAuthenticated: boolean;
}

// Safe retrieval of user data with error handling
const getUserFromStorage = () => {
  try {
    const userString = localStorage.getItem("user");
    if (!userString || userString === "undefined" || userString === "null") {
      return null;
    }
    return JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    localStorage.removeItem("user"); // Clean up corrupted data
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem("token") || null,
  otp_mail: sessionStorage.getItem("otp_mail") || null,
  isAuthenticated: !!getUserFromStorage(),
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          window.localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          window.localStorage.removeItem("user");
        }
      }
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      
      if (typeof window !== "undefined") {
        if (action.payload) {
          // Store token as plain string (not JSON stringified)
          window.localStorage.setItem("token", action.payload);
        } else {
          window.localStorage.removeItem("token");
        }
      }
    },
    setOtpMail: (state, action: PayloadAction<string | null>) => {
      state.otp_mail = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          window.sessionStorage.setItem("otp_mail", action.payload);
        } else {
          window.sessionStorage.removeItem("otp_mail");
        }
      }
    },
    // Add a logout action for convenience
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.otp_mail = null;
      state.isAuthenticated = false;
      
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("token");
        window.sessionStorage.removeItem("otp_mail");
      }
    },
  },
});

export const { setAdmin, setToken, setOtpMail, logout } = authSlice.actions;
export default authSlice.reducer;