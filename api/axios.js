import axios from "axios";

const BASE_URL = process.env.API_URL || process.env.EXPO_PUBLIC_API_URL || "https://localhost:5000";

export const classifier = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
