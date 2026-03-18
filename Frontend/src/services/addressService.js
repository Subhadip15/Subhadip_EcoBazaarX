import api from "./api";

export async function fetchAddresses() {
  const res = await api.get("/addresses");
  return res.data;
}

export async function createAddress(payload) {
  const res = await api.post("/addresses", payload);
  return res.data;
}

export async function updateAddress(id, payload) {
  const res = await api.put(`/addresses/${id}`, payload);
  return res.data;
}

export async function deleteAddress(id) {
  await api.delete(`/addresses/${id}`);
  return true;
}
