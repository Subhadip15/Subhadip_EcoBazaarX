import api from "./api";

export async function getRecommendations(requestData) {
  const res = await api.post("/recommendations", requestData);
  return res.data;
}