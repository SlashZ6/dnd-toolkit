

import { useState, useEffect } from 'react';
import { NPC, createEmptyNPC } from '../types';

const DB_NAME = 'dnd-dm-toolkit';
const DB_VERSION = 6;
const NPC_STORE_NAME = 'npcs';
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
  const transaction = db.transaction(NPC_STORE_NAME, mode);
  return transaction.objectStore(NPC_STORE_NAME);
};

const getAllNpcsDB = (): Promise<NPC[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addNpcDB = (npc: NPC): Promise<NPC> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').add(npc);
    request.onsuccess = () => resolve(npc);
    request.onerror = () => reject(request.error);
  });
};

const updateNpcDB = (npc: NPC): Promise<NPC> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(npc);
    request.onsuccess = () => resolve(npc);
    request.onerror = () => reject(request.error);
  });
};

const deleteNpcDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').delete(id);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const useNpcs = () => {
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedNpcs = await getAllNpcsDB();
        const migratedNpcs = storedNpcs.map(npc => ({
          ...createEmptyNPC(npc.id),
          ...npc,
        }));
        setNpcs(migratedNpcs);
      } catch (error) {
        console.error('Failed to load NPCs from DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addNpc = async (npc: NPC) => {
    try {
      await addNpcDB(npc);
      setNpcs((prev) => [...prev, npc]);
    } catch (error) {
      console.error('Failed to add NPC', error);
    }
  };

  const updateNpc = async (updatedNpc: NPC) => {
    try {
      await updateNpcDB(updatedNpc);
      setNpcs((prev) =>
        prev.map((c) => (c.id === updatedNpc.id ? updatedNpc : c))
      );
    } catch (error) {
      console.error('Failed to update NPC', error);
    }
  };

  const deleteNpc = async (npcId: string) => {
    try {
      await deleteNpcDB(npcId);
      setNpcs((prev) => prev.filter((c) => c.id !== npcId));
    } catch (error) {
      console.error('Failed to delete NPC', error);
    }
  };

  return { npcs, addNpc, updateNpc, deleteNpc, isLoading };
};