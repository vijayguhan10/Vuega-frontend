/**
 * Mock implementation of tripService for demo/testing.
 * Reads/writes from in-memory mock data so status changes persist during session.
 */
import {
  MOCK_BUSES,
  MOCK_TRIPS,
  MOCK_PASSENGERS,
  MOCK_SEAT_MAP,
} from './mockData';

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

/** Resolve the busId from the stored auth token */
function getBusIdFromToken() {
  const token = localStorage.getItem('auth_token') || '';
  // token format: mock-token-{busId}-{timestamp}
  const match = token.match(/mock-token-(bus-\d+)/);
  return match ? match[1] : null;
}

// Deep-clone passengers so mutations persist in-session only
const sessionPassengers = JSON.parse(JSON.stringify(MOCK_PASSENGERS));

const mockTripService = {
  async getActiveTrip() {
    await delay(500);
    const busId = getBusIdFromToken();
    if (!busId) throw mockError('Not authenticated');

    const bus = MOCK_BUSES[busId];
    if (!bus) throw mockError('Bus not found');

    const trip = MOCK_TRIPS[busId];
    if (!trip) throw mockError('No active trip');

    return { ...trip };
  },

  async getPassengers(tripId) {
    await delay(400);
    const list = sessionPassengers[tripId];
    if (!list) throw mockError('Trip not found');
    return list.map((p) => ({ ...p }));
  },

  async updatePassengerStatus(tripId, passengerId, status) {
    await delay(500);
    const list = sessionPassengers[tripId];
    if (!list) throw mockError('Trip not found');

    const passenger = list.find((p) => p.id === passengerId);
    if (!passenger) throw mockError('Passenger not found');

    if (passenger.status !== 'pending') {
      throw mockError(`Cannot change status — already marked as "${passenger.status}".`);
    }

    passenger.status = status;
    return { ...passenger };
  },

  async addPassengerRemark(tripId, passengerId, remark) {
    await delay(300);
    const list = sessionPassengers[tripId];
    if (!list) throw mockError('Trip not found');

    const passenger = list.find((p) => p.id === passengerId);
    if (!passenger) throw mockError('Passenger not found');

    passenger.remark = remark;
    return { ...passenger };
  },

  async getSeatMap(tripId) {
    await delay(400);
    const sm = MOCK_SEAT_MAP[tripId];
    if (!sm) throw mockError('Seat map not found');
    return { ...sm };
  },

  async getBusProfile() {
    await delay(400);
    const busId = getBusIdFromToken();
    if (!busId) throw mockError('Not authenticated');

    const bus = MOCK_BUSES[busId];
    if (!bus) throw mockError('Bus not found');

    return { ...bus };
  },
};

function mockError(message) {
  const err = new Error(message);
  err.response = { data: { message } };
  return err;
}

export default mockTripService;
