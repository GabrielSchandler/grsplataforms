import Link from "next/link";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";
import { areas, type Area } from "@/content/areas";
import { Reveal, ScrollProgress } from "@/components/motion/motion";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { MobileCta } from "@/components/site/mobile-cta";
import { CheckList, Eyebrow, Section, SectionTitle } from "@/components/site/primitives";
import { Screenshot } from "@/components/site/screenshot";
import { siteConfig, whatsappLink } from "@/lib/site-config";

export function areaMetadata(area: Area) {
  return {
    title: area.metaTitle,
    description: area.metaDescription,
    alternates: { canonical: `/${area.slug}` },
    openGraph: {
      type: "website" as const,
      locale: "pt_BR",
      url: `${siteConfig.siteUrl}/${area.slug}`,
      siteName: siteConfig.productName,
      title: `${area.metaTitle} — ${siteConfig.productName}`,
      description: area.metaDescription,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: area.headline }],
    },
  };
}

function structuredData(area: Area) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteConfig.siteUrl}/${area.slug}/#pagina`,
        url: `${siteConfig.siteUrl}/${area.slug}`,
        name: area.metaTitle,
        description: area.metaDescription,
        inLanguage: "pt-BR",
        isPartOf: { "@id": `${siteConfig.siteUrl}/#software` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: siteConfig.productName,
            item: siteConfig.siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: area.navLabel,
            item: `${siteConfig.siteUrl}/${area.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.siteUrl}/${area.slug}/#perguntas`,
        mainEntity: area.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export function AreaPage({ area }: { area: Area }) {
  const others = areas.filter((item) => item.slug !== area.slug);
  const ctaHref = whatsappLink(area.whatsappMessage);
  const external = ctaHref.startsWith("http");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(area)) }}
      />
      <ScrollProgress />
      <Header />
      <main id="conteudo">
        {/* Cabeçalho da área */}
        <section id="topo" className="bg-ink-950">
          <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-32 sm:px-8 sm:pt-40">
            <nav aria-label="Trilha" className="text-[13px] text-fog-500">
              <Link href="/" className="transition hover:text-white">
                Início
              </Link>
              <span aria-hidden="true" className="px-2">
                /
              </span>
              <span className="text-fog-300">{area.navLabel}</span>
            </nav>

            <div className="mt-8 max-w-3xl">
              <Reveal>
                <Eyebrow>{area.eyebrow}</Eyebrow>
              </Reveal>
              <Reveal variant="rise" delay={90}>
                <h1 className="font-display mt-5 text-3xl leading-[1.08] font-semibold text-white sm:text-4xl lg:text-5xl">
                  {area.headline}
                </h1>
              </Reveal>
              <Reveal delay={190}>
                <p className="measure mt-6 text-lg leading-relaxed text-fog-300">{area.lead}</p>
              </Reveal>
              <Reveal delay={280}>
                <a
                  href={ctaHref}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="sweep mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white"
                >
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Agendar demonstração
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Blocos de conteúdo, alternando fundo para quebrar a monotonia */}
        {area.blocks.map((block, index) => (
          <Section key={block.title} tone={index % 2 === 0 ? "light" : "bone"}>
            <Reveal>
              <h2 className="font-display max-w-3xl text-2xl leading-snug font-semibold text-ink-950 sm:text-3xl">
                {block.title}
              </h2>

              {block.paragraph ? (
                <p className="measure mt-5 text-base leading-relaxed text-fog-600 sm:text-[17px]">
                  {block.paragraph}
                </p>
              ) : null}
            </Reveal>

            {block.items ? (
              <Reveal delay={100}>
                <CheckList items={block.items} tone="light" columns={2} />
              </Reveal>
            ) : null}

            {block.screenshot ? (
              <Screenshot
                id={block.screenshot.id}
                alt={block.screenshot.alt}
                caption={block.screenshot.caption}
                tone="light"
              />
            ) : null}
          </Section>
        ))}

        {/* Perguntas da área */}
        <Section id="perguntas" tone="dark">
          <Eyebrow>Perguntas frequentes</Eyebrow>
          <SectionTitle className="max-w-3xl">Sobre {area.navLabel.toLowerCase()}.</SectionTitle>

          <div className="mt-10 border-t border-ink-800">
            {area.faq.map((item) => (
              <details key={item.question} className="group border-b border-ink-800">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[16px] font-semibold text-white marker:content-['']">
                  {item.question}
                  <Plus
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-brand-300 transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="measure pb-6 text-[15px] leading-relaxed text-fog-300">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Section>

        {/* Outras áreas + chamada final */}
        <Section id="demonstracao" tone="panel">
          <Eyebrow>Continue pelo sistema</Eyebrow>
          <SectionTitle className="max-w-3xl">As outras áreas da plataforma.</SectionTitle>

          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-ink-700 bg-ink-700 sm:grid-cols-2">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="group bg-ink-900 p-6 transition hover:bg-ink-850"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-white">{item.cardTitle}</h3>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-brand-300 transition group-hover:translate-x-0.5"
                  />
                </div>
                <p className="mt-2 text-[14px] leading-relaxed text-fog-400">
                  {item.cardDescription}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-ink-700 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="measure text-[17px] font-medium text-white">
              Veja o sistema rodando com a sua operação em mente.
            </p>
            <a
              href={ctaHref}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              Agendar demonstração
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </Section>
      </main>
      <Footer />
      <MobileCta message={area.whatsappMessage} />
    </>
  );
}
