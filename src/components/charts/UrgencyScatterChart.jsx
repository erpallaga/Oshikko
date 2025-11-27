import React, { useState, useMemo, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { startOfWeek, endOfWeek, addWeeks, format, parseISO, getDay, isWithinInterval, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function UrgencyScatterChart({ entries = [], viewMode = 'week' }) {
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

        const filtered = viewMode === 'history' ? entries : entries.filter(entry => {
            const date = parseISO(entry.timestamp);
            return isWithinInterval(date, { start, end });
        });

        const mapped = filtered.map(entry => {
            const date = parseISO(entry.timestamp);
            // 0 = Sunday, 1 = Monday... we want Monday = 0
            const dayIndex = (getDay(date) + 6) % 7;
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const timeDecimal = hours + (minutes / 60);

            // X value: 0.0 to 7.0 (e.g. Monday 12:00 = 0.5)
            // For Month/History, we might want to change X axis, but user requested X axis comprises whole month/history
            // However, the current scatter logic is "Day of Week" vs "Time of Day".
            // If we want "Whole Month" on X axis, we need to change X to be Date.
            // But user said: "X axis comprises the whole month".
            // Let's assume for now we keep the "Day of Week" distribution for Week view, 
            // but for Month/History, maybe we should map X to Day of Month?
            // Actually, usually scatter plots for habits are "Day of Week" vs "Time".
            // If the user wants "X axis comprises the whole month", they probably mean a timeline?
            // But this is a Scatter Chart for "Urgency".
            // Let's stick to the requested "X axis comprises the whole month" which implies a timeline.

            let xValue;
            if (viewMode === 'week') {
                xValue = dayIndex + (timeDecimal / 24);
            } else {
                // For Month/History, X axis is the Date itself?
                // Or maybe just Day of Month?
                // Let's map to Day of Month (1-31) for Month view?
                // Or just keep it simple and map to timestamp?
                // Recharts Scatter can take numbers.
                // Let's use timestamp for X axis in Month/History to show "Whole Month".
                xValue = date.getTime();
            }

            return {
                x: xValue,
                y: entry.urgency,
                z: entry.amount, // Raw amount for bubble size
                originalDate: date,
                urgency: entry.urgency,
                amount: entry.amount
            };
        });

        return { data: mapped, chartLabel: label };
    }, [entries, currentDate, viewMode]);

    const handlePrev = () => {
        if (viewMode === 'week') setCurrentDate(d => addWeeks(d, -1));
        if (viewMode === 'month') setCurrentDate(d => addMonths(d, -1));
    };

    const handleNext = () => {
        if (viewMode === 'week') setCurrentDate(d => addWeeks(d, 1));
        if (viewMode === 'month') setCurrentDate(d => addMonths(d, 1));
    };

    const getUrgencyColor = (urgency) => {
        if (urgency === 3) return '#ef476f';
        if (urgency === 2) return '#ffd166';
        return '#06d6a0';
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="chart-tooltip">
                    <p className="tooltip-date">
                        {format(d.originalDate, 'EEEE HH:mm', { locale: es })}
                    </p>
                    <p className="tooltip-info">Urgencia: {d.urgency}</p>
                    <p className="tooltip-info">Volumen: {d.amount}</p>
                </div>
            );
        }
        return null;
    };

    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3 style={{ margin: 0, color: 'var(--color-water-deep)' }}>Urgencia y Volumen</h3>

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
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} horizontal={true} vertical={true} />
                        <XAxis
                            type="number"
                            dataKey="x"
                            domain={viewMode === 'week' ? [0, 7] : ['auto', 'auto']}
                            ticks={viewMode === 'week' ? [0, 1, 2, 3, 4, 5, 6] : undefined}
                            tickFormatter={(val) => {
                                if (viewMode === 'week') return days[val];
                                return format(val, 'dd MMM', { locale: es });
                            }}
                            tick={{ fontSize: 12, fill: '#03045e' }}
                            axisLine={false}
                            tickLine={false}
                            interval={viewMode === 'week' ? 0 : 'preserveStartEnd'}
                            scale={viewMode === 'week' ? 'linear' : 'time'}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Urgencia"
                            domain={[0, 4]}
                            ticks={[1, 2, 3]}
                            tick={{ fontSize: 12, fill: '#03045e' }}
                            axisLine={false}
                            tickLine={false}
                            width={30}
                        />
                        <ZAxis type="number" dataKey="z" range={[20, 2500]} name="Volumen" />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Oshikko" data={data}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getUrgencyColor(entry.urgency)} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
