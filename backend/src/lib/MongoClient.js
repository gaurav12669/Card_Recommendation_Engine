const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

class MongoConnection {
  constructor() {
    this.client = null;
    this.db = null;
    this.connectionPromise = null;
  }

  static getInstance() {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  async connect() {
    if (this.db) {
      return this.db;
    }

    if (!this.connectionPromise) {
      this.connectionPromise = this.initialize();
    }

    try {
      this.db = await this.connectionPromise;
      return this.db;
    } catch (error) {
      this.connectionPromise = null;
      throw error;
    }
  }

  async initialize() {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
    const dbName = process.env.MONGO_DB_NAME || 'card_genius_analytics';

    try {
      const client = new MongoClient(uri, {
        maxPoolSize: Number(5),
      });
      await client.connect();
      console.log('MongoDB connected successfully');
      this.client = client;
      return client.db(dbName);
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      throw error;
    }
  }

  async getCollection(collectionName) {
    const db = await this.connect();
    return db.collection(collectionName);
  }
}

module.exports = MongoConnection.getInstance();

