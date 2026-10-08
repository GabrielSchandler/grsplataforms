"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MoveHorizontal } from "lucide-react";

/**
 * Palco que encaixa a réplica do sistema na largura disponível.
 *
 * A interface do CRM foi desenhada para 1.040px. Enquanto a redução é pequena,
 * ela encolhe por inteiro, como a fotografia de um produto. Abaixo de
 * `ESCALA_LEGIVEL` isso deixa de servir: num celular a tela inteira cabe, mas
 * vira miniatura — letra de 4px não mostra produto nenhum. Daí em diante o
 * palco para de encolher e passa a deslizar de lado, e um botão devolve a
 * visão da tela inteira para quem quer a composição.
 *
 * Acima da largura natural não há redução nenhuma. O padrão é a do CRM; as
 * réplicas do Focus e do Chat passam a própria (`largura`).
 */

export const LARGURA_BASE = 1040;

/** Menor escala em que o texto da réplica ainda se lê num celular. */
export const ESCALA_LEGIVEL = 0.7;

/** Marca o elemento que desliza, para o tour levar o destaque até a vista. */
export const ATRIBUTO_ROLAGEM = "data-palco-rolagem";

export function ScaledStage({
  children,
  className = "",
  onScaleChange,
  largura = LARGURA_BASE,
}: {
  children: ReactNode;
  className?: string;
  /** Avisa a escala vigente, para quem precisa converter medidas. */
  onScaleChange?: (escala: number) => void;
  /** Largura natural do conteúdo, em px. */
  largura?: number;
}) {
  const externoRef = useRef<HTMLDivElement>(null);
  const internoRef = useRef<HTMLDivElement>(null);
  const [escala, setEscala] = useState(1);
  const [altura, setAltura] = useState<number | undefined>(undefined);
  // Começa como o HTML do build (sem controles); a medida entra no efeito.
  const [estreito, setEstreito] = useState(false);
  const [ampliado, setAmpliado] = useState(true);

  const medir = useCallback(() => {
    const externo = externoRef.current;
    const interno = internoRef.current;
    if (!externo || !interno) return;

    const disponivel = externo.clientWidth;
    const cabe = Math.min(1, disponivel / largura);
    const apertado = cabe < ESCALA_LEGIVEL;
    const nova = apertado && ampliado ? ESCALA_LEGIVEL : cabe;

    setEstreito(apertado);
    setEscala(nova);
    // `offsetHeight` ignora o transform, então é a altura real do conteúdo.
    setAltura(interno.offsetHeight * nova);
    onScaleChange?.(nova);
  }, [onScaleChange, largura, ampliado]);

  useEffect(() => {
    medir();

    const externo = externoRef.current;
    const interno = internoRef.current;
    if (!externo || !interno) return;

    // Observa os dois: a largura disponível muda ao girar a tela, e a altura
    // do conteúdo muda a cada troca de tela do tour.
    const observador = new ResizeObserver(() => medir());
    observador.observe(externo);
    observador.observe(interno);

    return () => observador.disconnect();
  }, [medir]);

  const desliza = estreito && ampliado;

  return (
    <div className={className}>
      {estreito ? (
        <div className="flex items-center justify-between gap-3 px-1 pb-2 pt-0.5">
          <p className="flex min-w-0 items-center gap-1.5 text-[12px] leading-snug text-fog-400">
            {ampliado ? (
              <>
                <MoveHorizontal aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-fog-300" />
                Arraste para o lado
              </>
            ) : (
              "Tela inteira, reduzida"
            )}
          </p>
          <button
            type="button"
            onClick={() => setAmpliado((valor) => !valor)}
            aria-pressed={ampliado}
            className="shrink-0 rounded-md border border-ink-700 px-2.5 py-1.5 text-[12px] font-semibold text-white"
          >
            {ampliado ? "Ver tela inteira" : "Ampliar"}
          </button>
        </div>
      ) : null}

      <div
        ref={externoRef}
        {...{ [ATRIBUTO_ROLAGEM]: "" }}
        className={desliza ? "palco-desliza" : undefined}
        style={{
          height: altura,
          overflowX: desliza ? "auto" : "hidden",
          overflowY: "hidden",
        }}
      >
        <div
          ref={internoRef}
          style={{
            width: largura,
            transform: escala < 1 ? `scale(${escala})` : undefined,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
