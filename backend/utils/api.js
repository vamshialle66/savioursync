// utils/api.js
import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export default api;
