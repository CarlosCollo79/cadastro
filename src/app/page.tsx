'use client';

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { ArrowRight, ClipboardList, Shield, Clock, User, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-text-inverse font-bold text-sm">O</span>
            </div>
            <span className="font-semibold text-text">Onboarding Digital</span>
          </Link>
          <SignedIn>
            <div className="flex items-center gap-4">
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
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <button className="text-sm text-text-muted hover:text-text transition-colors">
                  Entrar
                </button>
              </SignInButton>
              <Link href="/cadastro" className="btn-primary text-sm hidden sm:flex">
                Iniciar Cadastro
                <ArrowRight size={14} />
              </Link>
            </div>
          </SignedOut>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-6">
                Modernize seu
                <span className="block text-accent">Processo de Onboarding</span>
              </h1>
              <p className="text-lg text-text-muted leading-relaxed mb-10 max-w-lg">
                Agilize sua entrada fazendo o cadastro antecipado. Seus dados serão analisados com segurança e rapidez através de um fluxo totalmente digital.
              </p>
              <div className="flex flex-wrap items-center gap-4">
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
                <a href="#features" className="text-sm font-medium text-text-muted hover:text-text transition-colors">
                  Saiba Mais
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section id="features" className="pb-16 sm:pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="card group hover:border-accent/30 transition-colors">
                <ClipboardList className="text-accent mb-3" size={24} />
                <h3 className="font-semibold text-text mb-1.5">Formulário Completo</h3>
                <p className="text-sm text-text-muted">
                  Preencha seus dados pessoais, endereço e documentos em etapas simples e guiadas para evitar erros.
                </p>
              </div>
              <div className="card group hover:border-accent/30 transition-colors">
                <Shield className="text-accent mb-3" size={24} />
                <h3 className="font-semibold text-text mb-1.5">Dados Seguros</h3>
                <p className="text-sm text-text-muted">
                  Suas informações são protegidas e criptografadas de ponta a ponta para garantir sua total segurança.
                </p>
              </div>
              <div className="card group hover:border-accent/30 transition-colors">
                <Clock className="text-accent mb-3" size={24} />
                <h3 className="font-semibold text-text mb-1.5">Processo Digital</h3>
                <p className="text-sm text-text-muted">
                  Evite filas e burocracia com um fluxo 100% digital e agilizado para sua comodidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase section */}
        <section className="py-16 sm:py-24 bg-surface-alt">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full mb-4">
                  Auto-atendimento
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-text mb-4">
                  Sua conta, sob seu controle.
                </h2>
                <p className="text-text-muted leading-relaxed mb-8">
                  Acesse seu painel administrativo a qualquer momento para atualizar informações, enviar documentos pendentes e acompanhar o status da sua aprovação em tempo real.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-text">
                    <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                    Acompanhamento em tempo real
                  </li>
                  <li className="flex items-center gap-3 text-sm text-text">
                    <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                    Upload simplificado de documentos
                  </li>
                  <li className="flex items-center gap-3 text-sm text-text">
                    <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                    Suporte dedicado via chat
                  </li>
                </ul>
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="w-80 bg-success-bg/40 rounded-2xl p-6 shadow-lg">
                  <div className="bg-card rounded-xl p-5 shadow-sm space-y-4">
                    <div className="h-3 w-24 bg-accent/20 rounded" />
                    <div className="space-y-2.5">
                      <div className="h-8 bg-surface-alt rounded-lg" />
                      <div className="h-8 bg-accent rounded-lg" />
                      <div className="h-8 bg-surface-alt rounded-lg" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 w-20 bg-surface-alt rounded text-xs" />
                      <div className="h-6 w-20 bg-surface-alt rounded text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-light">
          <p>© {new Date().getFullYear()} Onboarding Digital — Sistema de cadastro simplificado e seguro</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-text transition-colors cursor-pointer">Termos de Uso</span>
            <span className="hover:text-text transition-colors cursor-pointer">Privacidade</span>
            <span className="hover:text-text transition-colors cursor-pointer">Contato</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
