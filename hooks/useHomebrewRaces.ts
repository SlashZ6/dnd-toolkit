import { useState, useEffect } from 'react';
import { HomebrewRace } from '../types';

const DB_NAME = 'dnd-players-toolkit';
const DB_VERSION = 5; // Bump version for schema change
const STORE_NAME = 'homebrew_races';

let db: IDBDatabase;

const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(true);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      if (!dbInstance.objectStoreNames.contains('characters')) {
        dbInstance.createObjectStore('characters', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains('homebrew_spells')) {
        dbInstance.createObjectStore('homebrew_spells', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains('homebrew_classes')) {
        dbInstance.createObjectStore('homebrew_classes', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains('homebrew_rules')) {
        dbInstance.createObjectStore('homebrew_rules', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains('homebrew_official_subclasses')) {
        dbInstance.createObjectStore('homebrew_official_subclasses', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(true);
    };

    request.onerror = (event) => reject((event.target as IDBOpenDBRequest).error);
  });
};

const getStore = (mode: IDBTransactionMode) => {
  const transaction = db.transaction(STORE_NAME, mode);
  return transaction.objectStore(STORE_NAME);
};

const getAllRacesDB = (): Promise<HomebrewRace[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addRaceDB = (race: HomebrewRace): Promise<HomebrewRace> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').add(race);
    request.onsuccess = () => resolve(race);
    request.onerror = () => reject(request.error);
  });
};

const updateRaceDB = (race: HomebrewRace): Promise<HomebrewRace> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(race);
    request.onsuccess = () => resolve(race);
    request.onerror = () => reject(request.error);
  });
};

const deleteRaceDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').delete(id);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const useHomebrewRaces = () => {
  const [races, setRaces] = useState<HomebrewRace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedRaces = await getAllRacesDB();
        setRaces(storedRaces);
      } catch (error) {
        console.error('Failed to load homebrew races from DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addRace = async (race: HomebrewRace) => {
    await addRaceDB(race);
    setRaces((prev) => [...prev, race]);
  };

  const updateRace = async (updatedRace: HomebrewRace) => {
    await updateRaceDB(updatedRace);
    setRaces((prev) => prev.map((r) => (r.id === updatedRace.id ? updatedRace : r)));
  };

  const deleteRace = async (raceId: string) => {
    await deleteRaceDB(raceId);
    setRaces((prev) => prev.filter((r) => r.id !== raceId));
  };

  return { races, addRace, updateRace, deleteRace, isLoading };
};