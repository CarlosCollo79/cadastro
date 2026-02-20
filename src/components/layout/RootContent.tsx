'use client';

import React from 'react';
export function RootContent({ children, interClass }: { children: React.ReactNode, interClass: string }) {
    return (
        <html lang="pt-BR">
            <body className={`min-h-screen bg-background text-text antialiased ${interClass}`}>
                {children}
            </body>
        </html>
    );
}
