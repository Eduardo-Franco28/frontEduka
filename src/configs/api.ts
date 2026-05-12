import { API_URL } from "../constants/constant";
import { getStore } from "../services/storageService";
import axios from "axios";

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(
  async (config) => {
    const token = await getStore("token");

    if (!token) return config;

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
