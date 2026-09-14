"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Palco que encaixa a réplica do sistema na largura disponível.
 *
 * A interface do CRM foi desenhada para 1.040px. Em telas estreitas, deixá-la
 * rolar de lado mostra uma fatia sem contexto — o visitante vê meia coluna de
 * um Kanban e não entende nada. Aqui ela é reduzida por inteiro, como a
 * fotografia de um produto: pequena, mas completa e legível como composição.
 *
 * Acima da largura natural não há redução nenhuma. O padrão é a do CRM; a
 * réplica do Focus passa a própria (`largura`), porque o painel dele tem
 * barra lateral e grade de cinco colunas que não cabem em 1.040px.
 */

export const LARGURA_BASE = 1040;

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

  const medir = useCallback(() => {
    const externo = externoRef.current;
    const interno = internoRef.current;
    if (!externo || !interno) return;

    const disponivel = externo.clientWidth;
    const nova = Math.min(1, disponivel / largura);

    setEscala(nova);
    // `offsetHeight` ignora o transform, então é a altura real do conteúdo.
    setAltura(interno.offsetHeight * nova);
    onScaleChange?.(nova);
  }, [onScaleChange, largura]);

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

  return (
    <div ref={externoRef} className={className} style={{ height: altura }}>
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
  );
}
