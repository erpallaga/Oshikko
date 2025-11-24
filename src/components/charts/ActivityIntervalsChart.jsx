import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ActivityIntervalsChart({ data }) {
    return (
        <div className="chart-card">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Actividad e Intervalos</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(parseISO(str), 'dd MMM', { locale: es })}
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            allowDecimals={false}
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            label={{ value: 'Eventos', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666', fontSize: 12 } }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            unit=" min"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            label={{ value: 'Intervalo (min)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#666', fontSize: 12 } }}
                        />
                        <Tooltip
                            labelFormatter={(str) => format(parseISO(str), 'PPPP', { locale: es })}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />

                        <Bar yAxisId="left" dataKey="count" name="Eventos" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="minInterval"
                            name="Int. Mínimo"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#10b981' }}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="maxInterval"
                            name="Int. Máximo"
                            stroke="#ef476f"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#ef476f' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
