"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronLeft, Info } from "lucide-react";
import { cn } from "./formato";

/**
 * As primitivas do painel do Focus, refeitas aqui.
 *
 * São as mesmas classes do produto (`components/ui/` e `components/efeitos/`),
 * com duas diferenças conscientes:
 *
 * - o raio dos cartões vem de `--radius-foco` (1,25rem), porque o tema deste
 *   site limita qualquer raio a 8px e isso vale para a moldura da NewSec, não
 *   para a réplica de um produto que usa outro desenho;
 * - o vidro fosco não leva `backdrop-filter`: dentro de uma réplica reduzida,
 *   dezenas de desfoques custam caro e quase não aparecem.
 */

export function Cartao({
  className,
  children,
  ...resto
}: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...resto}
      className={cn("rounded-foco border border-foco-borda foco-vidro text-slate-200", className)}
    >
      {children}
    </div>
  );
}

/**
 * Cartão com borda em gradiente (Glow Card do painel, efeito característico
 * do catálogo 21st.dev). Com `animar`, um quadrado cônico gira atrás de uma
 * moldura de 1px — só `transform` anima, então o custo fica no compositor.
 */
export function CartaoBrilho({
  animar = false,
  className,
  children,
}: {
  animar?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("feixe-moldura rounded-foco p-px", className)}>
      {animar ? (
        <span
          aria-hidden="true"
          className="feixe-giro"
          style={{ ["--feixe-tamanho" as string]: "190%", ["--feixe-duracao" as string]: "9s" }}
        />
      ) : null}
      <div className="relative h-full rounded-foco border border-foco-borda bg-foco-cartao/90">
        {children}
      </div>
    </div>
  );
}

const SELOS = {
  neutro: "border-slate-700 bg-slate-800/60 text-slate-300",
  ativo: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  ocioso: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  offline: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  ciano: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  roxo: "border-violet-500/30 bg-violet-500/10 text-violet-300",
} as const;

export function Selo({
  variante = "neutro",
  className,
  children,
}: {
  variante?: keyof typeof SELOS;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        SELOS[variante],
        className,
      )}
    >
      {children}
    </span>
  );
}

const BOTOES = {
  primario: "bg-cyan-500 text-slate-950 hover:bg-cyan-400 foco-glow",
  contorno: "border border-foco-borda bg-transparent text-slate-200 hover:bg-slate-800/60",
  fantasma: "text-slate-300 hover:bg-slate-800/60",
} as const;

const TAMANHOS = {
  md: "h-10 px-4",
  sm: "h-8 px-3 text-xs",
  icone: "h-9 w-9",
} as const;

export function Botao({
  variante = "primario",
  tamanho = "md",
  className,
  children,
  ...resto
}: {
  variante?: keyof typeof BOTOES;
  tamanho?: keyof typeof TAMANHOS;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...resto}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50",
        "disabled:pointer-events-none disabled:opacity-40",
        BOTOES[variante],
        TAMANHOS[tamanho],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Entrada({
  className,
  ...resto
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...resto}
      className={cn(
        "w-full rounded-lg border border-foco-borda bg-foco-suave px-3 py-2 text-sm text-slate-200 outline-none transition-colors",
        "placeholder:text-slate-600 hover:border-slate-600",
        "focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20",
        "[&::-webkit-calendar-picker-indicator]:invert-[0.7]",
        className,
      )}
    />
  );
}

export function Seletor({
  valor,
  aoMudar,
  opcoes,
  className,
  ...resto
}: {
  valor: string;
  aoMudar: (valor: string) => void;
  opcoes: { valor: string; rotulo: string }[];
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        className="w-full appearance-none rounded-lg border border-foco-borda bg-foco-suave px-3 py-2 pr-9 text-sm text-slate-200 outline-none transition-colors hover:border-slate-600 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20"
        {...resto}
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor} className="bg-foco-cartao">
            {opcao.rotulo}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

const LEDS = {
  ativo: "bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.7)]",
  ocioso: "bg-amber-400 shadow-[0_0_10px_2px_rgba(251,191,36,0.6)]",
  offline: "bg-rose-500 shadow-[0_0_8px_1px_rgba(244,63,94,0.5)]",
} as const;

/** Ponto LED verde/âmbar/vermelho, como na atividade em tempo real. */
export function IndicadorLed({ estado }: { estado: keyof typeof LEDS }) {
  return (
    <span className="relative inline-flex h-2.5 w-2.5">
      <span
        className={cn(
          "inline-flex h-2.5 w-2.5 rounded-full",
          LEDS[estado],
          estado === "ativo" && "foco-pulso",
        )}
      />
    </span>
  );
}

export function CabecalhoPagina({
  titulo,
  descricao,
  icone,
  voltarPara,
  acoes,
}: {
  titulo: string;
  descricao?: string;
  icone?: ReactNode;
  voltarPara?: { rotulo: string; aoVoltar: () => void };
  acoes?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        {voltarPara ? (
          <button
            type="button"
            onClick={voltarPara.aoVoltar}
            className="mb-1.5 inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-cyan-300"
          >
            <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
            {voltarPara.rotulo}
          </button>
        ) : null}
        <div className="flex items-center gap-2.5">
          {icone}
          <h3 className="truncate text-lg font-semibold text-slate-100">{titulo}</h3>
        </div>
        {descricao ? <p className="mt-1 text-sm text-slate-500">{descricao}</p> : null}
      </div>
      {acoes ? <div className="flex shrink-0 items-center gap-2">{acoes}</div> : null}
    </div>
  );
}

/** Estado vazio explicativo — diz o que fazer, não só que não há nada. */
export function EstadoVazio({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <Cartao className="flex flex-col items-center gap-2 p-10 text-center">
      <Info aria-hidden="true" className="h-5 w-5 text-slate-600" />
      <p className="text-sm font-medium text-slate-300">{titulo}</p>
      <p className="max-w-md text-xs leading-relaxed text-slate-500">{descricao}</p>
    </Cartao>
  );
}
