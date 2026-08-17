"use client";

import { createContext, useContext } from "react";
import {
  BarChart3,
  Building2,
  Calculator,
  ClipboardList,
  FileSignature,
  FileText,
  GraduationCap,
  Handshake,
  House,
  LayoutDashboard,
  LogOut,
  Mail,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { demoCompany } from "./data";

/**
 * Reprodução da casca do sistema. As classes seguem o que existe no produto
 * (barra lateral branca de 288px, item ativo em teal-50, ação em teal-700)
 * para que a tela demonstrativa não pareça outra coisa.
 */

const icons: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  clients: Users,
  preSales: Handshake,
  calculations: Calculator,
  documents: FileText,
  contracts: FileSignature,
  users: BarChart3,
  company: Building2,
  backups: ClipboardList,
  logs: ClipboardList,
  email: Mail,
  integrations: Mail,
  leads: ClipboardList,
  legal: FileText,
  finance: WalletCards,
  academy: GraduationCap,
};

export type NavItem = { label: string; icon: keyof typeof icons };

export type Workspace = "Comercial" | "Jurídico" | "Financeiro" | "Academy" | "Gestão";

/**
 * Navegação por área, espelhando o filtro por workspace do sistema.
 *
 * A lista traz apenas itens que têm tela construída: dentro do demo todos são
 * clicáveis, e item de menu que não leva a lugar nenhum frustra mais do que
 * a lista curta incomoda.
 */
export const workspaceNav: Record<Workspace, NavItem[]> = {
  Comercial: [
    { label: "Painel comercial", icon: "dashboard" },
    { label: "Distribuição de leads", icon: "leads" },
    { label: "Clientes", icon: "clients" },
    { label: "Pré-vendas", icon: "preSales" },
    { label: "Simulações", icon: "calculations" },
    { label: "Documentos", icon: "documents" },
  ],
  "Jurídico": [
    { label: "Esteira", icon: "legal" },
    { label: "Clientes", icon: "clients" },
    { label: "Pré-vendas", icon: "preSales" },
    { label: "Documentos", icon: "documents" },
  ],
  Financeiro: [
    { label: "Lançamentos", icon: "finance" },
    { label: "Consultas", icon: "finance" },
  ],
  Academy: [{ label: "Academy", icon: "academy" }],
  "Gestão": [
    { label: "Painel comercial", icon: "dashboard" },
    { label: "Usuários", icon: "users" },
    { label: "Empresa", icon: "company" },
    { label: "Backups", icon: "backups" },
    { label: "Logs", icon: "logs" },
  ],
};

/**
 * Quando a réplica está dentro de um demo navegável, o contexto assume a área
 * e o item ativo, e entrega o clique. Sem contexto — nas capturas de imagem —
 * a barra lateral continua estática, como uma fotografia.
 */
type DemoNav = {
  workspace?: Workspace;
  active?: string;
  onSelect?: (label: string) => void;
};

export const DemoNavContext = createContext<DemoNav>({});

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white/80 px-2 py-1 text-[11px] font-medium tracking-wide text-slate-500">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Ambiente demonstrativo
    </span>
  );
}

type ScreenProps = {
  workspace: Workspace;
  active: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

/** Casca completa: barra lateral + cabeçalho + área de conteúdo. */
export function Screen({ workspace, active, title, subtitle, actions, children }: ScreenProps) {
  const nav = useContext(DemoNavContext);
  const areaAtual = nav.workspace ?? workspace;
  const itemAtivo = nav.active ?? active;
  const items = workspaceNav[areaAtual];

  return (
    // data-demo marca a réplica do produto: ela reproduz o estilo do sistema
    // real, então a auditoria de contraste do site não se aplica aqui.
    <div data-demo="true" className="flex min-h-[620px] w-full bg-[#f7f8fa] text-slate-950">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-sm font-bold uppercase tracking-wide text-slate-700">
            {demoCompany.initials}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">
              {areaAtual}
            </p>
            <p className="mt-0.5 truncate text-base font-semibold text-slate-950">
              {demoCompany.tradeName}
            </p>
          </div>
        </div>

        <div className="mt-6 px-2">
          <span className="inline-flex w-full items-center gap-2.5 rounded-lg bg-teal-700 px-3 py-2.5 text-sm font-semibold text-white">
            <House aria-hidden="true" className="h-4 w-4" />
            Tela inicial
          </span>
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const Icon = icons[item.icon];
            const isActive = item.label === itemAtivo;
            const classe = `inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
              isActive ? "bg-teal-50 text-teal-900" : "text-slate-700"
            }`;
            const icone = (
              <Icon
                aria-hidden="true"
                className={`h-4 w-4 shrink-0 ${isActive ? "text-teal-800" : "text-teal-700"}`}
              />
            );

            if (!nav.onSelect) {
              return (
                <span key={item.label} className={classe}>
                  {icone}
                  {item.label}
                </span>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => nav.onSelect?.(item.label)}
                aria-current={isActive ? "page" : undefined}
                className={`${classe} cursor-pointer hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600`}
              >
                {icone}
                {item.label}
              </button>
            );
          })}
        </nav>

        <p className="px-3 pb-2 text-[11px] text-slate-400">Versao 1.0.0</p>
        <span className="inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-600">
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Sair
        </span>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-slate-950">{title}</h3>
            {subtitle ? <p className="mt-0.5 text-[13px] text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {actions}
            <DemoBadge />
          </div>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}

/* ---------- primitivas reutilizadas pelas telas ---------- */

export function Panel({
  title,
  hint,
  children,
  className = "",
  ...rest
}: {
  title?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section {...rest} className={`rounded-lg border border-slate-200 bg-white ${className}`}>
      {title ? (
        <div className="flex items-baseline justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <h4 className="text-[13px] font-semibold text-slate-950">{title}</h4>
          {hint ? <span className="text-[11px] text-slate-500">{hint}</span> : null}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}

const toneText = {
  positive: "text-teal-700",
  negative: "text-brand-500",
  neutral: "text-slate-950",
} as const;

export function Stat({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof toneText;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1.5 text-xl font-semibold ${toneText[tone]}`}>{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function Bar({ value, tone = "teal" }: { value: number; tone?: "teal" | "slate" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded bg-slate-100">
      <div
        className={`h-full rounded ${tone === "teal" ? "bg-teal-700" : "bg-slate-400"}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600">
      {initials}
    </span>
  );
}

const pillTone = {
  teal: "border-teal-200 bg-teal-50 text-teal-800",
  slate: "border-slate-200 bg-slate-50 text-slate-600",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
} as const;

export function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: keyof typeof pillTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-medium ${pillTone[tone]}`}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold ${
        variant === "primary"
          ? "bg-teal-700 text-white"
          : "border border-slate-200 bg-white text-slate-700"
      }`}
    >
      {children}
    </span>
  );
}
