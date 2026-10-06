import { ChevronDown, X, type LucideIcon } from "lucide-react";

/**
 * Primitivas das telas da réplica: cartões, indicadores, selos, tabelas e o
 * painel lateral das listas.
 *
 * Ficam fora de chrome.tsx de propósito. Aquele arquivo é de cliente (guarda o
 * tema e o clique do menu), e uma tela renderizada no build não pode passar um
 * ícone como propriedade a um componente de cliente, nem chamar função dele.
 */

/** Iniciais de um nome completo, para os avatares das listas. */
export function iniciais(nome: string) {
  return nome
    .split(" ")
    .map((parte) => parte[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Classes das tabelas de lista: cabeçalho tingido e linha selecionada. */
export const tabela = {
  base: "w-full border-collapse text-left",
  cabeca: "bg-ns-primary/[0.09] text-[10px] text-ns-muted",
  th: "whitespace-nowrap px-3 py-2.5 font-medium",
  linha: "border-t border-ns-border",
  selecionada: "border-t border-ns-border bg-ns-primary/[0.13]",
  td: "px-3 py-2.5 text-[12px] text-ns-text",
  fraco: "px-3 py-2.5 text-[12px] text-ns-muted",
} as const;

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded border border-slate-300 bg-white/80 px-2 py-1 text-[11px] font-medium tracking-wide text-slate-500">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Ambiente demonstrativo
    </span>
  );
}

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
    <section {...rest} className={`min-w-0 rounded-lg border border-ns-border bg-ns-surface ${className}`}>
      {title ? (
        <div className="flex items-baseline justify-between gap-3 px-4 pt-3.5">
          <h4 className="text-[13px] font-semibold text-ns-text">{title}</h4>
          {hint ? <span className="text-[11px] text-ns-muted">{hint}</span> : null}
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}

export type Acento = "primary" | "success" | "warning" | "danger";

const acentoBorda: Record<Acento, string> = {
  primary: "border-l-ns-primary",
  success: "border-l-ns-success",
  warning: "border-l-ns-warning",
  danger: "border-l-ns-danger",
};

const acentoIcone: Record<Acento, string> = {
  primary: "bg-ns-primary/12 text-ns-primary",
  success: "bg-ns-success/12 text-ns-success",
  warning: "bg-ns-warning/15 text-ns-warning",
  danger: "bg-ns-danger/12 text-ns-danger",
};

const acentoDoTom = {
  positive: "success",
  negative: "danger",
  neutral: "primary",
} as const;

/** Indicador do topo das telas: filete colorido, ícone, rótulo e número. */
export function Stat({
  label,
  value,
  hint,
  tone = "neutral",
  accent,
  icon: Icone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof acentoDoTom;
  accent?: Acento;
  icon?: LucideIcon;
}) {
  const acento = accent ?? acentoDoTom[tone];

  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-lg border border-l-[3px] border-ns-border bg-ns-surface px-3.5 py-3 ${acentoBorda[acento]}`}
    >
      {Icone ? (
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${acentoIcone[acento]}`}
        >
          <Icone aria-hidden="true" className="h-[18px] w-[18px]" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="truncate text-[10px] font-medium uppercase text-ns-muted">{label}</p>
        <p className="mt-0.5 truncate text-[19px] font-semibold leading-tight text-ns-text">{value}</p>
        {hint ? <p className="mt-0.5 text-[11px] leading-snug text-ns-muted">{hint}</p> : null}
      </div>
    </div>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "muted" }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ns-alt">
      <div
        className={`h-full rounded-full ${tone === "primary" ? "bg-ns-primary" : "bg-ns-muted/60"}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Avatar({ initials, grande = false }: { initials: string; grande?: boolean }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-ns-primary/12 font-semibold text-ns-primary ${
        grande ? "h-9 w-9 text-[12px]" : "h-6 w-6 text-[10px]"
      }`}
    >
      {initials}
    </span>
  );
}

const pillTone = {
  primary: "bg-ns-primary/12 text-ns-primary",
  slate: "bg-ns-alt text-ns-muted",
  amber: "bg-ns-warning/15 text-ns-warning",
  success: "bg-ns-success/15 text-ns-success",
  danger: "bg-ns-danger/12 text-ns-danger",
  ia: "bg-ns-ia/12 text-ns-ia",
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
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${pillTone[tone]}`}
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
  variant?: "primary" | "ghost" | "danger";
}) {
  const classe = {
    primary: "bg-ns-primary text-white",
    ghost: "border border-ns-border bg-ns-surface text-ns-text",
    danger: "border border-ns-danger/35 bg-ns-surface text-ns-danger",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold ${classe}`}
    >
      {children}
    </span>
  );
}

/** Abas de uma tela (Gerados · Templates, Resumo · Parâmetros…). */
export function Abas({ itens, ativa }: { itens: readonly string[]; ativa: string }) {
  return (
    <div className="flex gap-1 border-b border-ns-border">
      {itens.map((item) => (
        <span
          key={item}
          className={`border-b-2 px-3 py-2.5 text-[12px] font-semibold ${
            item === ativa ? "border-ns-primary text-ns-primary" : "border-transparent text-ns-muted"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/** Campo de busca e filtros que ficam acima das tabelas. */
export function Filtros({ busca, selects = [] }: { busca: string; selects?: readonly string[] }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center rounded-md border border-ns-border bg-ns-alt px-2.5 py-2">
        <span className="truncate text-[12px] text-ns-muted">{busca}</span>
      </div>
      {selects.map((rotulo) => (
        <span
          key={rotulo}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-ns-border bg-ns-alt px-2.5 py-2 text-[12px] text-ns-text"
        >
          {rotulo}
          <ChevronDown aria-hidden="true" className="h-3 w-3 text-ns-muted" />
        </span>
      ))}
    </div>
  );
}

/**
 * Painel lateral das listas: mostra o registro em que o ponteiro está (ou o
 * último consultado) sem sair da tela.
 */
export function Detalhe({
  titulo,
  selo,
  fatos,
  children,
  className = "",
}: {
  titulo: string;
  selo?: React.ReactNode;
  fatos?: readonly (readonly [string, string])[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <aside className={`min-w-0 self-start rounded-lg border border-ns-border bg-ns-surface p-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 text-[13px] font-semibold leading-snug text-ns-text">{titulo}</h4>
        <X aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ns-muted" />
      </div>
      {selo ? <div className="mt-2.5">{selo}</div> : null}
      {fatos ? (
        <dl className="mt-3">
          {fatos.map(([rotulo, valor]) => (
            <div
              key={rotulo}
              className="flex items-baseline justify-between gap-3 border-b border-ns-border py-2 last:border-0"
            >
              <dt className="shrink-0 text-[11px] text-ns-muted">{rotulo}</dt>
              <dd className="min-w-0 text-right text-[12px] text-ns-text">{valor}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {children}
    </aside>
  );
}
