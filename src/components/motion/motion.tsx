"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Primitivas de movimento do site.
 *
 * Regras que valem para todas:
 * - só transform, opacity, clip-path e filter — nada que force recálculo de
 *   layout durante a rolagem;
 * - um único IntersectionObserver compartilhado, em vez de um por elemento;
 * - o estado inicial escondido mora no CSS, dentro de
 *   `prefers-reduced-motion: no-preference`. Quem pede menos movimento vê a
 *   página pronta mesmo que este JavaScript não execute.
 */

let sharedObserver: IntersectionObserver | null = null;

function getObserver() {
  if (typeof window === "undefined") return null;

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      // Dispara um pouco antes de entrar por inteiro: o elemento termina de
      // aparecer quando o olho chega nele, e não depois.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );
  }

  return sharedObserver;
}

type RevealProps = {
  children: ReactNode;
  /** up: sobe · rise: sobe mais, com desfoque · wipe: cortina · line: risca */
  variant?: "up" | "rise" | "wipe" | "line";
  /** Atraso em milissegundos, para escalonar itens de uma mesma lista. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span" | "p" | "h2" | "figure";
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = getObserver();

    if (!observer) {
      node.classList.add("is-visible");
      return;
    }

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  // A tag é escolhida por quem usa o componente, então o tipo do ref muda
  // conforme o caso. ElementType permite a variação sem espalhar genéricos.
  const Component = as as React.ElementType;

  return (
    <Component
      ref={(node: HTMLElement | null) => {
        ref.current = node;
      }}
      data-reveal={variant}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Component>
  );
}

/** Fio de progresso da leitura, no topo da janela. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const node = ref.current;
      if (!node) return;

      const rolavel = document.documentElement.scrollHeight - window.innerHeight;
      const razao = rolavel > 0 ? window.scrollY / rolavel : 0;
      node.style.transform = `scaleX(${Math.min(1, Math.max(0, razao))})`;
    }

    function onScroll() {
      // Uma leitura por quadro: evita trabalho repetido durante a rolagem.
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-0.5">
      <div
        ref={ref}
        className="h-full origin-left bg-brand-500"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/**
 * Realce que segue o ponteiro. As coordenadas vão para variáveis CSS, então
 * o desenho fica com o compositor e nada é recalculado no JavaScript.
 * Não faz nada em tela sensível ao toque, onde não existe ponteiro.
 */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAtivo(true);
  }, []);

  return (
    <div
      ref={ref}
      onPointerMove={
        ativo
          ? (event) => {
              const node = ref.current;
              if (!node) return;
              const rect = node.getBoundingClientRect();
              node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
              node.style.setProperty("--my", `${event.clientY - rect.top}px`);
            }
          : undefined
      }
      className={`relative ${ativo ? "spotlight" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Camada que desliza mais devagar que a página. Usada só na cena do hero:
 * o deslocamento é sutil de propósito, porque parallax exagerado envelhece
 * rápido e atrapalha a leitura.
 */
export function ParallaxLayer({
  children,
  speed = 0.12,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    function update() {
      frame = 0;
      const node = ref.current;
      if (!node) return;

      // Só trabalha enquanto a cena está por perto da janela.
      const rect = node.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;

      node.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Costura fina entre seções, com o traço vermelho da marca à esquerda. */
export function Seam() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="seam-line" />
    </div>
  );
}
