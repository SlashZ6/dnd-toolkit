import { useState, useEffect } from 'react';
import { TimelineEvent, createEmptyTimelineEvent } from '../types';

const DB_NAME = 'dnd-dm-toolkit';
const DB_VERSION = 8; // Bump version for schema change
const TIMELINE_STORE_NAME = 'timeline_events';
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
  const transaction = db.transaction(TIMELINE_STORE_NAME, mode);
  return transaction.objectStore(TIMELINE_STORE_NAME);
};

const getAllEventsDB = (): Promise<TimelineEvent[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addEventDB = (event: TimelineEvent): Promise<TimelineEvent> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').add(event);
    request.onsuccess = () => resolve(event);
    request.onerror = () => reject(request.error);
  });
};

const updateEventDB = (event: TimelineEvent): Promise<TimelineEvent> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(event);
    request.onsuccess = () => resolve(event);
    request.onerror = () => reject(request.error);
  });
};

const deleteEventDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').delete(id);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const useTimeline = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedEvents = await getAllEventsDB();
        setEvents(storedEvents);
      } catch (error) {
        console.error('Failed to load timeline events from DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addEvent = async (event: TimelineEvent) => {
    try {
      await addEventDB(event);
      setEvents((prev) => [...prev, event]);
    } catch (error) {
      console.error('Failed to add event', error);
    }
  };

  const updateEvent = async (updatedEvent: TimelineEvent) => {
    try {
      await updateEventDB(updatedEvent);
      setEvents((prev) =>
        prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
      );
    } catch (error) {
      console.error('Failed to update event', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteEventDB(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error('Failed to delete event', error);
    }
  };

  return { events, addEvent, updateEvent, deleteEvent, isLoading };
};
