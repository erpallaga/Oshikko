import React, { useMemo } from 'react';
import { useEntries } from '../hooks/useEntries';
import { isToday, isThisWeek, isThisMonth, parseISO, format, differenceInMinutes, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import ActivityIntervalsChart from './charts/ActivityIntervalsChart';
import UrgencyScatterChart from './charts/UrgencyScatterChart';
import HourlyDistributionChart from './charts/HourlyDistributionChart';

export default function Dashboard() {
    const { entries } = useEntries();

    const todayCount = entries.filter(e => isToday(parseISO(e.timestamp))).length;
    const weekCount = entries.filter(e => isThisWeek(parseISO(e.timestamp), { weekStartsOn: 1 })).length;
    const monthCount = entries.filter(e => isThisMonth(parseISO(e.timestamp))).length;

    // Data Processing
    const chartData = useMemo(() => {
        if (!entries.length) return { daily: [], intervals: [], scatter: [], hourly: [] };

        // Sort entries by time
        const sortedEntries = [...entries].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        // 1. Events per Day & 2. Intervals
        const daysMap = {};

        sortedEntries.forEach(entry => {
            const dateStr = format(parseISO(entry.timestamp), 'yyyy-MM-dd');
            if (!daysMap[dateStr]) {
                daysMap[dateStr] = { date: dateStr, count: 0, entries: [] };
            }
            daysMap[dateStr].count++;
            daysMap[dateStr].entries.push(parseISO(entry.timestamp));
        });

        const dailyData = Object.values(daysMap).slice(-14); // Last 14 days

        const intervalsData = dailyData.map(day => {
            const dayEntries = day.entries;
            if (dayEntries.length < 2) return { date: day.date, count: day.count, minInterval: 0, maxInterval: 0 };

            let min = Infinity;
            let max = 0;

            for (let i = 1; i < dayEntries.length; i++) {
                const diff = differenceInMinutes(dayEntries[i], dayEntries[i - 1]);
                if (diff < min) min = diff;
                if (diff > max) max = diff;
            }

            return {
                date: day.date,
                count: day.count,
                minInterval: min === Infinity ? 0 : min,
                maxInterval: max
            };
        });

        // 3. Scatter Data
        const scatterData = sortedEntries.map(entry => {
            const date = parseISO(entry.timestamp);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return {
                timeDecimal: hours + (minutes / 60),
                timeStr: format(date, 'HH:mm'),
                dateY: format(date, 'EEE dd', { locale: es }), // Y-Axis: "Lun 24"
                urgency: entry.urgency || 1,
                amount: (entry.amount || 1) * 100 // Scale for Z-axis
            };
        });

        // 4. Hourly Distribution
        const hoursMap = Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));
        sortedEntries.forEach(entry => {
            const hour = parseISO(entry.timestamp).getHours();
            hoursMap[hour].count++;
        });

        return {
            daily: dailyData,
            intervals: intervalsData,
            scatter: scatterData,
            hourly: hoursMap
        };
    }, [entries]);

    return (
        <div className="dashboard">
            <h2 className="sticky-dashboard-header">Estadísticas</h2>

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

            <div className="charts-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '20px'
            }}>
                <ActivityIntervalsChart data={chartData.intervals} />
                <UrgencyScatterChart data={chartData.scatter} />
                <HourlyDistributionChart data={chartData.hourly} />
            </div>
        </div>
    );
}
