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
    TrendingUp,
    TrendingDown,
    ClipboardCheck,
    Bell,
    ChevronRight,
    History,
    Settings as SettingsIcon,
    UserCog,
    LayoutDashboard,
    ArrowUpDown,
    BarChart3,
    Shield,
    Menu,
    X,
} from 'lucide-react';
import { Dashboard } from '@/components/admin/Dashboard';
import { useUser, UserButton } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
export default function AdminPage() {
    const { isLoaded: isUserLoaded } = useUser();

    const STATUS_CONFIG: Record<ClientStatus, { label: string; className: string }> = {
        pending: { label: 'Pendente', className: 'badge-pending' },
        approved: { label: 'Aprovado', className: 'badge-approved' },
        rejected: { label: 'Rejeitado', className: 'badge-rejected' },
        incomplete: { label: 'Incompleto', className: 'badge-incomplete' },
    };
    const [clients, setClients] = useState<(Client & { userId?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'dashboard'>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        async function loadClients() {
            try {
                const data = await getAllClients();
                setClients(data);

                // Set initial view and filter based on entry point
                const entryView = searchParams.get('view');
                const entryStatus = searchParams.get('status');

                if (entryView === 'list') setView('list');
                if (entryStatus && entryStatus in STATUS_CONFIG) setStatusFilter(entryStatus as ClientStatus);

            } catch (err) {
                setError('Erro ao carregar cadastros. Verifique sua conexão.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        if (isUserLoaded) {
            loadClients();
        }
    }, [isUserLoaded, searchParams]);

    const handleStatusChange = async (clientId: string, status: ClientStatus, userId?: string) => {
        try {
            await updateClientStatus(clientId, status, userId);
            setClients(clients.map(c => c.id === clientId ? { ...c, status } : c));
        } catch (err) {
            alert('Erro ao atualizar status.');
        }
    };

    const exportCSV = () => {
        const filtered = clients.filter((c) => {
            const matchesSearch =
                !search ||
                c.personalData.name?.toLowerCase().includes(search.toLowerCase()) ||
                c.personalData.cpf?.includes(search);
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        const headers = ['Nome Completo', 'CPF', 'Email', 'Celular (WhatsApp)', 'Status', 'Cadastros'];
        const rows = filtered.map((c) => [
            c.personalData.name || '',
            c.personalData.cpf || '',
            c.contact.email || '',
            c.contact.mobile || '',
            STATUS_CONFIG[c.status].label,
            new Date(c.createdAt).toLocaleDateString('pt-BR'),
        ]);

        // Use semicolon for Brazilian Excel compatibility and wrap values in quotes to handle special characters
        const csvContent = [headers, ...rows]
            .map((row) => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(';'))
            .join('\n');

        // Add BOM (Byte Order Mark) for UTF-8 support (Excel requirement for characters like ã, ó, é)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cadastros-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-text-muted animate-pulse">Visão Geral dos Cadastros...</p>
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
                        Voltar ao Site
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

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                            <span className="text-text-inverse font-bold text-sm">O</span>
                        </div>
                        <span className="font-semibold text-text text-lg">Onboarding</span>
                    </Link>
                </div>
                <nav className="flex-1 px-3 space-y-1">
                    <button
                        onClick={() => setView('dashboard')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all
                            ${view === 'dashboard' ? 'bg-accent/5 text-accent font-bold shadow-sm' : 'text-text-muted hover:bg-surface-alt hover:text-text'}`}
                    >
                        <BarChart3 size={18} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => setView('list')}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all
                            ${view === 'list' ? 'bg-accent/5 text-accent font-bold shadow-sm' : 'text-text-muted hover:bg-surface-alt hover:text-text'}`}
                    >
                        <Users size={18} />
                        Cadastros
                    </button>
                </nav>
                <div className="p-4 border-t border-border mt-auto">
                    <Link href="/" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-alt transition-colors">
                        <ArrowLeft size={16} className="text-text-light" />
                        <span className="text-sm text-text-muted">Voltar ao Site</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="px-4 sm:px-8 h-16 flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-surface-alt text-text-muted"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {/* Mobile Logo */}
                        <Link href="/" className="lg:hidden flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                                <span className="text-text-inverse font-bold text-xs">O</span>
                            </div>
                        </Link>

                        <div className="flex-1 flex items-center justify-between gap-3">
                            <div className="relative flex-1 max-w-sm hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={16} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-input !pl-10 text-sm h-10"
                                    placeholder="Buscar por nome ou CPF..."
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={exportCSV} className="btn-secondary text-sm whitespace-nowrap h-10 px-3">
                                    <Download size={14} className="sm:mr-1" />
                                    <span className="hidden sm:inline">Exportar CSV</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation Drawer */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden border-t border-border bg-card p-4 space-y-2 animate-in slide-in-from-top duration-300">
                            <button
                                onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                                    ${view === 'dashboard' ? 'bg-accent/5 text-accent font-bold shadow-sm' : 'text-text-muted hover:bg-surface-alt hover:text-text'}`}
                            >
                                <BarChart3 size={18} />
                                Dashboard
                            </button>
                            <button
                                onClick={() => { setView('list'); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                                    ${view === 'list' ? 'bg-accent/5 text-accent font-bold shadow-sm' : 'text-text-muted hover:bg-surface-alt hover:text-text'}`}
                            >
                                <Users size={18} />
                                Cadastros
                            </button>
                            <div className="pt-2">
                                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-alt transition-colors">
                                    <ArrowLeft size={16} className="text-text-light" />
                                    <span className="text-sm text-text-muted">Voltar ao Site</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </header>

                <main className="flex-1 px-4 sm:px-8 py-8 space-y-6">
                    {/* Title area */}
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-bold text-text tracking-tight">Visão Geral dos Cadastros</h2>
                        <p className="text-sm text-text-muted">Gerencie e audite os processos de onboarding em tempo real.</p>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <button
                            onClick={() => { setStatusFilter('all'); setView('list'); }}
                            className={`card group p-6 text-left transition-all hover:border-info/40 cursor-pointer relative overflow-hidden ${statusFilter === 'all' ? 'ring-2 ring-info !bg-info-bg/60 scale-[1.02] shadow-md' : 'hover:scale-[1.01]'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[10px] font-bold text-text-light uppercase tracking-widest leading-none mb-1">Total de Onboardings</p>
                                </div>
                                <div className="p-2 rounded-full bg-info-bg/50">
                                    <BarChart3 size={18} className="text-info" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <p className="text-3xl font-bold text-text tracking-tight">{counts.total.toLocaleString()}</p>
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-success-bg text-success text-[10px] font-bold">
                                    <TrendingUp size={10} />
                                    12.5%
                                </span>
                            </div>
                            <div className="w-full h-1 bg-surface-alt rounded-full overflow-hidden">
                                <div className="h-full bg-info w-2/3 rounded-full" />
                            </div>
                        </button>

                        <button
                            onClick={() => { setStatusFilter('pending'); setView('list'); }}
                            className={`card group p-6 text-left transition-all hover:border-warning/40 cursor-pointer relative overflow-hidden ${statusFilter === 'pending' ? 'ring-2 ring-warning !bg-warning-bg/60 scale-[1.02] shadow-md' : 'hover:scale-[1.01]'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-bold text-text-light uppercase tracking-widest leading-none">Em Revisão</p>
                                <div className="p-2 rounded-full bg-warning-bg/50">
                                    <ClipboardCheck size={18} className="text-warning" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <p className="text-3xl font-bold text-warning tracking-tight">{counts.pending}</p>
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-warning-bg text-warning text-[10px] font-bold">
                                    <TrendingUp size={10} />
                                    +5.4%
                                </span>
                            </div>
                            <div className="w-full h-1 bg-surface-alt rounded-full overflow-hidden">
                                <div className="h-full bg-warning w-1/4 rounded-full" />
                            </div>
                        </button>

                        <button
                            onClick={() => { setStatusFilter('approved'); setView('list'); }}
                            className={`card group p-6 text-left transition-all hover:border-success/40 cursor-pointer relative overflow-hidden ${statusFilter === 'approved' ? 'ring-2 ring-success !bg-success-bg/60 scale-[1.02] shadow-md' : 'hover:scale-[1.01]'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-bold text-text-light uppercase tracking-widest leading-none">Aprovados</p>
                                <div className="p-2 rounded-full bg-success-bg/50">
                                    <CheckCircle2 size={18} className="text-success" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <p className="text-3xl font-bold text-success tracking-tight">{counts.approved}</p>
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-success-bg text-success text-[10px] font-bold">
                                    <TrendingUp size={10} />
                                    8.2%
                                </span>
                            </div>
                            <div className="w-full h-1 bg-surface-alt rounded-full overflow-hidden">
                                <div className="h-full bg-success w-3/4 rounded-full" />
                            </div>
                        </button>

                        <button
                            onClick={() => { setStatusFilter('rejected'); setView('list'); }}
                            className={`card group p-6 text-left transition-all hover:border-danger/40 cursor-pointer relative overflow-hidden ${statusFilter === 'rejected' ? 'ring-2 ring-danger !bg-danger-bg/60 scale-[1.02] shadow-md' : 'hover:scale-[1.01]'}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-[10px] font-bold text-text-light uppercase tracking-widest leading-none">Rejeitados</p>
                                <div className="p-2 rounded-full bg-danger-bg/50">
                                    <XCircle size={18} className="text-danger" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-4">
                                <p className="text-3xl font-bold text-danger tracking-tight">{counts.rejected}</p>
                                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-danger-bg text-danger text-[10px] font-bold">
                                    <TrendingDown size={10} />
                                    2.1%
                                </span>
                            </div>
                            <div className="w-full h-1 bg-surface-alt rounded-full overflow-hidden">
                                <div className="h-full bg-danger w-1/6 rounded-full" />
                            </div>
                        </button>
                    </div>

                    {view === 'dashboard' ? (
                        <Dashboard clients={clients} />
                    ) : (
                        <div className="space-y-4">
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
                                        <div key={client.id} className="card p-0 overflow-hidden border border-border/40 hover:border-accent/40 shadow-sm">
                                            {/* Row summary */}
                                            <button
                                                type="button"
                                                onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                                                className="w-full px-4 py-4 flex items-center gap-4 text-left hover:bg-surface/50 transition-colors"
                                            >
                                                <div className="w-11 h-11 rounded-2xl bg-surface-alt flex items-center justify-center shrink-0">
                                                    {client.professional.mainOccupation?.toLowerCase().includes('enterprise') || client.personalData.name?.toLowerCase().includes('inc') ? (
                                                        <Shield className="text-accent" size={20} />
                                                    ) : (
                                                        <Users className="text-accent" size={20} />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                                        <p className="font-bold text-text truncate leading-tight">
                                                            {client.personalData.name || 'Sem nome'}
                                                        </p>
                                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider
                                                            ${client.status === 'pending' ? 'bg-warning-bg text-warning' : ''}
                                                            ${client.status === 'approved' ? 'bg-success-bg text-success' : ''}
                                                            ${client.status === 'rejected' ? 'bg-danger-bg text-danger' : ''}
                                                        `}>
                                                            {STATUS_CONFIG[client.status].label === 'Pendente' ? 'IN REVIEW' : STATUS_CONFIG[client.status].label.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-medium">
                                                        <span>{new Date(client.createdAt).toLocaleDateString('pt-BR')}</span>
                                                        <span>•</span>
                                                        <span className="uppercase">ID: #{client.id.slice(-4)}</span>
                                                    </div>
                                                </div>

                                                <ChevronRight size={16} className={`text-text-light transition-transform duration-300 ${expandedId === client.id ? 'rotate-90' : ''}`} />
                                            </button>

                                            {/* Expanded detail */}
                                            {expandedId === client.id && (
                                                <div className="border-t border-border/50 px-4 py-5 bg-surface-alt/30 space-y-4 animate-in slide-in-from-top duration-300">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                                        <Detail label="Nome Completo" value={client.personalData.name} />
                                                        <Detail label="CPF" value={client.personalData.cpf} />
                                                        <Detail label="RG" value={`${client.personalData.rg} - ${client.personalData.rgIssuer}`} />
                                                        <Detail label="Data de Nascimento" value={client.personalData.birthDate} />
                                                        <Detail label="Email" value={client.contact.email} />
                                                        <Detail label="Celular (WhatsApp)" value={client.contact.mobile} />
                                                        <Detail label="Endereço" value={
                                                            `${client.address.streetType || ''} ${client.address.street || ''}, ${client.address.number || ''} - ${client.address.neighborhood || ''}, ${client.address.city || ''}/${client.address.state || ''}`
                                                        } />
                                                        <Detail label="CEP" value={client.address.zipCode} />
                                                        <Detail label="Ocupação" value={client.professional.mainOccupation} />
                                                        <Detail label="Renda Mensal" value={client.professional.declaredIncome} />
                                                        <Detail label="Documentos" value={`${client.documents.length} documento(s) enviado(s)`} />
                                                        {client.notes && <Detail label="Observações" value={client.notes} />}
                                                    </div>

                                                    {/* Document previews */}
                                                    {client.documents.length > 0 && (
                                                        <div>
                                                            <p className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Documentos Enviados:</p>
                                                            <div className="flex flex-wrap gap-3">
                                                                {client.documents.map((doc) => (
                                                                    <div key={doc.id} className="group relative border border-border rounded-xl overflow-hidden shadow-sm hover:border-accent transition-colors">
                                                                        {doc.fileUrl.startsWith('data:image') ? (
                                                                            // eslint-disable-next-line @next/next/no-img-element
                                                                            <img src={doc.fileUrl} alt={doc.fileName} className="w-20 h-20 object-cover" />
                                                                        ) : (
                                                                            <div className="w-20 h-20 flex items-center justify-center bg-surface-alt">
                                                                                <FileText size={24} className="text-text-light" />
                                                                            </div>
                                                                        )}
                                                                        <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[8px] px-1 py-0.5 truncate uppercase font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            {doc.type}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                                                        {client.status !== 'approved' && (
                                                            <button
                                                                onClick={() => handleStatusChange(client.id, 'approved', client.userId)}
                                                                className="btn-primary flex-1 text-xs py-2.5 h-auto"
                                                            >
                                                                <CheckCircle2 size={14} />
                                                                Aprovar
                                                            </button>
                                                        )}
                                                        {client.status !== 'rejected' && (
                                                            <button
                                                                onClick={() => handleStatusChange(client.id, 'rejected', client.userId)}
                                                                className="btn-danger flex-1 text-xs py-2.5 h-auto text-white"
                                                            >
                                                                <XCircle size={14} />
                                                                Rejeitar
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={exportCSV}
                                                            className="flex-1 btn-secondary text-xs py-2.5 h-auto"
                                                        >
                                                            <Download size={14} />
                                                            Exportar
                                                        </button>
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
            </div>
        </div>
    );
}

function Detail({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-text-light uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-text font-medium truncate">{value || 'N/A'}</p>
        </div>
    );
}
