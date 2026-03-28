import { orderClient, paymentClient, restaurantClient, reviewClient, searchClient, userClient } from './client'

export const restaurantApi = {
  getById: (id: string) => restaurantClient.get(`/restaurant/${id}`),
  update: (restaurant: any) => restaurantClient.put('/restaurant', restaurant),
  updateMenu: (restaurant: any) => restaurantClient.put('/restaurant/updatemenu', restaurant),
  updateRating: (restaurantId: string, rating: string) =>
    restaurantClient.put(`/restaurant/rating?restaurantId=${restaurantId}&rating=${rating}`),
  create: (restaurant: any) => restaurantClient.post('/restaurant', restaurant),
}

export const searchApi = {
  searchRestaurants: (params: Record<string, string>) =>
    searchClient.get('/search/restaurant', { params }),
  getRestaurantById: (id: string) => searchClient.get(`/search/restaurant/${id}`),
}

export const orderApi = {
  create: (orderData: any) => orderClient.post('/order', orderData),
  update: (orderData: any) => orderClient.put('/order', orderData),
  getByUser: (userId: string) => orderClient.get(`/order/user/${userId}`),
  getByRestaurant: (restaurantId: string) => orderClient.get(`/order/restaurant/${restaurantId}`),
  getById: (orderId: string) => orderClient.get(`/order/${orderId}`),
}

export const paymentApi = {
  processPayment: (paymentData: any) => paymentClient.post('/payment', paymentData),
  refundPayment: (paymentData: any) => paymentClient.put('/payment', paymentData),
  getById: (paymentId: string) => paymentClient.get(`/payment/${paymentId}`),
}

export const reviewApi = {
  getById: (reviewId: string) => reviewClient.get(`/review/${reviewId}`),
  getByUser: (userId: string) => reviewClient.get(`/review/user/${userId}`),
  getByRestaurant: (restaurantId: string) => reviewClient.get(`/review/restaurant/${restaurantId}`),
  create: (review: any) => reviewClient.post('/review', review),
}

export const userApi = {
  getById: (userId: string) => userClient.get(`/users/${userId}`),
  create: (userData: any) => userClient.post('/users', userData),
  update: (userData: any) => userClient.put('/users', userData),
  delete: (userId: string) => userClient.delete(`/users/${userId}`),
}
