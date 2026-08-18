import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@/components/site/analytics";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const title = `${siteConfig.productName} — sistema de operação do lead ao pós-atendimento`;
const description =
  "Comercial, jurídico, financeiro, documentos e trilhas de treinamento em um só sistema, em um ambiente configurado com a identidade da sua empresa. Relatórios e documentos gerados pelo próprio sistema, esteira jurídica configurável e módulos conforme o pacote contratado. Agende uma demonstração.";

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
    "sistema para empresa de revisão de juros",
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
    <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        {/* Só a cena do hero é pré-carregada: é o único recurso acima da
            dobra que decide a primeira impressão. O resto entra preguiçoso. */}
        <link
          rel="preload"
          as="image"
          href="/img/hero/cena-2560.avif"
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
