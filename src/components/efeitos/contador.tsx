"use client";

import { useEffect, useRef, useState } from "react";
import { useAntesDaPintura } from "@/lib/use-antes-da-pintura";

/**
 * Número que conta até o valor quando entra na tela (Number Ticker, do
 * catálogo 21st.dev).
 *
 * O HTML do build já traz o valor final: quem não tem JavaScript, ou pediu
 * menos movimento, lê o número certo. A contagem só começa se o elemento
 * ainda estiver fora da vista — animar o que já está sendo lido faria o
 * número piscar de zero na cara de quem chegou.
 */
export function Contador({
  valor,
  formatar = (n: number) => String(Math.round(n)),
  duracao = 1200,
  className = "",
}: {
  valor: number;
  formatar?: (valor: number) => string;
  duracao?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(valor);
  const anima = useRef(false);

  useAntesDaPintura(() => {
    const no = ref.current;
    if (!no) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const caixa = no.getBoundingClientRect();
    const jaVisivel = caixa.top < window.innerHeight && caixa.bottom > 0;
    if (jaVisivel) return;

    anima.current = true;
    setAtual(0);
  }, []);

  useEffect(() => {
    const no = ref.current;
    if (!no || !anima.current) return;

    let quadro = 0;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();

        const inicio = performance.now();
        const passo = (agora: number) => {
          const progresso = Math.min(1, (agora - inicio) / duracao);
          // Mesma curva do resto do site: começa rápido e assenta no fim.
          const suave = 1 - Math.pow(1 - progresso, 3);
          setAtual(valor * suave);
          if (progresso < 1) quadro = requestAnimationFrame(passo);
        };

        quadro = requestAnimationFrame(passo);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observador.observe(no);

    return () => {
      observador.disconnect();
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, [valor, duracao]);

  return (
    <span ref={ref} className={className}>
      {formatar(atual)}
    </span>
  );
}
