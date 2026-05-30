import { useAuth } from "@clerk/expo";
import axios from "axios";
import { useEffect } from "react";

// localhost will work in simulator
const API_URL = process.env.EXPO_PUBLIC_API_URL!;

// prod url will work in your physical device
// const API_URL = "https://expo-ecommerce-th4ln.sevalla.app/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useApi = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.request.use(async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // cleanup: remove interceptor when component unmounts

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return api;
};
