"use client";

/**
 * Filtros do topo das telas: o período num botão só (presets, setas e
 * intervalo livre num painel que abre embaixo, como o
 * `seletor-periodo-compacto` do painel) e os seletores de equipe e pessoa.
 */

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Download, UserRound, Users } from "lucide-react";
import { EQUIPES, HOJE, PESSOAS } from "./dados";
import { useFocus } from "./estado";
import { cn } from "./formato";
import {
  DIA_PRIMEIRO,
  PRESETS,
  criarPeriodo,
  ehPeriodoAtual,
  ehPrimeiroPeriodo,
  navegar,
  paraIso,
  rotuloIntervaloCurto,
} from "./motor";

export function SeletorPeriodo() {
  const { periodo, definirPeriodo } = useFocus();
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(evento: MouseEvent) {
      if (caixa.current && !caixa.current.contains(evento.target as Node)) setAberto(false);
    }
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAberto(false);
    }
    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  const voltarDesligado = ehPrimeiroPeriodo(periodo);
  const avancarDesligado = ehPeriodoAtual(periodo);

  return (
    <div className="relative" ref={caixa} data-tour="periodo">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-haspopup="dialog"
        className={cn(
          "flex h-10 items-center gap-2.5 rounded-lg border bg-white pl-3 pr-2.5 text-[13.5px] text-slate-900 transition-colors",
          aberto ? "border-foco-acao/60 ring-2 ring-foco-acao/15" : "border-foco-borda hover:border-slate-300",
        )}
      >
        <CalendarDays aria-hidden="true" className="h-4 w-4 text-slate-600" />
        <span className="foco-num whitespace-nowrap">{rotuloIntervaloCurto(periodo)}</span>
        <ChevronDown aria-hidden="true" className={cn("h-4 w-4 text-slate-500 transition-transform", aberto && "rotate-180")} />
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-label="Escolher período"
          className="absolute right-0 z-30 mt-2 w-[19.5rem] rounded-[0.625rem] border border-foco-borda bg-white p-4 shadow-[0_12px_32px_-8px_rgba(16,24,40,0.18)]"
        >
          <div className="grid grid-cols-3 gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.valor}
                type="button"
                onClick={() => definirPeriodo(criarPeriodo(p.valor, periodo))}
                className={cn(
                  "rounded-md px-2 py-1.5 text-[12.5px] transition-colors",
                  periodo.preset === p.valor ? "bg-foco-acao font-medium text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100",
                )}
              >
                {p.rotulo}
              </button>
            ))}
          </div>

          {periodo.preset !== "geral" && (
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                aria-label="Período anterior"
                disabled={voltarDesligado}
                onClick={() => definirPeriodo(navegar(periodo, -1))}
                className="rounded-md border border-foco-borda p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="foco-num text-[12.5px] text-slate-700">{rotuloIntervaloCurto(periodo)}</span>
              <button
                type="button"
                aria-label="Próximo período"
                disabled={avancarDesligado}
                onClick={() => definirPeriodo(navegar(periodo, 1))}
                className="rounded-md border border-foco-borda p-1.5 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {periodo.preset === "personalizado" && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-slate-600">
              <label className="flex flex-col gap-1">
                De
                <input
                  type="date"
                  min={paraIso(DIA_PRIMEIRO)}
                  max={HOJE}
                  value={periodo.de ?? periodo.ancora}
                  onChange={(e) => e.target.value && definirPeriodo({ ...periodo, de: e.target.value, ancora: e.target.value })}
                  className="rounded-md border border-foco-borda px-2 py-1.5 text-[12.5px] text-slate-900"
                />
              </label>
              <label className="flex flex-col gap-1">
                Até
                <input
                  type="date"
                  min={paraIso(DIA_PRIMEIRO)}
                  max={HOJE}
                  value={periodo.ate ?? periodo.ancora}
                  onChange={(e) => e.target.value && definirPeriodo({ ...periodo, ate: e.target.value })}
                  className="rounded-md border border-foco-borda px-2 py-1.5 text-[12.5px] text-slate-900"
                />
              </label>
            </div>
          )}

          <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
            O período atual para no relógio; a comparação usa o anterior cortado no mesmo ponto.
          </p>
        </div>
      )}
    </div>
  );
}

function Seletor({
  rotulo,
  Icone,
  valor,
  opcoes,
  aoMudar,
  largura,
}: {
  rotulo: string;
  Icone: typeof Users;
  valor: string;
  opcoes: { valor: string; rotulo: string }[];
  aoMudar: (valor: string) => void;
  largura: string;
}) {
  return (
    <label className={cn("relative flex h-10 items-center rounded-lg border border-foco-borda bg-white", largura)}>
      <span className="sr-only">{rotulo}</span>
      <Icone aria-hidden="true" className="pointer-events-none absolute left-3 h-4 w-4 text-slate-600" />
      <select
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        className="h-full w-full appearance-none rounded-lg bg-transparent pl-9 pr-8 text-[13.5px] text-slate-900 outline-none focus:ring-2 focus:ring-foco-acao/15"
      >
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 h-4 w-4 text-slate-500" />
    </label>
  );
}

export function SeletorEquipe() {
  const { escopo, definirEscopo } = useFocus();
  return (
    <Seletor
      rotulo="Equipe"
      Icone={Users}
      largura="w-52"
      valor={escopo.equipeId ?? "todos"}
      aoMudar={(v) => definirEscopo({ equipeId: v === "todos" ? null : v })}
      opcoes={[{ valor: "todos", rotulo: "Todas as equipes" }, ...EQUIPES.map((e) => ({ valor: e.id, rotulo: e.nome }))]}
    />
  );
}

export function SeletorPessoa() {
  const { escopo, definirEscopo } = useFocus();
  const pessoas = PESSOAS.filter((p) => !escopo.equipeId || p.equipeId === escopo.equipeId);
  return (
    <Seletor
      rotulo="Pessoa"
      Icone={UserRound}
      largura="w-48"
      valor={escopo.colaboradorId ?? "todos"}
      aoMudar={(v) => definirEscopo({ colaboradorId: v === "todos" ? null : v })}
      opcoes={[{ valor: "todos", rotulo: "Todas as pessoas" }, ...pessoas.map((p) => ({ valor: p.id, rotulo: p.nome }))]}
    />
  );
}

/** "Exportar": na réplica não gera arquivo, só explica o que sairia. */
export function BotaoExportar({ destaque = false, oQue = "o recorte da tela" }: { destaque?: boolean; oQue?: string }) {
  const { mostrarNota } = useFocus();
  return (
    <button
      type="button"
      onClick={() => mostrarNota(`No painel, isto baixa ${oQue} em XLSX ou CSV, com o mesmo período e filtros.`)}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3.5 text-[13.5px] font-medium transition-colors",
        destaque ? "bg-foco-acao text-white hover:bg-[#154b73]" : "border border-foco-acao/70 bg-white text-foco-acao hover:bg-foco-acao-suave",
      )}
    >
      <Download aria-hidden="true" className="h-4 w-4" />
      Exportar
    </button>
  );
}
