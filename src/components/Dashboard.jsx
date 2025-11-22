import React from 'react';
import { useEntries } from '../hooks/useEntries';
import { isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard() {
    const { entries } = useEntries();

    const todayCount = entries.filter(e => isToday(parseISO(e.timestamp))).length;
    const weekCount = entries.filter(e => isThisWeek(parseISO(e.timestamp), { weekStartsOn: 1 })).length;
    const monthCount = entries.filter(e => isThisMonth(parseISO(e.timestamp))).length;

    return (
        <div className="dashboard">
            <h2>Estadísticas</h2>

            <div className="stats-grid">
                <div className="stat-box">
                    <div className="icon-bg">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="value">{todayCount}</span>
                        <span className="label">Hoy</span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="icon-bg">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="value">{weekCount}</span>
                        <span className="label">Esta Semana</span>
                    </div>
                </div>

                <div className="stat-box">
                    <div className="icon-bg">
                        <BarChart3 size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="value">{monthCount}</span>
                        <span className="label">Este Mes</span>
                    </div>
                </div>
            </div>

            <div className="chart-placeholder">
                <p>Gráficos detallados próximamente...</p>
            </div>
        </div>
    );
}
