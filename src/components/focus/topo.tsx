"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Contador } from "@/components/efeitos/contador";
import { Reveal } from "@/components/motion/motion";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { AcaoPrincipal, AcaoSecundaria, TopoProduto } from "@/components/site/topo-produto";
import { focusDemo, focusHero, focusMensagens, focusNumeros } from "@/content/focus";
import { whatsappLink } from "@/lib/site-config";
import { ProvedorFocus, useFocus } from "./demo/estado";
import { UsoExpediente } from "./demo/graficos";
import { SistemaFocus } from "./demo/sistema-focus";
import { CartoesIndicadores, PontosAtencao } from "./demo/tela-visao";

/**
 * Primeira dobra da página do Focus.
 *
 * A cena da direita não é ilustração: é o painel de verdade, no computador e
 * no celular, com os mesmos números da demonstração logo abaixo. Quem rolar a
 * página encontra a mesma tela, agora para clicar.
 */
export function HeroFocus() {
  const testeHref = whatsappLink(focusMensagens.teste);

  return (
    <TopoProduto
      produto="focus"
      eyebrow={focusHero.eyebrow}
      titulo={focusHero.title}
      subtitulo={focusHero.subtitle}
      garantias={focusHero.chips}
      acoes={
        <>
          <AcaoPrincipal href={testeHref}>
            {focusHero.primaryCta}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </AcaoPrincipal>
          <AcaoSecundaria href="#painel">{focusHero.secondaryCta}</AcaoSecundaria>
        </>
      }
      fundo={
        <>
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
        </>
      }
    />
  );
}

/**
 * O topo da Visão geral, do jeito que ele existe: os quatro indicadores e o
 * uso do expediente. É a mesma régua da demonstração logo abaixo — tempo
 * produtivo sobre o expediente — e por isso o número bate com ela.
 */
export function PreviaPainel() {
  return (
    <ProvedorFocus layout="desktop" navegavel={false}>
      <div data-demo="true" className="foco-app relative w-[1000px] bg-foco-fundo p-5">
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
      <CartoesIndicadores />
      <div className="grid grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] gap-4">
        <UsoExpediente minutos={recorte.resumo.minutos} colunas={4} />
        <PontosAtencao pontos={recorte.pontos} />
      </div>
    </>
  );
}

/**
 * Faixa de números. Todos verificáveis no produto — e os dois zeros são o
 * argumento mais forte da página, porque é o que o comprador teme.
 */
export function FaixaNumeros() {
  return (
    <div className="focus-numeros border-y border-ink-800 bg-ink-900">
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
