"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Lista que se renova sozinha (Animated List, do catálogo 21st.dev): os avisos
 * entram um a um, como chegariam no painel.
 *
 * Começa mostrando os primeiros itens — a página em repouso já está legível,
 * e a renovação é um detalhe, não a condição para ler. Parada para quem pede
 * menos movimento.
 */
export function ListaAnimada({
  itens,
  visiveis = 3,
  intervalo = 3200,
  className = "",
}: {
  itens: ReactNode[];
  visiveis?: number;
  intervalo?: number;
  className?: string;
}) {
  const [inicio, setInicio] = useState(0);

  useEffect(() => {
    if (itens.length <= visiveis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tempo = window.setInterval(
      () => setInicio((atual) => (atual + 1) % itens.length),
      intervalo,
    );

    return () => window.clearInterval(tempo);
  }, [itens.length, visiveis, intervalo]);

  const mostrados = Array.from({ length: Math.min(visiveis, itens.length) }, (_, posicao) => ({
    conteudo: itens[(inicio + posicao) % itens.length],
    chave: `${inicio}-${posicao}`,
  }));

  return (
    <ul className={`grid gap-2 ${className}`}>
      {mostrados.map(({ conteudo, chave }) => (
        <li key={chave} className="foco-entra">
          {conteudo}
        </li>
      ))}
    </ul>
  );
}
