'use client';

import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { Client } from '@/types/client';

interface DashboardProps {
    clients: (Client & { userId?: string })[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const STATUS_COLORS = {
    pending: '#FFBB28',
    approved: '#00C49F',
    rejected: '#FF8042',
    incomplete: '#8884d8'
};

export function Dashboard({ clients }: DashboardProps) {
    // 1. Process Registrations Over Time (Last 30 days)
    const timeData = useMemo(() => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        });

        const counts = clients.reduce((acc: Record<string, number>, client) => {
            const date = new Date(client.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return last30Days.map(date => ({
            date,
            count: counts[date] || 0
        }));
    }, [clients]);

    // 2. Process Status Distribution
    const statusData = useMemo(() => {
        const counts = clients.reduce((acc: Record<string, number>, client) => {
            acc[client.status] = (acc[client.status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts).map(([name, value]) => ({
            name: name === 'pending' ? 'Pendente' : name === 'approved' ? 'Aprovado' : name === 'rejected' ? 'Rejeitado' : 'Incompleto',
            value,
            key: name
        }));
    }, [clients]);

    // 3. Process Regional Distribution (States)
    const stateData = useMemo(() => {
        const counts = clients.reduce((acc: Record<string, number>, client) => {
            const state = client.address.state || 'N/A';
            acc[state] = (acc[state] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10); // Top 10 states
    }, [clients]);

    // 4. Process Occupation Distribution
    const occupationData = useMemo(() => {
        const counts = clients.reduce((acc: Record<string, number>, client) => {
            const occ = client.professional.mainOccupation || 'N/A';
            acc[occ] = (acc[occ] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5); // Top 5 occupations
    }, [clients]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Registration History */}
                <div className="card p-6">
                    <h3 className="text-sm font-semibold text-text-muted mb-6 uppercase tracking-wider">Histórico de Cadastros (30 dias)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    interval={4}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#0088FE"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#0088FE', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="card p-6">
                    <h3 className="text-sm font-semibold text-text-muted mb-6 uppercase tracking-wider">Distribuição por Status</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.key as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regional Distribution */}
                <div className="card p-6">
                    <h3 className="text-sm font-semibold text-text-muted mb-6 uppercase tracking-wider">Distribuição por Estado (UF)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stateData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 500, fill: '#475569' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Occupation Distribution */}
                <div className="card p-6">
                    <h3 className="text-sm font-semibold text-text-muted mb-6 uppercase tracking-wider">Top 5 Ocupações</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupationData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#475569' }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
