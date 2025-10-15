import { useState, useEffect } from 'react';
import { Monster, createEmptyMonster } from '../types';

const DB_NAME = 'dnd-dm-toolkit';
const DB_VERSION = 8; // Bump version for schema change
const BESTIARY_STORE_NAME = 'bestiary';
const STORE_NAMES = ['characters', 'dm_notes', 'npcs', 'bestiary', 'campaign_notes', 'timeline_events', 'homebrew_races', 'homebrew_spells', 'homebrew_classes', 'homebrew_rules'];


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
  const transaction = db.transaction(BESTIARY_STORE_NAME, mode);
  return transaction.objectStore(BESTIARY_STORE_NAME);
};

const getAllMonstersDB = (): Promise<Monster[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addMonsterDB = (monster: Monster): Promise<Monster> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').add(monster);
    request.onsuccess = () => resolve(monster);
    request.onerror = () => reject(request.error);
  });
};

const updateMonsterDB = (monster: Monster): Promise<Monster> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(monster);
    request.onsuccess = () => resolve(monster);
    request.onerror = () => reject(request.error);
  });
};

const deleteMonsterDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').delete(id);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const useBestiary = () => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedMonsters = await getAllMonstersDB();
        const migratedMonsters = storedMonsters.map(monster => ({
          ...createEmptyMonster(monster.id),
          ...monster,
        }));
        setMonsters(migratedMonsters);
      } catch (error) {
        console.error('Failed to load monsters from DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addMonster = async (monster: Monster) => {
    try {
      await addMonsterDB(monster);
      setMonsters((prev) => [...prev, monster]);
    } catch (error) {
      console.error('Failed to add monster', error);
    }
  };

  const updateMonster = async (updatedMonster: Monster) => {
    try {
      await updateMonsterDB(updatedMonster);
      setMonsters((prev) =>
        prev.map((m) => (m.id === updatedMonster.id ? updatedMonster : m))
      );
    } catch (error) {
      console.error('Failed to update monster', error);
    }
  };

  const deleteMonster = async (monsterId: string) => {
    try {
      await deleteMonsterDB(monsterId);
      setMonsters((prev) => prev.filter((m) => m.id !== monsterId));
    } catch (error) {
      console.error('Failed to delete monster', error);
    }
  };

  return { monsters, addMonster, updateMonster, deleteMonster, isLoading };
};
