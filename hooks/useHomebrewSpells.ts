import { useState, useEffect } from 'react';
import { HomebrewSpell } from '../types';

const DB_NAME = 'dnd-players-toolkit';
const DB_VERSION = 5; // Bump version for schema change
const STORE_NAME = 'homebrew_spells';

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
      if (!dbInstance.objectStoreNames.contains('homebrew_races')) {
        dbInstance.createObjectStore('homebrew_races', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
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

const getAllSpellsDB = (): Promise<HomebrewSpell[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addSpellDB = (spell: HomebrewSpell): Promise<HomebrewSpell> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').add(spell);
    request.onsuccess = () => resolve(spell);
    request.onerror = () => reject(request.error);
  });
};

const updateSpellDB = (spell: HomebrewSpell): Promise<HomebrewSpell> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(spell);
    request.onsuccess = () => resolve(spell);
    request.onerror = () => reject(request.error);
  });
};

const deleteSpellDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').delete(id);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const useHomebrewSpells = () => {
  const [spells, setSpells] = useState<HomebrewSpell[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedSpells = await getAllSpellsDB();
        setSpells(storedSpells);
      } catch (error) {
        console.error('Failed to load homebrew spells from DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addSpell = async (spell: HomebrewSpell) => {
    await addSpellDB(spell);
    setSpells((prev) => [...prev, spell]);
  };

  const updateSpell = async (updatedSpell: HomebrewSpell) => {
    await updateSpellDB(updatedSpell);
    setSpells((prev) => prev.map((s) => (s.id === updatedSpell.id ? updatedSpell : s)));
  };

  const deleteSpell = async (spellId: string) => {
    await deleteSpellDB(spellId);
    setSpells((prev) => prev.filter((s) => s.id !== spellId));
  };

  return { spells, addSpell, updateSpell, deleteSpell, isLoading };
};