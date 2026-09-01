"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { DemoNavContext } from "./chrome";
import { ScaledStage } from "./scaled-stage";
import { screenMap } from "./screen-map";
import { tourDepartments, tourSteps } from "@/content/tour";
import { useAntesDaPintura } from "@/lib/use-antes-da-pintura";

/**
 * Tour guiado: percorre o caminho de um cliente, do lead que cai na planilha
 * ao número que a gestão lê no fim do mês.
 *
 * A explicação não fica num cartão à parte: ela mora **dentro da área
 * escurecida da própria tela**, ancorada ao ponto destacado, como um tour de
 * produto de verdade. O olho não precisa sair da interface para ler.
 *
 * `?passo=N` abre direto na etapa pedida, para um link compartilhado levar a
 * pessoa ao ponto certo. Sem o parâmetro, começa em 1.
 *
 * Nada aqui escreve na URL durante o uso, e essa é uma decisão: manter o
 * histórico sincronizado com as etapas exigia disputar o controle da pilha
 * com o roteador do Next, e o resultado era o botão voltar saltando para um
 * ponto arbitrário. Sem escrita, o comportamento fica previsível — recarregar
 * volta ao começo e o voltar sai da página, como em qualquer outra seção.
 */

const PARAM = "passo";
const DURACAO = 7200;

/** Cor de cada área, para o realce e o rótulo mudarem junto com o assunto. */
const corDoDepartamento: Record<string, string> = {
  Marketing: "#c31230",
  Comercial: "#c31230",
  Jurídico: "#3b6ef0",
  Financeiro: "#12a594",
  Gestão: "#d98324",
};

type Caixa = { top: number; left: number; width: number; height: number };

const LARGURA_LEGENDA = 340;
const ALTURA_ESTIMADA = 200;
const MARGEM = 24;
/** Faixa da base ocupada pelos controles flutuantes. */
const RESERVA_CONTROLES = 80;

const limitar = (valor: number, minimo: number, maximo: number) =>
  Math.min(Math.max(valor, minimo), Math.max(minimo, maximo));

/**
 * Escolhe onde a legenda cabe sem tapar o que está sendo explicado: tenta
 * abaixo, acima, à esquerda e à direita do realce, nessa ordem, e só então
 * cai no canto superior esquerdo.
 */
function posicionarLegenda(
  anel: Caixa,
  base: { width: number; height: number },
) {
  const alturaUtil = base.height - RESERVA_CONTROLES;
  const esquerdaAlinhada = limitar(
    anel.left,
    MARGEM,
    base.width - LARGURA_LEGENDA - MARGEM,
  );
  const topoAlinhado = limitar(anel.top, MARGEM, alturaUtil - ALTURA_ESTIMADA);

  const abaixo = base.height - (anel.top + anel.height);
  if (abaixo >= ALTURA_ESTIMADA + MARGEM + RESERVA_CONTROLES) {
    return { top: anel.top + anel.height + MARGEM, left: esquerdaAlinhada };
  }

  if (anel.top >= ALTURA_ESTIMADA + MARGEM) {
    return { top: anel.top - ALTURA_ESTIMADA - MARGEM, left: esquerdaAlinhada };
  }

  if (anel.left >= LARGURA_LEGENDA + MARGEM * 2) {
    return { top: topoAlinhado, left: anel.left - LARGURA_LEGENDA - MARGEM };
  }

  const direita = base.width - (anel.left + anel.width);
  if (direita >= LARGURA_LEGENDA + MARGEM * 2) {
    return { top: topoAlinhado, left: anel.left + anel.width + MARGEM };
  }

  return { top: MARGEM, left: MARGEM };
}

/**
 * Le a etapa pedida na URL. Serve a link compartilhado (`?passo=14`), e nao a
 * recarregamento comum: o avanco automatico nao escreve o parametro, entao
 * uma pagina recarregada sem link explicito volta para a etapa 1.
 *
 * Valor invalido, abaixo de 1 ou acima do total cai na etapa 1.
 */
function etapaInicial() {
  if (typeof window === "undefined") return 0;

  const bruto = new URLSearchParams(window.location.search).get(PARAM);
  if (bruto === null) return 0;

  const numero = Number(bruto);
  if (!Number.isInteger(numero) || numero < 1 || numero > tourSteps.length) {
    return 0;
  }

  return numero - 1;
}

export function GuidedTour() {
  // O estado inicial e sempre a etapa 1, igual ao HTML gerado no build. A
  // etapa pedida na URL entra logo abaixo, em efeito de layout: ler
  // `window` durante a renderizacao fazia o cliente desenhar diferente do
  // servidor e quebrava a hidratacao (erro #418 do React, reproduzivel em
  // /?passo=9). O efeito roda antes da pintura, entao a etapa 1 nao chega
  // a aparecer.
  const [indice, setIndice] = useState(0);
  const [direcao, setDirecao] = useState<1 | -1>(1);
  // Link para uma etapa especifica quer aquela etapa, nao um filme rodando.
  const [tocando, setTocando] = useState(true);

  useAntesDaPintura(() => {
    const pedida = etapaInicial();
    if (pedida === 0) return;

    setIndice(pedida);
    setTocando(false);
  }, []);
  const [realce, setRealce] = useState<Caixa | null>(null);
  const [legenda, setLegenda] = useState<{ top: number; left: number } | null>(
    null,
  );

  const palcoRef = useRef<HTMLDivElement>(null);
  const roloRef = useRef<HTMLDivElement>(null);
  // O palco encolhe em tela estreita; as medidas do realce precisam voltar
  // para a escala natural, senão o anel sai menor que o alvo.
  const escalaRef = useRef(1);

  const irPara = useCallback(
    (proximo: number, opcoes: { parar?: boolean } = {}) => {
      const { parar = true } = opcoes;
      const alvo = Math.min(Math.max(proximo, 0), tourSteps.length - 1);

      setDirecao(alvo >= indice ? 1 : -1);
      setIndice(alvo);
      if (parar) setTocando(false);
    },
    [indice],
  );

  /* ---------- reprodução automática ---------- */

  useEffect(() => {
    if (!tocando) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tempo = window.setTimeout(() => {
      if (indice + 1 >= tourSteps.length) {
        setTocando(false);
        return;
      }

      setDirecao(1);
      setIndice(indice + 1);
    }, DURACAO);

    return () => window.clearTimeout(tempo);
  }, [indice, tocando]);

  /* ---------- medida do realce e da legenda ---------- */

  const passo = tourSteps[indice];
  const tela = screenMap[passo.screen];
  const Tela = tela.component;
  const cor = corDoDepartamento[passo.department] ?? "#c31230";

  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco) return;

    const id = window.setTimeout(() => {
      const alvo = passo.highlight
        ? palco.querySelector<HTMLElement>(`[data-tour="${passo.highlight}"]`)
        : null;

      const base = palco.getBoundingClientRect();

      if (!alvo) {
        setRealce(null);
        setLegenda({ top: MARGEM, left: MARGEM });
        return;
      }

      const caixa = alvo.getBoundingClientRect();
      const escala = escalaRef.current || 1;
      const margem = 10;
      const anel: Caixa = {
        top: (caixa.top - base.top) / escala - margem,
        left: (caixa.left - base.left) / escala - margem,
        width: caixa.width / escala + margem * 2,
        height: caixa.height / escala + margem * 2,
      };
      setRealce(anel);

      setLegenda(
        posicionarLegenda(anel, {
          width: base.width / escala,
          height: base.height / escala,
        }),
      );

      const rolo = roloRef.current;
      if (rolo) {
        const centro = anel.left + anel.width / 2 - rolo.clientWidth / 2;
        rolo.scrollTo({ left: Math.max(0, centro), behavior: "smooth" });
      }
    }, 300);

    return () => window.clearTimeout(id);
  }, [indice, passo.highlight]);

  const conteudoLegenda = (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className="rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white"
          style={{ backgroundColor: cor }}
        >
          {passo.department}
        </span>
        <span className="text-[12px] tabular-nums text-fog-400">
          Etapa {indice + 1} de {tourSteps.length}
        </span>
      </div>
      <h3 className="font-display mt-3 text-xl leading-snug font-semibold text-white">
        {passo.title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-fog-300">
        {passo.text}
      </p>
    </>
  );

  return (
    <div onMouseEnter={() => setTocando(false)}>
      {/* Trilha por área, acima da cena */}
      <div className="scroll-x flex items-end gap-3 pb-1 sm:gap-4">
        {tourDepartments.map((area) => {
          const etapas = tourSteps
            .map((etapa, posicao) => ({ etapa, posicao }))
            .filter(({ etapa }) => etapa.department === area);

          if (etapas.length === 0) return null;
          const ativa = etapas.some(({ posicao }) => posicao === indice);

          return (
            <div key={area} className="shrink-0">
              <p
                className={`mb-1.5 text-[9px] font-semibold uppercase tracking-wide transition-colors sm:text-[10px] ${
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
                    className={`h-1.5 rounded transition-all duration-500 ${
                      posicao === indice
                        ? "w-8 sm:w-10"
                        : posicao < indice
                          ? "w-4 bg-fog-500 sm:w-5"
                          : "w-4 bg-ink-700 hover:bg-fog-600 sm:w-5"
                    }`}
                    style={
                      posicao === indice ? { backgroundColor: cor } : undefined
                    }
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

      {/* A cena: tela do sistema, escurecimento, realce e legenda */}
      <div
        ref={roloRef}
        className="mt-4 overflow-hidden rounded-lg border border-ink-700 bg-ink-900 p-2"
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
        <ScaledStage onScaleChange={(valor) => (escalaRef.current = valor)}>
          <div ref={palcoRef} className="relative overflow-hidden rounded">
            <div
              key={indice}
              className={`overflow-hidden rounded border border-slate-200 ${
                direcao === 1 ? "slide-from-right" : "slide-from-left"
              }`}
            >
              <DemoNavContext.Provider
                value={{ workspace: tela.workspace, active: tela.nav }}
              >
                <Tela />
              </DemoNavContext.Provider>
            </div>

            {/* Anel de destaque. O box-shadow gigante escurece todo o resto. */}
            {realce ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute z-10 rounded transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  top: realce.top,
                  left: realce.left,
                  width: realce.width,
                  height: realce.height,
                  border: `2px solid ${cor}`,
                  boxShadow: `0 0 0 9999px rgba(8, 8, 10, 0.74), 0 0 30px ${cor}66`,
                }}
              />
            ) : null}

            {/* A explicação, sobre a área escurecida */}
            {legenda ? (
              <div
                key={`legenda-${indice}`}
                data-tour-caption="desktop"
                // Fundo sólido, não translúcido: sobre a tela do sistema, vidro
                // fosco deixa o texto competindo com a interface por trás.
                className="swap-slide pointer-events-none absolute z-20 hidden rounded-lg border border-ink-700 bg-ink-950 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.85)] lg:block"
                style={{
                  top: legenda.top,
                  left: legenda.left,
                  width: LARGURA_LEGENDA,
                  borderLeft: `3px solid ${cor}`,
                }}
              >
                {conteudoLegenda}
              </div>
            ) : null}

            {/* Controles flutuantes, também sobre o escuro */}
            <div className="absolute inset-x-0 bottom-5 z-30 hidden justify-center lg:flex">
              <div className="flex items-center gap-1 rounded-lg border border-ink-700 bg-ink-950 p-1.5 shadow-[0_16px_44px_rgba(0,0,0,0.75)]">
                <button
                  type="button"
                  onClick={() => irPara(indice - 1)}
                  disabled={indice === 0}
                  className="inline-flex h-9 w-9 items-center justify-center rounded text-white transition-colors hover:bg-white/10 disabled:opacity-30"
                >
                  <span className="sr-only">Etapa anterior</span>
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setTocando((valor) => !valor)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded text-white transition-colors hover:bg-white/10"
                >
                  <span className="sr-only">
                    {tocando ? "Pausar" : "Reproduzir"}
                  </span>
                  {tocando ? (
                    <Pause aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Play aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>

                <span className="px-2 text-[12px] tabular-nums text-fog-400">
                  {indice + 1}/{tourSteps.length}
                </span>

                <button
                  type="button"
                  onClick={() => irPara(indice + 1)}
                  disabled={indice === tourSteps.length - 1}
                  className="inline-flex h-9 items-center gap-1.5 rounded px-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-30"
                >
                  Próxima
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => irPara(0)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded text-fog-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <span className="sr-only">Recomeçar</span>
                  <RotateCcw aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tempo do avanço automático, rente à base da cena */}
            <div className="absolute inset-x-0 bottom-0 z-30 h-0.5 bg-white/10">
              <div
                key={`tempo-${indice}-${tocando}`}
                className="h-full origin-left"
                style={{
                  backgroundColor: cor,
                  animation: tocando
                    ? `tour-timer ${DURACAO}ms linear both`
                    : "none",
                  transform: tocando ? undefined : "scaleX(0)",
                }}
              />
            </div>
          </div>
        </ScaledStage>
      </div>

      {/* No celular a legenda e os controles ficam abaixo da cena: sobrepor
          texto numa tela que já rola de lado atrapalharia a leitura. */}
      <div
        data-tour-caption="mobile"
        className="mt-4 rounded-lg border border-ink-700 bg-ink-950 p-5 lg:hidden"
      >
        {conteudoLegenda}

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => irPara(indice - 1)}
            disabled={indice === 0}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-white disabled:opacity-30"
          >
            <span className="sr-only">Etapa anterior</span>
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => irPara(indice + 1)}
            disabled={indice === tourSteps.length - 1}
            className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 text-sm font-semibold text-white disabled:opacity-30"
          >
            Próxima
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => irPara(0)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 text-fog-300"
          >
            <span className="sr-only">Recomeçar</span>
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
