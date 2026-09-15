"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Contador } from "@/components/efeitos/contador";
import { Reveal } from "@/components/motion/motion";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { focusDemo, focusHero, focusMensagens, focusNumeros } from "@/content/focus";
import { whatsappLink } from "@/lib/site-config";
import { ProvedorFocus, useFocus } from "./demo/estado";
import { GraficoArea } from "./demo/graficos";
import { IndicadoresFocus } from "./demo/kpis";
import { SistemaFocus } from "./demo/sistema-focus";

/**
 * Primeira dobra da página do Focus.
 *
 * A cena da direita não é ilustração: é o painel de verdade, com os mesmos
 * números da demonstração logo abaixo. Quem rolar a página encontra a mesma
 * tela, agora para clicar.
 */
export function HeroFocus() {
  const testeHref = whatsappLink(focusMensagens.teste);

  return (
    <section id="topo" className="relative isolate overflow-hidden bg-ink-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* Malha de pontos, desbotando para as bordas. */}
        <div
          className="padrao-pontos absolute inset-0 opacity-70"
          style={{
            maskImage: "radial-gradient(70% 60% at 65% 35%, black, transparent)",
            WebkitMaskImage: "radial-gradient(70% 60% at 65% 35%, black, transparent)",
          }}
        />
        {/* Brilho do produto: ciano e violeta são as cores do Focus, e aqui
            elas aparecem só como atmosfera atrás do painel. */}
        <div className="absolute -right-24 top-10 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/40" />
      </div>

      {/* A cena: o painel em perspectiva, saindo pela direita. */}
      <div
        aria-hidden="true"
        inert
        className="hero-panel pointer-events-none absolute -bottom-[6%] right-[-10%] hidden w-[56%] select-none lg:block"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 20%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 20%)",
        }}
      >
        <div className="overflow-hidden rounded-lg border border-foco-borda shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
          <PreviaPainel />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[86vh] w-full max-w-6xl flex-col justify-center px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
        <div className="max-w-xl lg:max-w-[34rem] xl:max-w-2xl">
          <div className="hero-in">
            <Eyebrow>{focusHero.eyebrow}</Eyebrow>
          </div>

          <div className="hero-in" style={{ "--delay": "70ms" } as React.CSSProperties}>
            <h1 className="font-display mt-6 text-4xl leading-[1.05] font-semibold text-white sm:text-5xl lg:text-[3.4rem]">
              {focusHero.title}
            </h1>
          </div>

          <div className="hero-in" style={{ "--delay": "150ms" } as React.CSSProperties}>
            <p className="measure mt-6 text-lg leading-relaxed text-fog-300">
              {focusHero.subtitle}
            </p>
          </div>

          <div className="hero-in" style={{ "--delay": "220ms" } as React.CSSProperties}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={testeHref}
                {...(testeHref.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="sweep inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {focusHero.primaryCta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </a>
              <a
                href="#painel"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-fog-600"
              >
                {focusHero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="hero-in" style={{ "--delay": "260ms" } as React.CSSProperties}>
            <ul className="mt-7 flex flex-wrap gap-x-2 gap-y-2">
              {focusHero.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded border border-ink-700 bg-ink-900/60 px-2.5 py-1 text-[12px] text-fog-300"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

/** O topo da Visão geral, do jeito que ele existe: indicadores e a curva. */
export function PreviaPainel() {
  return (
    <ProvedorFocus layout="desktop" navegavel={false}>
      <div data-demo="true" className="foco-app relative bg-foco-fundo p-5">
        <div aria-hidden="true" className="foco-aurora" />
        <div className="relative space-y-4">
          <ConteudoPrevia />
        </div>
      </div>
    </ProvedorFocus>
  );
}

function ConteudoPrevia() {
  const { recorte } = useFocus();

  return (
    <>
      <IndicadoresFocus rotuloAnterior="mês anterior" />
      <GraficoArea
        dados={recorte.serie}
        bucket={recorte.intervalo.bucket}
        periodoRotulo={recorte.intervalo.rotulo}
      />
    </>
  );
}

/**
 * Faixa de números. Todos verificáveis no produto — e os dois zeros são o
 * argumento mais forte da página, porque é o que o comprador teme.
 */
export function FaixaNumeros() {
  return (
    <div className="border-y border-ink-800 bg-ink-900">
      <div className="mx-auto grid w-full max-w-6xl gap-px px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {focusNumeros.map((numero, indice) => (
          <Reveal
            key={numero.titulo}
            delay={indice * 90}
            className="py-8 lg:px-6 lg:first:pl-0 lg:last:pr-0"
          >
            <p className="font-display text-3xl font-semibold text-white">
              {numero.prefixo ?? ""}
              <Contador valor={numero.valor} />
              {numero.sufixo ?? ""}
            </p>
            <h2 className="mt-1 text-sm font-semibold text-fog-300">{numero.titulo}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-fog-500">{numero.texto}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function SecaoDemo() {
  const testeHref = whatsappLink(focusMensagens.teste);

  return (
    <Section id="painel" tone="dark">
      <Reveal>
        <Eyebrow>{focusDemo.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl">{focusDemo.title}</SectionTitle>
        <Lead>{focusDemo.intro}</Lead>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <SistemaFocus />
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-12 flex flex-col gap-5 border-t border-ink-800 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[17px] font-semibold text-white">
              Isto é uma demonstração. A sua operação é o próximo passo.
            </h3>
            <p className="measure mt-2 text-[15px] leading-relaxed text-fog-400">
              No teste, instalamos nas primeiras estações da sua empresa — e em poucos dias este
              mesmo painel para de mostrar um exemplo e passa a mostrar você.
            </p>
          </div>
          <a
            href={testeHref}
            {...(testeHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-ink-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-fog-600"
          >
            Testar no seu time
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </Reveal>

    </Section>
  );
}
