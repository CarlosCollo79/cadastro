import React from 'react';

export function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="px-5 py-3.5 flex justify-between items-center border-b border-border">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{title}</h3>
                {action}
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {children}
            </div>
        </div>
    );
}

export function Field({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div>
            <dt className="text-[11px] text-text-light uppercase tracking-wider mb-1">{label}</dt>
            <dd className="text-sm font-medium text-text break-words">{value || '—'}</dd>
        </div>
    );
}
