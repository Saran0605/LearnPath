const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    const isPlaceholder = !uri || uri.trim() === '' || uri.includes('<username>') || uri.includes('user:password') || uri.includes('your_');

    if (!isPlaceholder) {
      console.log('🔄 Connecting to MongoDB Atlas...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ Connected to MongoDB Atlas successfully.');
    } else {
      console.log('⚠️ MONGODB_URI not set or contains placeholder. Starting MongoMemoryServer fallback...');
      mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`✅ Connected to MongoDB Memory Server at: ${memoryUri}`);
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // If Atlas connection failed, try fallback MongoMemoryServer
    if (!mongoServer) {
      console.log('⚠️ Attempting MongoMemoryServer fallback after Atlas connection failure...');
      try {
        mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(`✅ Connected to MongoDB Memory Server fallback at: ${memoryUri}`);
        return;
      } catch (memErr) {
        console.error('❌ MongoMemoryServer fallback also failed:', memErr.message);
      }
    }
  }
};

module.exports = connectDB;
