export const AUTH_TOKEN_KEY = 'auth_token';
export const BUS_DATA_KEY = 'bus_data';

export function isLoggedIn() {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(BUS_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(busNumber, password) {
  const trimmedBusNumber = busNumber.trim();
  const token = `mock-token-${Date.now()}`;
  const user = {
    id: 'bus-local',
    busNumber: trimmedBusNumber,
    registration: trimmedBusNumber.replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
    type: 'Bus Crew',
    capacity: 40,
    driverName: 'Operator',
    cleanerName: 'Crew',
    pin: password,
  };

  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(BUS_DATA_KEY, JSON.stringify(user));

  return user;
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(BUS_DATA_KEY);
}