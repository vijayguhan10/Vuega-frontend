/**
 * Mock implementation of authService for demo/testing.
 * Simulates network delay and validates against mock credentials.
 */
import {
  MOCK_CREDENTIALS,
  MOCK_BUSES,
} from './mockData';

const AUTH_TOKEN_KEY = 'auth_token';
const BUS_DATA_KEY = 'bus_data';

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

const mockAuthService = {
  async login(busNumber, password) {
    await delay(800);

    const cred = MOCK_CREDENTIALS[busNumber];
    if (!cred || cred.password !== password) {
      const err = new Error('Invalid bus number or password');
      err.response = { data: { message: 'Invalid bus number or password.' } };
      throw err;
    }

    const bus = MOCK_BUSES[cred.busId];
    const token = `mock-token-${cred.busId}-${Date.now()}`;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(BUS_DATA_KEY, JSON.stringify(bus));

    return { token, bus };
  },

  async logout() {
    await delay(300);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(BUS_DATA_KEY);
  },

  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  getBusData() {
    const data = localStorage.getItem(BUS_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },

  async validateSession() {
    await delay(200);
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) throw new Error('No session');
    return { valid: true };
  },
};

export default mockAuthService;
