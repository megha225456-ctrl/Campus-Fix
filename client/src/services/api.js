const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Reusable HTTP request helper with automatic JWT injection and error extraction
 */
export async function apiRequest(endpoint, { method = 'GET', body = null, token = null } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const authToken = token || localStorage.getItem('campusfix_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${method} ${endpoint}]:`, error.message);
    throw error;
  }
}
