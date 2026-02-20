import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import { Inter } from 'next/font/google'
import "./globals.css";

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
      <html lang="pt-BR">
        <body className={`min-h-screen bg-background antialiased ${inter.className}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
