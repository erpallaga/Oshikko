import React, { useState, useMemo } from 'react';
import { useEntries } from '../hooks/useEntries';
import {
    isToday, isThisWeek, isThisMonth, parseISO, format,
    startOfWeek, endOfWeek, startOfMonth, endOfMonth,
    addWeeks, addMonths, isWithinInterval
} from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, CalendarDays, CalendarRange } from 'lucide-react';
import ActivityIntervalsChart from './charts/ActivityIntervalsChart';
import UrgencyScatterChart from './charts/UrgencyScatterChart';
import HourlyDistributionChart from './charts/HourlyDistributionChart';

export default function Dashboard() {
    const { entries } = useEntries();
    const [viewMode, setViewMode] = useState('week'); // 'week', 'month', 'history'

    const todayCount = entries.filter(e => isToday(parseISO(e.timestamp))).length;
    const weekCount = entries.filter(e => isThisWeek(parseISO(e.timestamp), { weekStartsOn: 1 })).length;
    const monthCount = entries.filter(e => isThisMonth(parseISO(e.timestamp))).length;

    return (
        <div className="dashboard">
            <h2 className="sticky-dashboard-header">Estadísticas</h2>

            {/* Global Selector */}
            <div className="view-switcher" style={{ marginBottom: '15px' }}>
                <button
                    className={viewMode === 'week' ? 'active' : ''}
                    onClick={() => setViewMode('week')}
                >
                    Semana
                </button>
                <button
                    className={viewMode === 'month' ? 'active' : ''}
                    onClick={() => setViewMode('month')}
                >
                    Mes
                </button>
                <button
                    className={viewMode === 'history' ? 'active' : ''}
                    onClick={() => setViewMode('history')}
                >
                    Histórico
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-box">
                    <div className="icon-bg">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="value">{todayCount}</span>
                        <span className="label">Hoy</span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="icon-bg">
                        <CalendarDays size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="value">{weekCount}</span>
                        <span className="label">Esta Semana</span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="icon-bg">
                        <CalendarRange size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="value">{monthCount}</span>
                        <span className="label">Este Mes</span>
                    </div>
                </div>
            </div>

            <div className="charts-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '20px'
            }}>
                <ActivityIntervalsChart entries={entries} viewMode={viewMode} />
                <UrgencyScatterChart entries={entries} viewMode={viewMode} />
                <HourlyDistributionChart entries={entries} viewMode={viewMode} />
            </div>
        </div>
    );
}
