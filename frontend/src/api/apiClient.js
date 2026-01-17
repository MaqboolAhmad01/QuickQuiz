
import { API_BASE_URL } from "../config";

export async function apiFetch(
  url,
  { method = "GET", body = null, headers = {} } = {}
) {
  url = API_BASE_URL + url;

  let token = localStorage.getItem("access_token");

  const options = {
    method,
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  // Handle body
  if (body) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  let response = await fetch(url, options);

  // 🔁 Access token expired
  if (response.status === 401) {
    const refreshResponse = await fetch(
      API_BASE_URL + "/auth/refresh/",
      {
        method: "POST",
        credentials: "include", // cookie refresh token
      }
    );

    if (!refreshResponse.ok) {
      localStorage.removeItem("access_token");
      throw new Error("Session expired");
    }

    // ✅ STORE NEW ACCESS TOKEN
    const data = await refreshResponse.json();
    localStorage.setItem("access_token", data.access);

    // ✅ Retry original request with NEW token
    options.headers.Authorization = `Bearer ${data.access}`;
    response = await fetch(url, options);
  }

  return response;
}
