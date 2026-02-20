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

const COLORS = ['#006bf9', '#6366f1', '#94a3b8', '#1e293b', '#3b82f6', '#475569'];
const STATUS_COLORS = {
    pending: '#f59e0b', // Amber for pending
    approved: '#006bf9', // Blue for approved (instead of green)
    rejected: '#ef4444', // Red for rejected
    incomplete: '#94a3b8' // Slate for incomplete
};

export function Dashboard({ clients }: DashboardProps) {
    const dateLocale = 'pt-BR';
    // 0. Total counts
    const totals = useMemo(() => ({
        total: clients.length,
        pending: clients.filter(c => c.status === 'pending').length,
        approved: clients.filter(c => c.status === 'approved').length,
        rejected: clients.filter(c => c.status === 'rejected').length,
    }), [clients]);

    // 1. Process Registrations Over Time (Last 30 days)
    const timeData = useMemo(() => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toLocaleDateString(dateLocale, { day: '2-digit', month: '2-digit' });
        });

        const dailyCounts = clients.reduce((acc: Record<string, number>, client) => {
            const date = new Date(client.createdAt).toLocaleDateString(dateLocale, { day: '2-digit', month: '2-digit' });
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return last30Days.map(date => ({
            date,
            count: dailyCounts[date] || 0
        }));
    }, [clients]);

    // 2. Process Status Distribution
    const statusData = useMemo(() => {
        const statusCounts = clients.reduce((acc: Record<string, number>, client) => {
            acc[client.status] = (acc[client.status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(statusCounts).map(([name, value]) => ({
            name: name === 'pending' ? 'Pendente' : name === 'approved' ? 'Aprovado' : name === 'rejected' ? 'Reprovado' : 'Incompleto',
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
                    <div className="mb-8">
                        <h3 className="text-base font-bold text-text">Histórico de Cadastros</h3>
                        <p className="text-xs text-text-muted">Volume de novos registros nos últimos 30 dias</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
                                    interval={4}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#006bf9"
                                    strokeWidth={4}
                                    dot={{ r: 4, fill: '#006bf9', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="card p-6">
                    <div className="mb-8">
                        <h3 className="text-base font-bold text-text">Distribuição por Status</h3>
                        <p className="text-xs text-text-muted">Situação atual dos cadastros na plataforma</p>
                    </div>
                    <div className="h-[300px] w-full relative">
                        {/* Central Label */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-12">
                            <span className="text-2xl font-bold text-text">100%</span>
                            <span className="text-[10px] font-bold text-text-light uppercase tracking-widest">Aggregate</span>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="40%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={STATUS_COLORS[entry.key as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]}
                                            strokeLinejoin="round"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Custom Bottom Legend */}
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {statusData.map((entry, index) => (
                            <div key={entry.key} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: STATUS_COLORS[entry.key as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length] }}
                                />
                                <span className="text-xs font-medium text-text-muted whitespace-nowrap">
                                    {entry.name} ({totals.total > 0 ? Math.round((entry.value / totals.total) * 100) : 0}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Regional Distribution */}
                <div className="card p-6">
                    <div className="mb-8">
                        <h3 className="text-base font-bold text-text">Distribuição Regional</h3>
                        <p className="text-xs text-text-muted">Top 10 estados com mais registros</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stateData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fontWeight: 600, fill: '#475569' }}
                                    width={40}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Occupation Distribution */}
                <div className="card p-6">
                    <div className="mb-8">
                        <h3 className="text-base font-bold text-text">Principais Ocupações</h3>
                        <p className="text-xs text-text-muted">Top 5 áreas de atuação declaradas</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupationData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#475569', fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#006bf9" radius={[6, 6, 0, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
