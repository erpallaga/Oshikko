import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, addWeeks, isWithinInterval, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HourlyDistributionChart({ entries = [], viewMode = 'week' }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Reset current date when view mode changes
    useEffect(() => {
        setCurrentDate(new Date());
    }, [viewMode]);

    const { data, chartLabel } = useMemo(() => {
        let start, end;
        let label = '';

        if (viewMode === 'week') {
            start = startOfWeek(currentDate, { weekStartsOn: 1 });
            end = endOfWeek(currentDate, { weekStartsOn: 1 });
            label = `Semana ${format(start, 'd MMM', { locale: es })} - ${format(end, 'd MMM', { locale: es })}`;
        } else if (viewMode === 'month') {
            start = startOfMonth(currentDate);
            end = endOfMonth(currentDate);
            label = format(currentDate, 'MMMM yyyy', { locale: es });
        } else {
            // History: all entries
            label = 'Histórico Completo';
        }

        const filteredEntries = viewMode === 'history' ? entries : entries.filter(entry => {
            const date = parseISO(entry.timestamp);
            return isWithinInterval(date, { start, end });
        });

        const hoursMap = Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));

        filteredEntries.forEach(entry => {
            const hour = parseISO(entry.timestamp).getHours();
            hoursMap[hour].count++;
        });

        return { data: hoursMap, chartLabel: label };
    }, [entries, currentDate, viewMode]);

    const handlePrev = () => {
        if (viewMode === 'week') setCurrentDate(d => addWeeks(d, -1));
        if (viewMode === 'month') setCurrentDate(d => addMonths(d, -1));
    };

    const handleNext = () => {
        if (viewMode === 'week') setCurrentDate(d => addWeeks(d, 1));
        if (viewMode === 'month') setCurrentDate(d => addMonths(d, 1));
    };

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3 style={{ margin: 0, color: 'var(--color-water-deep)' }}>Distribución por Hora</h3>

                {viewMode !== 'history' && (
                    <div className="week-selector">
                        <button onClick={handlePrev} className="week-nav-btn">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="week-label">
                            {chartLabel}
                        </span>
                        <button onClick={handleNext} className="week-nav-btn">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
                {viewMode === 'history' && (
                    <div className="week-selector" style={{ justifyContent: 'center' }}>
                        <span className="week-label">{chartLabel}</span>
                    </div>
                )}
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis
                            dataKey="hour"
                            tick={{ fontSize: 12, fill: '#03045e' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 12, fill: '#03045e' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 20px rgba(0,119,182,0.15)', background: 'rgba(255,255,255,0.95)' }}
                            labelFormatter={(label) => `${label}:00 - ${label}:59`}
                        />
                        <Bar dataKey="count" name="Oshikko" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
