import api from "./api";

export async function fetchProfile() {
  const res = await api.get("/profile");
  return res.data;
}

export async function updateProfile(updatedData) {
  const res = await api.put("/profile", updatedData);
  return res.data;
}