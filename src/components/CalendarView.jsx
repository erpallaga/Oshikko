import React, { useState } from 'react';
import { useEntries } from '../hooks/useEntries';
import { format, isSameDay, isSameWeek, isSameMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Droplet, ShieldCheck, AlertTriangle, Siren } from 'lucide-react';

export default function CalendarView() {
    const { entries } = useEntries();
    const [view, setView] = useState('day'); // day, week, month
    const [selectedDate, setSelectedDate] = useState(new Date());

    const filteredEntries = entries
        .filter(entry => {
            const entryDate = parseISO(entry.timestamp);
            if (view === 'day') return isSameDay(entryDate, selectedDate);
            if (view === 'week') return isSameWeek(entryDate, selectedDate, { weekStartsOn: 1 });
            if (view === 'month') return isSameMonth(entryDate, selectedDate);
            return true;
        })
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const totalMicciones = filteredEntries.length;

    const renderDrops = (count) => (
        <div style={{ display: 'flex', gap: '1px' }}>
            {Array.from({ length: count }).map((_, i) => (
                <Droplet key={i} size={16} fill="currentColor" className="text-water-deep" />
            ))}
        </div>
    );

    const renderUrgencyIcon = (level) => {
        if (level === 1) return <ShieldCheck size={18} color="#06d6a0" />;
        if (level === 2) return <AlertTriangle size={18} color="#ffd166" />;
        if (level === 3) return <Siren size={18} color="#ef476f" />;
        return null;
    };

    return (
        <div className="calendar-view">
            <h2>Calendario</h2>

            <div className="view-switcher">
                <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Día</button>
                <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Semana</button>
                <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Mes</button>
            </div>

            <div className="stats-summary">
                <div className="stat-card">
                    <span className="stat-value">{totalMicciones}</span>
                    <span className="stat-label">Micciones</span>
                </div>
            </div>

            <div className="entries-list">
                {filteredEntries.length === 0 ? (
                    <p className="no-entries">No hay registros para este periodo.</p>
                ) : (
                    filteredEntries.map(entry => (
                        <div key={entry.id} className="entry-card">
                            <div className="entry-time">
                                {format(parseISO(entry.timestamp), 'dd MMM HH:mm', { locale: es })}
                            </div>
                            <div className="entry-details">
                                <div className="detail-item">
                                    {renderDrops(entry.amount)}
                                </div>
                                <div className="detail-item">
                                    {renderUrgencyIcon(entry.urgency)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
