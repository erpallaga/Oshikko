import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function IntervalsChart({ data }) {
    return (
        <div className="chart-card">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Intervalos (Min/Max)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(parseISO(str), 'dd MMM', { locale: es })}
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            unit=" min"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            labelFormatter={(str) => format(parseISO(str), 'PPPP', { locale: es })}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Line
                            type="monotone"
                            dataKey="minInterval"
                            name="Mínimo"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#10b981' }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="maxInterval"
                            name="Máximo"
                            stroke="#ef476f"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#ef476f' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
