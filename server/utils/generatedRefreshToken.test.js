import generatedRefreshToken from './generatedRefreshToken'; // Adjust the path if needed
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';

// Mock jsonwebtoken.sign and UserModel.updateOne
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

jest.mock('../models/user.model.js');

describe('generatedRefreshToken', () => {
  it('should generate a refresh token and update the user with the refresh token', async () => {
    const userId = '12345';
    const mockToken = 'mockedRefreshToken';

    // Mock jwt.sign to resolve with the mocked token
    jwt.sign.mockResolvedValue(mockToken);

    // Mock UserModel.updateOne to resolve successfully
    UserModel.updateOne.mockResolvedValue({ modifiedCount: 1 });

    // Call the generatedRefreshToken function
    const token = await generatedRefreshToken(userId);

    // Assert that jwt.sign was called with correct arguments
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: userId },
      process.env.SECRET_KEY_REFRESH_TOKEN,
      { expiresIn: '7d' }
    );

    // Assert that the user model's updateOne was called with correct parameters
    expect(UserModel.updateOne).toHaveBeenCalledWith(
      { _id: userId },
      { refresh_token: mockToken }
    );

    // Assert that the function returns the mocked token
    expect(token).toBe(mockToken);
  });

  it('should throw an error if jwt.sign fails', async () => {
    const userId = '12345';

    // Mock jwt.sign to reject with an error
    jwt.sign.mockRejectedValue(new Error('JWT Error'));

    // Call the generatedRefreshToken function and expect it to throw an error
    await expect(generatedRefreshToken(userId)).rejects.toThrow('JWT Error');
  });

  it('should throw an error if UserModel.updateOne fails', async () => {
    const userId = '12345';
    const mockToken = 'mockedRefreshToken';

    // Mock jwt.sign to resolve with a mock token
    jwt.sign.mockResolvedValue(mockToken);

    // Mock UserModel.updateOne to reject with an error
    UserModel.updateOne.mockRejectedValue(new Error('Database Error'));

    // Call the generatedRefreshToken function and expect it to throw an error
    await expect(generatedRefreshToken(userId)).rejects.toThrow('Database Error');
  });
});
