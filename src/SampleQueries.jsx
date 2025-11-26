const sampleQueries = [
  {
    name: 'Get all users',
    query: `query {
  users {
    id
    name
    email
    bookings {
      id
      status
    }
  }
}`
  },
  {
    name: 'Get all routes',
    query: `query {
  routes {
    id
    code
    origin
    destination
  }
}`
  },
  {
    name: 'Get trips by route',
    query: `query GetTrips($routeId: ID!) {
  trips(routeId: $routeId, limit: 5) {
    id
    departureTime
    arrivalTime
    busNumber
    availableSeats
  }
}`
  },
  {
    name: 'Get bookings by user',
    query: `query GetBookings($userId: ID!) {
  bookings(userId: $userId, limit: 5) {
    id
    seatNumber
    status
    createdAt
    trip {
      id
      busNumber
    }
  }
}`
  },
  {
    name: 'Create user (mutation)',
    query: `mutation {
  createUser(input: { name: "Test User", email: "test@example.com" }) {
    id
    name
    email
    token
  }
}`
  },
  {
    name: 'Book seat (mutation)',
    query: `mutation BookSeat($tripId: ID!, $userId: ID!, $seatNumber: Int!) {
  bookSeat(input: { tripId: $tripId, userId: $userId, seatNumber: $seatNumber }) {
    id
    status
    seatNumber
    trip {
      id
      busNumber
    }
    user {
      id
      name
    }
  }
}`
  },
  {
    name: 'Cancel booking (mutation)',
    query: `mutation CancelBooking($id: ID!) {
  cancelBooking(id: $id)
}`
  }
];

export default function SampleQueries() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Sample GraphQL Queries</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sampleQueries.map((q, idx) => (
          <li key={idx} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{q.name}</div>
            <pre style={{ background: '#222', color: '#fff', padding: 12, fontSize: 14, whiteSpace: 'pre-wrap' }}>{q.query}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
