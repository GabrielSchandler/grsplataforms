import { notFound } from "next/navigation";
import { ConversaHero } from "@/components/chat/secoes";
import { PainelComercial } from "@/components/demo/screens-comercial";
import { screenMap } from "@/components/demo/screen-map";
import { PreviaPainel } from "@/components/focus/topo";
import { LogoMark } from "@/components/site/logo";
import { hero } from "@/content/site";
import { fonteFocus, fonteFocusMono } from "@/lib/fontes-focus";
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
  return [
    // Todas as telas da réplica, e não só as abas da home: qualquer uma pode
    // virar imagem de página ou peça de divulgação.
    ...Object.keys(screenMap).map((id) => ({ id })),
    { id: "og" },
    { id: "og-focus" },
    { id: "og-chat" },
  ];
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

      <div className="relative flex items-center gap-3 text-white">
        <LogoMark className="h-12 w-auto" />
        <span className="text-3xl font-extrabold uppercase tracking-[0.02em]">
          NewSec
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

/** A mesma peça, para o Focus: o painel dele no lugar do painel comercial. */
function OpenGraphFocusCard() {
  return (
    <div
      id="alvo"
      className={`relative flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden bg-ink-950 p-16 ${fonteFocus.variable} ${fonteFocusMono.variable}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-16 w-[1100px] opacity-[0.22]">
          <div className="overflow-hidden rounded-lg border border-foco-borda">
            <PreviaPainel />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/92 to-ink-950/50" />
      </div>

      <div className="relative flex items-center gap-3 text-white">
        <LogoMark className="h-12 w-auto" />
        <span className="text-3xl font-extrabold uppercase tracking-[0.02em]">NewSec</span>
        <span className="rounded bg-cyan-500/15 px-3 py-1 text-xl font-semibold text-cyan-300">
          Focus
        </span>
      </div>

      <div className="relative max-w-3xl">
        <h1 className="font-display text-[54px] leading-[1.05] font-semibold text-white">
          Veja para onde vai o tempo da sua equipe.
        </h1>
        <p className="mt-6 text-2xl text-fog-400">
          Sem captura de tela e sem registrar o que é digitado.
        </p>
      </div>

      <div className="relative flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-10 bg-brand-500" />
        <span className="text-lg text-fog-500">newsec.com.br/focus</span>
      </div>
    </div>
  );
}

/** A do Chat: a conversa atendida pela IA e assumida pela equipe. */
function OpenGraphChatCard() {
  return (
    <div
      id="alvo"
      className="relative flex h-[630px] w-[1200px] flex-col justify-between overflow-hidden bg-ink-950 p-16"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute right-12 top-12 w-[420px]">
          <ConversaHero />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-transparent" />
      </div>

      <div className="relative flex items-center gap-3 text-white">
        <LogoMark className="h-12 w-auto" />
        <span className="text-3xl font-extrabold uppercase tracking-[0.02em]">NewSec</span>
        <span className="rounded bg-violet-500/15 px-3 py-1 text-xl font-semibold text-violet-300">
          Chat
        </span>
      </div>

      <div className="relative max-w-[620px]">
        <h1 className="font-display text-[54px] leading-[1.05] font-semibold text-white">
          WhatsApp com IA, equipe e campanhas.
        </h1>
        <p className="mt-6 text-2xl text-fog-400">A IA responde na hora e para quando alguém assume.</p>
      </div>

      <div className="relative flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-10 bg-brand-500" />
        <span className="text-lg text-fog-500">newsec.com.br/chat</span>
      </div>
    </div>
  );
}

export default async function CapturePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === "og") {
    return <OpenGraphCard />;
  }

  if (id === "og-focus") {
    return <OpenGraphFocusCard />;
  }

  if (id === "og-chat") {
    return <OpenGraphChatCard />;
  }

  const screen = screenMap[id];

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
