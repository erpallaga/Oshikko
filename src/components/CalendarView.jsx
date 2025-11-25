import React, { useState } from 'react';
import { useEntries } from '../hooks/useEntries';
import {
    format,
    isSameDay,
    isSameWeek,
    isSameMonth,
    parseISO,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    startOfMonth,
    endOfMonth,
    getDay,
    addDays,
    startOfDay,
    differenceInMinutes
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Droplet, ShieldCheck, AlertTriangle, Siren, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function CalendarView() {
    const { entries } = useEntries();
    const [view, setView] = useState('day'); // day, week, month
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [expandedDays, setExpandedDays] = useState({});

    // --- Helpers ---
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

    const getEntriesForDay = (date) => {
        return entries
            .filter(entry => isSameDay(parseISO(entry.timestamp), date))
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Ascending for stats
    };

    const toggleDay = (dateKey) => {
        setExpandedDays(prev => ({
            ...prev,
            [dateKey]: !prev[dateKey]
        }));
    };

    const calculateDailyStats = (dayEntries) => {
        if (dayEntries.length < 2) return { count: dayEntries.length, maxInterval: '-', minInterval: '-' };

        let maxDiff = 0;
        let minDiff = Infinity;

        for (let i = 1; i < dayEntries.length; i++) {
            const diff = differenceInMinutes(
                parseISO(dayEntries[i].timestamp),
                parseISO(dayEntries[i - 1].timestamp)
            );
            if (diff > maxDiff) maxDiff = diff;
            if (diff < minDiff) minDiff = diff;
        }

        const formatDuration = (minutes) => {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            if (h > 0) return `${h}h ${m}m`;
            return `${m}m`;
        };

        return {
            count: dayEntries.length,
            maxInterval: formatDuration(maxDiff),
            minInterval: formatDuration(minDiff)
        };
    };

    // --- Renderers ---

    const renderTimelineEvent = (entry) => (
        <div key={entry.id} className="timeline-event">
            <div className="timeline-connector"></div>
            <div className="entry-time">
                {format(parseISO(entry.timestamp), 'HH:mm')}
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
    );

    const renderWeekView = () => {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start, end });

        return (
            <div className="week-view-container">
                {days.map(day => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayEntries = getEntriesForDay(day);
                    const stats = calculateDailyStats(dayEntries);
                    const isExpanded = expandedDays[dateKey];
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={dateKey} className="day-wrapper">
                            <div
                                className={`day-summary-card ${isToday ? 'today' : ''}`}
                                onClick={() => toggleDay(dateKey)}
                            >
                                <div className="day-summary-header">
                                    <span className="day-date">
                                        {format(day, 'EEEE d', { locale: es })}
                                    </span>
                                    <ChevronDown size={20} className={`expand-icon ${isExpanded ? 'expanded' : ''}`} />
                                </div>

                                <div className="summary-stats">
                                    <div className="stat-pill">
                                        <strong>{stats.count}</strong> micciones
                                    </div>
                                    {stats.count > 1 && (
                                        <>
                                            <div className="stat-pill">
                                                Max: <strong>{stats.maxInterval}</strong>
                                            </div>
                                            <div className="stat-pill">
                                                Min: <strong>{stats.minInterval}</strong>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {isExpanded && dayEntries.length > 0 && (
                                <div className="week-timeline-wrapper">
                                    <div className="timeline-container" style={{ paddingBottom: 0 }}>
                                        <div className="timeline-line"></div>
                                        {dayEntries.map(renderTimelineEvent)}
                                    </div>
                                </div>
                            )}

                            {isExpanded && dayEntries.length === 0 && (
                                <div className="no-entries" style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
                                    Sin registros
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderDayView = () => {
        const dayEntries = getEntriesForDay(selectedDate);
        const stats = calculateDailyStats(dayEntries);

        if (dayEntries.length === 0) {
            return <div className="no-entries">No hay registros para este día.</div>;
        }

        return (
            <div className="day-view-container">
                <div className="day-summary-card" style={{ cursor: 'default', marginBottom: '20px' }}>
                    <div className="summary-stats" style={{ justifyContent: 'center' }}>
                        <div className="stat-pill">
                            <strong>{stats.count}</strong> micciones
                        </div>
                        {stats.count > 1 && (
                            <>
                                <div className="stat-pill">
                                    Max: <strong>{stats.maxInterval}</strong>
                                </div>
                                <div className="stat-pill">
                                    Min: <strong>{stats.minInterval}</strong>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="timeline-container">
                    <div className="timeline-line"></div>
                    <div className="day-group">
                        <div className="sticky-header">
                            <div className="header-dot"></div>
                            {format(selectedDate, 'EEEE d', { locale: es })}
                        </div>
                        {dayEntries.map(renderTimelineEvent)}
                    </div>
                </div>
            </div>
        );
    };

    const renderMonthGrid = () => {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

        return (
            <div className="month-view">
                <div className="month-grid">
                    {weekDays.map(d => (
                        <div key={d} className="grid-header">{d}</div>
                    ))}
                    {days.map(day => {
                        const dayEntries = getEntriesForDay(day);
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isToday = isSameDay(day, new Date());
                        const isSelected = isSameDay(day, selectedDate);

                        return (
                            <div
                                key={day.toString()}
                                className={`calendar-day ${!isCurrentMonth ? 'empty-day' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedDate(day);
                                    setView('day');
                                }}
                            >
                                <span className="day-number">{format(day, 'd')}</span>
                                {dayEntries.length > 0 && (
                                    <div className="density-dots">
                                        {Array.from({ length: Math.min(dayEntries.length, 3) }).map((_, i) => (
                                            <div key={i} className="dot"></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- Navigation ---
    const handlePrev = () => {
        if (view === 'day') setSelectedDate(addDays(selectedDate, -1));
        if (view === 'week') setSelectedDate(addDays(selectedDate, -7));
        if (view === 'month') setSelectedDate(addDays(selectedDate, -30)); // Approx
    };

    const handleNext = () => {
        if (view === 'day') setSelectedDate(addDays(selectedDate, 1));
        if (view === 'week') setSelectedDate(addDays(selectedDate, 7));
        if (view === 'month') setSelectedDate(addDays(selectedDate, 30)); // Approx
    };

    const getTitle = () => {
        if (view === 'day') return format(selectedDate, 'd MMMM yyyy', { locale: es });
        if (view === 'week') return `Semana ${format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'd MMM', { locale: es })}`;
        if (view === 'month') return format(selectedDate, 'MMMM yyyy', { locale: es });
    };

    return (
        <div className="calendar-view">
            <h2>Calendario</h2>

            <div className="view-switcher">
                <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Día</button>
                <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Semana</button>
                <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Mes</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
                <button onClick={handlePrev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-water-deep)' }}><ChevronLeft /></button>
                <span style={{ fontWeight: '600', color: 'var(--color-water-deep)', textTransform: 'capitalize' }}>{getTitle()}</span>
                <button onClick={handleNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-water-deep)' }}><ChevronRight /></button>
            </div>

            {view === 'month' && renderMonthGrid()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
        </div>
    );
}
