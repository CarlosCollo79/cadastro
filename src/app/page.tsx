import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ArrowRight, ClipboardList, Shield, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-text-inverse font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-text">CâmbioPré</span>
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
              <Link href="/meus-dados" className="text-sm text-text-muted hover:text-text transition-colors">
                Meus Dados
              </Link>
              <Link href="/admin" className="text-sm text-text-muted hover:text-text transition-colors">
                Admin
              </Link>
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
              Pré-Cadastro para
              <span className="block text-accent">Operações de Câmbio</span>
            </h1>
            <p className="text-lg text-text-muted leading-relaxed mb-10 max-w-lg">
              Agilize sua compra de moeda estrangeira fazendo o cadastro antecipado.
              Seus dados serão analisados pela corretora antes da sua chegada.
            </p>
            <Link href="/cadastro" className="btn-primary text-base px-6 py-3">
              Começar Pré-Cadastro
              <ArrowRight size={18} />
            </Link>
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
                Suas informações são protegidas e acessíveis apenas pela corretora.
              </p>
            </div>
            <div className="card group hover:border-accent/30 transition-colors">
              <Clock className="text-accent mb-3" size={24} />
              <h3 className="font-semibold text-text mb-1.5">Processo Agilizado</h3>
              <p className="text-sm text-text-muted">
                Ao chegar na corretora, seus dados já estarão pré-aprovados.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-text-light">
          © {new Date().getFullYear()} CâmbioPré — Pré-cadastro para corretoras de câmbio
        </div>
      </footer>
    </div>
  );
}
