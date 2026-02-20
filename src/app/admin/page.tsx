'use client';

import { useEffect, useState } from 'react';
import { getAllClients, updateClientStatus } from '@/lib/storage';
import type { Client, ClientStatus } from '@/types/client';
import Link from 'next/link';
import {
    ArrowLeft,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    Search,
    ChevronDown,
    ChevronUp,
    FileText,
    Download,
    BarChart3,
    List
} from 'lucide-react';
import { Dashboard } from '@/components/admin/Dashboard';
import { useUser } from '@clerk/nextjs';

const STATUS_CONFIG: Record<ClientStatus, { label: string; className: string }> = {
    pending: { label: 'Pendente', className: 'badge-pending' },
    approved: { label: 'Aprovado', className: 'badge-approved' },
    rejected: { label: 'Rejeitado', className: 'badge-rejected' },
    incomplete: { label: 'Incompleto', className: 'badge-incomplete' },
};

export default function AdminPage() {
    const { isLoaded: isUserLoaded } = useUser();
    const [clients, setClients] = useState<(Client & { userId?: string })[]>([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('pending');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'dashboard'>('list');

    useEffect(() => {
        if (!isUserLoaded) return;

        async function fetchClients() {
            try {
                setLoading(true);
                const data = await getAllClients();
                setClients(data);
                setError(null);
            } catch (err: unknown) {
                console.error('Failed to load clients:', err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar dados. Verifique suas permissões.');
            } finally {
                setLoading(false);
            }
        }

        fetchClients();
    }, [isUserLoaded]);

    const refresh = async () => {
        const data = await getAllClients();
        setClients(data);
    };

    const handleStatusChange = async (id: string, status: ClientStatus, userId?: string) => {
        await updateClientStatus(id, status, userId);
        refresh();
    };

    if (!isUserLoaded || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-muted animate-pulse">Carregando painel...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="card max-w-sm w-full space-y-4 p-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-danger-bg mx-auto flex items-center justify-center">
                        <XCircle size={24} className="text-danger" />
                    </div>
                    <h1 className="text-xl font-bold text-text">Acesso Negado</h1>
                    <p className="text-sm text-text-muted">{error}</p>
                    <Link href="/" className="btn-secondary w-full py-2 flex items-center justify-center gap-2">
                        <ArrowLeft size={16} />
                        Voltar para Home
                    </Link>
                </div>
            </div>
        );
    }

    const filtered = clients.filter((c) => {
        const matchesSearch =
            !search ||
            c.personalData.name?.toLowerCase().includes(search.toLowerCase()) ||
            c.personalData.cpf?.includes(search);
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const counts = {
        total: clients.length,
        pending: clients.filter((c) => c.status === 'pending').length,
        approved: clients.filter((c) => c.status === 'approved').length,
        rejected: clients.filter((c) => c.status === 'rejected').length,
    };

    const exportCSV = () => {
        const headers = ['Nome', 'CPF', 'Email', 'Celular', 'Status', 'Data Cadastro'];
        const rows = filtered.map((c) => [
            c.personalData.name || '',
            c.personalData.cpf || '',
            c.contact.email || '',
            c.contact.mobile || '',
            STATUS_CONFIG[c.status].label,
            new Date(c.createdAt).toLocaleDateString('pt-BR'),
        ]);
        const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cadastros-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-text-muted hover:text-text transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                                <span className="text-text-inverse font-bold text-xs">A</span>
                            </div>
                            <span className="font-semibold text-text text-sm">Painel Admin</span>
                        </div>
                    </div>
                    <button onClick={exportCSV} className="btn-secondary text-sm">
                        <Download size={14} />
                        Exportar CSV
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => { setStatusFilter('all'); setView('list'); }}
                        className={`card flex items-center gap-3 text-left transition-all hover:scale-[1.02] cursor-pointer ${statusFilter === 'all' ? 'ring-2 ring-primary !bg-info-bg' : ''}`}
                    >
                        <div className="p-2 rounded-lg bg-info-bg">
                            <Users size={20} className="text-info" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text">{counts.total}</p>
                            <p className="text-xs text-text-muted">Total</p>
                        </div>
                    </button>
                    <button
                        onClick={() => { setStatusFilter('pending'); setView('list'); }}
                        className={`card flex items-center gap-3 text-left transition-all hover:scale-[1.02] cursor-pointer ${statusFilter === 'pending' ? 'ring-2 ring-warning !bg-warning-bg' : ''}`}
                    >
                        <div className="p-2 rounded-lg bg-warning-bg">
                            <Clock size={20} className="text-warning" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text">{counts.pending}</p>
                            <p className="text-xs text-text-muted">Pendentes</p>
                        </div>
                    </button>
                    <button
                        onClick={() => { setStatusFilter('approved'); setView('list'); }}
                        className={`card flex items-center gap-3 text-left transition-all hover:scale-[1.02] cursor-pointer ${statusFilter === 'approved' ? 'ring-2 ring-success !bg-success-bg' : ''}`}
                    >
                        <div className="p-2 rounded-lg bg-success-bg">
                            <CheckCircle2 size={20} className="text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text">{counts.approved}</p>
                            <p className="text-xs text-text-muted">Aprovados</p>
                        </div>
                    </button>
                    <button
                        onClick={() => { setStatusFilter('rejected'); setView('list'); }}
                        className={`card flex items-center gap-3 text-left transition-all hover:scale-[1.02] cursor-pointer ${statusFilter === 'rejected' ? 'ring-2 ring-danger !bg-danger-bg' : ''}`}
                    >
                        <div className="p-2 rounded-lg bg-danger-bg">
                            <XCircle size={20} className="text-danger" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-text">{counts.rejected}</p>
                            <p className="text-xs text-text-muted">Rejeitados</p>
                        </div>
                    </button>
                </div>

                {/* View Switcher */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${view === 'dashboard'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-muted hover:text-text hover:border-border'
                            }`}
                    >
                        <BarChart3 size={16} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${view === 'list'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-muted hover:text-text hover:border-border'
                            }`}
                    >
                        <List size={16} />
                        Lista de Cadastros
                    </button>
                </div>

                {view === 'dashboard' ? (
                    <Dashboard clients={clients} />
                ) : (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-input !pl-12"
                                    placeholder="Buscar por nome ou CPF..."
                                />
                            </div>
                        </div>

                        {/* Table */}
                        {filtered.length === 0 ? (
                            <div className="card text-center py-12">
                                <FileText className="mx-auto text-text-light mb-3" size={40} />
                                <p className="text-text-muted font-medium">Nenhum cadastro encontrado</p>
                                <p className="text-sm text-text-light mt-1">
                                    {clients.length === 0
                                        ? 'Ainda não há cadastros. Quando um cliente preencher o formulário, ele aparecerá aqui.'
                                        : 'Tente ajustar os filtros de busca.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filtered.map((client) => (
                                    <div key={client.id} className="card p-0 overflow-hidden">
                                        {/* Row summary */}
                                        <button
                                            type="button"
                                            onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                                            className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-surface transition-colors cursor-pointer"
                                        >
                                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                                                <div>
                                                    <p className="font-medium text-text truncate">{client.personalData.name || 'Sem nome'}</p>
                                                    <p className="text-xs text-text-light">{client.personalData.cpf}</p>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <p className="text-sm text-text-muted">{client.contact.email}</p>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <p className="text-sm text-text-muted">
                                                        {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={STATUS_CONFIG[client.status].className}>
                                                        {STATUS_CONFIG[client.status].label}
                                                    </span>
                                                </div>
                                            </div>
                                            {expandedId === client.id ? (
                                                <ChevronUp size={16} className="text-text-light" />
                                            ) : (
                                                <ChevronDown size={16} className="text-text-light" />
                                            )}
                                        </button>

                                        {/* Expanded detail */}
                                        {expandedId === client.id && (
                                            <div className="border-t border-border px-5 py-5 bg-surface space-y-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                    <Detail label="Nome" value={client.personalData.name} />
                                                    <Detail label="CPF" value={client.personalData.cpf} />
                                                    <Detail label="RG" value={`${client.personalData.rg} - ${client.personalData.rgIssuer}`} />
                                                    <Detail label="Data Nascimento" value={client.personalData.birthDate} />
                                                    <Detail label="E-mail" value={client.contact.email} />
                                                    <Detail label="Celular" value={client.contact.mobile} />
                                                    <Detail label="Endereço" value={
                                                        `${client.address.streetType || ''} ${client.address.street || ''}, ${client.address.number || ''} - ${client.address.neighborhood || ''}, ${client.address.city || ''}/${client.address.state || ''}`
                                                    } />
                                                    <Detail label="CEP" value={client.address.zipCode} />
                                                    <Detail label="Ocupação" value={client.professional.mainOccupation} />
                                                    <Detail label="Renda Declarada" value={client.professional.declaredIncome} />
                                                    <Detail label="Documentos" value={`${client.documents.length} enviado(s)`} />
                                                    {client.notes && <Detail label="Observações" value={client.notes} />}
                                                </div>

                                                {/* Document previews */}
                                                {client.documents.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-medium text-text-muted mb-2">Documentos:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {client.documents.map((doc) => (
                                                                <div key={doc.id} className="border border-border rounded-md overflow-hidden">
                                                                    {doc.fileUrl.startsWith('data:image') ? (
                                                                        // eslint-disable-next-line @next/next/no-img-element
                                                                        <img src={doc.fileUrl} alt={doc.fileName} className="w-20 h-20 object-cover" />
                                                                    ) : (
                                                                        <div className="w-20 h-20 flex items-center justify-center bg-surface-alt">
                                                                            <FileText size={24} className="text-text-light" />
                                                                        </div>
                                                                    )}
                                                                    <p className="text-[10px] text-text-light px-1 py-0.5 truncate w-20">{doc.type}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-2 border-t border-border">
                                                    {client.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleStatusChange(client.id, 'approved', client.userId)}
                                                            className="btn-primary text-sm py-2"
                                                        >
                                                            <CheckCircle2 size={14} />
                                                            Aprovar
                                                        </button>
                                                    )}
                                                    {client.status !== 'rejected' && (
                                                        <button
                                                            onClick={() => handleStatusChange(client.id, 'rejected', client.userId)}
                                                            className="btn-danger text-sm py-2"
                                                        >
                                                            <XCircle size={14} />
                                                            Rejeitar
                                                        </button>
                                                    )}
                                                    {client.status !== 'pending' && (
                                                        <button
                                                            onClick={() => handleStatusChange(client.id, 'pending', client.userId)}
                                                            className="btn-secondary text-sm py-2"
                                                        >
                                                            <Clock size={14} />
                                                            Mover para Pendente
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div >
    );
}

function Detail({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <dt className="text-xs text-text-muted">{label}</dt>
            <dd className="font-medium mt-0.5">{value || '—'}</dd>
        </div>
    );
}
