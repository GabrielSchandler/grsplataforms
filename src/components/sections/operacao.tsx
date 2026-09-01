import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Reveal, Spotlight } from "@/components/motion/motion";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { implementation, securityTeaser } from "@/content/site";

export function SecurityTeaser() {
  return (
    <Section id="seguranca" tone="dark">
      <Reveal>
        <Eyebrow>{securityTeaser.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl">{securityTeaser.title}</SectionTitle>
        <Lead>{securityTeaser.intro}</Lead>
      </Reveal>

      {/* O realce segue o ponteiro sobre a grade, dando profundidade sem
          nenhum enfeite adicional. Fica inerte em tela de toque. */}
      <Spotlight className="mt-12 overflow-hidden rounded-lg border border-ink-800">
        <div className="grid gap-px bg-ink-800 sm:grid-cols-3">
          {securityTeaser.highlights.map((item, index) => (
            <Reveal key={item.title} as="article" delay={index * 110} className="bg-ink-950 p-6">
              <div className="flex items-center gap-2.5">
                <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-300" />
                <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
              </div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-fog-400">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </Spotlight>

      <Reveal delay={120}>
        <Link
          href={securityTeaser.href}
          className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 underline-offset-4 hover:underline"
        >
          {securityTeaser.cta}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </Reveal>
    </Section>
  );
}

export function Implementation() {
  return (
    <Section id="implantacao" tone="light">
      <Reveal>
        <Eyebrow tone="light">{implementation.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{implementation.title}</SectionTitle>
        <Lead tone="light">{implementation.intro}</Lead>
      </Reveal>

      <ol className="mt-12 grid gap-8 sm:grid-cols-2">
        {implementation.steps.map((step, index) => (
          <Reveal
            key={step.title}
            as="li"
            delay={(index % 2) * 110}
            className="border-t border-fog-200 pt-5"
          >
            <span className="text-xs font-semibold tabular-nums text-brand-600">
              Etapa {index + 1}
            </span>
            <h3 className="mt-3 text-[17px] font-semibold text-ink-950">{step.title}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-600">{step.description}</p>
          </Reveal>
        ))}
      </ol>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-fog-200 bg-fog-200 sm:grid-cols-2">
        {[implementation.support, implementation.commercialModel].map((block, index) => (
          <Reveal key={block.title} delay={index * 110} className="bg-bone p-6">
            <h3 className="text-[15px] font-semibold text-ink-950">{block.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-fog-600">{block.description}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
