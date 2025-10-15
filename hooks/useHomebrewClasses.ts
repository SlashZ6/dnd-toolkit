import { useState, useEffect } from 'react';
import { HomebrewClass } from '../types';

const DB_NAME = 'dnd-players-toolkit';
const DB_VERSION = 5;
const STORE_NAME = 'homebrew_classes';

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
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
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

const getAllClassesDB = (): Promise<HomebrewClass[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addClassDB = (cls: HomebrewClass): Promise<HomebrewClass> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').add(cls);
    request.onsuccess = () => resolve(cls);
    request.onerror = () => reject(request.error);
  });
};

const updateClassDB = (cls: HomebrewClass): Promise<HomebrewClass> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(cls);
    request.onsuccess = () => resolve(cls);
    request.onerror = () => reject(request.error);
  });
};

const deleteClassDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').delete(id);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const useHomebrewClasses = () => {
  const [classes, setClasses] = useState<HomebrewClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedClasses = await getAllClassesDB();
        setClasses(storedClasses);
      } catch (error) {
        console.error('Failed to load homebrew classes from DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addClass = async (cls: HomebrewClass) => {
    await addClassDB(cls);
    setClasses((prev) => [...prev, cls]);
  };

  const updateClass = async (updatedCls: HomebrewClass) => {
    await updateClassDB(updatedCls);
    setClasses((prev) => prev.map((c) => (c.id === updatedCls.id ? updatedCls : c)));
  };

  const deleteClass = async (classId: string) => {
    await deleteClassDB(classId);
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  return { classes, addClass, updateClass, deleteClass, isLoading };
};