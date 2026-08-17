import { ArrowRight } from "lucide-react";
import { PainelComercial } from "@/components/demo/screens-comercial";
import { ParallaxLayer, Reveal } from "@/components/motion/motion";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { benefitStrip, hero, problems } from "@/content/site";
import { CONTACT_ANCHOR, primaryCtaHref } from "@/lib/site-config";

export function Hero() {
  const ctaHref = primaryCtaHref(hero.whatsappMessage);

  return (
    <section id="topo" className="relative isolate min-h-[94vh] overflow-hidden bg-ink-950">
      {/* Camada 1 — a cena. Fotografia de ambiente, não de interface: a
          interface real entra depois, por cima, como réplica em HTML. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <ParallaxLayer speed={0.1} className="absolute inset-0">
          <picture>
            <source
              media="(max-width: 640px)"
              type="image/avif"
              srcSet="/img/hero/cena-mobile.avif"
            />
            <source
              media="(max-width: 640px)"
              type="image/webp"
              srcSet="/img/hero/cena-mobile.webp"
            />
            <source type="image/avif" srcSet="/img/hero/cena-2560.avif" />
            <source
              type="image/webp"
              srcSet="/img/hero/cena-1280.webp 1280w, /img/hero/cena-2560.webp 2560w"
              sizes="100vw"
            />
            <img
              src="/img/hero/cena-2560.webp"
              alt=""
              width={2560}
              height={1097}
              fetchPriority="high"
              decoding="async"
              className="hero-scene h-[112vh] w-full object-cover"
            />
          </picture>
        </ParallaxLayer>

        {/* Camada 2 — escurecimento. O texto fica sobre o terço escuro da
            esquerda, que a própria fotografia já reserva. */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-ink-950/70" />

        {/* Camada 3 — a interface surgindo por baixo, em perspectiva. A
            máscara dissolve a borda esquerda: sem ela o painel invade a
            coluna do texto e engole o subtítulo. */}
        <div
          className="hero-panel absolute -bottom-[8%] right-[-8%] hidden w-[54%] lg:block xl:w-[52%]"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 22%)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 22%)",
          }}
        >
          <div className="overflow-hidden rounded-lg border border-ink-700 shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
            <PainelComercial />
          </div>
        </div>

        <div className="absolute inset-y-0 left-0 w-[40%] overflow-hidden">
          <div className="scan-line h-full w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-[94vh] w-full max-w-6xl flex-col justify-center px-5 pb-28 pt-32 sm:px-8 sm:pt-36">
        <div className="max-w-xl lg:max-w-[34rem] xl:max-w-2xl">
          <Reveal variant="up">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal variant="rise" delay={90}>
            <h1 className="font-display mt-6 text-4xl leading-[1.05] font-semibold text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
          </Reveal>

          <Reveal variant="up" delay={200}>
            <p className="measure mt-6 text-lg leading-relaxed text-fog-300">{hero.subtitle}</p>
          </Reveal>

          <Reveal variant="up" delay={300}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={ctaHref}
                {...(ctaHref.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="sweep inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-white"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  {hero.primaryCta}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </a>
              <a
                href="#demonstrativo"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-fog-600"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </Reveal>

          <Reveal variant="up" delay={400}>
            <p className="mt-8 flex max-w-md items-start gap-2.5 text-[13px] leading-relaxed text-fog-500">
              <span aria-hidden="true" className="mt-[0.62em] h-px w-5 shrink-0 bg-brand-500" />
              {hero.trustLine}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Indicação de que há mais abaixo: um fio que pulsa, sem seta piscando. */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <span className="scroll-cue block h-10 w-px bg-gradient-to-b from-fog-500 to-transparent" />
      </div>
    </section>
  );
}

export function BenefitStrip() {
  return (
    <div className="border-y border-ink-800 bg-ink-900">
      <div className="mx-auto grid w-full max-w-6xl gap-px px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {benefitStrip.map((benefit, index) => (
          <Reveal
            key={benefit.title}
            delay={index * 90}
            className="py-8 lg:px-6 lg:first:pl-0 lg:last:pr-0"
          >
            <h2 className="text-sm font-semibold text-white">{benefit.title}</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-fog-400">{benefit.description}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function Problems() {
  return (
    <Section tone="bone">
      <Reveal>
        <Eyebrow tone="bone">{problems.eyebrow}</Eyebrow>
        <SectionTitle className="max-w-3xl text-ink-950">{problems.title}</SectionTitle>
        <Lead tone="bone">{problems.intro}</Lead>
      </Reveal>

      <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {problems.items.map((item, index) => (
          <Reveal
            key={item.title}
            as="article"
            delay={(index % 3) * 110}
            className="group border-t border-fog-200 pt-5"
          >
            <span className="text-xs font-semibold tabular-nums text-brand-500">
              {String(index + 1).padStart(2, "0")}
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
            href={CONTACT_ANCHOR}
            className="group inline-flex items-center gap-2 font-semibold text-brand-500 underline-offset-4 hover:underline"
          >
            Ver como isso fica em um sistema só
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
