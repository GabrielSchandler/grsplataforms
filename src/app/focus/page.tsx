import type { Metadata } from "next";
import { ScrollProgress } from "@/components/motion/motion";
import { FaixaNumeros, HeroFocus, SecaoDemo } from "@/components/focus/topo";
import {
  SecaoAcessos,
  SecaoCelular,
  SecaoChamadaFinal,
  SecaoColeta,
  SecaoImplantacao,
  SecaoOferta,
  SecaoPerguntas,
  SecaoRespostas,
} from "@/components/focus/secoes";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { MobileCta } from "@/components/site/mobile-cta";
import { focusFaq, focusMensagens, focusMeta, focusNav } from "@/content/focus";
import { fonteFocus, fonteFocusMono } from "@/lib/fontes-focus";
import { siteConfig } from "@/lib/site-config";

/**
 * Página do NewSec Focus.
 *
 * O CRM continua na home, com os mesmos endereços de sempre: o Focus entra ao
 * lado, com título, descrição, dados estruturados e imagem de compartilhamento
 * próprios. As duas páginas disputam buscas diferentes — "CRM para assessoria"
 * de um lado, "monitoramento de produtividade" do outro — e por isso somam em
 * vez de competir.
 */

export const metadata: Metadata = {
  // Absoluto: o sufixo padrão do site é a marca, e aqui o nome do produto já
  // aparece no começo do título.
  title: { absolute: focusMeta.title },
  description: focusMeta.description,
  keywords: focusMeta.keywords,
  alternates: { canonical: "/focus" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${siteConfig.siteUrl}/focus`,
    siteName: siteConfig.brandName,
    title: focusMeta.title,
    description: focusMeta.description,
    images: [
      {
        url: "/og-focus.png",
        width: 1200,
        height: 630,
        alt: "NewSec Focus — painel de produtividade em ambiente demonstrativo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: focusMeta.title,
    description: focusMeta.description,
    images: ["/og-focus.png"],
  },
};

const dadosEstruturados = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.siteUrl}/focus/#software`,
      name: "NewSec Focus",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Monitoramento de produtividade",
      operatingSystem: "Windows 10 e Windows 11 (agente); navegador e celular (painel)",
      url: `${siteConfig.siteUrl}/focus`,
      inLanguage: "pt-BR",
      description:
        "Telemetria de produtividade para estações Windows: tempo ativo, uso de aplicativos e sites, horas extras e aderência à jornada, por pessoa, equipe e período.",
      publisher: { "@id": `${siteConfig.siteUrl}/#organizacao` },
      // Cada item existe no produto. Nada aqui é promessa de próxima versão.
      featureList: [
        "Registro de um minuto por estação, com o aplicativo em primeiro plano e o estado de atividade",
        "Índice de produtividade por pessoa, equipe e período",
        "Classificação de aplicativos e sites definida pela própria empresa",
        "Horas extras calculadas a partir da janela de expediente",
        "Linha do tempo das estações: ligou, bloqueou a tela, hibernou e desligou",
        "Aviso quando uma estação para de enviar",
        "Exportação em XLSX e CSV com o mesmo recorte do painel",
        "Painel instalável no celular, sem passar por loja de aplicativos",
        "Acesso por papel, com líder de equipe restrito à própria equipe",
        "Coleta de metadados apenas: sem captura de tela e sem registro do que é digitado",
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        description:
          "Contratação por número de estações monitoradas. Valor apresentado em proposta.",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.siteUrl}/focus/#perguntas`,
      mainEntity: focusFaq.itens.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteConfig.siteUrl}/focus/#trilha`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: siteConfig.brandName,
          item: siteConfig.siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "NewSec Focus",
          item: `${siteConfig.siteUrl}/focus`,
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}/focus/#pagina`,
      url: `${siteConfig.siteUrl}/focus`,
      name: focusMeta.title,
      description: focusMeta.description,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${siteConfig.siteUrl}/focus/#software` },
    },
  ],
};

export default function PaginaFocus() {
  return (
    // As fontes do painel valem só nesta página: a marca continua em Sora.
    <div className={`${fonteFocus.variable} ${fonteFocusMono.variable}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />
      <ScrollProgress />
      <Header produto="focus" />
      <main id="conteudo">
        <HeroFocus />
        <FaixaNumeros />
        <SecaoDemo />
        <SecaoRespostas />
        <SecaoCelular />
        <SecaoColeta />
        <SecaoImplantacao />
        <SecaoAcessos />
        <SecaoOferta />
        <SecaoPerguntas />
        <SecaoChamadaFinal />
      </main>
      <Footer />
      <MobileCta message={focusMensagens.teste} rotulo={focusNav.cta} />
    </div>
  );
}
