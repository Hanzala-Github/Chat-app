import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export default axiosInstance;
