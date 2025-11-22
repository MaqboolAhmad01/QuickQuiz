
import { API_BASE_URL } from "../config";

export async function apiFetch(url, { method = "GET", body = null, headers = {} } = {}) {
    url = API_BASE_URL + url;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include", // send cookies automatically
    };
  
    if (body) {
      options.body = JSON.stringify(body);
    }
  
    let response = await fetch(url, options);
    console.log("API Fetch Response:", response.json());
  
    if (response.status === 401) {
      // Try to refresh access token
      const refreshResponse = await fetch("/auth/refresh/", {
        method: "POST",
        credentials: "include",
      });
  
      if (!refreshResponse.ok) {
        // Let the caller handle failed refresh (e.g., redirect)
        return { error: "Session expired" };
      }
  
      // Retry original request
      response = await fetch(url, options);
    }
  
    return response; // caller can decide to parse JSON, redirect, etc.
  }