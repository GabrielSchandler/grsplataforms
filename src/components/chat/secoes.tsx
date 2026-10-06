"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Megaphone,
  Plus,
  ShieldAlert,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { MolduraFeixe } from "@/components/efeitos/feixe-borda";
import { Reveal, Spotlight } from "@/components/motion/motion";
import { DemoForm } from "@/components/site/demo-form";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import {
  chatCampanhas,
  chatDemo,
  chatFaq,
  chatFinal,
  chatHero,
  chatIa,
  chatImplantacao,
  chatMensagens,
  chatOferta,
  chatPilares,
  chatProblema,
  chatTelas,
} from "@/content/chat";
import { whatsappLink } from "@/lib/site-config";
import { aposAssumir, carla } from "./demo/dados";
import { SistemaChat, abrirTelaDoChat, type TelaChat } from "./demo/sistema-chat";

/** Atributos de link externo só quando o destino sai do site. */
function externo(href: string) {
  return href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

/* -------------------------------------------------------------------------
   Primeira dobra
   ------------------------------------------------------------------------- */

/**
 * A cena da direita é a conversa que a página inteira acompanha: a mesma
 * Carla que aparece na demonstração, atendida pela IA e assumida pela Marina.
 */
export function HeroChat() {
  const testeHref = whatsappLink(chatMensagens.teste);

  return (
    <section id="topo" className="relative isolate overflow-hidden bg-ink-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="padrao-pontos absolute inset-0 opacity-70"
          style={{
            maskImage: "radial-gradient(70% 60% at 68% 35%, black, transparent)",
            WebkitMaskImage: "radial-gradient(70% 60% at 68% 35%, black, transparent)",
          }}
        />
        {/* Roxo e ciano são as cores do Chat: roxo é tudo que é da IA, ciano é
            a ação humana. Aqui aparecem só como atmosfera atrás da conversa. */}
        <div className="absolute -right-24 top-10 h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto grid min-h-[86vh] w-full max-w-6xl items-center gap-12 px-5 pb-24 pt-32 sm:px-8 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="max-w-xl">
          <div className="hero-in">
            <Eyebrow>{chatHero.eyebrow}</Eyebrow>
          </div>

          <div className="hero-in" style={{ "--delay": "70ms" } as React.CSSProperties}>
            <h1 className="font-display mt-6 text-4xl leading-[1.05] font-semibold text-white sm:text-5xl lg:text-[3.2rem]">
              {chatHero.title}
            </h1>
          </div>

          <div className="hero-in" style={{ "--delay": "150ms" } as React.CSSProperties}>
            <p className="measure mt-6 text-lg leading-relaxed text-fog-300">{chatHero.subtitle}</p>
          </div>

          <div className="hero-in" style={{ "--delay": "220ms" } as React.CSSProperties}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={testeHref}
                {...externo(testeHref)}
                className="sweep inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {chatHero.primaryCta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </a>
              <a
                href="#central"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-fog-600"
              >
                {chatHero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="hero-in" style={{ "--delay": "260ms" } as React.CSSProperties}>
            <ul className="mt-7 flex flex-wrap gap-x-2 gap-y-2">
              {chatHero.chips.map((chip) => (
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

        <div className="hero-in hidden lg:block" style={{ "--delay": "320ms" } as React.CSSProperties}>
          <ConversaHero />
        </div>
      </div>
    </section>
  );
}

/** A conversa da Carla em cartão escuro: IA em roxo, atendente em ciano. */
export function ConversaHero() {
  const mensagens = [...carla.mensagens.slice(0, 4), ...aposAssumir];

  return (
    // data-demo: é peça de produto, fora da auditoria de contraste do site.
    <div
      aria-hidden="true"
      data-demo="true"
      className="rounded-lg border border-ink-700 bg-ink-900/90 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-center gap-3 border-b border-ink-800 px-4 py-3.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-700 text-sm font-semibold text-fog-300">
          CM
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">{carla.nome}</p>
          <p className="text-xs text-fog-500">chegou pelo anúncio</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">
          <UserRoundCheck className="h-3.5 w-3.5" />
          Marina assumiu
        </span>
      </div>

      <div className="flex flex-col gap-2.5 px-4 py-4">
        {mensagens.map((mensagem, indice) =>
          mensagem.de === "sistema" ? (
            <p
              key={indice}
              className="mx-auto rounded-full border border-ink-700 px-3 py-1 text-[11px] text-fog-400"
            >
              {mensagem.texto}
            </p>
          ) : (
            <div
              key={indice}
              className={`max-w-[84%] rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
                mensagem.de === "contato"
                  ? "self-start bg-ink-800 text-fog-200"
                  : mensagem.de === "ia"
                    ? "self-end border border-violet-500/40 bg-violet-500/15 text-violet-100"
                    : "self-end border border-cyan-500/40 bg-cyan-500/15 text-cyan-50"
              }`}
            >
              {mensagem.autor ? (
                <strong className="font-semibold">
                  {mensagem.autor}
                  {mensagem.de === "ia" ? " · IA" : ""}:{" "}
                </strong>
              ) : null}
              {mensagem.texto}
            </div>
          ),
        )}
      </div>

      <div className="border-t border-ink-800 px-4 py-3">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          Resumo da IA
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-fog-300">{carla.resumo}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Os três pilares
   ------------------------------------------------------------------------- */

const iconesPilares = [Bot, UsersRound, Megaphone];
const coresPilares = ["text-violet-300", "text-cyan-300", "text-amber-300"];

export function FaixaPilares() {
  return (
    <div className="border-y border-ink-800 bg-ink-900">
      <div className="mx-auto grid w-full max-w-6xl gap-px px-5 sm:px-8 lg:grid-cols-3">
        {chatPilares.map((pilar, indice) => {
          const Icone = iconesPilares[indice];

          return (
            <Reveal key={pilar.titulo} delay={indice * 90} className="py-8 lg:px-6 lg:first:pl-0 lg:last:pr-0">
              <h2 className="flex items-center gap-2.5 text-[17px] font-semibold text-white">
                <Icone aria-hidden="true" className={`h-5 w-5 ${coresPilares[indice]}`} />
                {pilar.titulo}
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-fog-400">{pilar.texto}</p>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   O problema
   ------------------------------------------------------------------------- */

export function SecaoProblemaChat() {
  return (
    <Section id="problema" tone="bone">
      <Reveal>
        <Eyebrow tone="bone">{chatProblema.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{chatProblema.title}</SectionTitle>
        <Lead tone="bone">{chatProblema.intro}</Lead>
      </Reveal>

      <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {chatProblema.items.map((item, indice) => (
          <Reveal
            key={item.title}
            as="article"
            delay={(indice % 3) * 110}
            className="border-t border-fog-200 pt-5"
          >
            <span className="text-xs font-semibold tabular-nums text-brand-600">
              {String(indice + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-[17px] font-semibold leading-snug text-ink-950">{item.title}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-600">{item.description}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-12 text-[15px] text-ink-800">
          <a
            href="#central"
            className="group inline-flex items-center gap-2 font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            Ver como fica com a central
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </p>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------------------------------
   A central funcionando
   ------------------------------------------------------------------------- */

export function SecaoCentral() {
  const testeHref = whatsappLink(chatMensagens.teste);

  return (
    <Section id="central" tone="dark">
      <Reveal>
        <Eyebrow>{chatDemo.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl">{chatDemo.title}</SectionTitle>
        <Lead>{chatDemo.intro}</Lead>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <SistemaChat />
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-12 flex flex-col gap-5 border-t border-ink-800 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[17px] font-semibold text-white">
              Aqui a Carla é um exemplo. No teste, é um contato seu.
            </h3>
            <p className="measure mt-2 text-[15px] leading-relaxed text-fog-400">
              Conectamos um número da sua empresa e configuramos a IA com as regras do seu
              atendimento.
            </p>
          </div>
          <a
            href={testeHref}
            {...externo(testeHref)}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-ink-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-fog-600"
          >
            {chatHero.primaryCta}
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

/* -------------------------------------------------------------------------
   O que cada tela responde — os cartões que abrem a demonstração
   ------------------------------------------------------------------------- */

export function SecaoTelas() {
  return (
    <Section id="telas" tone="panel">
      <Reveal>
        <Eyebrow>{chatTelas.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl">{chatTelas.title}</SectionTitle>
        <Lead>{chatTelas.intro}</Lead>
      </Reveal>

      <div style={{ ["--spot" as string]: "rgba(139, 92, 246, 0.12)" }}>
        <Spotlight className="mt-12 overflow-hidden rounded-lg border border-ink-700">
          <div className="grid gap-px bg-ink-700 sm:grid-cols-2">
            {chatTelas.cartoes.map((cartao, indice) => (
              <Reveal key={cartao.tela} delay={(indice % 2) * 110}>
                <button
                  type="button"
                  onClick={() => abrirTelaDoChat(cartao.tela as TelaChat)}
                  className="group flex h-full w-full flex-col bg-ink-950 p-6 text-left transition-colors duration-300 hover:bg-ink-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[17px] font-semibold leading-snug text-white">{cartao.pergunta}</h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-violet-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-fog-400">{cartao.resposta}</p>
                  <span className="mt-5 text-[13px] font-semibold text-violet-300">Ver na central</span>
                </button>
              </Reveal>
            ))}
          </div>
        </Spotlight>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------
   A IA
   ------------------------------------------------------------------------- */

export function SecaoIa() {
  const { passagem } = chatIa;

  return (
    <Section id="ia" tone="light">
      <Reveal>
        <Eyebrow tone="light">{chatIa.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{chatIa.title}</SectionTitle>
        <Lead tone="light">{chatIa.intro}</Lead>
      </Reveal>

      <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {chatIa.itens.map((item, indice) => (
          <Reveal
            key={item.titulo}
            as="article"
            delay={(indice % 3) * 110}
            className="border-t border-fog-200 pt-5"
          >
            <h3 className="text-[17px] font-semibold leading-snug text-ink-950">{item.titulo}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-600">{item.texto}</p>
          </Reveal>
        ))}
      </div>

      {/* A passagem para o humano: o argumento mais forte da página. */}
      <Reveal delay={100} className="mt-14 rounded-lg border border-fog-200 bg-bone p-6 sm:p-8">
        <h3 className="font-display text-xl font-semibold text-ink-950 sm:text-2xl">{passagem.titulo}</h3>
        <p className="measure mt-3 text-[15px] leading-relaxed text-fog-600">{passagem.texto}</p>

        <ol className="mt-7 grid gap-4 lg:grid-cols-3">
          {passagem.etapas.map((etapa, indice) => (
            <li key={etapa.rotulo} className="rounded-lg border border-fog-200 bg-white p-4">
              <span className="text-xs font-semibold tabular-nums text-brand-600">Etapa {indice + 1}</span>
              <p className="mt-2 text-[15px] font-semibold text-ink-950">{etapa.rotulo}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-fog-600">{etapa.texto}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------------------------------
   Campanhas
   ------------------------------------------------------------------------- */

export function SecaoCampanhas() {
  return (
    <Section id="campanhas" tone="bone">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal>
          <Eyebrow tone="bone">{chatCampanhas.eyebrow}</Eyebrow>
          <SectionTitle className="max-w-2xl text-ink-950">{chatCampanhas.title}</SectionTitle>
          <Lead tone="bone">{chatCampanhas.intro}</Lead>

          <button
            type="button"
            onClick={() => abrirTelaDoChat("campanhas")}
            className="group mt-8 inline-flex cursor-pointer items-center gap-2 text-[15px] font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            Ver uma campanha na demonstração
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </Reveal>

        <Reveal delay={110} className="flex flex-col gap-6">
          <div className="rounded-lg border border-fog-200 bg-white p-6 sm:p-8">
            <ul className="grid gap-4">
              {chatCampanhas.itens.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-product-700" />
                  <span className="text-[15px] leading-relaxed text-ink-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-fog-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-[17px] font-semibold text-ink-950">
              <ShieldAlert aria-hidden="true" className="h-4 w-4 text-brand-500" />
              {chatCampanhas.nota.titulo}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-fog-600">{chatCampanhas.nota.texto}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------
   Implantação
   ------------------------------------------------------------------------- */

export function SecaoImplantacaoChat() {
  return (
    <Section id="implantacao" tone="dark">
      <Reveal>
        <Eyebrow>{chatImplantacao.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl">{chatImplantacao.title}</SectionTitle>
        <Lead>{chatImplantacao.intro}</Lead>
      </Reveal>

      <ol className="mt-12 grid gap-8 sm:grid-cols-2">
        {chatImplantacao.passos.map((passo, indice) => (
          <Reveal key={passo.titulo} as="li" delay={(indice % 2) * 110} className="border-t border-ink-800 pt-5">
            <span className="text-xs font-semibold tabular-nums text-violet-300">Etapa {indice + 1}</span>
            <h3 className="mt-3 text-[17px] font-semibold text-white">{passo.titulo}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-400">{passo.texto}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={80}>
        <ul className="mt-12 grid gap-3.5 border-t border-ink-800 pt-8 sm:grid-cols-3">
          {chatImplantacao.requisitos.map((requisito) => (
            <li key={requisito} className="flex gap-3">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              <span className="text-[14px] leading-relaxed text-fog-300">{requisito}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------------------------------
   Oferta
   ------------------------------------------------------------------------- */

export function SecaoOfertaChat() {
  const testeHref = whatsappLink(chatMensagens.teste);
  const especialistaHref = whatsappLink(chatMensagens.especialista);

  return (
    <Section id="teste" tone="panel">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Reveal>
          <Eyebrow>{chatOferta.eyebrow}</Eyebrow>
          <SectionTitle className="max-w-2xl">{chatOferta.title}</SectionTitle>
          <Lead>{chatOferta.texto}</Lead>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={testeHref}
              {...externo(testeHref)}
              className="sweep inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {chatOferta.cta}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </a>
            <a
              href={especialistaHref}
              {...externo(especialistaHref)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-fog-600"
            >
              {chatOferta.ctaSecundario}
            </a>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <MolduraFeixe className="rounded-lg" tamanho="220%" duracao="11s">
            <div className="rounded-lg border border-ink-700 bg-ink-950 p-6 sm:p-8">
              <h3 className="text-[17px] font-semibold text-white">O que entra no teste</h3>
              <ul className="mt-5 grid gap-3.5">
                {chatOferta.inclui.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                    <span className="text-[15px] leading-relaxed text-fog-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-ink-800 pt-5">
                <h4 className="text-[15px] font-semibold text-white">{chatOferta.contratacao.titulo}</h4>
                <p className="mt-2 text-[14px] leading-relaxed text-fog-400">
                  {chatOferta.contratacao.texto}
                </p>
              </div>
            </div>
          </MolduraFeixe>
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------
   Perguntas e chamada final
   ------------------------------------------------------------------------- */

export function SecaoPerguntasChat() {
  return (
    <Section id="perguntas" tone="bone">
      <Reveal>
        <Eyebrow tone="bone">{chatFaq.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{chatFaq.title}</SectionTitle>
        <Lead tone="bone">{chatFaq.intro}</Lead>
      </Reveal>

      <div className="mt-12 border-t border-fog-200">
        {chatFaq.itens.map((item, indice) => (
          <Reveal key={item.question} delay={Math.min(indice, 4) * 70}>
            <details className="group border-b border-fog-200">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[16px] font-semibold text-ink-950 transition-colors duration-200 hover:text-brand-600 marker:content-['']">
                {item.question}
                <Plus
                  aria-hidden="true"
                  className="mt-1 h-4 w-4 shrink-0 text-brand-500 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45"
                />
              </summary>
              <p className="measure pb-6 text-[15px] leading-relaxed text-fog-600">{item.answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function SecaoChamadaFinalChat() {
  const especialistaHref = whatsappLink(chatMensagens.especialista);

  return (
    <Section id="demonstracao" tone="dark">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow>{chatFinal.eyebrow}</Eyebrow>
          <SectionTitle>{chatFinal.title}</SectionTitle>
          <Lead>{chatFinal.description}</Lead>

          <a
            href={especialistaHref}
            {...externo(especialistaHref)}
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 underline-offset-4 hover:underline"
          >
            {chatFinal.especialista}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <div className="mt-10 rounded-lg border border-ink-800 bg-ink-900 p-5">
            <h3 className="text-[15px] font-semibold text-white">Já usa o NewSec CRM?</h3>
            <p className="measure mt-2 text-[14px] leading-relaxed text-fog-400">
              O CRM tem o próprio atendimento por WhatsApp, ligado ao cadastro do cliente. O Chat
              funciona sozinho e é a central completa — a conversa sobre os dois é com o mesmo
              comercial.
            </p>
          </div>
        </Reveal>

        <Reveal delay={140} className="rounded-lg border border-ink-800 bg-ink-900 p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-white">{chatFinal.formTitle}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-fog-400">{chatFinal.formDescription}</p>
          <div className="mt-7">
            <DemoForm produto="chat" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
