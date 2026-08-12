import { ArrowRight } from "lucide-react";
import { PainelComercial } from "@/components/demo/screens-comercial";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { benefitStrip, hero, problems } from "@/content/site";
import { CONTACT_ANCHOR, primaryCtaHref } from "@/lib/site-config";

export function Hero() {
  const ctaHref = primaryCtaHref(hero.whatsappMessage);

  return (
    <section id="topo" className="relative isolate min-h-[92vh] overflow-hidden bg-ink-950">
      {/* Cena de fundo: a própria tela do sistema, escurecida atrás do texto. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-[10%] top-[14%] w-[1500px] opacity-[0.28] blur-[0.4px]">
          <div className="overflow-hidden rounded-lg border border-ink-700">
            <PainelComercial />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/92 to-ink-950/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/80" />
      </div>

      <div className="relative mx-auto flex min-h-[92vh] w-full max-w-6xl flex-col justify-center px-5 pb-24 pt-32 sm:px-8 sm:pt-36">
        <div className="rise max-w-3xl">
          <Eyebrow>{hero.eyebrow}</Eyebrow>

          <h1 className="font-display mt-6 text-4xl leading-[1.05] font-semibold text-white sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>

          <p className="measure mt-6 text-lg leading-relaxed text-fog-300">{hero.subtitle}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={ctaHref}
              {...(ctaHref.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              {hero.primaryCta}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <a
              href="#demonstrativo"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-700 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-fog-600"
            >
              {hero.secondaryCta}
            </a>
          </div>

          <p className="mt-8 flex max-w-md items-start gap-2.5 text-[13px] leading-relaxed text-fog-500">
            <span aria-hidden="true" className="mt-1.5 h-px w-5 shrink-0 bg-brand-500" />
            {hero.trustLine}
          </p>
        </div>
      </div>
    </section>
  );
}

export function BenefitStrip() {
  return (
    <div className="border-y border-ink-800 bg-ink-900">
      <div className="mx-auto grid w-full max-w-6xl gap-px px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {benefitStrip.map((benefit) => (
          <div key={benefit.title} className="py-8 lg:px-6 lg:first:pl-0 lg:last:pr-0">
            <h2 className="text-sm font-semibold text-white">{benefit.title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-fog-400">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Problems() {
  return (
    <Section tone="bone">
      <Eyebrow tone="bone">{problems.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{problems.title}</SectionTitle>
      <Lead tone="bone">{problems.intro}</Lead>

      <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {problems.items.map((item, index) => (
          <article key={item.title} className="border-t border-fog-200 pt-5">
            <span className="text-xs font-semibold tabular-nums text-brand-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-[17px] font-semibold leading-snug text-ink-950">
              {item.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-600">{item.description}</p>
          </article>
        ))}
      </div>

      <p className="mt-12 text-[15px] text-ink-800">
        <a
          href={CONTACT_ANCHOR}
          className="inline-flex items-center gap-2 font-semibold text-brand-500 underline-offset-4 hover:underline"
        >
          Ver como isso fica em um sistema só
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </p>
    </Section>
  );
}
