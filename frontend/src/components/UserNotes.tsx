// --- frontend/components/UserNotes.tsx ---

import React, { useEffect, useState } from 'react';

interface Note {
  lessonId: string;
  note: string;
}

export const UserNotes = ({ userId }: { userId: string }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  // set reference to the textarea and button
  const noteRef = React.createRef<HTMLTextAreaElement>();

  useEffect(() => {
    console.log('get notes');
    fetch(`/api/notes/${userId}`)
      .then(res => res.json())
      .then(setNotes);
  });

  const handleCreateNote = () => {
    const noteContent = noteRef.current?.value;
    if (noteContent) {
      
      
    }
  };

  return (
    <div>
      <textarea ref={noteRef} id="note" className="w-full h-32 border rounded p-2 mb-4" placeholder="Write your notes here..."></textarea>
      <button id="create-note" className="bg-blue-500 text-white mb-4 px-4 py-2 rounded" onClick={handleCreateNote}>Save Note</button>
      <hr />

      {notes.map((note, idx) => (
        <div key={idx}>
          <p><strong>Lesson:</strong> {note.lessonId}</p>
          <p>{note.note}</p>
        </div>
      ))}
    </div>
  );
};
