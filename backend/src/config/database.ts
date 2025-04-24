import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import type { Filter, InferIdType, InsertOneResult, ObjectId, UpdateFilter } from 'mongodb';
import Datastore from 'nedb';
// Add MongoDB's ObjectId for ID compatibility

const __dirname = import.meta.url;

// Database collections
const collections: Record<string, Datastore> = {};

// Data directory path
const DATA_DIR = path.join(__dirname, '..', '..', 'data');

export interface Document { _id?: string;[key: string]: unknown }

// Initialize database by ensuring data directory exists
export const connectToDatabase = () => {
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
    findOne: async <T = unknown>(query: Filter<T>): Promise<T | null> => {
      // Handle ObjectId conversion for _id queries
      return new Promise((resolve, reject) => {
        collections[collectionName].findOne(query, (err: Error | null, doc: T | null) => {
          if (err) reject(err);
          resolve(doc);
        });
      });
    },
    
    // Insert one document
    insertOne: async <T = unknown>(document: Omit<T, '_id'> & { _id?: string | ObjectId }): Promise<InsertOneResult<T>> => {
      // Generate MongoDB-compatible ObjectId if _id is missing
      document._id ??= crypto.randomUUID();
      
      return new Promise((resolve, reject) => {
        collections[collectionName].insert(document, (err: Error | null, newDoc) => {
          if (err) reject(err);
          resolve({
            acknowledged: true,
            insertedId: newDoc._id as InferIdType<T>,
          });
        });
      });
    },
    
    // Find many documents
    find: <T = unknown>(query: Filter<T>) => {
      const cursor = {
        toArray: async () => {
          return new Promise((resolve, reject) => {
            collections[collectionName].find(query, (err: Error | null, docs: any[]) => {
              if (err) reject(err);
              resolve(docs);
            });
          });
        }
      };
      return cursor;
    },
    
    // Update one document
    updateOne: async <T = unknown>(filter: Filter<T>, update: UpdateFilter<T>) => {
      return new Promise((resolve, reject) => {
        collections[collectionName].update(
          filter, 
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
    deleteOne: async <T = unknown>(filter: Filter<T>) => {
      return new Promise((resolve, reject) => {
        collections[collectionName].remove(
          filter, 
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

// For backward compatibility, but not used with NeDB
export const getDatabase = () => {
  console.warn('getDatabase() is deprecated with NeDB implementation');
  return { collection: getCollection };
};
