import { useState, useEffect } from 'react';
import { HomebrewRule } from '../types';

const DB_NAME = 'dnd-players-toolkit';
const DB_VERSION = 5;
const STORE_NAME = 'homebrew_rules';

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
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
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

const getAllRulesDB = (): Promise<HomebrewRule[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readonly').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const addRuleDB = (rule: HomebrewRule): Promise<HomebrewRule> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').add(rule);
    request.onsuccess = () => resolve(rule);
    request.onerror = () => reject(request.error);
  });
};

const updateRuleDB = (rule: HomebrewRule): Promise<HomebrewRule> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').put(rule);
    request.onsuccess = () => resolve(rule);
    request.onerror = () => reject(request.error);
  });
};

const deleteRuleDB = (id: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('DB not initialized');
    const request = getStore('readwrite').delete(id);
    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
};

export const useHomebrewRules = () => {
  const [rules, setRules] = useState<HomebrewRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await initDB();
        const storedRules = await getAllRulesDB();
        setRules(storedRules);
      } catch (error) {
        console.error('Failed to load homebrew rules from DB', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addRule = async (rule: HomebrewRule) => {
    await addRuleDB(rule);
    setRules((prev) => [...prev, rule]);
  };

  const updateRule = async (updatedRule: HomebrewRule) => {
    await updateRuleDB(updatedRule);
    setRules((prev) => prev.map((r) => (r.id === updatedRule.id ? updatedRule : r)));
  };

  const deleteRule = async (ruleId: string) => {
    await deleteRuleDB(ruleId);
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  return { rules, addRule, updateRule, deleteRule, isLoading };
};