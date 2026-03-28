import axios from 'axios';

// Create an Axios instance for API calls
export const api = axios.create({
  baseURL: '/api', // Placeholder for real API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example interceptor
api.interceptors.request.use((config) => {
  // Add auth token here if needed
  return config;
});
