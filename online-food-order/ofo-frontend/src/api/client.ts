import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const withAuth = (client: AxiosInstance) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
      }
      return Promise.reject(error)
    }
  )

  return client
}

const createClient = (baseURL: string) => withAuth(axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}))

export const userClient = createClient(import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8083')
export const restaurantClient = createClient(import.meta.env.VITE_RESTAURANT_SERVICE_URL || 'http://localhost:8082')
export const orderClient = createClient(import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8081')
export const paymentClient = createClient(import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8084')
export const searchClient = createClient(import.meta.env.VITE_SEARCH_SERVICE_URL || 'http://localhost:8085')
export const reviewClient = createClient(import.meta.env.VITE_REVIEW_SERVICE_URL || 'http://localhost:8086')
