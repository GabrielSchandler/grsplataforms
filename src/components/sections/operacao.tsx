import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { implementation, securityTeaser } from "@/content/site";

export function SecurityTeaser() {
  return (
    <Section id="seguranca" tone="dark">
      <Eyebrow>{securityTeaser.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl">{securityTeaser.title}</SectionTitle>
      <Lead>{securityTeaser.intro}</Lead>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-ink-800 bg-ink-800 sm:grid-cols-3">
        {securityTeaser.highlights.map((item) => (
          <article key={item.title} className="bg-ink-950 p-6">
            <div className="flex items-center gap-2.5">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-300" />
              <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-fog-400">{item.description}</p>
          </article>
        ))}
      </div>

      <Link
        href={securityTeaser.href}
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 underline-offset-4 hover:underline"
      >
        {securityTeaser.cta}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
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
