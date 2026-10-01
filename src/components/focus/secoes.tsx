"use client";

import {
  AlarmClockCheck,
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Check,
  Gauge,
  MonitorSmartphone,
  PartyPopper,
  PlugZap,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { Contador } from "@/components/efeitos/contador";
import { MolduraFeixe } from "@/components/efeitos/feixe-borda";
import { ListaAnimada } from "@/components/efeitos/lista-animada";
import { Reveal, Spotlight } from "@/components/motion/motion";
import { DemoForm } from "@/components/site/demo-form";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import {
  focusCelular,
  focusColeta,
  focusFaq,
  focusFinal,
  focusImplantacao,
  focusMensagens,
  focusOferta,
  focusProblema,
  focusRespostas,
} from "@/content/focus";
import { whatsappLink } from "@/lib/site-config";
import { MaqueteCelular } from "./demo/celular";
import { formatarDuracao } from "./demo/formato";
import { RESUMO_PADRAO } from "./demo/motor";
import { abrirTelaDoFocus } from "./demo/painel-focus";
import { ATRASADAS } from "./demo/vivo";
import type { TelaId } from "./demo/estado";

/* -------------------------------------------------------------------------
   O que muda na segunda-feira — os cartões que abrem a demonstração
   ------------------------------------------------------------------------- */

// Os avisos saem do mesmo ambiente da demonstração: estação parada, cadastro
// pendente, quem mais estende o dia e o que ficou sem categoria.
const AVISOS = [
  {
    Icone: PlugZap,
    cor: "text-amber-400",
    texto: `${ATRASADAS[0].maquina} sem enviar dados há ${formatarDuracao(ATRASADAS[0].minutosSemEnvio)} durante o expediente`,
  },
  {
    Icone: PartyPopper,
    cor: "text-emerald-400",
    texto: "Estação nova no painel: ATD-06, com cadastro pendente de revisão",
  },
  {
    Icone: AlarmClockCheck,
    cor: "text-rose-400",
    texto: `${RESUMO_PADRAO.maisFora.nome}: ${formatarDuracao(RESUMO_PADRAO.maisFora.minutos)} de atividade fora da escala no mês`,
  },
  {
    Icone: AppWindow,
    cor: "text-cyan-400",
    texto: `${RESUMO_PADRAO.semClassificacao} aplicativos sem classificação ficaram fora do índice`,
  },
];

export function SecaoRespostas() {
  const cartoes = focusRespostas.cartoes;
  const principal = cartoes[0];
  // O cartão dos avisos é o das estações: é nele que a lista que se renova faz
  // sentido. Pegar "o segundo da lista" prendia o efeito ao cartão que por
  // acaso estivesse naquela posição.
  const alertas = cartoes.find((cartao) => cartao.tela === "dispositivos") ?? cartoes[1];
  const demais = cartoes.filter((cartao) => cartao !== principal && cartao !== alertas);

  return (
    <Section id="respostas" tone="panel">
      <Reveal>
        <Eyebrow>{focusRespostas.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl">{focusRespostas.title}</SectionTitle>
        <Lead>{focusRespostas.intro}</Lead>
      </Reveal>

      {/* O realce segue o ponteiro, em ciano: aqui a cor é a do produto. */}
      <div style={{ ["--spot" as string]: "rgba(34, 211, 238, 0.12)" }}>
        <Spotlight className="mt-12 overflow-hidden rounded-lg border border-ink-700">
          <div className="grid gap-px bg-ink-700 lg:grid-cols-3">
            <CartaoResposta cartao={principal} className="lg:col-span-2">
              <div className="mt-5 flex flex-wrap items-end gap-6 rounded-lg border border-ink-700 bg-ink-900 p-5">
                <div>
                  <p className="flex items-center gap-2 text-xs text-slate-400">
                    <Gauge aria-hidden="true" className="h-3.5 w-3.5 text-cyan-400" />
                    Tempo produtivo / expediente
                  </p>
                  {/* O número sai do mesmo motor da demonstração: digitado à
                      mão, bastaria mexer nos dados para o cartão passar a
                      contradizer o painel logo abaixo. */}
                  <p className="font-display mt-1 text-4xl font-semibold text-slate-100">
                    <Contador
                      valor={RESUMO_PADRAO.indice ?? 0}
                      formatar={(valor) => `${Math.round(valor)}%`}
                    />
                  </p>
                </div>
                <div className="min-w-[8rem] flex-1">
                  <p className="text-xs text-slate-400">como o expediente foi utilizado</p>
                  <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-slate-800">
                    {RESUMO_PADRAO.composicao.map((faixa) => (
                      <span
                        key={faixa.chave}
                        className={faixa.chave === "semDados" ? "h-full bg-slate-600" : "h-full"}
                        style={{ width: `${faixa.parte}%`, background: faixa.chave === "semDados" ? undefined : faixa.cor }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CartaoResposta>

            <CartaoResposta cartao={alertas}>
              <ListaAnimada
                className="mt-5"
                visiveis={2}
                itens={AVISOS.map(({ Icone, cor, texto }) => (
                  <span
                    key={texto}
                    className="flex items-start gap-2.5 rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-[13px] leading-relaxed text-slate-300"
                  >
                    <Icone aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${cor}`} />
                    {texto}
                  </span>
                ))}
              />
            </CartaoResposta>

            {demais.map((cartao) => (
              <CartaoResposta key={cartao.pergunta} cartao={cartao} />
            ))}

            {/* A grade fecha com uma chamada em vez de uma célula vazia. */}
            <Reveal delay={180} className="lg:col-span-2">
              <button
                type="button"
                onClick={() => abrirTelaDoFocus("visao")}
                className="group flex h-full w-full flex-col justify-between bg-ink-950 p-6 text-left transition-colors duration-300 hover:bg-ink-900"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[17px] font-semibold text-white">
                      Prefere um roteiro pronto?
                    </h3>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-cyan-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-fog-400">
                    O tour guiado percorre as onze leituras do painel em pouco mais de um minuto, uma
                    de cada vez.
                  </p>
                </div>
                <span className="mt-5 text-[13px] font-semibold text-cyan-300">
                  Abrir a demonstração
                </span>
              </button>
            </Reveal>
          </div>
        </Spotlight>
      </div>
    </Section>
  );
}

function CartaoResposta({
  cartao,
  className = "",
  children,
}: {
  cartao: { tela: string; pergunta: string; resposta: string };
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal className={className}>
      <button
        type="button"
        onClick={() => abrirTelaDoFocus(cartao.tela as TelaId)}
        className="group flex h-full w-full flex-col bg-ink-950 p-6 text-left transition-colors duration-300 hover:bg-ink-900"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[17px] font-semibold leading-snug text-white">{cartao.pergunta}</h3>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 h-4 w-4 shrink-0 text-cyan-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
        <p className="mt-2.5 text-[14px] leading-relaxed text-fog-400">{cartao.resposta}</p>
        {children}
        <span className="mt-5 text-[13px] font-semibold text-cyan-300">Ver no painel</span>
      </button>
    </Reveal>
  );
}

/* -------------------------------------------------------------------------
   O painel no celular
   ------------------------------------------------------------------------- */

export function SecaoCelular() {
  return (
    <Section id="celular" tone="light">
      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
        <Reveal>
          <Eyebrow tone="light">{focusCelular.eyebrow}</Eyebrow>
          <SectionTitle className="max-w-2xl text-ink-950">{focusCelular.title}</SectionTitle>
          <Lead tone="light">{focusCelular.intro}</Lead>

          <ul className="mt-8 grid gap-3.5">
            {focusCelular.itens.map((item) => (
              <li key={item} className="flex gap-3">
                <MonitorSmartphone
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
                />
                <span className="text-[15px] leading-relaxed text-ink-800">{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-8 border-l-2 border-brand-500 pl-3 text-[13px] leading-relaxed text-fog-600">
            {focusCelular.nota}
          </p>
        </Reveal>

        <Reveal delay={140} className="hidden lg:block">
          <MaqueteCelular />
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------
   O que é coletado
   ------------------------------------------------------------------------- */

export function SecaoColeta() {
  return (
    <Section id="coleta" tone="bone">
      <Reveal>
        <Eyebrow tone="bone">{focusColeta.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{focusColeta.title}</SectionTitle>
        <Lead tone="bone">{focusColeta.intro}</Lead>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <Reveal className="rounded-lg border border-fog-200 bg-white p-6 sm:p-8">
          <h3 className="text-[17px] font-semibold text-ink-950">{focusColeta.pratica.titulo}</h3>
          <ul className="mt-5 grid gap-4">
            {focusColeta.pratica.itens.map((item) => (
              <li key={item} className="flex gap-3">
                <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-product-700" />
                <span className="text-[15px] leading-relaxed text-ink-800">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={110} className="flex flex-col gap-6">
          <div className="rounded-lg border border-fog-200 bg-white p-6">
            <h3 className="text-[17px] font-semibold text-ink-950">{focusColeta.aviso.titulo}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-fog-600">
              {focusColeta.aviso.texto}
            </p>

            <BandejaWindows />

            <p className="mt-4 text-[13px] leading-relaxed text-fog-600">{focusColeta.aviso.nota}</p>
          </div>

          <div className="rounded-lg border border-fog-200 bg-white p-6">
            <h3 className="flex items-center gap-2 text-[17px] font-semibold text-ink-950">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-brand-500" />
              {focusColeta.legal.titulo}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-fog-600">
              {focusColeta.legal.texto}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** O ícone que fica na barra de tarefas da estação, como o agente instala. */
function BandejaWindows() {
  return (
    <div data-demo="true" className="mt-5 overflow-hidden rounded-lg border border-ink-800 bg-ink-950 p-3">
      <div className="rounded-md border border-ink-800 bg-ink-900 p-2">
        <div className="rounded border border-ink-800 bg-ink-950 px-3 py-2">
          <p className="text-[12px] font-medium text-white">Telemetria de Produtividade (ativo)</p>
          <ul className="mt-2 grid gap-1 text-[12px] text-fog-300">
            <li className="rounded px-2 py-1 hover:bg-white/5">O que é coletado?</li>
            <li className="rounded px-2 py-1 hover:bg-white/5">Sobre</li>
          </ul>
        </div>
        <div className="mt-2 flex items-center justify-end gap-3 px-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-cyan-400" />
          <span className="text-[11px] text-fog-400">16:40</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Implantação
   ------------------------------------------------------------------------- */

export function SecaoImplantacao() {
  return (
    <Section id="implantacao" tone="dark">
      <Reveal>
        <Eyebrow>{focusImplantacao.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl">{focusImplantacao.title}</SectionTitle>
        <Lead>{focusImplantacao.intro}</Lead>
      </Reveal>

      <Reveal delay={120} className="mt-12">
        <DiagramaFluxo />
      </Reveal>

      <ol className="focus-etapas mt-12 grid gap-8 sm:grid-cols-2">
        {focusImplantacao.passos.map((passo, indice) => (
          <Reveal key={passo.titulo} as="li" delay={(indice % 2) * 110} className="border-t border-ink-800 pt-5">
            <span className="text-xs font-semibold tabular-nums text-cyan-300">
              Etapa {indice + 1}
            </span>
            <h3 className="mt-3 text-[17px] font-semibold text-white">{passo.titulo}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-400">{passo.texto}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={80}>
        <ul className="mt-12 grid gap-3.5 border-t border-ink-800 pt-8 sm:grid-cols-3">
          {focusImplantacao.requisitos.map((requisito) => (
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

/**
 * Estação → envio → painel. As linhas têm um tracejado que corre, como o lote
 * que sobe a cada sincronização (Animated Beam, do catálogo 21st.dev).
 */
function DiagramaFluxo() {
  const { origem, meio, destino } = focusImplantacao.fluxo;
  const nos = [
    { ...origem, Icone: MonitorSmartphone },
    { ...meio, Icone: ShieldCheck },
    { ...destino, Icone: Gauge },
  ];

  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 40"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-10 -translate-y-1/2 lg:block"
      >
        <defs>
          <linearGradient id="feixe-fluxo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[
          [300, 366],
          [634, 700],
        ].map(([de, ate]) => (
          <g key={de}>
            <line x1={de} y1="20" x2={ate} y2="20" stroke="#2a2d35" strokeWidth="2" />
            <line
              x1={de}
              y1="20"
              x2={ate}
              y2="20"
              stroke="url(#feixe-fluxo)"
              strokeWidth="2"
              strokeDasharray="10 26"
              className="feixe-linha"
            />
          </g>
        ))}
      </svg>

      <div className="focus-fluxo relative grid gap-4 lg:grid-cols-3">
        {nos.map(({ titulo, texto, Icone }) => (
          <div
            key={titulo}
            className="rounded-lg border border-ink-700 bg-ink-900 p-5 text-center lg:text-left"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700 bg-ink-950">
              <Icone aria-hidden="true" className="h-5 w-5 text-cyan-300" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold text-white">{titulo}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-fog-400">{texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   O problema — logo depois do gancho, antes de qualquer prova

   Mesmo formato validado na home do CRM (seis situações concretas,
   numeradas, tom="bone"): o leitor precisa se reconhecer na primeira linha,
   antes de qualquer número ou tela aparecer.
   ------------------------------------------------------------------------- */

export function SecaoProblema() {
  return (
    <Section id="problema" tone="bone">
      <Reveal>
        <Eyebrow tone="bone">{focusProblema.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{focusProblema.title}</SectionTitle>
        <Lead tone="bone">{focusProblema.intro}</Lead>
      </Reveal>

      <div className="focus-problemas mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {focusProblema.items.map((item, indice) => (
          <Reveal
            key={item.title}
            as="article"
            delay={(indice % 3) * 110}
            className="border-t border-fog-200 pt-5"
          >
            <span className="text-xs font-semibold tabular-nums text-brand-600">
              {String(indice + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-[17px] font-semibold leading-snug text-ink-950">
              {item.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-600">{item.description}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-12 text-[15px] text-ink-800">
          <a
            href="#painel"
            className="group inline-flex items-center gap-2 font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            Ver a operação com dados, não com impressão
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
   Oferta
   ------------------------------------------------------------------------- */

export function SecaoOferta() {
  const testeHref = whatsappLink(focusMensagens.teste);
  const especialistaHref = whatsappLink(focusMensagens.especialista);

  return (
    <Section id="teste" tone="panel">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Reveal>
          <Eyebrow>{focusOferta.eyebrow}</Eyebrow>
          <SectionTitle className="max-w-2xl">{focusOferta.title}</SectionTitle>
          <Lead>{focusOferta.texto}</Lead>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={testeHref}
              {...(testeHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="sweep inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {focusOferta.cta}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </a>
            <a
              href={especialistaHref}
              {...(especialistaHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-fog-600"
            >
              {focusOferta.ctaSecundario}
            </a>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <MolduraFeixe className="rounded-lg" tamanho="220%" duracao="11s">
            <div className="rounded-lg border border-ink-700 bg-ink-950 p-6 sm:p-8">
              <h3 className="text-[17px] font-semibold text-white">O que entra no teste</h3>
              <ul className="mt-5 grid gap-3.5">
                {focusOferta.inclui.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span className="text-[15px] leading-relaxed text-fog-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 border-t border-ink-800 pt-5">
                <h4 className="text-[15px] font-semibold text-white">
                  {focusOferta.contratacao.titulo}
                </h4>
                <p className="mt-2 text-[14px] leading-relaxed text-fog-400">
                  {focusOferta.contratacao.texto}
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

export function SecaoPerguntas() {
  return (
    <Section id="perguntas" tone="bone">
      <Reveal>
        <Eyebrow tone="bone">{focusFaq.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{focusFaq.title}</SectionTitle>
        <Lead tone="bone">{focusFaq.intro}</Lead>
      </Reveal>

      <div className="mt-12 border-t border-fog-200">
        {focusFaq.itens.map((item, indice) => (
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

export function SecaoChamadaFinal() {
  const especialistaHref = whatsappLink(focusMensagens.especialista);

  return (
    <Section id="demonstracao" tone="dark">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Eyebrow>{focusFinal.eyebrow}</Eyebrow>
          <SectionTitle>{focusFinal.title}</SectionTitle>
          <Lead>{focusFinal.description}</Lead>

          <a
            href={especialistaHref}
            {...(especialistaHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 underline-offset-4 hover:underline"
          >
            {focusFinal.especialista}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <div className="mt-10 rounded-lg border border-ink-800 bg-ink-900 p-5">
            <h3 className="text-[15px] font-semibold text-white">Já usa o NewSec CRM?</h3>
            <p className="measure mt-2 text-[14px] leading-relaxed text-fog-400">
              O Focus funciona sozinho e não depende de nenhum outro sistema — mas, se a sua empresa
              já usa o CRM, a conversa é com o mesmo comercial.
            </p>
          </div>
        </Reveal>

        <Reveal delay={140} className="rounded-lg border border-ink-800 bg-ink-900 p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-white">{focusFinal.formTitle}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-fog-400">
            {focusFinal.formDescription}
          </p>
          <div className="mt-7">
            <DemoForm produto="focus" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
