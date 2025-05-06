// --- controllers/userNotesController.ts ---

import type { Request, Response } from 'express';
import { Note } from '../models/Note.ts';

// Create a single note
export const createNote = async (req: Request, res: Response) => {
  const { userId, lessonId, note } = req.body;
  try {
    const newNote = await Note.create({
      userId,
      lessonId,
      note,
      createdAt: new Date().toISOString(),
    });
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create note' });
  }
};

// Get all notes for a user
export const getUserNotes = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const notes = await Note.find({ userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes' });
  }
};

// Bulk create notes
export const bulkCreateNotes = async (req: Request, res: Response) => {
  const { userId, notes } = req.body;
  try {
    for (const note of notes) {
      await Note.create({
        userId,
        lessonId: note.lessonId,
        note: note.content,
        createdAt: new Date().toISOString(),
      });
    }
    res.status(201).json({ message: 'Notes created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Bulk note creation failed' });
  }
};
