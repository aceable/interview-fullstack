import fs from 'fs';
import path from 'path';

import { ObjectId } from 'mongodb';
import Datastore from 'nedb';
import { User } from '../../../shared/types.ts';
// Add MongoDB's ObjectId for ID compatibility

const __dirname = import.meta.url;

// Database collections
const collections: Record<string, Datastore> = {};

// Data directory path
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

// Initialize database by ensuring data directory exists
export const connectToDatabase = async () => {
  try {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    console.log('Successfully initialized NeDB database');
  } catch (error) {
    console.error('Failed to initialize database', error);
    process.exit(1);
  }
};

// Get or create a collection
export const getCollection = (collectionName: string) => {
  if (!collections[collectionName]) {
    // Initialize collection if it doesn't exist
    collections[collectionName] = new Datastore({
      filename: path.join(DATA_DIR, `${collectionName}.db`),
      autoload: true,
    });
    
    // Add auto-compaction to keep the database files optimized
    collections[collectionName].persistence.setAutocompactionInterval(30000); // 30 seconds
  }
  
  // Return a MongoDB-compatible API wrapper
  return {
    // Find one document
    findOne: async (query: any): Promise<User> => {
      // Handle ObjectId conversion for _id queries
      const processedQuery = processQuery(query);
      
      return new Promise((resolve, reject) => {
        collections[collectionName].findOne(processedQuery, (err: Error | null, doc: any) => {
          if (err) reject(err);
          resolve(doc);
        });
      });
    },
    
    // Insert one document
    insertOne: async (document: any) => {
      // Generate MongoDB-compatible ObjectId if _id is missing
      if (!document._id) {
        document._id = new ObjectId().toString();
      }
      
      return new Promise((resolve, reject) => {
        collections[collectionName].insert(document, (err: Error | null, newDoc: any) => {
          if (err) reject(err);
          resolve({
            acknowledged: true,
            insertedId: {
              toString: () => newDoc._id,
              // Add ObjectId compatibility
              toHexString: () => newDoc._id
            }
          });
        });
      });
    },
    
    // Find many documents
    find: async (query: any) => {
      // Handle ObjectId conversion for _id queries
      const processedQuery = processQuery(query);
      
      const cursor = {
        toArray: async () => {
          return new Promise((resolve, reject) => {
            collections[collectionName].find(processedQuery, (err: Error | null, docs: any[]) => {
              if (err) reject(err);
              resolve(docs);
            });
          });
        }
      };
      return cursor;
    },
    
    // Update one document
    updateOne: async (filter: any, update: any) => {
      // Handle ObjectId conversion for _id queries
      const processedFilter = processQuery(filter);
      
      return new Promise((resolve, reject) => {
        collections[collectionName].update(
          processedFilter, 
          { $set: update.$set }, 
          { multi: false, upsert: false },
          (err: Error | null, numReplaced: number) => {
            if (err) reject(err);
            resolve({
              acknowledged: true,
              modifiedCount: numReplaced,
              matchedCount: numReplaced
            });
          }
        );
      });
    },
    
    // Delete one document
    deleteOne: async (filter: any) => {
      // Handle ObjectId conversion for _id queries
      const processedFilter = processQuery(filter);
      
      return new Promise((resolve, reject) => {
        collections[collectionName].remove(
          processedFilter, 
          { multi: false },
          (err: Error | null, numRemoved: number) => {
            if (err) reject(err);
            resolve({
              acknowledged: true,
              deletedCount: numRemoved
            });
          }
        );
      });
    }
  };
};

// Utility function to process ObjectId in queries
function processQuery(query: any): any {
  // If no query or not an object, return as is
  if (!query || typeof query !== 'object') {
    return query;
  }
  
  // Clone the query to avoid modifying the original
  const processedQuery = { ...query };
  
  // Process _id fields to handle both ObjectId instances and string IDs
  if (processedQuery._id) {
    if (processedQuery._id instanceof ObjectId) {
      processedQuery._id = processedQuery._id.toString();
    } else if (typeof processedQuery._id === 'object' && processedQuery._id.$in) {
      // Handle $in operator for _id
      processedQuery._id.$in = processedQuery._id.$in.map((id: any) => 
        id instanceof ObjectId ? id.toString() : id
      );
    }
  }
  
  return processedQuery;
}

// For backward compatibility, but not used with NeDB
export const getDatabase = () => {
  console.warn('getDatabase() is deprecated with NeDB implementation');
  return { collection: getCollection };
};

// Export MongoDB's ObjectId for use in other parts of the application
export { ObjectId };