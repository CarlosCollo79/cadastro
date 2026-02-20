import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import { Inter } from 'next/font/google'
import "./globals.css";
import { RootContent } from '@/components/layout/RootContent';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: "Onboarding Digital",
  description: "Faça seu cadastro para agilizar sua operação",
  openGraph: {
    title: "Onboarding Digital",
    description: "Faça seu cadastro para agilizar sua operação",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}>
      <RootContent interClass={inter.className}>
        {children}
      </RootContent>
    </ClerkProvider>
  );
}
