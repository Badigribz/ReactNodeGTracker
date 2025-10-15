import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/workouts", // adjust port if needed
});

export default API;
