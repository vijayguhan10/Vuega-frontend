import api from './api';

const tripService = {
  /**
   * Get the active trip for the logged-in bus.
   */
  async getActiveTrip() {
    const response = await api.get('/trips/active');
    return response.data;
  },

  /**
   * Get passenger list for a trip.
   */
  async getPassengers(tripId) {
    const response = await api.get(`/trips/${tripId}/passengers`);
    return response.data;
  },

  /**
   * Update passenger status (boarded / no-show).
   * @param {string} tripId
   * @param {string} passengerId
   * @param {'boarded' | 'no-show'} status
   */
  async updatePassengerStatus(tripId, passengerId, status) {
    const response = await api.patch(
      `/trips/${tripId}/passengers/${passengerId}/status`,
      { status }
    );
    return response.data;
  },

  /**
   * Add a remark to a passenger.
   */
  async addPassengerRemark(tripId, passengerId, remark) {
    const response = await api.patch(
      `/trips/${tripId}/passengers/${passengerId}/remark`,
      { remark }
    );
    return response.data;
  },

  /**
   * Get seat map for a trip.
   */
  async getSeatMap(tripId) {
    const response = await api.get(`/trips/${tripId}/seat-map`);
    return response.data;
  },

  /**
   * Get bus profile details.
   */
  async getBusProfile() {
    const response = await api.get('/bus/profile');
    return response.data;
  },
};

export default tripService;
