import request from 'supertest';
import app from '../index'; // Import the express app
import * as db from '../config/connectDB'; // Import the connectDB module

// Mock the connectDB function to avoid connecting to the real database during tests
jest.mock('../config/connectDB', () => ({
  connectDB: jest.fn().mockResolvedValue('DB Connected'),
}));

describe('GET /', () => {
  it('should return server running message', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200); // Check for status 200 OK
    expect(response.body.message).toBe(`Server is running ${process.env.PORT || 5000}`);
  });
});

describe('GET /api/user', () => {
  it('should return a 404 if the route does not exist', async () => {
    const response = await request(app).get('/api/user');
    expect(response.status).toBe(404); // Adjust if you implement the actual route
  });
});

// Optional: Close DB connection after tests if necessary
afterAll(async () => {
  // This is to handle any leftover async operations that might hang
  await db.connectDB.mockClear();
});
