import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SystemDemo } from "@/components/demo/system-demo";
import { Reveal } from "@/components/motion/motion";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { areas } from "@/content/areas";
import { areasIndex, demoLabels, hero } from "@/content/site";
import { primaryCtaHref, siteConfig, whatsappLink } from "@/lib/site-config";

export function DemoSection() {
  const testAccess = demoLabels.testAccess;
  const testHref = siteConfig.demoUrl || whatsappLink(testAccess.whatsappMessage);
  const external = testHref.startsWith("http");

  return (
    <Section id="demonstrativo" tone="panel">
      <Reveal>
        <Eyebrow>{demoLabels.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl">{demoLabels.title}</SectionTitle>
        <Lead>{demoLabels.intro}</Lead>
      </Reveal>

      <Reveal delay={120} className="mt-10">
        <SystemDemo />
      </Reveal>

      <Reveal delay={80}>
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
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-ink-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-fog-600"
          >
            {siteConfig.demoUrl ? testAccess.ctaExternal : testAccess.cta}
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

/** Índice das cinco áreas — é por aqui que a home entrega o aprofundamento. */
export function AreasIndex() {
  const ctaHref = primaryCtaHref(hero.whatsappMessage);
  const ctaExternal = ctaHref.startsWith("http");

  return (
    <Section id="areas" tone="light">
      <Reveal>
        <Eyebrow tone="light">{areasIndex.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{areasIndex.title}</SectionTitle>
        <Lead tone="light">{areasIndex.intro}</Lead>
      </Reveal>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-fog-200 bg-fog-200 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area, index) => (
          <Reveal key={area.slug} delay={(index % 3) * 90}>
            <Link
              href={`/${area.slug}`}
              className="group flex h-full flex-col bg-white p-6 transition-colors duration-300 hover:bg-bone"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[17px] font-semibold text-ink-950">{area.cardTitle}</h3>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-brand-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
              <p className="mt-2.5 text-[14px] leading-relaxed text-fog-600">
                {area.cardDescription}
              </p>
              <span
                aria-hidden="true"
                className="mt-5 h-px w-full origin-left scale-x-0 bg-brand-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
            </Link>
          </Reveal>
        ))}

        {/* São cinco áreas em grade de três colunas: esta célula fecha a
            grade e aproveita o espaço para uma chamada, em vez de deixar
            um buraco cinza no canto. */}
        <Reveal delay={180}>
          <a
            href={ctaHref}
            {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex h-full flex-col justify-between bg-ink-950 p-6 text-white transition-colors duration-300 hover:bg-ink-900"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[17px] font-semibold">Não sabe por onde começar?</h3>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-brand-300 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
        </Reveal>
      </div>
    </Section>
  );
}
