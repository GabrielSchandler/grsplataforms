import { ArrowRight } from "lucide-react";
import { ParallaxLayer, Reveal } from "@/components/motion/motion";
import {
  Eyebrow,
  Lead,
  Section,
  SectionTitle,
} from "@/components/site/primitives";
import { AcaoPrincipal, AcaoSecundaria, TopoProduto } from "@/components/site/topo-produto";
import { benefitStrip, hero, problems, trial } from "@/content/site";
import {
  CONTACT_ANCHOR,
  primaryCtaHref,
  whatsappLink,
} from "@/lib/site-config";

export function Hero() {
  const ctaHref = primaryCtaHref(hero.whatsappMessage);
  const testeHref = whatsappLink(trial.whatsappMessage);

  return (
    <TopoProduto
      produto="crm"
      eyebrow={hero.eyebrow}
      titulo={hero.title}
      subtitulo={hero.subtitle}
      garantias={hero.trustChips}
      nota={hero.trustLine}
      acoes={
        <>
          <AcaoPrincipal href={ctaHref}>
            {hero.primaryCta}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </AcaoPrincipal>
          <AcaoSecundaria href={testeHref}>{hero.secondaryCta}</AcaoSecundaria>
          <a
            href="#demonstrativo"
            className="hidden items-center justify-center gap-2 px-1 py-3.5 text-sm font-semibold text-fog-300 underline-offset-4 transition-colors hover:text-white hover:underline sm:inline-flex"
          >
            {hero.tertiaryCta}
          </a>
        </>
      }
      fundo={
        <>
          {/* A cena: fotografia de ambiente, bem ao fundo. A interface de
              verdade vem por cima, na composição do computador e do celular. */}
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
              {/* O maior arquivo tem 1672px porque essa e a largura do
                  original da cena. Declarar 2560w serviria um arquivo
                  ampliado por interpolacao: mesmo borrao, mais bytes. Quem
                  trocar a foto por uma maior, atualize os tres numeros. */}
              <source type="image/avif" srcSet="/img/hero/cena-1672.avif" />
              <source
                type="image/webp"
                srcSet="/img/hero/cena-1280.webp 1280w, /img/hero/cena-1672.webp 1672w"
                sizes="100vw"
              />
              <img
                src="/img/hero/cena-1672.webp"
                alt=""
                width={1672}
                height={716}
                decoding="async"
                className="hero-scene h-[112vh] w-full object-cover"
              />
            </picture>
          </ParallaxLayer>

          {/* Escurecimento: o texto fica legível e a foto vira atmosfera. */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-950/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/75" />

          {/* Varredura de luz: só no desktop. Em tela estreita ela não é
              percebida e ainda empurrava a largura da página. */}
          <div className="absolute inset-y-0 left-0 hidden w-[40%] overflow-hidden sm:block">
            <div className="scan-line h-full w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </>
      }
    />
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
            <h2 className="text-sm font-semibold text-white">
              {benefit.title}
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-fog-400">
              {benefit.description}
            </p>
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
        <SectionTitle className="max-w-3xl text-ink-950">
          {problems.title}
        </SectionTitle>
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
            <span className="text-xs font-semibold tabular-nums text-brand-600">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-[17px] font-semibold leading-snug text-ink-950">
              {item.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog-600">
              {item.description}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="mt-12 text-[15px] text-ink-800">
          <a
            href={CONTACT_ANCHOR}
            /* brand-600, não brand-500: este link fica sobre fundo claro, e
               o vermelho da marca não alcança 4,5:1 ali. Mesma lógica do
               brand-300 no escuro — um tom por tipo de fundo. */
            className="group inline-flex items-center gap-2 font-semibold text-brand-600 underline-offset-4 hover:underline"
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
