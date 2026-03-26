import uploadImageClodinary from './uploadImageClodinary'; // Adjust the path if needed
import { v2 as cloudinary } from 'cloudinary';

// Mock the cloudinary module
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(), // Mock the config method
    uploader: {
      upload_stream: jest.fn(),
    },
  },
}));

describe('uploadImageClodinary', () => {
  it('should upload the image and return the upload result', async () => {
    const mockImageBuffer = Buffer.from('mock-image-data');
    const mockUploadResult = {
      url: 'https://cloudinary.com/mock-image-url',
      public_id: 'mock-public-id',
    };

    // Mock cloudinary.uploader.upload_stream to call the resolve function with a mocked upload result
    cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
      callback(null, mockUploadResult); // Simulate successful upload with the mock result
    });

    const image = { buffer: mockImageBuffer }; // Simulating the image object passed to the function

    // Call the uploadImageClodinary function
    const result = await uploadImageClodinary(image);

    // Assert that cloudinary.uploader.upload_stream was called
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      { folder: 'binkeyit' },
      expect.any(Function)
    );

    // Assert that the result contains the expected URL and public_id
    expect(result).toEqual(mockUploadResult);
  });

  it('should throw an error if the upload fails', async () => {
    const mockImageBuffer = Buffer.from('mock-image-data');

    // Mock cloudinary.uploader.upload_stream to simulate an error
    cloudinary.uploader.upload_stream.mockImplementation((options, callback) => {
      callback(new Error('Upload failed'), null); // Simulate upload failure
    });

    const image = { buffer: mockImageBuffer };

    // Call the uploadImageClodinary function and expect it to throw an error
    await expect(uploadImageClodinary(image)).rejects.toThrow('Upload failed');
  });
});
