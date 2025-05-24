import axios from "axios";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const omdb = axios.create({
  baseURL: "https://www.omdbapi.com/",
  params: {
    apikey: API_KEY,
  },
});
