"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * O movimento da cena 3D do topo (`CenaProduto`).
 *
 * Este componente não desenha nada: ele só escreve três variáveis CSS no
 * próprio elemento, e o CSS (`.c3` em `globals.css`) monta as transformações
 * a partir delas. O desenho fica todo com o compositor.
 *
 * - `--p`  rolagem: 0 com a cena na posição de repouso; até 1 quando ela sai
 *          por cima; até -0,6 enquanto ela ainda vem subindo por baixo (no
 *          celular a cena começa abaixo da dobra).
 * - `--mx` / `--my`  ponteiro, de -1 a 1. Só com mouse; no toque fica 0.
 *
 * Sem JavaScript, ou com `prefers-reduced-motion: reduce`, as variáveis ficam
 * no valor do CSS (0) e a cena aparece parada na pose de repouso — com luz e
 * sombra, só sem movimento. Nada aqui muda o HTML, então não há risco de
 * erro de hidratação.
 *
 * A leitura do valor-alvo acontece no evento; a escrita, uma vez por quadro,
 * com amortecimento (o objeto "pesa" um pouco, em vez de grudar no dedo).
 * O laço para sozinho quando chega no alvo e quando a cena sai da tela.
 */

const AMORTECIMENTO = 0.12;
const PONTEIRO_AMORTECIMENTO = 0.08;

function limitar(valor: number, min: number, max: number) {
  return Math.min(max, Math.max(min, valor));
}

export function CenaMovimento({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const no = ref.current;
    if (!no) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const comMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let alvoP = 0;
    let p = 0;
    let alvoX = 0;
    let alvoY = 0;
    let x = 0;
    let y = 0;
    let quadro = 0;
    let naTela = true;

    function lerRolagem() {
      if (!no) return;
      const caixa = no.getBoundingClientRect();
      const altura = window.innerHeight || 1;
      // Centro da cena em relação à janela: 0 no topo, 1 na base.
      const centro = (caixa.top + caixa.height / 2) / altura;
      // Repouso com o centro um pouco acima do meio da tela.
      alvoP = limitar((0.56 - centro) / 0.62, -0.6, 1);
    }

    function desenhar() {
      quadro = 0;
      if (!no) return;

      p += (alvoP - p) * AMORTECIMENTO;
      x += (alvoX - x) * PONTEIRO_AMORTECIMENTO;
      y += (alvoY - y) * PONTEIRO_AMORTECIMENTO;

      no.style.setProperty("--p", p.toFixed(4));
      no.style.setProperty("--mx", x.toFixed(4));
      no.style.setProperty("--my", y.toFixed(4));

      const parado =
        Math.abs(alvoP - p) < 0.0005 && Math.abs(alvoX - x) < 0.0005 && Math.abs(alvoY - y) < 0.0005;
      if (!parado && naTela) quadro = requestAnimationFrame(desenhar);
    }

    function pedirQuadro() {
      if (!quadro && naTela) quadro = requestAnimationFrame(desenhar);
    }

    function aoRolar() {
      lerRolagem();
      pedirQuadro();
    }

    function aoMoverPonteiro(evento: PointerEvent) {
      if (evento.pointerType !== "mouse") return;
      alvoX = limitar((evento.clientX / window.innerWidth - 0.5) * 2, -1, 1);
      alvoY = limitar((evento.clientY / window.innerHeight - 0.5) * 2, -1, 1);
      pedirQuadro();
    }

    function aoSairDaJanela() {
      alvoX = 0;
      alvoY = 0;
      pedirQuadro();
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        naTela = entrada.isIntersecting;
        if (naTela) aoRolar();
      },
      { rootMargin: "120px 0px" },
    );
    observador.observe(no);

    // Começa já no lugar certo (a página pode abrir rolada, ao voltar).
    lerRolagem();
    p = alvoP;
    desenhar();

    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar, { passive: true });
    if (comMouse) {
      window.addEventListener("pointermove", aoMoverPonteiro, { passive: true });
      document.documentElement.addEventListener("pointerleave", aoSairDaJanela);
    }

    return () => {
      observador.disconnect();
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      window.removeEventListener("pointermove", aoMoverPonteiro);
      document.documentElement.removeEventListener("pointerleave", aoSairDaJanela);
      if (quadro) cancelAnimationFrame(quadro);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
