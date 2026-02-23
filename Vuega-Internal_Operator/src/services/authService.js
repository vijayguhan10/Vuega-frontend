import api from './api';

const AUTH_TOKEN_KEY = 'auth_token';
const BUS_DATA_KEY = 'bus_data';

const authService = {
  /**
   * Login with bus credentials (bus number + password/pin).
   */
  async login(busNumber, password) {
    const response = await api.post('/auth/login', { busNumber, password });
    const { token, bus } = response.data;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(BUS_DATA_KEY, JSON.stringify(bus));
    return { token, bus };
  },

  /**
   * Logout — clears local storage and calls server.
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors — we clear local state regardless
    } finally {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(BUS_DATA_KEY);
    }
  },

  /**
   * Returns the stored auth token.
   */
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Returns the stored bus data.
   */
  getBusData() {
    const data = localStorage.getItem(BUS_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Checks if the user is authenticated.
   */
  isAuthenticated() {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Validate current session with the server.
   */
  async validateSession() {
    const response = await api.get('/auth/session');
    return response.data;
  },
};

export default authService;
