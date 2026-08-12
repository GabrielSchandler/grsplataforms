import { notFound } from "next/navigation";
import { PainelComercial } from "@/components/demo/screens-comercial";
import { demoScreens } from "@/components/demo/registry";
import { hero } from "@/content/site";
import { siteConfig } from "@/lib/site-config";

/**
 * Páginas usadas apenas para gerar as imagens com o Playwright.
 *
 * O arquivo termina em `.capture.tsx`, extensão que só entra no roteamento
 * quando CAPTURE=1 (ver next.config.ts). No build de produção estas rotas
 * não existem, então nada disso vai para o site publicado.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return [...demoScreens.map((screen) => ({ id: screen.id })), { id: "og" }];
}

export const metadata = {
  robots: { index: false, follow: false },
};

function OpenGraphCard() {
  return (
    <div
      id="alvo"
      className="relative flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden bg-ink-950 p-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 top-24 w-[1100px] opacity-[0.18]">
          <div className="overflow-hidden rounded-lg border border-ink-700">
            <PainelComercial />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/92 to-ink-950/50" />
      </div>

      <div className="relative flex items-baseline gap-3">
        <span className="font-display text-3xl font-semibold text-white">GRS</span>
        <span className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
          Plataforma
        </span>
      </div>

      <div className="relative max-w-3xl">
        <h1 className="font-display text-[56px] leading-[1.05] font-semibold text-white">
          {hero.title}
        </h1>
        <p className="mt-6 text-2xl text-fog-400">
          Comercial, jurídico, financeiro e documentos no mesmo sistema.
        </p>
      </div>

      <div className="relative flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-10 bg-brand-500" />
        <span className="text-lg text-fog-500">{siteConfig.vendorName}</span>
      </div>
    </div>
  );
}

export default async function CapturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "og") {
    return <OpenGraphCard />;
  }

  const screen = demoScreens.find((item) => item.id === id);

  if (!screen) {
    notFound();
  }

  const ScreenComponent = screen.component;

  return (
    <div className="bg-ink-950 p-6">
      <div id="alvo" className="w-[1280px] overflow-hidden rounded-lg border border-slate-200">
        <ScreenComponent />
      </div>
    </div>
  );
}
