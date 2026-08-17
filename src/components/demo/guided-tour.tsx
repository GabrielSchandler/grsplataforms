"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { DemoNavContext } from "./chrome";
import { screenMap } from "./screen-map";
import { tourSteps } from "@/content/tour";

/**
 * Tour guiado: percorre o caminho completo de um cliente, do lead que cai na
 * planilha ao número que a gestão lê no fim do mês.
 *
 * O passo fica na URL (`?passo=N`), então voltar e avançar no navegador
 * funcionam e um link pode apontar direto para uma etapa. Dentro do tour a
 * barra lateral da réplica não navega — quem manda é o roteiro.
 */

const PARAM = "passo";

function lerPassoDaUrl() {
  if (typeof window === "undefined") return 0;
  const bruto = new URLSearchParams(window.location.search).get(PARAM);
  const numero = Number(bruto);

  if (!Number.isFinite(numero)) return 0;
  return Math.min(Math.max(Math.trunc(numero) - 1, 0), tourSteps.length - 1);
}

export function GuidedTour() {
  const [indice, setIndice] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const jaMontou = useRef(false);

  // Sincroniza com a URL: primeiro na montagem, depois a cada voltar/avançar.
  useEffect(() => {
    setIndice(lerPassoDaUrl());
    jaMontou.current = true;

    function aoNavegar() {
      setIndice(lerPassoDaUrl());
    }

    window.addEventListener("popstate", aoNavegar);
    return () => window.removeEventListener("popstate", aoNavegar);
  }, []);

  const irPara = useCallback((proximo: number, empilhar = true) => {
    const alvo = Math.min(Math.max(proximo, 0), tourSteps.length - 1);
    setIndice(alvo);

    if (!empilhar || !jaMontou.current) return;

    const url = new URL(window.location.href);
    url.searchParams.set(PARAM, String(alvo + 1));
    window.history.pushState({ passo: alvo }, "", url);
  }, []);

  const passo = tourSteps[indice];
  const tela = screenMap[passo.screen];
  const Tela = tela.component;
  const progresso = ((indice + 1) / tourSteps.length) * 100;

  return (
    <div
      ref={containerRef}
      onKeyDown={(evento) => {
        if (evento.key === "ArrowRight") {
          evento.preventDefault();
          irPara(indice + 1);
        }
        if (evento.key === "ArrowLeft") {
          evento.preventDefault();
          irPara(indice - 1);
        }
      }}
    >
      {/* Explicação do passo, acima da tela: o visitante lê o que vai ver. */}
      <div className="flex flex-col gap-4 rounded-lg border border-ink-700 bg-ink-950 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded border border-brand-500/40 bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-300">
              {passo.department}
            </span>
            <span className="text-[12px] tabular-nums text-fog-500">
              Etapa {indice + 1} de {tourSteps.length}
            </span>
          </div>

          <h3 className="font-display mt-3 text-xl font-semibold text-white sm:text-2xl">
            {passo.title}
          </h3>
          <p className="measure mt-2 text-[15px] leading-relaxed text-fog-400">{passo.text}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => irPara(indice - 1)}
            disabled={indice === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-white transition-colors hover:border-fog-600 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <span className="sr-only">Etapa anterior</span>
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => irPara(indice + 1)}
            disabled={indice === tourSteps.length - 1}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Próxima
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => irPara(0)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-fog-300 transition-colors hover:border-fog-600 hover:text-white"
          >
            <span className="sr-only">Recomeçar o tour</span>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progresso: barra contínua e passos clicáveis, para pular etapas. */}
      <div className="mt-4">
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={tourSteps.length}
          aria-valuenow={indice + 1}
          aria-label="Progresso do tour"
          className="h-0.5 w-full overflow-hidden rounded bg-ink-700"
        >
          <div
            className="h-full bg-brand-500 transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${progresso}%` }}
          />
        </div>

        <div className="scroll-x mt-3 flex gap-1.5 pb-1">
          {tourSteps.map((etapa, posicao) => (
            <button
              key={`${etapa.screen}-${posicao}`}
              type="button"
              onClick={() => irPara(posicao)}
              aria-current={posicao === indice ? "step" : undefined}
              title={etapa.title}
              className={`h-7 shrink-0 rounded px-2.5 text-[11px] font-medium tabular-nums transition-colors ${
                posicao === indice
                  ? "bg-brand-500 text-white"
                  : posicao < indice
                    ? "bg-ink-700 text-fog-300 hover:text-white"
                    : "border border-ink-700 text-fog-500 hover:text-white"
              }`}
            >
              {posicao + 1}
            </button>
          ))}
        </div>
      </div>

      {/* A tela do passo. A chave força a transição a cada troca. */}
      <div className="scroll-x mt-4 rounded-lg border border-ink-700 bg-ink-900 p-2">
        <div
          key={indice}
          className="swap-in min-w-[1040px] overflow-hidden rounded border border-slate-200"
        >
          <DemoNavContext.Provider value={{ workspace: tela.workspace, active: tela.nav }}>
            <Tela />
          </DemoNavContext.Provider>
        </div>
      </div>
    </div>
  );
}
