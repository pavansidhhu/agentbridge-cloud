import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  retryReads: true,
  tls: true,
  ...(process.env.NODE_ENV !== 'production' && { tlsAllowInvalidCertificates: true }),
};

let client;
let clientPromise;


if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    // Auto-reset the promise if it failed (e.g., SSL errors) so the next
    // request gets a fresh connection attempt.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch(err => {
        console.error('MongoDB connection failed, resetting cache:', err.message);
        global._mongoClientPromise = null;
        throw err;
      });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
} else {
  // Use a local JSON file-based database for development when MONGODB_URI is missing.
  const dbFilePath = path.join(process.cwd(), 'local_db.json');

  const readDb = () => {
    try {
      if (fs.existsSync(dbFilePath)) {
        return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
      }
    } catch (e) {
      console.error('Error reading mock DB file:', e);
    }
    return { users: [], config: [] };
  };

  const writeDb = (data) => {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing mock DB file:', e);
    }
  };

  class MockCollection {
    constructor(name) {
      this.name = name;
    }

    async findOne(query) {
      const db = readDb();
      const list = db[this.name] || [];
      return list.find(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    }

    async updateOne(query, update, options = {}) {
      const db = readDb();
      if (!db[this.name]) db[this.name] = [];
      const list = db[this.name];

      let index = list.findIndex(item => {
        for (const key in query) {
          if (item[key] !== query[key]) return false;
        }
        return true;
      });

      let item;
      let isNew = false;
      if (index === -1) {
        if (options.upsert) {
          item = { ...query };
          isNew = true;
        } else {
          return { matchedCount: 0, modifiedCount: 0 };
        }
      } else {
        item = list[index];
      }

      if (update.$set) {
        for (const key in update.$set) {
          item[key] = update.$set[key];
        }
      }
      if (update.$setOnInsert && isNew) {
        for (const key in update.$setOnInsert) {
          item[key] = update.$setOnInsert[key];
        }
      }

      if (isNew) {
        list.push(item);
      } else {
        list[index] = item;
      }

      writeDb(db);
      return { matchedCount: index === -1 ? 0 : 1, modifiedCount: 1, upsertedCount: isNew ? 1 : 0 };
    }

    async countDocuments(query = {}) {
      const db = readDb();
      const list = db[this.name] || [];
      if (Object.keys(query).length === 0) {
        return list.length;
      }

      return list.filter(item => {
        for (const key in query) {
          const queryVal = query[key];
          const itemVal = item[key];
          if (queryVal && typeof queryVal === 'object') {
            if ('$gte' in queryVal) {
              const dateVal = new Date(itemVal);
              const compareVal = new Date(queryVal.$gte);
              if (isNaN(dateVal.getTime()) || dateVal < compareVal) return false;
            }
          } else {
            if (itemVal !== queryVal) return false;
          }
        }
        return true;
      }).length;
    }

    find(query = {}) {
      const db = readDb();
      let list = [...(db[this.name] || [])];

      // Apply simple query filtering
      if (Object.keys(query).length > 0) {
        list = list.filter(item => {
          for (const key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        });
      }

      // Return a cursor-like object
      const cursor = {
        _list: list,
        sort(sortObj) {
          const [key, dir] = Object.entries(sortObj)[0] || [];
          if (key) {
            this._list = [...this._list].sort((a, b) => {
              const av = a[key] ? new Date(a[key]).getTime() : 0;
              const bv = b[key] ? new Date(b[key]).getTime() : 0;
              return dir === -1 ? bv - av : av - bv;
            });
          }
          return this;
        },
        async toArray() {
          return this._list;
        },
      };
      return cursor;
    }
  }

  const mockDb = {
    collection: (name) => new MockCollection(name)
  };

  const mockClient = {
    db: () => mockDb,
    connect: async () => mockClient
  };

  clientPromise = Promise.resolve(mockClient);
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

