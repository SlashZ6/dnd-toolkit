import { useState, useEffect } from 'react';
import { Character, createEmptyCharacter } from '../types';

// --- IndexedDB Logic for DM ---
const DB_NAME = 'dnd-dm-toolkit'; // Separate DB for the DM
const DB_VERSION = 8; // Bump version for schema change
const STORE_NAME = 'characters';
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
                  keyPath = 'id'; // All homebrew stores use 'id'
              } else {
                  keyPath = 'id'; // Default for characters, npcs, etc.
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

const getStore = (store: string, mode: IDBTransactionMode) => {
  const transaction = db.transaction(store, mode);
  transaction.onerror = (event) => {
    console.error(`Transaction error on ${store}: ${(event.target as IDBTransaction).error}`);
  };
  return transaction.objectStore(store);
};


const getAllCharactersDB = (): Promise<Character[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore(STORE_NAME, 'readonly').getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      console.error('Error getting all characters:', request.error);
      reject(request.error);
    };
  });
};

const addCharacterDB = (character: Character): Promise<Character> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore(STORE_NAME, 'readwrite').add(character);
    request.onsuccess = () => {
      resolve(character);
    };
    request.onerror = () => {
      console.error('Error adding character:', request.error);
      reject(request.error);
    };
  });
};

const updateCharacterDB = (character: Character): Promise<Character> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore(STORE_NAME, 'readwrite').put(character);
    request.onsuccess = () => {
      resolve(character);
    };
    request.onerror = () => {
      console.error('Error updating character:', request.error);
      reject(request.error);
    };
  });
};

const deleteCharacterDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore(STORE_NAME, 'readwrite').delete(id);
    request.onsuccess = () => {
      resolve(id);
    };
    request.onerror = () => {
      console.error('Error deleting character:', request.error);
      reject(request.error);
    };
  });
};
// --- End IndexedDB Logic ---

export const useDmCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedCharacters = await getAllCharactersDB();
        const migratedCharacters = storedCharacters.map(char => ({
          ...createEmptyCharacter(char.id),
          ...char,
        }));
        setCharacters(migratedCharacters);
      } catch (error) {
        console.error('Failed to load characters from DM DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addCharacter = async (character: Character) => {
    try {
      await addCharacterDB(character);
      setCharacters((prev) => [...prev, character]);
    } catch (error) {
      console.error('Failed to add character', error);
    }
  };

  const updateCharacter = async (updatedCharacter: Character) => {
    try {
      await updateCharacterDB(updatedCharacter);
      setCharacters((prev) =>
        prev.map((c) => (c.id === updatedCharacter.id ? updatedCharacter : c))
      );
    } catch (error) {
      console.error('Failed to update character', error);
    }
  };

  const deleteCharacter = async (characterId: string) => {
    try {
      await deleteCharacterDB(characterId);
      setCharacters((prev) => prev.filter((c) => c.id !== characterId));
    } catch (error) {
      console.error('Failed to delete character', error);
    }
  };

  return { characters, addCharacter, updateCharacter, deleteCharacter, isLoading };
};
