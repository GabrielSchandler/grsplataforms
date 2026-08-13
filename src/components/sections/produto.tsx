import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { InteractiveDemo } from "@/components/demo/interactive-demo";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { areas } from "@/content/areas";
import { areasIndex, demoLabels, hero, journey } from "@/content/site";
import { primaryCtaHref, siteConfig, whatsappLink } from "@/lib/site-config";

export function DemoSection() {
  const testAccess = demoLabels.testAccess;
  const testHref = siteConfig.demoUrl || whatsappLink(testAccess.whatsappMessage);
  const external = testHref.startsWith("http");

  return (
    <Section id="demonstrativo" tone="panel">
      <Eyebrow>{demoLabels.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl">{demoLabels.title}</SectionTitle>
      <Lead>{demoLabels.intro}</Lead>

      <div className="mt-10">
        <InteractiveDemo />
      </div>

      <div className="mt-12 flex flex-col gap-5 border-t border-ink-700 pt-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[17px] font-semibold text-white">{testAccess.title}</h3>
          <p className="measure mt-2 text-[15px] leading-relaxed text-fog-400">
            {testAccess.description}
          </p>
        </div>
        <a
          href={testHref}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-ink-700 px-5 py-3 text-sm font-semibold text-white transition hover:border-fog-600"
        >
          {siteConfig.demoUrl ? testAccess.ctaExternal : testAccess.cta}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </Section>
  );
}

export function Journey() {
  return (
    <Section id="jornada" tone="dark">
      <Eyebrow>{journey.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl">{journey.title}</SectionTitle>
      <Lead>{journey.intro}</Lead>

      <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-ink-800 bg-ink-800 sm:grid-cols-2">
        {journey.phases.map((phase, index) => (
          <li key={phase.name} className="bg-ink-950 p-6">
            <span className="text-xs font-semibold tabular-nums text-brand-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-[17px] font-semibold text-white">{phase.name}</h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-400">{phase.description}</p>
            <Link
              href={phase.href}
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-300 underline-offset-4 hover:underline"
            >
              Ver em detalhe
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** Índice das cinco áreas — é por aqui que a home entrega o aprofundamento. */
export function AreasIndex() {
  const ctaHref = primaryCtaHref(hero.whatsappMessage);
  const ctaExternal = ctaHref.startsWith("http");

  return (
    <Section id="areas" tone="light">
      <Eyebrow tone="light">{areasIndex.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{areasIndex.title}</SectionTitle>
      <Lead tone="light">{areasIndex.intro}</Lead>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-fog-200 bg-fog-200 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <Link
            key={area.slug}
            href={`/${area.slug}`}
            className="group flex flex-col bg-white p-6 transition hover:bg-bone"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[17px] font-semibold text-ink-950">{area.cardTitle}</h3>
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-brand-500 transition group-hover:translate-x-0.5"
              />
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-fog-600">
              {area.cardDescription}
            </p>
          </Link>
        ))}

        {/* São cinco áreas em grade de três colunas: esta célula fecha a
            grade e aproveita o espaço para uma chamada, em vez de deixar
            um buraco cinza no canto. */}
        <a
          href={ctaHref}
          {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="group flex flex-col justify-between bg-ink-950 p-6 text-white transition hover:bg-ink-900"
        >
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-[17px] font-semibold">Não sabe por onde começar?</h3>
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-brand-300 transition group-hover:translate-x-0.5"
              />
            </div>
            <p className="mt-2.5 text-[14px] leading-relaxed text-fog-400">
              Na demonstração avaliamos quais áreas fazem sentido para o tamanho da sua
              operação.
            </p>
          </div>
          <span className="mt-5 text-[13px] font-semibold text-brand-300">
            Agendar demonstração
          </span>
        </a>
      </div>
    </Section>
  );
}
