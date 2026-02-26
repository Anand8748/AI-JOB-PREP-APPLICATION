import { mongoDB } from './mongodb.js';

class MockDatabase {
  constructor() {
    this.users = new Map();
    this.interviews = new Map();
    this.summaries = new Map();
  }

  collection(name) {
    return new MockCollection(this.getData(name));
  }

  getData(name) {
    switch (name) {
      case 'users': return this.users;
      case 'interviews': return this.interviews;
      case 'summaries': return this.summaries;
      default: return new Map();
    }
  }
}

class MockCollection {
  constructor(data) {
    this.data = data;
  }

  async findOne(query) {
    for (const [id, doc] of this.data) {
      if (this.matchesQuery(doc, query)) {
        return { _id: id, ...doc };
      }
    }
    return null;
  }

  async insertOne(doc) {
    const id = Date.now().toString();
    const fullDoc = { ...doc, _id: id };
    this.data.set(id, doc);
    return { insertedId: id, acknowledged: true };
  }

  async find(query) {
    const results = [];
    for (const [id, doc] of this.data) {
      if (this.matchesQuery(doc, query)) {
        results.push({ _id: id, ...doc });
      }
    }
    return { toArray: () => results };
  }

  async updateOne(query, update) {
    for (const [id, doc] of this.data) {
      if (this.matchesQuery(doc, query)) {
        if (update.$set) {
          Object.assign(doc, update.$set);
        }
        return { matchedCount: 1, modifiedCount: 1, acknowledged: true };
      }
    }
    return { matchedCount: 0, modifiedCount: 0, acknowledged: true };
  }

  matchesQuery(doc, query) {
    if (!query || Object.keys(query).length === 0) return true;
    for (const [key, value] of Object.entries(query)) {
      if (doc[key] !== value) return false;
    }
    return true;
  }
}

// Development database manager
export class DevDatabase {
  static async getDatabase() {
    try {
      // Try to connect to real MongoDB first
      return await mongoDB.getDatabase();
    } catch (error) {
      console.warn('⚠️  MongoDB unavailable, using mock database for development');
      console.warn('⚠️  Data will be lost when server restarts');
      return new MockDatabase();
    }
  }
}
