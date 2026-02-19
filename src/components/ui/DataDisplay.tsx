import React from 'react';

export function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-surface px-4 py-2.5 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-primary">{title}</h3>
                {action}
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}

export function Field({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div>
            <dt className="text-xs text-text-muted">{label}</dt>
            <dd className="text-sm font-medium mt-0.5 break-words">{value || '—'}</dd>
        </div>
    );
}
