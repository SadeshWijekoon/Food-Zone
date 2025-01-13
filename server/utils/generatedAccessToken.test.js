import generatedAccessToken from './generatedAccessToken'; // adjust the path if needed
import jwt from 'jsonwebtoken';

// Mock the jsonwebtoken.sign method
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('generatedAccessToken', () => {
  it('should generate a valid access token', async () => {
    const userId = '12345';
    const mockToken = 'mockedAccessToken';

    // Mock the sign method to return a mock token
    jwt.sign.mockResolvedValue(mockToken);

    // Call the generatedAccessToken function
    const token = await generatedAccessToken(userId);

    // Assert that the sign method was called with correct arguments
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: userId },
      process.env.SECRET_KEY_ACCESS_TOKEN,
      { expiresIn: '5h' }
    );

    // Assert that the returned token matches the mock token
    expect(token).toBe(mockToken);
  });

  it('should throw an error if jwt.sign fails', async () => {
    const userId = '12345';

    // Mock the sign method to reject with an error
    jwt.sign.mockRejectedValue(new Error('JWT Error'));

    // Call the generatedAccessToken function and expect it to throw an error
    await expect(generatedAccessToken(userId)).rejects.toThrow('JWT Error');
  });
});
