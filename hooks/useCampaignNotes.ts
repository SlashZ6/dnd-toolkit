import { useState, useEffect, useCallback } from 'react';
import { CampaignNote } from '../types';

const DB_NAME = 'dnd-dm-toolkit';
const DB_VERSION = 6;
const NOTES_STORE_NAME = 'campaign_notes';
const STORE_NAMES = ['characters', 'dm_notes', 'npcs', 'bestiary', 'campaign_notes', 'timeline_events'];

let db: IDBDatabase;

const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(true);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      STORE_NAMES.forEach(storeName => {
        if (!dbInstance.objectStoreNames.contains(storeName)) {
            const keyPath = storeName === 'dm_notes' ? 'characterId' : 'id';
            dbInstance.createObjectStore(storeName, { keyPath });
        }
      });
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(true);
    };

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      reject(false);
    };
  });
};

const getStore = (mode: IDBTransactionMode) => {
  const transaction = db.transaction(NOTES_STORE_NAME, mode);
  return transaction.objectStore(NOTES_STORE_NAME);
};

const getAllNotesDB = (): Promise<CampaignNote[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addNoteDB = (note: CampaignNote): Promise<CampaignNote> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').add(note);
    request.onsuccess = () => resolve(note);
    request.onerror = () => reject(request.error);
  });
};

const updateNoteDB = (note: CampaignNote): Promise<CampaignNote> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(note);
    request.onsuccess = () => resolve(note);
    request.onerror = () => reject(request.error);
  });
};

const deleteNoteDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').delete(id);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const useCampaignNotes = () => {
  const [notes, setNotes] = useState<CampaignNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedNotes = await getAllNotesDB();
        setNotes(storedNotes);
      } catch (error) {
        console.error('Failed to load notes from DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addNote = async (note: CampaignNote) => {
    try {
      await addNoteDB(note);
      setNotes((prev) => [...prev, note]);
    } catch (error) {
      console.error('Failed to add note', error);
    }
  };

  const updateNote = async (updatedNote: CampaignNote) => {
    try {
      await updateNoteDB(updatedNote);
      setNotes((prev) =>
        prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      );
    } catch (error) {
      console.error('Failed to update note', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await deleteNoteDB(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  return { notes, addNote, updateNote, deleteNote, isLoading };
};