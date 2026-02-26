import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

class MongoDBConnection {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 3;
  }

  async connect() {
    if (this.isConnected && this.client) {
      return this.client;
    }

    const connectionStrategies = [
      {
        name: 'MongoDB Atlas - Standard',
        uri: process.env.MONGODB_URI,
        options: {
          ssl: true,
          tlsAllowInvalidCertificates: true,
          tlsAllowInvalidHostnames: true,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 30000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 30000,
          retryWrites: true,
          retryReads: true,
        }
      },
      {
        name: 'MongoDB Atlas - Direct Connection',
        uri: process.env.MONGODB_URI?.replace('mongodb+srv://', 'mongodb://'),
        options: {
          ssl: true,
          tlsAllowInvalidCertificates: true,
          tlsAllowInvalidHostnames: true,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 30000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 30000,
          retryWrites: true,
          retryReads: true,
        }
      }
    ];

    for (const strategy of connectionStrategies) {
      if (!strategy.uri) continue;
      
      try {
        console.log(`Attempting connection to ${strategy.name}...`);
        this.client = new MongoClient(strategy.uri, strategy.options);
        await this.client.connect();
        await this.client.db().admin().ping();
        
        this.isConnected = true;
        this.connectionAttempts = 0;
        console.log(`✅ Successfully connected to ${strategy.name}`);
        return this.client;
      } catch (error) {
        console.log(`❌ Failed to connect to ${strategy.name}:`, error.message);
        if (this.client) {
          try {
            await this.client.close();
          } catch (closeError) {
            console.error('Error closing client:', closeError.message);
          }
        }
        this.client = null;
        this.isConnected = false;
      }
    }

    throw new Error('Failed to connect to any MongoDB instance');
  }

  async disconnect() {
    if (this.client && this.isConnected) {
      try {
        await this.client.close();
        this.isConnected = false;
        console.log('MongoDB disconnected');
      } catch (error) {
        console.error('Error disconnecting MongoDB:', error);
      }
    }
  }

  async getDatabase() {
    if (!this.isConnected || !this.client) {
      await this.connect();
    }
    return this.client.db();
  }
}

// Export singleton instance
export const mongoDB = new MongoDBConnection();
