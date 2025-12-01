import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { DiceRoller, RollResult } from '../../../components/DiceRoller';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock the hooks
vi.mock('../../../hooks/useDmCharacters', () => ({
    useDmCharacters: () => ({ characters: [] })
}));
vi.mock('../../../hooks/useDmNotes', () => ({
    useDmNotes: () => ({ dmNotes: null })
}));
vi.mock('../../../hooks/useNpcs', () => ({
    useNpcs: () => ({ npcs: [] })
}));
vi.mock('../../../hooks/useBestiary', () => ({
    useBestiary: () => ({ monsters: [] })
}));

describe('DiceRoller Component', () => {
    let history: RollResult[] = [];
    const setHistory = vi.fn((update) => {
        if (typeof update === 'function') {
            history = update(history);
        } else {
            history = update;
        }
    });

    beforeEach(() => {
        history = [];
        setHistory.mockClear();
    });

    it('renders correctly', () => {
        render(<DiceRoller history={history} setHistory={setHistory} />);
        expect(screen.getByText('Who is rolling?')).toBeInTheDocument();
        expect(screen.getByText('Roll Setup')).toBeInTheDocument();
        expect(screen.getAllByText('History').length).toBeGreaterThan(0);
    });

    it('performs a quick roll', async () => {
        render(<DiceRoller history={history} setHistory={setHistory} />);

        const d20Button = screen.getByRole('button', { name: 'd20' });
        fireEvent.click(d20Button);

        expect(setHistory).toHaveBeenCalled();
        expect(history).toHaveLength(1);
        expect(history[0].title).toBe('Quick d20 Roll');
    });

    it('performs a custom d20 check', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        render(<DiceRoller history={history} setHistory={setHistory} />);

        const rollButton = screen.getByRole('button', { name: /ROLL/i });
        fireEvent.click(rollButton);

        // Advance timers to skip animation (1800ms in component)
        await act(async () => {
             vi.advanceTimersByTime(2000);
        });

        expect(setHistory).toHaveBeenCalled();
        expect(history).toHaveLength(1);
        expect(history[0].title).toContain('Check');

        vi.useRealTimers();
    });
});
