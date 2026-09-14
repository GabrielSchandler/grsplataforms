"use client";

import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { EQUIPES, PESSOAS } from "./dados";
import { useFocus } from "./estado";
import { cn } from "./formato";
import { Botao, Entrada, Seletor } from "./kit";
import {
  PRESETS,
  criarPeriodo,
  ehPeriodoAtual,
  intervalo,
  navegar,
  paraIso,
  type Preset,
} from "./motor";
import { DISPOSITIVOS } from "./vivo";

/**
 * Barra de filtros do painel. No produto o estado vive na URL, para o recorte
 * ser compartilhável por link; aqui vive no estado da demonstração, que é o
 * equivalente possível dentro de uma página.
 *
 * O desenho é o do painel: no computador um cartão com tudo à vista; no
 * celular, uma faixa de uma linha e o resto numa folha que sobe do rodapé.
 */

export type CampoFiltro = "equipe" | "colaborador" | "dispositivo";

const CONTAGEM_EQUIPES = EQUIPES.map((equipe) => ({
  ...equipe,
  total: PESSOAS.filter((pessoa) => pessoa.equipeId === equipe.id).length,
}));

export function BarraFiltros({ campos = ["equipe", "colaborador"] }: { campos?: CampoFiltro[] }) {
  const { layout } = useFocus();
  return layout === "celular" ? (
    <FiltrosCelular campos={campos} />
  ) : (
    <FiltrosDesktop campos={campos} />
  );
}

function useFiltros() {
  const { periodo, escopo, definirPeriodo, definirEscopo } = useFocus();
  const iv = intervalo(periodo);

  const pessoasVisiveis = escopo.equipeId
    ? PESSOAS.filter((pessoa) => pessoa.equipeId === escopo.equipeId)
    : PESSOAS;

  const temFiltro = Boolean(escopo.equipeId || escopo.colaboradorId || escopo.dispositivoId);

  function escolherPreset(preset: Preset) {
    definirPeriodo(criarPeriodo(preset, periodo));
  }

  function limpar() {
    definirEscopo({ equipeId: null, colaboradorId: null, dispositivoId: null });
  }

  return { periodo, escopo, definirPeriodo, definirEscopo, iv, pessoasVisiveis, temFiltro, escolherPreset, limpar };
}

function CamposEscopo({ campos }: { campos: CampoFiltro[] }) {
  const { escopo, definirEscopo, pessoasVisiveis } = useFiltros();

  return (
    <>
      {campos.includes("equipe") ? (
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Equipe</span>
          <Seletor
            aria-label="Equipe"
            valor={escopo.equipeId ?? "todos"}
            aoMudar={(valor) => definirEscopo({ equipeId: valor === "todos" ? null : valor })}
            opcoes={[
              { valor: "todos", rotulo: "Todas as equipes" },
              ...CONTAGEM_EQUIPES.map((equipe) => ({
                valor: equipe.id,
                rotulo: `${equipe.nome} (${equipe.total})`,
              })),
            ]}
          />
        </label>
      ) : null}

      {campos.includes("colaborador") ? (
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Colaborador
          </span>
          <Seletor
            aria-label="Colaborador"
            valor={escopo.colaboradorId ?? "todos"}
            aoMudar={(valor) => definirEscopo({ colaboradorId: valor === "todos" ? null : valor })}
            opcoes={[
              { valor: "todos", rotulo: "Todos os colaboradores" },
              ...pessoasVisiveis.map((pessoa) => ({ valor: pessoa.id, rotulo: pessoa.nome })),
            ]}
          />
        </label>
      ) : null}

      {campos.includes("dispositivo") ? (
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Dispositivo
          </span>
          <Seletor
            aria-label="Dispositivo"
            valor={escopo.dispositivoId ?? "todos"}
            aoMudar={(valor) => definirEscopo({ dispositivoId: valor === "todos" ? null : valor })}
            opcoes={[
              { valor: "todos", rotulo: "Todos os dispositivos" },
              ...DISPOSITIVOS.map((dispositivo) => ({
                valor: dispositivo.id,
                rotulo: dispositivo.maquina,
              })),
            ]}
          />
        </label>
      ) : null}
    </>
  );
}

function SeletorPeriodo() {
  const { periodo, definirPeriodo, escolherPreset } = useFiltros();
  const noPresente = ehPeriodoAtual(periodo);
  const iv = intervalo(periodo);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1 rounded-lg border border-foco-borda bg-foco-suave p-1">
          {PRESETS.map((preset) => (
            <button
              key={preset.valor}
              type="button"
              onClick={() => escolherPreset(preset.valor)}
              aria-pressed={periodo.preset === preset.valor}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                periodo.preset === preset.valor
                  ? "bg-cyan-500/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
              )}
            >
              {preset.rotulo}
            </button>
          ))}
        </div>

        {periodo.preset !== "geral" ? (
          <div className="flex items-center gap-1">
            <Botao
              variante="contorno"
              tamanho="sm"
              aria-label="Período anterior"
              onClick={() => definirPeriodo(navegar(periodo, -1))}
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </Botao>

            <span className="min-w-[9rem] px-2 text-center text-sm font-medium text-slate-200">
              {iv.rotulo}
            </span>

            <Botao
              variante="contorno"
              tamanho="sm"
              aria-label="Próximo período"
              disabled={noPresente}
              onClick={() => definirPeriodo(navegar(periodo, 1))}
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </Botao>
          </div>
        ) : (
          <span className="flex items-center gap-1.5 px-2 text-sm text-slate-400">
            <CalendarDays aria-hidden="true" className="h-4 w-4 text-slate-500" />
            {iv.rotulo}
          </span>
        )}
      </div>

      {periodo.preset === "personalizado" ? <IntervaloLivre /> : null}
    </div>
  );
}

function IntervaloLivre() {
  const { periodo, definirPeriodo, iv } = useFiltros();
  const de = periodo.de ?? paraIso(iv.inicio);
  const ate = periodo.ate ?? paraIso(iv.fim);

  function aplicar(novoDe: string, novoAte: string) {
    if (!novoDe || !novoAte) return;
    const [inicio, fim] = novoDe <= novoAte ? [novoDe, novoAte] : [novoAte, novoDe];
    definirPeriodo({ preset: "personalizado", ancora: inicio, de: inicio, ate: fim });
  }

  return (
    <div className="flex flex-wrap items-end gap-2 rounded-lg border border-foco-borda bg-foco-suave/60 p-3">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-500">De</span>
        <Entrada
          type="date"
          value={de}
          max={ate}
          onChange={(evento) => aplicar(evento.target.value, ate)}
          className="w-40"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-slate-500">Até</span>
        <Entrada
          type="date"
          value={ate}
          min={de}
          onChange={(evento) => aplicar(de, evento.target.value)}
          className="w-40"
        />
      </label>
    </div>
  );
}

function FiltrosDesktop({ campos }: { campos: CampoFiltro[] }) {
  const { temFiltro, limpar } = useFiltros();
  const temEscopo = campos.length > 0;

  return (
    <section
      aria-label="Filtros do painel"
      className="flex flex-col gap-4 rounded-foco border border-foco-borda foco-vidro p-4"
      data-tour="filtros"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5" />
          Período
        </span>
        {temFiltro ? (
          <Botao variante="fantasma" tamanho="sm" onClick={limpar}>
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Limpar filtros
          </Botao>
        ) : null}
      </div>

      <SeletorPeriodo />

      {temEscopo ? (
        <div className="grid grid-cols-3 gap-3 border-t border-foco-borda pt-4">
          <CamposEscopo campos={campos} />
        </div>
      ) : null}
    </section>
  );
}

function FiltrosCelular({ campos }: { campos: CampoFiltro[] }) {
  const { periodo, escopo, definirPeriodo, iv, temFiltro, limpar } = useFiltros();
  const [aberta, setAberta] = useState(false);
  const noPresente = ehPeriodoAtual(periodo);
  const recortes = [escopo.equipeId, escopo.colaboradorId, escopo.dispositivoId].filter(Boolean).length;

  return (
    <div data-tour="filtros">
      <div className="flex items-center gap-2 rounded-foco border border-foco-borda foco-vidro p-1.5">
        <button
          type="button"
          aria-label="Período anterior"
          disabled={periodo.preset === "geral"}
          onClick={() => definirPeriodo(navegar(periodo, -1))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 disabled:opacity-30"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => setAberta(true)}
          className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg px-2 py-1"
        >
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-100">
            <CalendarDays aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
            <span className="truncate">{iv.rotulo}</span>
          </span>
          <span className="text-[10px] uppercase tracking-wide text-slate-500">
            tocar para filtrar
          </span>
        </button>

        <button
          type="button"
          aria-label="Próximo período"
          disabled={noPresente || periodo.preset === "geral"}
          onClick={() => definirPeriodo(navegar(periodo, 1))}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 disabled:opacity-30"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>

        {campos.length > 0 ? (
          <button
            type="button"
            aria-label="Filtros"
            onClick={() => setAberta(true)}
            className={cn(
              "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              recortes > 0 ? "text-cyan-300" : "text-slate-400",
            )}
          >
            <SlidersHorizontal aria-hidden="true" className="h-[18px] w-[18px]" />
            {recortes > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-semibold text-slate-950">
                {recortes}
              </span>
            ) : null}
          </button>
        ) : null}
      </div>

      {aberta ? (
        <div className="absolute inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setAberta(false)}
            className="absolute inset-0 bg-slate-950/70"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="absolute inset-x-0 bottom-0 flex max-h-[85%] flex-col rounded-t-3xl border-t border-foco-borda bg-foco-cartao"
          >
            <div className="shrink-0 px-5 pb-3 pt-3">
              <div className="mb-3 flex justify-center">
                <span className="h-1 w-10 rounded-full bg-slate-700" />
              </div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-100">Filtros</h2>
                <button
                  type="button"
                  onClick={() => setAberta(false)}
                  aria-label="Fechar"
                  className="rounded-lg p-2 text-slate-400"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="foco-rolagem min-h-0 flex-1 overflow-y-auto px-5">
              <section className="pb-2">
                <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Período
                </h3>
                <div className="mt-2">
                  <SeletorPeriodo />
                </div>
              </section>

              {campos.length > 0 ? (
                <section className="mt-5 space-y-3 border-t border-foco-borda pt-4">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Recorte
                  </h3>
                  <CamposEscopo campos={campos} />
                </section>
              ) : null}
            </div>

            <div className="shrink-0 border-t border-foco-borda px-5 pb-4 pt-3">
              <div className="flex gap-2">
                {temFiltro ? (
                  <Botao variante="contorno" className="flex-1" onClick={limpar}>
                    <RotateCcw aria-hidden="true" className="h-4 w-4" />
                    Limpar
                  </Botao>
                ) : null}
                <Botao className="flex-1" onClick={() => setAberta(false)}>
                  Ver resultados
                </Botao>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
