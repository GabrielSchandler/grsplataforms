"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { DemoNavContext } from "./chrome";
import { screenMap } from "./screen-map";
import { tourDepartments, tourSteps } from "@/content/tour";

/**
 * Tour guiado: percorre o caminho de um cliente, do lead que cai na planilha
 * ao número que a gestão lê no fim do mês.
 *
 * Três coisas fazem ele parecer produto e não slide:
 * 1. Anda sozinho, e para no primeiro sinal de que a pessoa assumiu o
 *    controle (clique, tecla ou ponteiro em cima).
 * 2. A troca de tela tem direção: avançar entra pela direita, voltar pela
 *    esquerda. Sem direção, o olho perde o fio.
 * 3. Escurece a tela e desenha um anel na parte que está sendo explicada.
 *    É o que transforma "olhe essa tela" em "olhe esta parte".
 *
 * O passo fica na URL (`?passo=N`), então voltar e avançar no navegador
 * funcionam e um link pode apontar direto para uma etapa.
 */

const PARAM = "passo";
const DURACAO = 7000;

const corDoDepartamento: Record<string, string> = {
  Marketing: "#c31230",
  Comercial: "#c31230",
  "Jurídico": "#1d4ed8",
  Financeiro: "#0f766e",
  "Gestão": "#b45309",
};

function lerPassoDaUrl() {
  if (typeof window === "undefined") return 0;
  const bruto = new URLSearchParams(window.location.search).get(PARAM);
  const numero = Number(bruto);

  if (!Number.isFinite(numero)) return 0;
  return Math.min(Math.max(Math.trunc(numero) - 1, 0), tourSteps.length - 1);
}

type Realce = { top: number; left: number; width: number; height: number } | null;

export function GuidedTour() {
  const [indice, setIndice] = useState(0);
  const [direcao, setDirecao] = useState<1 | -1>(1);
  const [tocando, setTocando] = useState(true);
  const [realce, setRealce] = useState<Realce>(null);

  const palcoRef = useRef<HTMLDivElement>(null);
  const roloRef = useRef<HTMLDivElement>(null);
  const jaMontou = useRef(false);

  /* ---------- estado na URL ---------- */

  useEffect(() => {
    setIndice(lerPassoDaUrl());
    jaMontou.current = true;

    function aoNavegar() {
      setIndice(lerPassoDaUrl());
    }

    window.addEventListener("popstate", aoNavegar);
    return () => window.removeEventListener("popstate", aoNavegar);
  }, []);

  const irPara = useCallback(
    (proximo: number, opcoes: { empilhar?: boolean; parar?: boolean } = {}) => {
      const { empilhar = true, parar = true } = opcoes;
      const alvo = Math.min(Math.max(proximo, 0), tourSteps.length - 1);

      setDirecao(alvo >= indice ? 1 : -1);
      setIndice(alvo);
      if (parar) setTocando(false);

      if (!empilhar || !jaMontou.current) return;

      const url = new URL(window.location.href);
      url.searchParams.set(PARAM, String(alvo + 1));
      window.history.pushState({ passo: alvo }, "", url);
    },
    [indice],
  );

  /* ---------- reprodução automática ---------- */

  useEffect(() => {
    if (!tocando) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tempo = window.setTimeout(() => {
      const proximo = indice + 1;

      if (proximo >= tourSteps.length) {
        setTocando(false);
        return;
      }

      // Avanço automático não empilha histórico: encheria o botão voltar.
      setDirecao(1);
      setIndice(proximo);

      const url = new URL(window.location.href);
      url.searchParams.set(PARAM, String(proximo + 1));
      window.history.replaceState({ passo: proximo }, "", url);
    }, DURACAO);

    return () => window.clearTimeout(tempo);
  }, [indice, tocando]);

  /* ---------- realce ---------- */

  const passo = tourSteps[indice];
  const tela = screenMap[passo.screen];
  const Tela = tela.component;

  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco) return;

    if (!passo.highlight) {
      setRealce(null);
      return;
    }

    // Espera a tela nova pintar antes de medir.
    const id = window.setTimeout(() => {
      const alvo = palco.querySelector<HTMLElement>(`[data-tour="${passo.highlight}"]`);

      if (!alvo) {
        setRealce(null);
        return;
      }

      const caixa = alvo.getBoundingClientRect();
      const base = palco.getBoundingClientRect();
      const margem = 8;

      setRealce({
        top: caixa.top - base.top - margem,
        left: caixa.left - base.left - margem,
        width: caixa.width + margem * 2,
        height: caixa.height + margem * 2,
      });

      // Traz o destaque para dentro da área visível na horizontal.
      const rolo = roloRef.current;
      if (rolo) {
        const alvoNoRolo = caixa.left - base.left;
        const centro = alvoNoRolo - rolo.clientWidth / 2 + caixa.width / 2;
        rolo.scrollTo({ left: Math.max(0, centro), behavior: "smooth" });
      }
    }, 260);

    return () => window.clearTimeout(id);
  }, [indice, passo.highlight]);

  const cor = corDoDepartamento[passo.department] ?? "#c31230";

  return (
    <div
      onMouseEnter={() => setTocando(false)}
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
      {/* Explicação do passo */}
      <div className="relative overflow-hidden rounded-lg border border-ink-700 bg-ink-950 p-5">
        {/* Barra de tempo do avanço automático, no topo do cartão. */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-ink-800">
          <div
            key={`${indice}-${tocando}`}
            className="h-full origin-left"
            style={{
              backgroundColor: cor,
              width: "100%",
              animation: tocando ? `tour-timer ${DURACAO}ms linear both` : "none",
              transform: tocando ? undefined : "scaleX(0)",
            }}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div key={indice} className="swap-in min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: cor }}
              >
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
              onClick={() => setTocando((valor) => !valor)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-white transition-colors hover:border-fog-600"
            >
              <span className="sr-only">{tocando ? "Pausar o tour" : "Reproduzir o tour"}</span>
              {tocando ? (
                <Pause aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Play aria-hidden="true" className="h-4 w-4" />
              )}
            </button>

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
      </div>

      {/* Trilha agrupada por área: mostra onde a etapa está no arco todo. */}
      <div className="scroll-x mt-4 flex items-end gap-4 pb-1">
        {tourDepartments.map((area) => {
          const etapas = tourSteps
            .map((etapa, posicao) => ({ etapa, posicao }))
            .filter(({ etapa }) => etapa.department === area);

          if (etapas.length === 0) return null;
          const ativa = etapas.some(({ posicao }) => posicao === indice);

          return (
            <div key={area} className="shrink-0">
              <p
                className={`mb-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                  ativa ? "text-white" : "text-fog-400"
                }`}
              >
                {area}
              </p>
              <div className="flex gap-1">
                {etapas.map(({ etapa, posicao }) => (
                  <button
                    key={`${etapa.screen}-${posicao}`}
                    type="button"
                    onClick={() => irPara(posicao)}
                    aria-current={posicao === indice ? "step" : undefined}
                    title={etapa.title}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      posicao === indice
                        ? "w-10"
                        : posicao < indice
                          ? "w-5 bg-fog-500"
                          : "w-5 bg-ink-700 hover:bg-fog-600"
                    }`}
                    style={posicao === indice ? { backgroundColor: cor } : undefined}
                  >
                    <span className="sr-only">
                      Etapa {posicao + 1}: {etapa.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* A tela, com o realce por cima */}
      <div ref={roloRef} className="scroll-x mt-4 rounded-lg border border-ink-700 bg-ink-900 p-2">
        <div ref={palcoRef} className="relative min-w-[1040px]">
          <div
            key={indice}
            className={`overflow-hidden rounded border border-slate-200 ${
              direcao === 1 ? "slide-from-right" : "slide-from-left"
            }`}
          >
            <DemoNavContext.Provider value={{ workspace: tela.workspace, active: tela.nav }}>
              <Tela />
            </DemoNavContext.Provider>
          </div>

          {realce ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute rounded transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                top: realce.top,
                left: realce.left,
                width: realce.width,
                height: realce.height,
                border: `2px solid ${cor}`,
                // Escurece tudo o que está fora do anel, sem máscara.
                boxShadow: `0 0 0 9999px rgba(10, 10, 11, 0.55), 0 0 24px ${cor}55`,
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
