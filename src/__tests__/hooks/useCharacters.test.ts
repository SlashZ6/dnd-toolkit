import { renderHook, waitFor, act } from '@testing-library/react';
import { useCharacters } from '../../../hooks/useCharacters';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Character, createEmptyCharacter } from '../../../types';

// We need to properly mock IndexedDB or use a better approach for fake-indexeddb
// Since fake-indexeddb is global, we need to ensure unique DB names or resets.

describe('useCharacters Hook', () => {

    // Use a unique DB name for each test run if possible, but the hook uses a hardcoded name.
    // So we must rely on cleanup.

    // We cannot reliably reset IndexedDB in JSDOM + fake-indexeddb environment between tests
    // because connections might stay open.
    // Instead of fighting the DB lock, we can mock the `indexedDB` object completely
    // OR we can just mock the implementation of the hook to avoid DB calls (but that defeats the purpose).
    // Better yet, we can close the DB connection in the hook if we expose it, but we don't.

    // A workaround is to not rely on shared state by using `indexedDB` factory that we can reset.
    // `fake-indexeddb` exports `indexedDB` and `IDBFactory`.

    // However, since we are stuck with the global `indexedDB`, let's try to close connections manually
    // if we can access the DB instance. `useCharacters` keeps `db` variable in module scope.
    // This is hard to reset from outside.

    // Alternative: mocking the whole module? No, we want to test the logic.

    // Let's try to make the tests sequential and just empty the table instead of deleting the DB.

    beforeEach(async () => {
        // Try to open DB and clear object store
        await new Promise<void>((resolve) => {
             const request = indexedDB.open('dnd-players-toolkit');
             request.onsuccess = (e) => {
                 const db = (e.target as any).result as IDBDatabase;
                 if (db.objectStoreNames.contains('characters')) {
                     const tx = db.transaction('characters', 'readwrite');
                     tx.objectStore('characters').clear();
                     tx.oncomplete = () => {
                         db.close();
                         resolve();
                     };
                     tx.onerror = () => {
                         db.close();
                         resolve();
                     }
                 } else {
                     db.close();
                     resolve();
                 }
             };
             request.onerror = () => resolve();
             request.onupgradeneeded = (e) => {
                 // If it needs upgrade, it means it didn't exist or version changed.
                 // Just let it be created.
                 const db = (e.target as any).result as IDBDatabase;
                 db.createObjectStore('characters', { keyPath: 'id' });
             }
        });
    });

  it('should initialize with empty characters', async () => {
    const { result } = renderHook(() => useCharacters());

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for loading to finish
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.characters).toEqual([]);
  });

  it('should add a character', async () => {
    const { result } = renderHook(() => useCharacters());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newCharacter = createEmptyCharacter('char-1');
    newCharacter.name = 'Test Char';

    await act(async () => {
      await result.current.addCharacter(newCharacter);
    });

    await waitFor(() => expect(result.current.characters).toHaveLength(1));
    expect(result.current.characters[0].name).toBe('Test Char');
  });

  it('should update a character', async () => {
    const { result } = renderHook(() => useCharacters());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newCharacter = createEmptyCharacter('char-2');
    newCharacter.name = 'Old Name';

    await act(async () => {
      await result.current.addCharacter(newCharacter);
    });

    await waitFor(() => expect(result.current.characters).toHaveLength(1));

    const addedChar = result.current.characters[0];
    const updatedChar = { ...addedChar, name: 'New Name' };

    await act(async () => {
      await result.current.updateCharacter(updatedChar);
    });

    await waitFor(() => {
        expect(result.current.characters).toHaveLength(1);
        expect(result.current.characters[0].name).toBe('New Name');
    });
  });

  it('should delete a character', async () => {
    const { result } = renderHook(() => useCharacters());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newCharacter = createEmptyCharacter('char-3');

    await act(async () => {
      await result.current.addCharacter(newCharacter);
    });

    await waitFor(() => expect(result.current.characters).toHaveLength(1));

    await act(async () => {
      await result.current.deleteCharacter(newCharacter.id);
    });

    await waitFor(() => expect(result.current.characters).toHaveLength(0));
  });
});
