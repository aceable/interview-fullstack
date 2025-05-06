// --- routes/userNotesRoutes.ts ---

import express from 'express';
import {
  createNote,
  getUserNotes,
  bulkCreateNotes,
} from '../controllers/userNotesController.ts';

const router = express.Router();

router.post('/notes', createNote);
router.get('/notes/:userId', getUserNotes);
router.post('/notes/bulk', bulkCreateNotes);

export default router;
