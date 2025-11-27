import React, { useState, useMemo, useEffect } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { format, parseISO, startOfWeek, endOfWeek, addWeeks, isWithinInterval, startOfMonth, endOfMonth, addMonths, eachDayOfInterval, differenceInMinutes, eachMonthOfInterval, min, max } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ActivityIntervalsChart({ entries = [], viewMode = 'week' }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        setCurrentDate(new Date());
    }, [viewMode]);

    const { data, chartLabel } = useMemo(() => {
        let start, end;
        let label = '';
        let dataPoints = [];

        if (viewMode === 'history') {
            if (entries.length === 0) return { data: [], chartLabel: 'Histórico Completo' };

            const dates = entries.map(e => parseISO(e.timestamp));
            start = min(dates);
            end = max(dates);
            label = 'Histórico Completo';
        } else if (viewMode === 'week') {
            start = startOfWeek(currentDate, { weekStartsOn: 1 });
            end = endOfWeek(currentDate, { weekStartsOn: 1 });
            label = `Semana ${format(start, 'd MMM', { locale: es })} - ${format(end, 'd MMM', { locale: es })}`;
        } else { // month
            start = startOfMonth(currentDate);
            end = endOfMonth(currentDate);
            label = format(currentDate, 'MMMM yyyy', { locale: es });
        }

        const days = eachDayOfInterval({ start, end });
        dataPoints = days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayEntries = entries.filter(e => format(parseISO(e.timestamp), 'yyyy-MM-dd') === dayStr);

            dayEntries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            let intervals = [];
            for (let i = 1; i < dayEntries.length; i++) {
                const diff = differenceInMinutes(parseISO(dayEntries[i].timestamp), parseISO(dayEntries[i - 1].timestamp));
                intervals.push(diff);
            }

            const minInterval = intervals.length > 0 ? Math.min(...intervals) : 0;
            const maxInterval = intervals.length > 0 ? Math.max(...intervals) : 0;

            return {
                displayDate: format(day, viewMode === 'history' ? 'dd/MM' : 'd MMM', { locale: es }),
                count: dayEntries.length,
                minInterval,
                maxInterval
            };
        });

        return { data: dataPoints, chartLabel: label };
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
                <h3 style={{ margin: 0, color: 'var(--color-water-deep)' }}>Intervalos de Actividad</h3>
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
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis
                            dataKey="displayDate"
                            tick={{ fontSize: 12, fill: '#03045e' }}
                            axisLine={false}
                            tickLine={false}
                            interval={viewMode === 'month' || viewMode === 'history' ? 'preserveStartEnd' : 0}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            allowDecimals={false}
                            tick={{ fontSize: 12, fill: '#03045e' }}
                            axisLine={false}
                            tickLine={false}
                            label={{ value: 'Oshikko', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666', fontSize: 12 } }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            unit=" min"
                            tick={{ fontSize: 12, fill: '#03045e' }}
                            axisLine={false}
                            tickLine={false}
                            label={{ value: 'Intervalo (min)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#666', fontSize: 12 } }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 20px rgba(0,119,182,0.15)', background: 'rgba(255,255,255,0.95)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />

                        <Bar yAxisId="left" dataKey="count" name="Oshikko" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="minInterval"
                            name="Int. Mínimo"
                            stroke="#ef476f"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#ef476f' }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="maxInterval"
                            name="Int. Máximo"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#10b981' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
