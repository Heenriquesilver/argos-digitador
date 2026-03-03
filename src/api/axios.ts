import axios from "axios";

const apiPublic = axios.create({
  baseURL: "http://138.255.160.161:9092",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

export default apiPublic;
