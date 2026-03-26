import mongoose from "mongoose";
import connectDB from "./connectDB";

jest.mock("mongoose", () => ({
  connect: jest.fn(),
}));

describe("connectDB", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should connect to MongoDB when MONGODB_URI is provided", async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/testdb"; // Mocking .env variable

    mongoose.connect.mockResolvedValueOnce(); // Mock successful connection

    console.log = jest.fn(); // Mock console.log
    await connectDB();

    expect(mongoose.connect).toHaveBeenCalledWith(process.env.MONGODB_URI);
    expect(console.log).toHaveBeenCalledWith("connect DB");
  });

  it("should throw an error if MONGODB_URI is not provided", async () => {
    delete process.env.MONGODB_URI; // Ensure MONGODB_URI is undefined

    try {
      await connectDB(); // Explicitly call connectDB
    } catch (error) {
      expect(error.message).toBe("Please provide MONGODB_URI in the .env file");
    }
  });

  it("should log an error and exit process if connection fails", async () => {
    process.env.MONGODB_URI = "mongodb://localhost:27017/testdb";

    const mockError = new Error("Connection failed");
    mongoose.connect.mockRejectedValueOnce(mockError); // Mock failed connection

    console.log = jest.fn(); // Mock console.log
    process.exit = jest.fn(); // Mock process.exit

    await connectDB();

    expect(console.log).toHaveBeenCalledWith("Mongodb connect error", mockError);
    expect(process.exit).toHaveBeenCalledWith(1);
  });
});
