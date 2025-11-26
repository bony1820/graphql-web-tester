import React from 'react';

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
import React from 'react';

const sampleQueries = [
  {
    name: 'Get all users',
    query: `query {\n  users {\n    id\n    name\n    email\n    bookings {\n      id\n      status\n    }\n  }\n}`
  },
  {
    name: 'Get all routes',
    query: `query {\n  routes {\n    id\n    code\n    origin\n    destination\n  }\n}`
  },
  {
    name: 'Get trips by route',
    query: `query GetTrips($routeId: ID!) {\n  trips(routeId: $routeId, limit: 5) {\n    id\n    departureTime\n    arrivalTime\n    busNumber\n    availableSeats\n  }\n}`
  },
  {
    name: 'Get bookings by user',
    query: `query GetBookings($userId: ID!) {\n  bookings(userId: $userId, limit: 5) {\n    id\n    seatNumber\n    status\n    createdAt\n    trip {\n      id\n      busNumber\n    }\n  }\n}`
  },
  {
    name: 'Create user (mutation)',
    query: `mutation {\n  createUser(input: { name: \"Test User\", email: \"test@example.com\" }) {\n    id\n    name\n    email\n    token\n  }\n}`
  },
  {
    name: 'Book seat (mutation)',
    query: `mutation BookSeat($tripId: ID!, $userId: ID!, $seatNumber: Int!) {\n  bookSeat(input: { tripId: $tripId, userId: $userId, seatNumber: $seatNumber }) {\n    id\n    status\n    seatNumber\n    trip {\n      id\n      busNumber\n    }\n    user {\n      id\n      name\n    }\n  }\n}`
  },
  {
    name: 'Cancel booking (mutation)',
    query: `mutation CancelBooking($id: ID!) {\n  cancelBooking(id: $id)\n}`
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
