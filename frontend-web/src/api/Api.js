// src/api/Api.js

export const API_BASE_URL = "http://192.168.1.119:8000";

export async function apiRequest(url, method = "GET", body = null) {
  const token = localStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${url}`, options);

  if (!response.ok) {
    throw new Error("Tidak dapat terhubung ke server");
  }

  return await response.json();
}
