"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import {
  BarChart3,
  Building2,
  Calculator,
  ChevronDown,
  ClipboardList,
  FileSignature,
  FileText,
  GraduationCap,
  Handshake,
  House,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  MessagesSquare,
  Moon,
  Sun,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { demoCompany } from "./data";

/**
 * Reprodução da casca do sistema, no visual de outubro de 2026: barra lateral
 * azul-marinho com o item ativo em índigo, cabeçalho com título, descrição e
 * o botão de tema, e superfícies que acompanham o tema claro ou escuro. As
 * cores vêm dos tokens `ns-*` (ver globals.css), os mesmos do produto.
 */

const icons: Record<string, LucideIcon> = {
  chat: MessagesSquare,
  internalChat: MessageCircle,
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
  leads: ClipboardList,
  legal: FileText,
  finance: WalletCards,
  academy: GraduationCap,
};

export type NavItem = { label: string; icon: keyof typeof icons };

export type Workspace = "Comercial" | "Jurídico" | "Financeiro" | "Academy" | "Gestão";

/** Atendimento e chat interno aparecem em qualquer área, no topo do menu. */
const chats: NavItem[] = [
  { label: "Atendimento WhatsApp", icon: "chat" },
  { label: "Chat interno", icon: "internalChat" },
];

/**
 * Navegação por área, espelhando o filtro por workspace do sistema.
 *
 * A lista traz apenas itens que têm tela construída: dentro do demo todos são
 * clicáveis, e item de menu que não leva a lugar nenhum frustra mais do que
 * a lista curta incomoda.
 */
export const workspaceNav: Record<Workspace, NavItem[]> = {
  Comercial: [
    ...chats,
    { label: "Painel comercial", icon: "dashboard" },
    { label: "Clientes", icon: "clients" },
    { label: "Pré-vendas", icon: "preSales" },
    { label: "Simulações", icon: "calculations" },
    { label: "Documentos", icon: "documents" },
    { label: "Academy", icon: "academy" },
    { label: "Distribuição de leads", icon: "leads" },
  ],
  "Jurídico": [
    ...chats,
    { label: "Clientes", icon: "clients" },
    { label: "Pré-vendas", icon: "preSales" },
    { label: "Documentos", icon: "documents" },
    { label: "Academy", icon: "academy" },
    { label: "Esteira", icon: "legal" },
  ],
  Financeiro: [
    ...chats,
    { label: "Financeiro", icon: "finance" },
    { label: "Consultas", icon: "finance" },
  ],
  Academy: [...chats, { label: "Academy", icon: "academy" }],
  "Gestão": [
    ...chats,
    { label: "Gestão", icon: "dashboard" },
    { label: "Usuários", icon: "users" },
    { label: "Empresa", icon: "company" },
    { label: "Backups", icon: "backups" },
    { label: "Logs", icon: "logs" },
  ],
};

/**
 * Abas da Gestão, como no produto: grupos em cima, páginas do grupo embaixo.
 * `nav` é o item da barra lateral que abre aquela página na réplica. O grupo
 * Operação (aprovações, contratos e templates) fica de fora pelo mesmo motivo
 * do menu: não tem tela construída aqui.
 */
const gestaoGrupos = [
  { label: "Visão geral", paginas: [{ label: "Visão geral", nav: "Gestão" }] },
  { label: "Equipe", paginas: [{ label: "Equipe", nav: "Usuários" }] },
  { label: "Configurações", paginas: [{ label: "Empresa", nav: "Empresa" }] },
  {
    label: "Segurança",
    paginas: [
      { label: "Auditoria", nav: "Logs" },
      { label: "Backups", nav: "Backups" },
    ],
  },
];

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

/* ---------- tema claro / escuro ----------
   O produto guarda a escolha no navegador. Aqui ela vive só na memória da
   página e começa sempre no claro, igual ao HTML que saiu do build. */

type Tema = "claro" | "escuro";

let temaAtual: Tema = "claro";
const ouvintesTema = new Set<() => void>();

function assinarTema(aviso: () => void) {
  ouvintesTema.add(aviso);
  return () => {
    ouvintesTema.delete(aviso);
  };
}

function alternarTema() {
  temaAtual = temaAtual === "claro" ? "escuro" : "claro";
  for (const aviso of ouvintesTema) aviso();
}

export function useTemaCrm(): Tema {
  return useSyncExternalStore(
    assinarTema,
    () => temaAtual,
    () => "claro",
  );
}

const foco =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ns-primary focus-visible:ring-offset-0";

type ScreenProps = {
  workspace: Workspace;
  active: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  /** Atendimento e chat ocupam a área inteira, sem cabeçalho nem margem. */
  semMoldura?: boolean;
  children: React.ReactNode;
};

/** Casca completa: barra lateral + cabeçalho + área de conteúdo. */
export function Screen({
  workspace,
  active,
  title,
  subtitle,
  actions,
  semMoldura = false,
  children,
}: ScreenProps) {
  const nav = useContext(DemoNavContext);
  const tema = useTemaCrm();
  const areaAtual = nav.workspace ?? workspace;
  const itemAtivo = nav.active ?? active;
  const items = workspaceNav[areaAtual];

  return (
    // data-demo marca a réplica do produto: ela reproduz o estilo do sistema
    // real, então a auditoria de contraste do site não se aplica aqui.
    <div
      data-demo="true"
      data-tema={tema}
      className="crm-app flex min-h-[620px] w-full bg-ns-bg text-ns-text"
    >
      <aside className="flex w-[226px] shrink-0 flex-col border-r border-ns-lateral-borda bg-ns-lateral px-3 py-5 text-ns-lateral-texto">
        <div className="border-b border-ns-lateral-borda px-2 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-[10px] font-bold uppercase tracking-wide text-slate-800">
              {demoCompany.initials}
            </span>
            <span className="text-[23px] font-semibold leading-none text-white">newsec</span>
          </div>
          <p className="mt-2.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-ns-lateral-fraco">
            CRM • {areaAtual}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5 text-white">
          <span>
            <span className="block text-[9px] text-ns-lateral-fraco">Workspace</span>
            <span className="mt-0.5 block text-[13px] font-semibold">{areaAtual}</span>
          </span>
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
        </div>

        <span className="mt-3 inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-white">
          <House aria-hidden="true" className="h-4 w-4 shrink-0" />
          Tela inicial
        </span>

        <nav className="mt-2 flex flex-1 flex-col gap-0.5">
          {items.map((item) => {
            const Icon = icons[item.icon];
            const isActive = item.label === itemAtivo;
            const classe = `inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[12.5px] font-medium transition-colors ${
              isActive ? "bg-[#5267f5] text-white" : "text-ns-lateral-texto"
            }`;
            const conteudo = (
              <>
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="min-w-0 truncate">{item.label}</span>
              </>
            );

            if (!nav.onSelect) {
              return (
                <span key={item.label} className={classe}>
                  {conteudo}
                </span>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => nav.onSelect?.(item.label)}
                aria-current={isActive ? "page" : undefined}
                className={`${classe} cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7385ff] ${
                  isActive ? "" : "hover:bg-white/5 hover:text-white"
                }`}
              >
                {conteudo}
              </button>
            );
          })}
        </nav>

        <p className="px-3 pb-2 text-[11px] text-[#8f9bb3]">
          {demoCompany.tradeName} · Versão 0.1.0
        </p>
        <span className="inline-flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium">
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Sair
        </span>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        {semMoldura ? (
          children
        ) : (
          <>
            <header className="flex items-center justify-between gap-4 border-b border-ns-border bg-ns-surface px-6 py-3">
              <div className="min-w-0">
                <h3 className="truncate text-[19px] font-semibold text-ns-text">{title}</h3>
                {subtitle ? (
                  <p className="mt-0.5 truncate text-[12px] text-ns-muted">{subtitle}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                {actions}
                <BotaoTema />
              </div>
            </header>

            {areaAtual === "Gestão" ? <AbasGestao ativo={itemAtivo} /> : null}

            <div className="flex-1 p-5">{children}</div>
          </>
        )}
      </main>
    </div>
  );
}

/** O botão de tema do cabeçalho: lua no claro, sol no escuro, como no produto. */
export function BotaoTema() {
  const tema = useTemaCrm();
  const Icone = tema === "claro" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={tema === "claro" ? "Usar tema escuro" : "Usar tema claro"}
      title={tema === "claro" ? "Tema escuro" : "Tema claro"}
      className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-ns-border bg-ns-alt text-ns-muted transition-colors hover:text-ns-text ${foco}`}
    >
      <Icone aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}

function AbasGestao({ ativo }: { ativo: string }) {
  const nav = useContext(DemoNavContext);
  const grupoAtual =
    gestaoGrupos.find((grupo) => grupo.paginas.some((pagina) => pagina.nav === ativo)) ??
    gestaoGrupos[0];

  function aba(rotulo: string, destino: string, ativa: boolean, classe: string) {
    const cor = ativa
      ? "border-ns-primary text-ns-primary"
      : "border-transparent text-ns-muted";

    if (!nav.onSelect) {
      return (
        <span key={rotulo} className={`shrink-0 border-b-2 ${classe} ${cor}`}>
          {rotulo}
        </span>
      );
    }

    return (
      <button
        key={rotulo}
        type="button"
        onClick={() => nav.onSelect?.(destino)}
        aria-current={ativa ? "page" : undefined}
        className={`shrink-0 cursor-pointer border-b-2 ${classe} ${cor} ${foco} ${
          ativa ? "" : "hover:text-ns-text"
        }`}
      >
        {rotulo}
      </button>
    );
  }

  return (
    <div className="bg-ns-bg px-5">
      <div className="flex gap-1 border-b border-ns-border">
        {gestaoGrupos.map((grupo) =>
          aba(grupo.label, grupo.paginas[0].nav, grupo === grupoAtual, "px-3.5 py-3 text-[13px] font-medium"),
        )}
      </div>
      {grupoAtual.paginas.length > 1 ? (
        <div className="flex gap-1 border-b border-ns-border">
          {grupoAtual.paginas.map((pagina) =>
            aba(pagina.label, pagina.nav, pagina.nav === ativo, "px-3.5 py-2.5 text-[11px] font-semibold"),
          )}
        </div>
      ) : null}
    </div>
  );
}
