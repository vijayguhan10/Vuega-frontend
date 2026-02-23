/**
 * Mock data for development / demo mode.
 *
 * DUMMY LOGIN CREDENTIALS:
 *   Bus Number : KA-01-F-1234
 *   Password   : 1234
 *
 *   Bus Number : TN-02-G-5678
 *   Password   : 5678
 */

export const MOCK_CREDENTIALS = {
  'KA-01-F-1234': { password: '1234', busId: 'bus-001' },
  'TN-02-G-5678': { password: '5678', busId: 'bus-002' },
};

export const MOCK_BUSES = {
  'bus-001': {
    id: 'bus-001',
    busNumber: 'KA-01-F-1234',
    registration: 'KA01F1234',
    type: 'AC Sleeper',
    capacity: 40,
    driverName: 'Rajesh Kumar',
    cleanerName: 'Suresh M',
  },
  'bus-002': {
    id: 'bus-002',
    busNumber: 'TN-02-G-5678',
    registration: 'TN02G5678',
    type: 'Non-AC Seater',
    capacity: 52,
    driverName: 'Karthik Rajan',
    cleanerName: 'Mohan S',
  },
};

export const MOCK_TRIPS = {
  'bus-001': {
    id: 'trip-001',
    busNumber: 'KA-01-F-1234',
    route: 'Bangalore → Chennai',
    departureTime: '06:30 AM',
    arrivalTime: '12:45 PM',
    status: 'Active',
  },
  'bus-002': {
    id: 'trip-002',
    busNumber: 'TN-02-G-5678',
    route: 'Chennai → Madurai',
    departureTime: '08:00 AM',
    arrivalTime: '02:30 PM',
    status: 'Active',
  },
};

export const MOCK_PASSENGERS = {
  'trip-001': [
    { id: 'p-001', name: 'Arun Sharma', seatNumber: 1, phone: '+919876543210', boardingPoint: 'Majestic', status: 'pending', remark: '' },
    { id: 'p-002', name: 'Priya Nair', seatNumber: 2, phone: '+919876543211', boardingPoint: 'Majestic', status: 'pending', remark: '' },
    { id: 'p-003', name: 'Vikram Singh', seatNumber: 3, phone: '+919876543212', boardingPoint: 'Electronic City', status: 'boarded', remark: 'Window seat requested' },
    { id: 'p-004', name: 'Meena Kumari', seatNumber: 4, phone: '+919876543213', boardingPoint: 'Silk Board', status: 'pending', remark: '' },
    { id: 'p-005', name: 'Sanjay Patel', seatNumber: 5, phone: '+919876543214', boardingPoint: 'Majestic', status: 'no-show', remark: 'Called twice, unreachable' },
    { id: 'p-006', name: 'Deepa Rao', seatNumber: 6, phone: '+919876543215', boardingPoint: 'Electronic City', status: 'boarded', remark: '' },
    { id: 'p-007', name: 'Rahul Menon', seatNumber: 7, phone: '+919876543216', boardingPoint: 'Madiwala', status: 'pending', remark: '' },
    { id: 'p-008', name: 'Kavitha S', seatNumber: 8, phone: '+919876543217', boardingPoint: 'Silk Board', status: 'pending', remark: '' },
    { id: 'p-009', name: 'Manoj V', seatNumber: 9, phone: '+919876543218', boardingPoint: 'Majestic', status: 'boarded', remark: '' },
    { id: 'p-010', name: 'Anitha Raj', seatNumber: 10, phone: '+919876543219', boardingPoint: 'Electronic City', status: 'pending', remark: 'Needs wheelchair assistance' },
    { id: 'p-011', name: 'Sunil Das', seatNumber: 11, phone: '+919876543220', boardingPoint: 'Madiwala', status: 'pending', remark: '' },
    { id: 'p-012', name: 'Lakshmi B', seatNumber: 12, phone: '+919876543221', boardingPoint: 'Majestic', status: 'no-show', remark: '' },
    { id: 'p-013', name: 'Ganesh K', seatNumber: 14, phone: '+919876543222', boardingPoint: 'Silk Board', status: 'pending', remark: '' },
    { id: 'p-014', name: 'Rekha Iyer', seatNumber: 15, phone: '+919876543223', boardingPoint: 'Electronic City', status: 'boarded', remark: '' },
    { id: 'p-015', name: 'Amit Joshi', seatNumber: 16, phone: '+919876543224', boardingPoint: 'Majestic', status: 'pending', remark: '' },
    { id: 'p-016', name: 'Divya M', seatNumber: 18, phone: '+919876543225', boardingPoint: 'Madiwala', status: 'pending', remark: '' },
    { id: 'p-017', name: 'Harish R', seatNumber: 20, phone: '+919876543226', boardingPoint: 'Silk Board', status: 'boarded', remark: '' },
    { id: 'p-018', name: 'Nandini G', seatNumber: 22, phone: '+919876543227', boardingPoint: 'Electronic City', status: 'pending', remark: '' },
    { id: 'p-019', name: 'Prasad T', seatNumber: 25, phone: '+919876543228', boardingPoint: 'Majestic', status: 'pending', remark: '' },
    { id: 'p-020', name: 'Fathima Z', seatNumber: 28, phone: '+919876543229', boardingPoint: 'Madiwala', status: 'pending', remark: '' },
  ],
  'trip-002': [
    { id: 'p-101', name: 'Kiran Kumar', seatNumber: 1, phone: '+919988776600', boardingPoint: 'Koyambedu', status: 'pending', remark: '' },
    { id: 'p-102', name: 'Jaya Lakshmi', seatNumber: 2, phone: '+919988776601', boardingPoint: 'Koyambedu', status: 'boarded', remark: '' },
    { id: 'p-103', name: 'Ravi Shankar', seatNumber: 3, phone: '+919988776602', boardingPoint: 'Tambaram', status: 'pending', remark: '' },
    { id: 'p-104', name: 'Saraswathi P', seatNumber: 5, phone: '+919988776603', boardingPoint: 'Koyambedu', status: 'pending', remark: '' },
    { id: 'p-105', name: 'Dinesh M', seatNumber: 7, phone: '+919988776604', boardingPoint: 'Tambaram', status: 'no-show', remark: 'Phone switched off' },
    { id: 'p-106', name: 'Uma Devi', seatNumber: 10, phone: '+919988776605', boardingPoint: 'Chromepet', status: 'boarded', remark: '' },
    { id: 'p-107', name: 'Balaji N', seatNumber: 12, phone: '+919988776606', boardingPoint: 'Koyambedu', status: 'pending', remark: '' },
    { id: 'p-108', name: 'Geetha R', seatNumber: 15, phone: '+919988776607', boardingPoint: 'Chromepet', status: 'pending', remark: '' },
  ],
};

export const MOCK_SEAT_MAP = {
  'trip-001': {
    totalRows: 10,
    totalCols: 4,
    seats: Array.from({ length: 10 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => ({
        seatNumber: r * 4 + c + 1,
        row: r,
        col: c,
      }))
    ),
  },
  'trip-002': {
    totalRows: 13,
    totalCols: 4,
    seats: Array.from({ length: 13 }, (_, r) =>
      Array.from({ length: 4 }, (_, c) => ({
        seatNumber: r * 4 + c + 1,
        row: r,
        col: c,
      }))
    ),
  },
};
