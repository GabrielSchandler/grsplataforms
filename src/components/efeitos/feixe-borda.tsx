"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Feixe que percorre a borda (Border Beam, do catálogo 21st.dev), refeito à
 * mão: um quadrado com gradiente cônico gira atrás de uma moldura de 1px.
 *
 * Só `transform` anima, então o trabalho fica com o compositor e a rolagem da
 * página não sente. Fora da tela a animação para — animação que ninguém vê é
 * bateria gasta. Quem pede menos movimento vê a moldura parada, pelo CSS.
 */
export function MolduraFeixe({
  children,
  className = "",
  cor1 = "#22d3ee",
  cor2 = "#a78bfa",
  tamanho = "160%",
  duracao = "9s",
}: {
  children: ReactNode;
  className?: string;
  cor1?: string;
  cor2?: string;
  /** Lado do quadrado que gira, em relação à largura da moldura. */
  tamanho?: string;
  duracao?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const no = ref.current;
    if (!no) return;

    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(entrada.isIntersecting),
      { rootMargin: "120px" },
    );

    observador.observe(no);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`feixe-moldura p-px ${visivel ? "" : "feixe-pausado"} ${className}`}
    >
      <span
        aria-hidden="true"
        className="feixe-giro"
        style={
          {
            "--feixe-cor-1": cor1,
            "--feixe-cor-2": cor2,
            "--feixe-tamanho": tamanho,
            "--feixe-duracao": duracao,
          } as React.CSSProperties
        }
      />
      {children}
    </div>
  );
}
