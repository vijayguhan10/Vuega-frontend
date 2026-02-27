/* Dummy route data — replace with API calls later */

let _nextId = 8;
export const generateId = () => String(_nextId++);

const dummyRoutes = [
  {
    id: '1',
    fromCity: 'Chennai',
    toCity: 'Bangalore',
    distance: 346,
    duration: '5h 30m',
    stops: [
      { id: 's1', name: 'Vellore', order: 1 },
      { id: 's2', name: 'Krishnagiri', order: 2 },
      { id: 's3', name: 'Hosur', order: 3 },
    ],
    boardingPoints: [
      { id: 'b1', name: 'Koyambedu Bus Stand', timeOffset: '+0 min' },
      { id: 'b2', name: 'Tambaram', timeOffset: '+25 min' },
    ],
    dropPoints: [
      { id: 'd1', name: 'Majestic Bus Stand' },
      { id: 'd2', name: 'Electronic City' },
    ],
    status: 'active',
  },
  {
    id: '2',
    fromCity: 'Bangalore',
    toCity: 'Hyderabad',
    distance: 570,
    duration: '8h 45m',
    stops: [
      { id: 's4', name: 'Anantapur', order: 1 },
      { id: 's5', name: 'Kurnool', order: 2 },
    ],
    boardingPoints: [
      { id: 'b3', name: 'Majestic', timeOffset: '+0 min' },
    ],
    dropPoints: [
      { id: 'd3', name: 'MGBS Hyderabad' },
    ],
    status: 'active',
  },
  {
    id: '3',
    fromCity: 'Mumbai',
    toCity: 'Pune',
    distance: 149,
    duration: '2h 45m',
    stops: [
      { id: 's6', name: 'Lonavala', order: 1 },
    ],
    boardingPoints: [
      { id: 'b4', name: 'Dadar', timeOffset: '+0 min' },
      { id: 'b5', name: 'Vashi', timeOffset: '+20 min' },
      { id: 'b6', name: 'Panvel', timeOffset: '+40 min' },
    ],
    dropPoints: [
      { id: 'd4', name: 'Shivajinagar' },
      { id: 'd5', name: 'Swargate' },
    ],
    status: 'active',
  },
  {
    id: '4',
    fromCity: 'Delhi',
    toCity: 'Jaipur',
    distance: 281,
    duration: '4h 30m',
    stops: [
      { id: 's7', name: 'Manesar', order: 1 },
      { id: 's8', name: 'Neemrana', order: 2 },
    ],
    boardingPoints: [
      { id: 'b7', name: 'Kashmere Gate ISBT', timeOffset: '+0 min' },
    ],
    dropPoints: [
      { id: 'd6', name: 'Sindhi Camp' },
    ],
    status: 'disabled',
  },
  {
    id: '5',
    fromCity: 'Chennai',
    toCity: 'Madurai',
    distance: 462,
    duration: '7h 15m',
    stops: [
      { id: 's9', name: 'Villupuram', order: 1 },
      { id: 's10', name: 'Trichy', order: 2 },
      { id: 's11', name: 'Dindigul', order: 3 },
    ],
    boardingPoints: [
      { id: 'b8', name: 'CMBT', timeOffset: '+0 min' },
      { id: 'b9', name: 'Guindy', timeOffset: '+15 min' },
    ],
    dropPoints: [
      { id: 'd7', name: 'Mattuthavani' },
      { id: 'd8', name: 'Periyar Bus Stand' },
    ],
    status: 'active',
  },
  {
    id: '6',
    fromCity: 'Hyderabad',
    toCity: 'Vijayawada',
    distance: 275,
    duration: '4h 00m',
    stops: [
      { id: 's12', name: 'Suryapet', order: 1 },
    ],
    boardingPoints: [
      { id: 'b10', name: 'JBS', timeOffset: '+0 min' },
    ],
    dropPoints: [
      { id: 'd9', name: 'Pandit Nehru Bus Station' },
    ],
    status: 'active',
  },
  {
    id: '7',
    fromCity: 'Bangalore',
    toCity: 'Mysore',
    distance: 143,
    duration: '2h 30m',
    stops: [
      { id: 's13', name: 'Ramanagara', order: 1 },
      { id: 's14', name: 'Mandya', order: 2 },
    ],
    boardingPoints: [
      { id: 'b11', name: 'Satellite Bus Stand', timeOffset: '+0 min' },
    ],
    dropPoints: [
      { id: 'd10', name: 'Mysore Bus Stand' },
    ],
    status: 'disabled',
  },
  {
    id: '8',
    fromCity: 'Pune',
    toCity: 'Goa',
    distance: 460,
    duration: '8h 00m',
    stops: [],
    boardingPoints: [],
    dropPoints: [],
    status: 'pending-approval',
    notes: 'Requesting new coastal route for weekend demand.',
  },
  {
    id: '9',
    fromCity: 'Hyderabad',
    toCity: 'Tirupati',
    distance: 555,
    duration: '9h 30m',
    stops: [],
    boardingPoints: [],
    dropPoints: [],
    status: 'rejected',
    notes: 'Route already covered by partner operator.',
  },
  {
    id: '10',
    fromCity: 'Bangalore',
    toCity: 'Goa',
    distance: 560,
    duration: '9h 00m',
    stops: [],
    boardingPoints: [],
    dropPoints: [],
    status: 'approved',
    notes: 'Approved — please configure stops and boarding/drop points.',
  },
  {
    id: '11',
    fromCity: 'Chennai',
    toCity: 'Coimbatore',
    distance: 505,
    duration: '7h 45m',
    stops: [],
    boardingPoints: [],
    dropPoints: [],
    status: 'approved',
    notes: 'Approved — configure route details to activate.',
  },
];

export default dummyRoutes;
