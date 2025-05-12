import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

export const baseUrl = import.meta.env.VITE_BASE_URL;

/*   const axiosClient = (): AxiosInstance => {
    const headers = {
      "Content-Type": "application/json;charset=utf-8",
    };

    const client = axios.create({
      baseURL: baseUrl,
      headers,
      timeout: 60000,
      withCredentials: false,
    });

    client.interceptors.request.use((config: any) => {
      config.headers = config.headers || {};
      return config;
    });

    client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        console.error(error);
        throw error;
      }
    );

    return client;
  }; */

  const axiosClient = (): AxiosInstance => {
    const headers = {
      "Content-Type": "application/json;charset=utf-8",
    };

    const client = axios.create({
      baseURL: baseUrl,
      headers,
      timeout: 60000,
      withCredentials: false,
    });

    // Add request interceptor
    client.interceptors.request.use((config: any) => {
      config.headers = config.headers || {};

      // Retrieve auth token from localStorage
      const token = localStorage.getItem("authToken");
      if (token && config.requiresAuth) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    // Response interceptor (optional)
    client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        console.error(error);
        throw error;
      }
    );

    return client;
  };


export default axiosClient;