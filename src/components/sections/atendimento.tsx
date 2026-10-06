import Link from "next/link";
import { ArrowUpRight, MousePointerClick } from "lucide-react";
import { ScaledStage } from "@/components/demo/scaled-stage";
import { AtendimentoWhatsApp } from "@/components/demo/screens-atendimento";
import { Reveal } from "@/components/motion/motion";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { atendimento } from "@/content/site";

/**
 * Atendimento por WhatsApp com IA, dentro do CRM.
 *
 * A tela entra viva, e não como imagem: as abas Meus, Outros e IA respondem
 * ao clique, que é a forma mais curta de mostrar o que a IA faz com o contato
 * novo. A seção fecha apontando para o NewSec Chat, que é a central completa.
 */
export function Atendimento() {
  return (
    <Section id="atendimento" tone="bone">
      <Reveal>
        <Eyebrow tone="bone">{atendimento.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{atendimento.title}</SectionTitle>
        <Lead tone="bone">{atendimento.intro}</Lead>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900 p-2">
          <ScaledStage>
            <div className="overflow-hidden rounded border border-slate-200">
              <AtendimentoWhatsApp />
            </div>
          </ScaledStage>
        </div>
        <p className="mt-3 flex items-start gap-2 text-[13px] leading-relaxed text-fog-600">
          <MousePointerClick aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
          {atendimento.demoNote}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {atendimento.items.map((item, indice) => (
          <Reveal
            key={item.title}
            as="article"
            delay={(indice % 3) * 110}
            className="border-t border-fog-200 pt-5"
          >
            <h3 className="text-[17px] font-semibold leading-snug text-ink-950">{item.title}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-600">{item.description}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={100}>
        <Link
          href={atendimento.chat.href}
          className="group mt-12 flex flex-col gap-4 rounded-lg bg-ink-950 p-6 text-white transition-colors duration-300 hover:bg-ink-900 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="text-[17px] font-semibold">{atendimento.chat.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-fog-400">{atendimento.chat.description}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 text-[13px] font-semibold text-brand-300">
            {atendimento.chat.cta}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </Link>
      </Reveal>
    </Section>
  );
}
