import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function UrgencyScatterChart({ data }) {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
                    <p className="font-medium text-gray-800">{`${data.dateY} - ${data.timeStr}`}</p>
                    <p className="text-sm text-gray-600">{`Urgencia: ${data.urgency}`}</p>
                    <p className="text-sm text-gray-600">{`Cantidad: ${data.amount / 100}`}</p>
                </div>
            );
        }
        return null;
    };

    const getUrgencyColor = (urgency) => {
        if (urgency === 3) return '#ef476f'; // Red/Pink
        if (urgency === 2) return '#ffd166'; // Yellow
        return '#06d6a0'; // Green
    };

    return (
        <div className="chart-card">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Urgencia y Volumen (Por Día)</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            type="number"
                            dataKey="timeDecimal"
                            name="Hora"
                            domain={[0, 24]}
                            tickCount={7}
                            unit="h"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            type="category"
                            dataKey="dateY"
                            name="Fecha"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            width={60}
                        />
                        <ZAxis type="number" dataKey="amount" range={[100, 500]} name="Cantidad" />
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Eventos" data={data}>
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
