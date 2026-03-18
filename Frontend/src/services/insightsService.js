import axios from "axios";

const API_URL = "http://localhost:8080/api/insights";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const fetchUserInsights = async () => {
  const response = await axios.get(`${API_URL}/user`, getAuthHeader());
  return response.data; // Returns CarbonInsightsResponse DTO
};

export const fetchAdminAnalytics = async () => {
  const response = await axios.get(`${API_URL}/admin/report`, getAuthHeader());
  return response.data;
};