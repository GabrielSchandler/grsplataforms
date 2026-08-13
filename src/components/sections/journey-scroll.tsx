"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/motion";
import { Eyebrow, Lead, SectionTitle } from "@/components/site/primitives";
import { journey } from "@/content/site";
import tamanhos from "@/content/screenshot-sizes.json";

const dimensoes: Record<string, { width: number; height: number }> = tamanhos;

/**
 * A jornada em rolagem guiada: o texto de cada fase passa pela coluna da
 * esquerda enquanto o painel da direita troca a tela do sistema.
 *
 * É a peça que carrega o argumento central — "cada etapa entrega a próxima" —
 * e por isso ganhou o tratamento mais forte da página. No celular vira uma
 * sequência simples, porque painel fixo em tela estreita atrapalha em vez de
 * ajudar.
 */
export function JourneyScroll() {
  const [ativo, setAtivo] = useState(0);
  const passos = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // A fase ativa é a que está mais próxima do meio da janela.
        const visiveis = entries.filter((entry) => entry.isIntersecting);
        if (visiveis.length === 0) return;

        const alvo = visiveis.reduce((melhor, atual) =>
          atual.intersectionRatio > melhor.intersectionRatio ? atual : melhor,
        );

        const indice = passos.current.indexOf(alvo.target as HTMLDivElement);
        if (indice >= 0) setAtivo(indice);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.5, 1] },
    );

    for (const passo of passos.current) {
      if (passo) observer.observe(passo);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="jornada" className="seam bg-ink-950 text-white">
      <div aria-hidden="true" className="seam-line text-white" />
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
        <Reveal>
          <Eyebrow>{journey.eyebrow}</Eyebrow>
          <SectionTitle className="max-w-3xl">{journey.title}</SectionTitle>
          <Lead>{journey.intro}</Lead>
        </Reveal>

        <div className="mt-16 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            {journey.phases.map((phase, index) => (
              <div
                key={phase.name}
                ref={(node) => {
                  passos.current[index] = node;
                }}
                className="flex min-h-[62vh] flex-col justify-center py-10 lg:py-0"
              >
                <div
                  className={`transition-opacity duration-500 ${
                    ativo === index ? "lg:opacity-100" : "lg:opacity-35"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-4xl font-semibold tabular-nums text-brand-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-px flex-1 origin-left bg-ink-700 transition-transform duration-700 ${
                        ativo === index ? "scale-x-100" : "scale-x-0 lg:scale-x-0"
                      }`}
                    />
                  </div>

                  <h3 className="font-display mt-5 text-2xl font-semibold sm:text-3xl">
                    {phase.name}
                  </h3>
                  <p className="measure mt-4 text-[15px] leading-relaxed text-fog-400 sm:text-base">
                    {phase.description}
                  </p>

                  <Link
                    href={phase.href}
                    className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold text-brand-300 underline-offset-4 hover:underline"
                  >
                    Ver em detalhe
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>

                  {/* No celular a tela acompanha o texto da própria fase. */}
                  <div className="mt-8 overflow-hidden rounded-lg border border-ink-700 bg-ink-900 p-1.5 lg:hidden">
                    <Image
                      src={`/img/telas/${phase.screenshot}.webp`}
                      alt={phase.alt}
                      width={dimensoes[phase.screenshot]?.width ?? 2048}
                      height={dimensoes[phase.screenshot]?.height ?? 995}
                      sizes="100vw"
                      className="w-full rounded"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Painel fixo: as telas se cruzam sem mover a página. */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative overflow-hidden rounded-lg border border-ink-700 bg-ink-900 p-2">
                {journey.phases.map((phase, index) => (
                  <Image
                    key={phase.screenshot}
                    src={`/img/telas/${phase.screenshot}.webp`}
                    alt={phase.alt}
                    width={dimensoes[phase.screenshot]?.width ?? 2048}
                    height={dimensoes[phase.screenshot]?.height ?? 995}
                    sizes="640px"
                    priority={index === 0}
                    className={`rounded transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      index === 0 ? "relative w-full" : "absolute inset-2 w-[calc(100%-1rem)]"
                    } ${
                      ativo === index
                        ? "z-10 scale-100 opacity-100 blur-0"
                        : "z-0 scale-[1.02] opacity-0 blur-[3px]"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2">
                {journey.phases.map((phase, index) => (
                  <span
                    key={phase.name}
                    aria-hidden="true"
                    className={`h-0.5 flex-1 rounded transition-colors duration-500 ${
                      ativo === index ? "bg-brand-500" : "bg-ink-700"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-[12px] text-fog-500">
                Fase {ativo + 1} de {journey.phases.length} · {journey.phases[ativo].name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
