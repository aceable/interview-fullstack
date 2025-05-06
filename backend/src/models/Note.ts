import { getCollection } from '../config/database.ts';

export interface Note {
  userId: string;
  lessonId: string;
  note: string;
  createdAt: string;
}

export const Note = {
  create: async (note: Note) => {
    console.log('Creating note', note);
    return { ...note, id: Math.random().toString(36).substring(2) };
  },
  find: async (filter: { userId: string }) => {
    console.log('Fetching notes for user', filter.userId);
    return [];
  },
};
