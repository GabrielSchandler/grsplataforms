"use client";

/**
 * Peças comuns das telas da réplica — o equivalente de
 * `newsecfocus/dashboard/components/painel/kit.tsx` e `cabecalho.tsx`.
 *
 * Mesmos tamanhos, cinzas e raios do painel. A diferença é que aqui nada é
 * link de verdade: o que no painel leva a outra rota, na réplica é um botão
 * que troca de tela dentro da própria demonstração.
 */

import * as React from "react";
import { AlertCircle, AlertTriangle, ArrowRight, ChevronRight, Info } from "lucide-react";
import { useFocus } from "./estado";
import { CORES_CATEGORIA, ROTULOS_CATEGORIA, cn, type TipoCategoria } from "./formato";

type Icone = React.ReactElement<{ className?: string; strokeWidth?: number }>;

const comClasse = (icone: Icone, className: string) => React.cloneElement(icone, { className, strokeWidth: 1.75 });

export function Cartao({ className, children, ...resto }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("foco-cartao", className)} {...resto}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------- Cabeçalho */

export function CabecalhoPagina({
  titulo,
  descricao,
  trilha,
  marca,
  acoes,
  nota,
}: {
  titulo: string;
  descricao?: React.ReactNode;
  trilha?: { rotulo: string; aoClicar?: () => void }[];
  marca?: React.ReactNode;
  acoes?: React.ReactNode;
  nota?: React.ReactNode;
}) {
  const { layout } = useLayout();
  const celular = layout === "celular";

  return (
    <header className={cn("flex gap-4", celular ? "flex-col" : "flex-row items-start justify-between")}>
      <div className="min-w-0">
        {trilha && (
          <nav aria-label="Trilha" className="mb-1.5 flex flex-wrap items-center gap-1 text-[13px] text-slate-500">
            {trilha.map((passo, i) => (
              <React.Fragment key={`${passo.rotulo}-${i}`}>
                {i > 0 && <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />}
                {passo.aoClicar ? (
                  <button type="button" onClick={passo.aoClicar} className="transition-colors hover:text-foco-acao hover:underline">
                    {passo.rotulo}
                  </button>
                ) : (
                  <span className="text-slate-600">{passo.rotulo}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <div className="flex min-w-0 items-center gap-3">
          {marca}
          <div className="min-w-0">
            {/* h3, não h1: a página do site já tem o próprio h1, e a réplica é uma peça dentro dela. */}
            <h3 className={cn("font-bold leading-tight tracking-tight text-foco-tinta", celular ? "text-[24px]" : "text-[28px]")}>
              {titulo}
            </h3>
            {descricao && <div className="mt-1 text-[14px] text-slate-600">{descricao}</div>}
          </div>
        </div>
      </div>

      {(acoes || nota) && (
        <div className={cn("flex min-w-0 flex-col gap-2", !celular && "items-end")}>
          {acoes && <div className={cn("flex flex-wrap items-center gap-2.5", !celular && "justify-end")}>{acoes}</div>}
          {nota && <div className="text-[12.5px] text-slate-500">{nota}</div>}
        </div>
      )}
    </header>
  );
}

const useLayout = () => ({ layout: useFocus().layout });

/* ------------------------------------------------------------ Indicadores */

export function GradeIndicadores({ children, colunas = 4 }: { children: React.ReactNode; colunas?: 3 | 4 }) {
  const { layout } = useLayout();
  return (
    <section
      aria-label="Indicadores"
      className={cn("grid gap-3", layout === "celular" ? "grid-cols-2" : colunas === 4 ? "grid-cols-4" : "grid-cols-3")}
    >
      {children}
    </section>
  );
}

/**
 * Cartão de indicador: nome, valor, e uma linha que diz o que o número é ou
 * com o que se compara. `definicao` vira a dica do ícone de informação — o
 * gestor pergunta "isso é o quê?" antes de perguntar "isso é bom?".
 */
export function Indicador({
  icone,
  rotulo,
  valor,
  rodape,
  definicao,
  compacto = false,
  tom = "normal",
  ...resto
}: {
  icone: Icone;
  rotulo: string;
  valor: React.ReactNode;
  rodape?: React.ReactNode;
  definicao?: string;
  compacto?: boolean;
  tom?: "normal" | "alerta";
} & { "data-tour"?: string }) {
  const { layout } = useLayout();
  const celular = layout === "celular";

  if (compacto) {
    return (
      <Cartao className={cn("flex gap-3 p-4", celular ? "flex-col items-start" : "items-center")} {...resto}>
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            tom === "alerta" ? "bg-rose-50 text-rose-600" : "bg-foco-acao-suave text-foco-acao",
          )}
        >
          {comClasse(icone, "h-5 w-5")}
        </span>
        <div className="min-w-0">
          <p className="foco-num whitespace-nowrap text-[22px] font-bold leading-none tracking-tight text-foco-tinta">{valor}</p>
          <p className="mt-1 text-[13px] text-slate-600" title={definicao}>
            {rotulo}
          </p>
          {rodape && <p className="text-[11.5px] text-slate-500">{rodape}</p>}
        </div>
      </Cartao>
    );
  }

  return (
    <Cartao className="flex flex-col p-4 px-5" {...resto}>
      <span className="flex items-center gap-2 text-[13px] font-semibold leading-snug text-slate-800" title={definicao}>
        {comClasse(icone, cn("h-5 w-5 shrink-0", tom === "alerta" ? "text-rose-600" : "text-foco-acao"))}
        <span className="min-w-0">
          {rotulo}
          {definicao && !celular && (
            <Info aria-label={definicao} className="ml-1 inline h-3.5 w-3.5 -translate-y-px align-middle text-slate-400" />
          )}
        </span>
      </span>
      <p className={cn("foco-num mt-3 whitespace-nowrap font-bold leading-none tracking-tight text-foco-tinta", celular ? "text-[1.6rem]" : "text-[2.15rem]")}>
        {valor}
      </p>
      {rodape && <div className="mt-3 text-[12px] leading-snug text-slate-500">{rodape}</div>}
    </Cartao>
  );
}

/** "▲ +4 p.p. vs mês anterior" — ou "sem base de comparação". */
export function Variacao({
  valor,
  rotulo,
  semBase = "sem base de comparação",
}: {
  valor: number | null;
  rotulo?: string | null;
  semBase?: string;
}) {
  if (valor === null) return <span className="text-slate-500">{semBase}</span>;
  const neutro = Math.abs(valor) < 0.05;
  const cor = neutro ? "text-slate-500" : valor > 0 ? "text-emerald-700" : "text-rose-700";
  const numero = Math.abs(valor).toFixed(1).replace(".", ",").replace(/,0$/, "");
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5">
      <span className={cn("inline-flex items-center gap-1 font-semibold", cor)}>
        {!neutro && (
          <span aria-hidden="true" className="text-[9px] leading-none">
            {valor > 0 ? "▲" : "▼"}
          </span>
        )}
        {valor > 0 ? "+" : valor < 0 ? "−" : ""}
        {numero} p.p.
      </span>
      {rotulo && <span className="text-slate-500">{rotulo}</span>}
    </span>
  );
}

/* ----------------------------------------------------------------- Seção */

export function Secao({
  icone,
  titulo,
  subtitulo,
  acao,
  children,
  rodape,
  className,
  ...resto
}: {
  icone?: Icone;
  titulo: string;
  subtitulo?: React.ReactNode;
  acao?: React.ReactNode;
  children: React.ReactNode;
  rodape?: React.ReactNode;
  className?: string;
} & { "data-tour"?: string }) {
  return (
    <Cartao className={cn("flex min-w-0 flex-col p-5", className)} {...resto}>
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div className="flex min-w-0 flex-1 basis-[12rem] items-start gap-3">
          {icone && comClasse(icone, "mt-0.5 h-5 w-5 shrink-0 text-foco-acao")}
          <div className="min-w-0">
            <h2 className="text-[16px] font-semibold text-slate-900">{titulo}</h2>
            {subtitulo && <p className="mt-0.5 text-[13px] text-slate-500">{subtitulo}</p>}
          </div>
        </div>
        {acao && <div className="shrink-0">{acao}</div>}
      </div>
      <div className="mt-4 min-w-0 flex-1">{children}</div>
      {rodape && <div className="mt-4 text-[11.5px] leading-relaxed text-slate-500">{rodape}</div>}
    </Cartao>
  );
}

/** Ação "Texto →" usada em seções, avisos e listas. */
export function LinkAcao({ aoClicar, children, className }: { aoClicar: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      className={cn("inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-foco-acao hover:underline", className)}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}

/* ----------------------------------------------------------------- Aviso */

const TONS_AVISO = {
  atencao: { caixa: "border-amber-200 bg-amber-50", icone: "text-amber-500", titulo: "text-amber-900", Icone: AlertTriangle },
  info: { caixa: "border-foco-acao/25 bg-foco-acao-suave", icone: "text-foco-acao", titulo: "text-slate-900", Icone: Info },
  erro: { caixa: "border-rose-200 bg-rose-50", icone: "text-rose-600", titulo: "text-rose-900", Icone: AlertCircle },
} as const;

/** Faixa compacta: o que é, o que está acontecendo e onde resolver. */
export function Aviso({
  tom = "atencao",
  titulo,
  children,
  acao,
  ...resto
}: {
  tom?: keyof typeof TONS_AVISO;
  titulo?: string;
  children: React.ReactNode;
  acao?: { rotulo: string; aoClicar: () => void };
} & { "data-tour"?: string }) {
  const t = TONS_AVISO[tom];
  return (
    <div role="status" className={cn("flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[0.625rem] border px-4 py-3", t.caixa)} {...resto}>
      <span className="flex shrink-0 items-center gap-2.5">
        <t.Icone aria-hidden="true" className={cn("h-5 w-5", t.icone)} strokeWidth={2} />
        {titulo && <span className={cn("text-[13px] font-semibold", t.titulo)}>{titulo}</span>}
      </span>
      <div className="min-w-0 flex-1 basis-[16rem] text-[13px] text-slate-700">{children}</div>
      {acao && (
        <button
          type="button"
          onClick={acao.aoClicar}
          className={cn("flex shrink-0 items-center gap-1.5 text-[13px] font-medium hover:underline", t.titulo)}
        >
          {acao.rotulo}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- Selos */

export function SeloCategoria({ tipo }: { tipo: TipoCategoria | null }) {
  const chave = tipo ?? "SEM";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11.5px] font-medium",
        tipo === "PRODUCTIVE" && "border-emerald-200 bg-emerald-50 text-emerald-800",
        tipo === "NEUTRAL" && "border-slate-200 bg-slate-50 text-slate-700",
        tipo === "UNPRODUCTIVE" && "border-rose-200 bg-rose-50 text-rose-800",
        tipo === null && "border-slate-200 bg-white text-slate-500",
      )}
    >
      <span className="h-2 w-2 rounded-full" style={{ background: CORES_CATEGORIA[chave] }} />
      {ROTULOS_CATEGORIA[chave]}
    </span>
  );
}

export function Selo({ tom, children }: { tom: "sucesso" | "atencao" | "erro" | "neutro" | "info"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-medium",
        tom === "sucesso" && "bg-emerald-50 text-emerald-800",
        tom === "atencao" && "bg-amber-50 text-amber-800",
        tom === "erro" && "bg-rose-50 text-rose-800",
        tom === "neutro" && "bg-slate-100 text-slate-600",
        tom === "info" && "bg-foco-acao-suave text-foco-acao",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tom === "sucesso" && "bg-emerald-500",
          tom === "atencao" && "bg-amber-500",
          tom === "erro" && "bg-rose-500",
          tom === "neutro" && "bg-slate-400",
          tom === "info" && "bg-foco-acao",
        )}
      />
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- Barras */

/** Barra de progresso com o número ao lado ("▬▬▬▬░░ 36%"). */
export function BarraPercentual({ valor, largura = "min-w-[72px]" }: { valor: number | null; largura?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", largura)}>
        <span className="block h-full rounded-full bg-foco-marca" style={{ width: `${Math.max(0, Math.min(100, valor ?? 0))}%` }} />
      </span>
      <span className="foco-num w-9 shrink-0 text-right text-[13px] font-medium text-slate-800">
        {valor === null ? "—" : `${Math.round(valor)}%`}
      </span>
    </div>
  );
}

/** Lista de barras horizontais: rótulo, barra proporcional ao maior, valor e %. */
export function BarrasHorizontais({
  itens,
  vazio = "Nada no período.",
}: {
  itens: { chave: string; rotulo: React.ReactNode; valor: number; texto: string; percentual?: number | null }[];
  vazio?: string;
}) {
  if (itens.length === 0) return <p className="text-[13px] text-slate-500">{vazio}</p>;
  const maior = Math.max(...itens.map((i) => i.valor), 1);
  return (
    <ul className="space-y-3">
      {itens.map((i) => (
        <li
          key={i.chave}
          className={cn(
            "grid items-center gap-3",
            i.percentual !== undefined
              ? "grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_4.2rem_2.3rem]"
              : "grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_4.2rem]",
          )}
        >
          <span className="min-w-0 truncate text-[13px] text-slate-800">{i.rotulo}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-slate-100">
            <span className="block h-full rounded-full bg-foco-marca" style={{ width: `${(i.valor / maior) * 100}%` }} />
          </span>
          <span className="foco-num whitespace-nowrap text-right text-[13px] font-medium text-slate-800">{i.texto}</span>
          {i.percentual !== undefined && (
            <span className="foco-num text-right text-[11.5px] text-slate-500">
              {i.percentual === null ? "—" : `${Math.round(i.percentual)}%`}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- Tabela */

/** Moldura de tabela: cabeçalho cinza claro e rolagem horizontal controlada. */
export function TabelaSimples({ children, minimo = "min-w-[600px]", className }: { children: React.ReactNode; minimo?: string; className?: string }) {
  return (
    <div className={cn("foco-rolagem overflow-x-auto rounded-lg border border-foco-borda", className)}>
      <table
        className={cn(
          "w-full text-[13px] [&_tbody_tr]:border-t [&_tbody_tr]:border-foco-borda [&_td]:px-3 [&_td]:py-2.5 [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[12.5px] [&_th]:font-medium [&_th]:text-slate-600 [&_thead_tr]:bg-slate-50",
          minimo,
        )}
      >
        {children}
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ Abas */

export function Abas<T extends string>({
  abas,
  ativa,
  aoMudar,
  variante = "pilula",
  ...resto
}: {
  abas: { chave: T; rotulo: string; selo?: number }[];
  ativa: T;
  aoMudar: (chave: T) => void;
  variante?: "pilula" | "sublinhado";
} & { "data-tour"?: string }) {
  if (variante === "sublinhado") {
    return (
      <div role="tablist" className="foco-rolagem flex gap-5 overflow-x-auto border-b border-foco-borda" {...resto}>
        {abas.map((a) => (
          <button
            key={a.chave}
            type="button"
            role="tab"
            aria-selected={a.chave === ativa}
            onClick={() => aoMudar(a.chave)}
            className={cn(
              "-mb-px shrink-0 whitespace-nowrap border-b-2 pb-2.5 text-[13.5px] transition-colors",
              a.chave === ativa ? "border-foco-acao font-medium text-foco-acao" : "border-transparent text-slate-600 hover:text-slate-900",
            )}
          >
            {a.rotulo}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div role="tablist" className="foco-rolagem flex gap-1 overflow-x-auto rounded-lg border border-foco-borda bg-white p-1" {...resto}>
      {abas.map((a) => (
        <button
          key={a.chave}
          type="button"
          role="tab"
          aria-selected={a.chave === ativa}
          onClick={() => aoMudar(a.chave)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] transition-colors",
            a.chave === ativa ? "bg-foco-acao font-medium text-white" : "text-slate-600 hover:bg-slate-100",
          )}
        >
          {a.rotulo}
          {a.selo ? (
            <span
              className={cn(
                "foco-num rounded-full px-1.5 text-[10.5px] font-semibold",
                a.chave === ativa ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800",
              )}
            >
              {a.selo}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- Avatar */

export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length >= 2) return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
  return nome.slice(0, 2).toUpperCase();
}

export function Avatar({ nome, tamanho = "sm" }: { nome: string; tamanho?: "sm" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-700",
        tamanho === "sm" ? "h-8 w-8 text-[11px]" : "h-12 w-12 text-[15px]",
      )}
    >
      {iniciais(nome)}
    </span>
  );
}

/** Botão secundário com contorno, como "Exportar" e "Ver registros". */
export function BotaoContorno({
  children,
  aoClicar,
  destaque = false,
}: {
  children: React.ReactNode;
  aoClicar: () => void;
  destaque?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={aoClicar}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3.5 text-[13.5px] font-medium transition-colors",
        destaque
          ? "bg-foco-acao text-white hover:bg-[#154b73]"
          : "border border-foco-acao/70 bg-white text-foco-acao hover:bg-foco-acao-suave",
      )}
    >
      {children}
    </button>
  );
}
