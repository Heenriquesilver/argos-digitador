import axios from "axios";

const api = axios.create({
  baseURL: "http://138.255.160.161:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
