import { useState, useEffect, useCallback } from 'react';
import { DMNotes, createEmptyDMNotes } from '../types';

const DB_NAME = 'dnd-dm-toolkit';
const DB_VERSION = 8; // Bump version for schema change
const NOTES_STORE_NAME = 'dm_notes';
const STORE_NAMES = ['characters', 'dm_notes', 'npcs', 'bestiary', 'campaign_notes', 'timeline_events', 'homebrew_races', 'homebrew_spells', 'homebrew_classes', 'homebrew_rules'];


let db: IDBDatabase;

const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(true);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      STORE_NAMES.forEach(storeName => {
          if (!dbInstance.objectStoreNames.contains(storeName)) {
              let keyPath;
              if (storeName === 'dm_notes') {
                  keyPath = 'characterId';
              } else if (storeName.startsWith('homebrew_')) {
                  keyPath = 'id';
              } else {
                  keyPath = 'id';
              }
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

const getDmNotesDB = (characterId: string): Promise<DMNotes> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').get(characterId);
    request.onsuccess = () => {
      resolve(request.result || createEmptyDMNotes(characterId));
    };
    request.onerror = () => reject(request.error);
  });
};

const saveDmNotesDB = (notes: DMNotes): Promise<DMNotes> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(notes);
    request.onsuccess = () => resolve(notes);
    request.onerror = () => reject(request.error);
  });
};

export const useDmNotes = (characterId: string) => {
  const [dmNotes, setDmNotes] = useState<DMNotes | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    if (!characterId) return;
    setIsLoading(true);
    try {
      await initDB();
      const notes = await getDmNotesDB(characterId);
      setDmNotes(notes);
    } catch (error) {
      console.error('Failed to load DM notes', error);
    } finally {
      setIsLoading(false);
    }
  }, [characterId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const saveDmNotes = useCallback(async (notesToSave: DMNotes) => {
    try {
      await saveDmNotesDB(notesToSave);
      setDmNotes(notesToSave);
    } catch (error) {
      console.error('Failed to save DM notes', error);
    }
  }, []);

  return { dmNotes, saveDmNotes, isLoading };
};
