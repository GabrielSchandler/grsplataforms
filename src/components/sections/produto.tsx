import { ArrowUpRight } from "lucide-react";
import { InteractiveDemo } from "@/components/demo/interactive-demo";
import { CheckList, Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { Screenshot } from "@/components/site/screenshot";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import { demoLabels, journey, legal, modules, simulations, workspaces } from "@/content/site";

export function Journey() {
  let counter = 0;

  return (
    <Section id="jornada" tone="dark">
      <Eyebrow>{journey.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl">{journey.title}</SectionTitle>
      <Lead>{journey.intro}</Lead>

      <div className="mt-14 space-y-12">
        {journey.phases.map((phase) => (
          <div key={phase.name} className="grid gap-6 lg:grid-cols-[220px_1fr] lg:gap-12">
            <h3 className="font-display text-xl font-semibold text-white lg:sticky lg:top-24 lg:self-start">
              {phase.name}
            </h3>

            <ol className="space-y-6 border-l border-ink-800 pl-6">
              {phase.steps.map((step) => {
                counter += 1;

                return (
                  <li key={step.title} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border border-ink-700 bg-ink-950 text-[10px] font-semibold tabular-nums text-brand-300"
                    >
                      {counter}
                    </span>
                    <h4 className="text-[15px] font-semibold text-white">{step.title}</h4>
                    <p className="measure mt-1.5 text-[15px] leading-relaxed text-fog-400">
                      {step.description}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>

      <Screenshot
        id="pipeline"
        alt="Pipeline comercial em Kanban, com colunas de etapa e cards de pré-venda"
        caption="O valor somado aparece na própria coluna, então o supervisor lê o funil sem abrir relatório."
      />
    </Section>
  );
}

export function DemoSection() {
  const { testAccess } = demoLabels;
  // Com um ambiente público configurado, o botão leva direto a ele.
  // Sem isso, o acesso de avaliação passa pelo comercial, como combinado.
  const externo = Boolean(siteConfig.demoUrl);
  const href = siteConfig.demoUrl || whatsappLink(testAccess.whatsappMessage);

  return (
    <Section id="demonstrativo" tone="panel">
      <Eyebrow>{demoLabels.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl">{demoLabels.title}</SectionTitle>
      <Lead>{demoLabels.intro}</Lead>

      <div className="mt-10">
        <InteractiveDemo />
      </div>

      <div className="mt-12 flex flex-col gap-5 border-t border-ink-800 pt-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{testAccess.title}</h3>
          <p className="measure mt-2 text-[15px] leading-relaxed text-fog-400">
            {testAccess.description}
          </p>
        </div>
        <a
          href={href}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-ink-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-fog-600"
        >
          {externo ? testAccess.ctaExternal : testAccess.cta}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </Section>
  );
}

export function Modules() {
  const groups = ["Operação", "Crescimento", "Gestão"];

  return (
    <Section id="modulos" tone="light">
      <Eyebrow tone="light">{modules.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{modules.title}</SectionTitle>
      <Lead tone="light">{modules.intro}</Lead>

      <div className="mt-12 space-y-10">
        {groups.map((group) => (
          <div key={group}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-fog-600">
              {group}
            </h3>
            <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-fog-200 bg-fog-200 sm:grid-cols-2 lg:grid-cols-3">
              {modules.items
                .filter((item) => item.group === group)
                .map((item) => (
                  <article key={item.name} className="bg-white p-5">
                    <h4 className="text-[15px] font-semibold text-ink-950">{item.name}</h4>
                    <p className="mt-2 text-[14px] leading-relaxed text-fog-600">
                      {item.description}
                    </p>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Screenshot
        id="empresas"
        alt="Lista de empresas da plataforma com módulos ativos, usuários contratados e armazenamento"
        caption="Cada empresa carrega os próprios módulos, limite de usuários e situação — ativa, em teste ou suspensa."
        tone="light"
      />
    </Section>
  );
}

export function Workspaces() {
  return (
    <Section tone="bone">
      <Eyebrow tone="bone">{workspaces.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{workspaces.title}</SectionTitle>
      <Lead tone="bone">{workspaces.intro}</Lead>

      <dl className="mt-12 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
        {workspaces.items.map((item) => (
          <div key={item.name} className="border-l-2 border-brand-500 pl-4">
            <dt className="text-[15px] font-semibold text-ink-950">{item.name}</dt>
            <dd className="mt-1.5 text-[14px] leading-relaxed text-fog-600">{item.description}</dd>
          </div>
        ))}
      </dl>

      <Screenshot
        id="cliente"
        alt="Cadastro de cliente dividido em abas, exibindo a linha do tempo"
        caption="A linha do tempo se alimenta sozinha: mudança de etapa, documento anexado e simulação entram com autor e data."
        tone="light"
      />
    </Section>
  );
}

export function Simulations() {
  return (
    <Section id="simulacoes" tone="dark">
      <Eyebrow>{simulations.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl">{simulations.title}</SectionTitle>
      <Lead>{simulations.intro}</Lead>
      <CheckList items={simulations.items} columns={2} />

      <Screenshot
        id="simulacao"
        alt="Tela de simulação revisional com dados do contrato, percentual de redução e resultados"
        caption="O relatório em PDF e a imagem-resumo já saem numerados com o protocolo da simulação."
      />
    </Section>
  );
}

export function Legal() {
  return (
    <Section id="juridico" tone="light">
      <Eyebrow tone="light">{legal.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{legal.title}</SectionTitle>
      <Lead tone="light">{legal.intro}</Lead>
      <CheckList items={legal.items} tone="light" columns={2} />

      <Screenshot
        id="esteira-juridica"
        alt="Esteira jurídica em colunas configuráveis, com documentos esperados por etapa"
        caption="Exemplo de configuração. Cada coluna declara o que espera receber, e o card mostra responsável e tempo parado."
        tone="light"
      />
    </Section>
  );
}
