import { useState, useEffect } from 'react';

const STORAGE_KEY = 'oshikko_entries';

export function useEntries() {
    const [entries, setEntries] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }, [entries]);

    const addEntry = (entry) => {
        const newEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...entry
        };
        setEntries(prev => [newEntry, ...prev]);
    };

    const getEntriesByDate = (date) => {
        // Filter logic to be added
        return entries;
    };

    return { entries, addEntry };
}
