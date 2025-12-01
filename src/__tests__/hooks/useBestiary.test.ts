import { renderHook, waitFor, act } from '@testing-library/react';
import { useBestiary } from '../../../hooks/useBestiary';
import { describe, it, expect, beforeEach } from 'vitest';
import { createEmptyMonster } from '../../../types';

describe('useBestiary Hook', () => {
    beforeEach(async () => {
        // Clear object store
        await new Promise<void>((resolve) => {
             const request = indexedDB.open('dnd-dm-toolkit');
             request.onsuccess = (e) => {
                 const db = (e.target as any).result as IDBDatabase;
                 if (db.objectStoreNames.contains('bestiary')) {
                     const tx = db.transaction('bestiary', 'readwrite');
                     tx.objectStore('bestiary').clear();
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
                 const db = (e.target as any).result as IDBDatabase;
                 db.createObjectStore('bestiary', { keyPath: 'id' });
             }
        });
    });

  it('should initialize with empty monsters', async () => {
    const { result } = renderHook(() => useBestiary());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.monsters).toEqual([]);
  });

  it('should add a monster', async () => {
    const { result } = renderHook(() => useBestiary());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newMonster = createEmptyMonster('1');
    newMonster.name = 'Goblin';

    await act(async () => {
      await result.current.addMonster(newMonster);
    });

    await waitFor(() => expect(result.current.monsters).toHaveLength(1));
    expect(result.current.monsters[0].name).toBe('Goblin');
  });

  it('should update a monster', async () => {
    const { result } = renderHook(() => useBestiary());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newMonster = createEmptyMonster('2');
    newMonster.name = 'Dragon';

    await act(async () => {
      await result.current.addMonster(newMonster);
    });

    await waitFor(() => expect(result.current.monsters).toHaveLength(1));

    const addedMonster = result.current.monsters[0];
    const updatedMonster = { ...addedMonster, name: 'Red Dragon' };

    await act(async () => {
      await result.current.updateMonster(updatedMonster);
    });

    await waitFor(() => {
        expect(result.current.monsters).toHaveLength(1);
        expect(result.current.monsters[0].name).toBe('Red Dragon');
    });
  });

  it('should delete a monster', async () => {
    const { result } = renderHook(() => useBestiary());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const newMonster = createEmptyMonster('3');

    await act(async () => {
      await result.current.addMonster(newMonster);
    });

    await waitFor(() => expect(result.current.monsters).toHaveLength(1));

    await act(async () => {
      await result.current.deleteMonster(newMonster.id);
    });

    await waitFor(() => expect(result.current.monsters).toHaveLength(0));
  });
});
