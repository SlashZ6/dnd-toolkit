import { useState, useEffect } from 'react';
import { HomebrewOfficialSubclass } from '../types';

const DB_NAME = 'dnd-players-toolkit';
const DB_VERSION = 5;
const STORE_NAME = 'homebrew_official_subclasses';

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
      if (!dbInstance.objectStoreNames.contains('homebrew_spells')) {
        dbInstance.createObjectStore('homebrew_spells', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains('homebrew_classes')) {
        dbInstance.createObjectStore('homebrew_classes', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains('homebrew_rules')) {
        dbInstance.createObjectStore('homebrew_rules', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
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

const getAllSubclassesDB = (): Promise<HomebrewOfficialSubclass[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addSubclassDB = (subclass: HomebrewOfficialSubclass): Promise<HomebrewOfficialSubclass> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').add(subclass);
    request.onsuccess = () => resolve(subclass);
    request.onerror = () => reject(request.error);
  });
};

const updateSubclassDB = (subclass: HomebrewOfficialSubclass): Promise<HomebrewOfficialSubclass> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(subclass);
    request.onsuccess = () => resolve(subclass);
    request.onerror = () => reject(request.error);
  });
};

const deleteSubclassDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').delete(id);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const useHomebrewOfficialSubclasses = () => {
  const [subclasses, setSubclasses] = useState<HomebrewOfficialSubclass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedSubclasses = await getAllSubclassesDB();
        setSubclasses(storedSubclasses);
      } catch (error) {
        console.error('Failed to load homebrew subclasses from DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addSubclass = async (subclass: HomebrewOfficialSubclass) => {
    await addSubclassDB(subclass);
    setSubclasses((prev) => [...prev, subclass]);
  };

  const updateSubclass = async (updatedSubclass: HomebrewOfficialSubclass) => {
    await updateSubclassDB(updatedSubclass);
    setSubclasses((prev) => prev.map((s) => (s.id === updatedSubclass.id ? updatedSubclass : s)));
  };

  const deleteSubclass = async (subclassId: string) => {
    await deleteSubclassDB(subclassId);
    setSubclasses((prev) => prev.filter((s) => s.id !== subclassId));
  };

  return { subclasses, addSubclass, updateSubclass, deleteSubclass, isLoading };
};