'use client';

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { ArrowRight, ClipboardList, Shield, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getLatestClient } from '@/lib/storage';

export default function HomePage() {
  const [hasRegistration, setHasRegistration] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    let isMounted = true;
    async function checkRegistration() {
      try {
        const client = await getLatestClient(user?.id);
        if (isMounted) {
          setHasRegistration(!!client);
        }
      } catch (err) {
        console.error("Failed to check registration:", err);
      }
    }

    checkRegistration();

    return () => {
      isMounted = false;
    };
  }, [user?.id, isLoaded]);

  // Condition to show "Meus Dados" instead of registration
  const showMyData = isSignedIn && hasRegistration;

  // Check if user has admin access for this tenant or is a global admin
  const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'default';
  const isAdmin = user?.publicMetadata?.role === 'admin' ||
    (user?.publicMetadata?.admin_clients as string[])?.includes(TENANT_ID);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-text-inverse font-bold text-sm">O</span>
            </div>
            <span className="font-semibold text-text">Onboarding Digital</span>
          </div>
          <nav className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm text-text-muted hover:text-text transition-colors">
                  Login
                </button>
              </SignInButton>
              <Link href="/cadastro" className="btn-primary text-sm">
                Iniciar Cadastro
                <ArrowRight size={14} />
              </Link>
            </SignedOut>
            <SignedIn>
              {showMyData ? (
                <Link href="/meus-dados" className="text-sm text-text-muted hover:text-text transition-colors">
                  Meus Dados
                </Link>
              ) : (
                <Link href="/cadastro" className="text-sm text-text-muted hover:text-text transition-colors">
                  Iniciar Cadastro
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin" className="text-sm text-text-muted hover:text-text transition-colors">
                  Admin
                </Link>
              )}
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-6">
              Modernize seu
              <span className="block text-accent">Processo de Onboarding</span>
            </h1>
            <p className="text-lg text-text-muted leading-relaxed mb-10 max-w-lg">
              Agilize sua entrada fazendo o cadastro antecipado.
              Seus dados serão analisados com segurança e rapidez.
            </p>
            {showMyData ? (
              <Link href="/meus-dados" className="btn-primary text-base px-6 py-3">
                Ver Meus Dados
                <User size={18} />
              </Link>
            ) : (
              <Link href="/cadastro" className="btn-primary text-base px-6 py-3">
                Iniciar Cadastro
                <ArrowRight size={18} />
              </Link>
            )}
          </div>


          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-20">
            <div className="card group hover:border-accent/30 transition-colors">
              <ClipboardList className="text-accent mb-3" size={24} />
              <h3 className="font-semibold text-text mb-1.5">Formulário Completo</h3>
              <p className="text-sm text-text-muted">
                Preencha seus dados pessoais, endereço e documentos em etapas simples.
              </p>
            </div>
            <div className="card group hover:border-accent/30 transition-colors">
              <Shield className="text-accent mb-3" size={24} />
              <h3 className="font-semibold text-text mb-1.5">Dados Seguros</h3>
              <p className="text-sm text-text-muted">
                Suas informações são protegidas e criptografadas para sua segurança.
              </p>
            </div>
            <div className="card group hover:border-accent/30 transition-colors">
              <Clock className="text-accent mb-3" size={24} />
              <h3 className="font-semibold text-text mb-1.5">Processo Digital</h3>
              <p className="text-sm text-text-muted">
                Evite filas e burocracia com um fluxo 100% digital e agilizado.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-text-light">
          © {new Date().getFullYear()} Onboarding Digital — Sistema de cadastro simplificado
        </div>
      </footer>
    </div>
  );
}

