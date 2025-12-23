
import { useState, useEffect } from 'react';
import { SavedMap } from '../types';

const DB_NAME = 'dnd-dm-toolkit';
const DB_VERSION = 8;
const MAPS_STORE_NAME = 'saved_maps';

// Reusing DB connection logic but centralized to this hook for maps specifically
let db: IDBDatabase;

const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(true);

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    // Schema creation is handled in other hooks if version matches, 
    // but just in case this runs first or isolated:
    request.onupgradeneeded = (event) => {
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        if (!dbInstance.objectStoreNames.contains(MAPS_STORE_NAME)) {
            dbInstance.createObjectStore(MAPS_STORE_NAME, { keyPath: 'id' });
        }
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
    const transaction = db.transaction(MAPS_STORE_NAME, mode);
    return transaction.objectStore(MAPS_STORE_NAME);
};

export const useMaps = () => {
    const [maps, setMaps] = useState<SavedMap[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadMaps = async () => {
        setIsLoading(true);
        try {
            await initDB();
            if (!db.objectStoreNames.contains(MAPS_STORE_NAME)) {
                 // Force upgrade if store missing in current version
                 // In production this implies version bump. Here we assume schema exists.
                 setMaps([]);
                 setIsLoading(false);
                 return;
            }
            const store = getStore('readonly');
            const request = store.getAll();
            request.onsuccess = () => {
                setMaps(request.result);
                setIsLoading(false);
            };
        } catch (error) {
            console.error('Failed to load maps', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadMaps();
    }, []);

    const saveMap = async (map: SavedMap) => {
        await initDB();
        const store = getStore('readwrite');
        store.put(map);
        setMaps(prev => {
            const existing = prev.findIndex(m => m.id === map.id);
            if (existing >= 0) {
                const newMaps = [...prev];
                newMaps[existing] = map;
                return newMaps;
            }
            return [...prev, map];
        });
    };

    const deleteMap = async (id: string) => {
        await initDB();
        const store = getStore('readwrite');
        store.delete(id);
        setMaps(prev => prev.filter(m => m.id !== id));
    };

    return { maps, saveMap, deleteMap, loadMaps, isLoading };
};
