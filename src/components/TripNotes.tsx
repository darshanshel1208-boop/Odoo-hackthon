import { useState, useEffect } from 'react';
import { SectionHeader, Card, Button } from './Theme';
import { Trip } from '../types';
import { Plus, StickyNote, Trash2, Clock, Calendar } from 'lucide-react';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError } from '../lib/utils';
import { OperationType } from '../types';

interface Note {
  id: string;
  tripId: string;
  text: string;
  createdAt: string;
}

interface TripNotesProps {
  trips: Trip[];
}

export function TripNotes({ trips }: TripNotesProps) {
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (selectedTripId) {
      const q = query(
        collection(db, `trips/${selectedTripId}/notes`),
        orderBy('createdAt', 'desc')
      );
      const unsub = onSnapshot(q, (snapshot) => {
        setNotes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `trips/${selectedTripId}/notes`);
      });
      return unsub;
    }
  }, [selectedTripId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote || !selectedTripId) return;
    try {
      await addDoc(collection(db, `trips/${selectedTripId}/notes`), {
        tripId: selectedTripId,
        text: newNote,
        createdAt: new Date().toISOString()
      });
      setNewNote('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `trips/${selectedTripId}/notes`);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, `trips/${selectedTripId}/notes/${id}`));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `trips/${selectedTripId}/notes/${id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <SectionHeader 
        title="Trip Journal" 
        subtitle="Capture memories, save important details, and leave reminders."
        action={
          <select 
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="px-4 py-3 rounded-2xl border-2 border-slate-100 font-bold outline-none focus:border-primary bg-white shadow-sm"
          >
            {trips.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        }
      />

      <div className="space-y-8">
        <form onSubmit={handleAddNote} className="space-y-4">
          <textarea 
            placeholder="Jot down a thought, hotel info, or a reminder..."
            className="w-full p-8 rounded-3xl bg-white border border-slate-100 shadow-sm focus:border-primary outline-none min-h-[160px] text-lg font-medium leading-relaxed transition-all"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="flex justify-end">
            <Button type="submit" icon={StickyNote} className="px-10 py-5 text-lg">Save Memory</Button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Card key={note.id} className="relative group p-8 hover:bg-amber-50">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      {new Date(note.createdAt).toLocaleDateString()} at {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="p-2 text-slate-200 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{note.text}</p>
              </Card>
            ))
          ) : (
             <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                  <StickyNote size={32} />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No notes captured for this journey yet.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
