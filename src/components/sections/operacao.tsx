import { ShieldCheck } from "lucide-react";
import { CheckList, Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { Screenshot } from "@/components/site/screenshot";
import {
  academy,
  dashboards,
  implementation,
  integrations,
  portal,
  security,
} from "@/content/site";

export function Integrations() {
  return (
    <Section id="integracoes" tone="bone">
      <Eyebrow tone="bone">{integrations.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{integrations.title}</SectionTitle>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-fog-200 bg-fog-200 lg:grid-cols-3">
        {integrations.main.map((item) => (
          <article key={item.name} className="bg-white p-6">
            <h3 className="text-base font-semibold text-ink-950">{item.name}</h3>
            <p className="mt-2.5 text-[14px] leading-relaxed text-fog-600">{item.description}</p>
          </article>
        ))}
      </div>

      <h3 className="mt-14 text-xs font-semibold uppercase tracking-[0.18em] text-fog-600">
        Automações que rodam sozinhas
      </h3>
      <CheckList items={integrations.automations} tone="bone" columns={2} />

      <Screenshot
        id="distribuicao-leads"
        alt="Tela de distribuição de leads, mostrando linhas novas importadas e carga por consultor"
        caption="A contagem de linhas ignoradas é o que prova a importação incremental: rodar de novo não recria ninguém."
        tone="light"
      />
    </Section>
  );
}

export function Portal() {
  return (
    <Section id="portal" tone="dark">
      <Eyebrow>{portal.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl">{portal.title}</SectionTitle>
      <Lead>{portal.intro}</Lead>
      <CheckList items={portal.items} columns={2} />

      <Screenshot
        id="portal-cliente"
        alt="Portal público de acompanhamento, com CPF mascarado, protocolo e atualizações liberadas"
        caption="É a única tela que o cliente final enxerga, e ela mostra exclusivamente o que foi liberado."
      />
    </Section>
  );
}

export function Dashboards() {
  return (
    <Section id="paineis" tone="light">
      <Eyebrow tone="light">{dashboards.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{dashboards.title}</SectionTitle>
      <Lead tone="light">{dashboards.intro}</Lead>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-fog-600">
            Painel comercial
          </h3>
          <CheckList items={dashboards.commercial} tone="light" />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-fog-600">
            Financeiro
          </h3>
          <CheckList items={dashboards.finance} tone="light" />
        </div>
      </div>

      <Screenshot
        id="painel-comercial"
        alt="Painel comercial com meta, vendas, comissão, ranking de consultores e origem do lead"
        caption="Meta, restante e comissão saem dos pagamentos já lançados na pré-venda, não de digitação paralela."
        tone="light"
      />

      <Screenshot
        id="financeiro"
        alt="Tela de lançamentos financeiros com entradas, saídas e chargebacks no período"
        caption="Chargeback é categoria própria, e não uma saída genérica que some no meio do custo fixo."
        tone="light"
      />
    </Section>
  );
}

export function Academy() {
  return (
    <Section id="academy" tone="bone">
      <Eyebrow tone="bone">{academy.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{academy.title}</SectionTitle>
      <Lead tone="bone">{academy.intro}</Lead>
      <CheckList items={academy.items} tone="bone" columns={2} />

      <Screenshot
        id="academy"
        alt="Academy com trilhas de treinamento e acompanhamento de progresso por usuário"
        caption="A gestão vê quem concluiu cada trilha, o que torna o treinamento cobrável em vez de opcional."
        tone="light"
      />
    </Section>
  );
}

export function Security() {
  return (
    <Section id="seguranca" tone="dark">
      <Eyebrow>{security.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl">{security.title}</SectionTitle>
      <Lead>{security.intro}</Lead>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-ink-800 bg-ink-800 sm:grid-cols-2">
        {security.items.map((item) => (
          <article key={item.title} className="bg-ink-950 p-6">
            <div className="flex items-center gap-2.5">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-300" />
              <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-fog-400">{item.description}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Implementation() {
  return (
    <Section id="implantacao" tone="light">
      <Eyebrow tone="light">{implementation.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{implementation.title}</SectionTitle>
      <Lead tone="light">{implementation.intro}</Lead>

      <ol className="mt-12 grid gap-8 sm:grid-cols-2">
        {implementation.steps.map((step, index) => (
          <li key={step.title} className="border-t border-fog-200 pt-5">
            <span className="text-xs font-semibold tabular-nums text-brand-500">
              Etapa {index + 1}
            </span>
            <h3 className="mt-3 text-[17px] font-semibold text-ink-950">{step.title}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-600">{step.description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-fog-200 bg-fog-200 sm:grid-cols-2">
        {[implementation.support, implementation.commercialModel].map((block) => (
          <div key={block.title} className="bg-bone p-6">
            <h3 className="text-[15px] font-semibold text-ink-950">{block.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-fog-600">{block.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
