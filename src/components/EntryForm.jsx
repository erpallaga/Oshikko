import React, { useState } from 'react';
import { useEntries } from '../hooks/useEntries';
import { Droplet, ShieldCheck, AlertTriangle, Siren, Check } from 'lucide-react';

export default function EntryForm() {
    const { addEntry } = useEntries();
    const [amount, setAmount] = useState(2);
    const [urgency, setUrgency] = useState(1);
    const [datetime, setDatetime] = useState(new Date().toISOString().slice(0, 16));
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        addEntry({
            amount,
            urgency,
            timestamp: new Date(datetime).toISOString()
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const renderDrops = (count) => {
        return (
            <div style={{ display: 'flex', gap: '2px' }}>
                {Array.from({ length: count }).map((_, i) => (
                    <Droplet key={i} size={32} fill="currentColor" />
                ))}
            </div>
        );
    };

    return (
        <div className="entry-form minimalist">
            {/* Date Time Picker - Minimalist */}
            <div className="input-group minimalist-group">

                <input
                    type="datetime-local"
                    className="datetime-input minimalist-input"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                />
            </div>

            {/* Amount Selector */}
            <div className="input-group minimalist-group">
                <div className="selector">
                    {[1, 2, 3].map(level => (
                        <button
                            key={level}
                            className={`select-btn minimalist-btn ${amount === level ? 'selected' : ''}`}
                            onClick={() => setAmount(level)}
                        >
                            <div className="btn-content">
                                {renderDrops(level)}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Urgency Selector */}
            <div className="input-group minimalist-group">
                <div className="selector">
                    {[1, 2, 3].map(level => (
                        <button
                            key={level}
                            className={`select-btn minimalist-btn ${urgency === level ? 'selected' : ''}`}
                            onClick={() => setUrgency(level)}
                            style={{
                                borderColor: urgency === level ? (level === 3 ? '#ef476f' : level === 2 ? '#ffd166' : '#06d6a0') : ''
                            }}
                        >
                            <div className="btn-content">
                                {level === 1 && <ShieldCheck size={40} color="#06d6a0" />}
                                {level === 2 && <AlertTriangle size={40} color="#ffd166" />}
                                {level === 3 && <Siren size={40} color="#ef476f" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Save Button - FAB style */}
            <button
                className={`save-btn-fab ${saved ? 'saved' : ''}`}
                onClick={handleSave}
                disabled={saved}
            >
                <Check size={32} />
            </button>
        </div>
    );
}
