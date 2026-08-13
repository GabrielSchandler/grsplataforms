import { ArrowUpRight, Plus } from "lucide-react";
import { DemoForm } from "@/components/site/demo-form";
import { Eyebrow, Lead, Section, SectionTitle } from "@/components/site/primitives";
import { faq, finalCta } from "@/content/site";
import { whatsappLink } from "@/lib/site-config";

export function Faq() {
  return (
    <Section id="perguntas" tone="bone">
      <Eyebrow tone="bone">{faq.eyebrow}</Eyebrow>
      <SectionTitle className="max-w-3xl text-ink-950">{faq.title}</SectionTitle>
      <Lead tone="bone">{faq.intro}</Lead>

      <div className="mt-12 border-t border-fog-200">
        {faq.items.map((item) => (
          <details key={item.question} className="group border-b border-fog-200">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[16px] font-semibold text-ink-950 marker:content-['']">
              {item.question}
              <Plus
                aria-hidden="true"
                className="mt-1 h-4 w-4 shrink-0 text-brand-500 transition-transform duration-200 group-open:rotate-45"
              />
            </summary>
            <p className="measure pb-6 text-[15px] leading-relaxed text-fog-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

export function FinalCta() {
  const specialistHref = whatsappLink(finalCta.specialistMessage);

  return (
    <Section id="demonstracao" tone="dark">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <Eyebrow>{finalCta.eyebrow}</Eyebrow>
          <SectionTitle>{finalCta.title}</SectionTitle>
          <Lead>{finalCta.description}</Lead>

          <a
            href={specialistHref}
            {...(specialistHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 underline-offset-4 hover:underline"
          >
            {finalCta.specialistCta}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>

        <div className="rounded-lg border border-ink-800 bg-ink-900 p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-white">{finalCta.formTitle}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-fog-400">
            {finalCta.formDescription}
          </p>
          <div className="mt-7">
            <DemoForm />
          </div>
        </div>
      </div>
    </Section>
  );
}
