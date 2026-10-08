import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { privacidade } from "@/content/privacidade";

export const metadata: Metadata = {
  title: privacidade.title,
  description:
    "Como os dados são tratados no site da NewSec: o que é coletado, com quem é compartilhado e como exercer seus direitos.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <>
      {/* Mesmo cabeçalho do resto do site, com os três produtos à vista: quem
          chega aqui pelo rodapé não pode ficar numa página sem saída. */}
      <Header marca />
      <main id="conteudo" className="bg-ink-950">
        <div className="mx-auto w-full max-w-3xl px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-40">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-fog-400 transition hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Voltar ao site
          </Link>

          <h1 className="font-display mt-8 text-3xl font-semibold text-white sm:text-4xl">
            {privacidade.title}
          </h1>
          <p className="mt-3 text-sm text-fog-500">
            Última atualização: {privacidade.updatedAt}
          </p>
          <p className="measure mt-6 text-base leading-relaxed text-fog-300">
            {privacidade.intro}
          </p>

          <div className="mt-14 space-y-12">
            {privacidade.sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="measure text-[15px] leading-relaxed text-fog-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
