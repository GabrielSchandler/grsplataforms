import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { Analytics } from "@/components/site/analytics";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

/**
 * Sora é a tipografia da marca NewSec, e aqui ela serve título e corpo.
 * Uma família só derruba um arquivo de fonte da primeira dobra em relação
 * ao par anterior (Fraunces + Inter).
 */
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const title = `${siteConfig.productName} — sistema de operação do lead ao pós-atendimento`;
const description =
  "Comercial, jurídico, financeiro, documentos e treinamento em um só sistema, no ambiente configurado com a identidade da sua empresa. Relatórios e contratos gerados pelo próprio sistema, esteira jurídica configurável e módulos conforme o pacote contratado. Agende uma demonstração ou teste grátis por 7 dias.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: title,
    template: `%s — ${siteConfig.productName}`,
  },
  description,
  applicationName: siteConfig.productName,
  keywords: [
    "sistema de gestão para assessoria de crédito",
    "CRM para assessoria",
    "CRM com esteira jurídica",
    "software para escritório de advocacia e comercial",
    "sistema com relatório de simulação automático",
  ],
  authors: [{ name: siteConfig.vendorName }],
  creator: siteConfig.vendorName,
  publisher: siteConfig.vendorName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.siteUrl,
    siteName: siteConfig.productName,
    title,
    description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.productName} — painel comercial em ambiente demonstrativo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={sora.variable}>
      <head>
        {/* Rede de segurança do sistema de revelação.
            
            O estado inicial de [data-reveal] é opacity:0, e quem devolve a
            opacidade é o IntersectionObserver. Sem JavaScript o observador
            nunca roda e o texto simplesmente não aparece: medido em
            1.325 palavras invisíveis na home, 630 em /comercial, 570 em
            /gestao e 371 em /juridico.

            A proteção que existia — esconder o estado inicial dentro de
            @media (prefers-reduced-motion: no-preference) — só cobre quem
            pediu menos movimento. Não cobre JavaScript bloqueado, quebrado
            ou ainda não carregado, que é quando o problema realmente
            acontece. Esta regra cobre. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important;filter:none!important}`}</style>
        </noscript>

        {/* Só a cena do hero é pré-carregada: é o único recurso acima da
            dobra que decide a primeira impressão. O resto entra preguiçoso. */}
        <link
          rel="preload"
          as="image"
          href="/img/hero/cena-1672.avif"
          type="image/avif"
          media="(min-width: 641px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/img/hero/cena-mobile.avif"
          type="image/avif"
          media="(max-width: 640px)"
          fetchPriority="high"
        />
      </head>
      <body className="bg-ink-950 text-white antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Pular para o conteúdo
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
