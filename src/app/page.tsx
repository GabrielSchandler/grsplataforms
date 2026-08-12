import {
  Academy,
  Dashboards,
  Implementation,
  Integrations,
  Portal,
  Security,
} from "@/components/sections/operacao";
import { Faq, FinalCta } from "@/components/sections/fim";
import {
  DemoSection,
  Journey,
  Legal,
  Modules,
  Simulations,
  Workspaces,
} from "@/components/sections/produto";
import { BenefitStrip, Hero, Problems } from "@/components/sections/topo";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { faq, hero } from "@/content/site";
import { siteConfig } from "@/lib/site-config";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.siteUrl}/#organizacao`,
      name: siteConfig.vendorName,
      legalName: siteConfig.legalName,
      taxID: siteConfig.taxId,
      url: siteConfig.siteUrl,
      description:
        "Desenvolvedora da GRS Plataforma, sistema de operação para empresas de serviços com comercial, jurídico e financeiro.",
      ...(siteConfig.email ? { email: siteConfig.email } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.street,
        addressLocality: siteConfig.address.city,
        addressRegion: siteConfig.address.state,
        postalCode: siteConfig.address.zip,
        addressCountry: "BR",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.siteUrl}/#software`,
      name: siteConfig.productName,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "CRM",
      operatingSystem: "Navegador web",
      url: siteConfig.siteUrl,
      inLanguage: "pt-BR",
      description:
        "Sistema multiempresa que reúne comercial, jurídico, financeiro, documentos, portal do cliente e treinamento, com módulos contratados por empresa e esteira jurídica configurável.",
      publisher: { "@id": `${siteConfig.siteUrl}/#organizacao` },
      featureList: [
        "CRM multiempresa com isolamento de dados",
        "Distribuição de leads com importação incremental de planilhas",
        "Pipeline comercial em Kanban",
        "Simulações de veículo, imóvel e empréstimo com relatório em PDF",
        "Geração de documentos por template com variáveis",
        "Esteira jurídica configurável por empresa",
        "Portal de acompanhamento do cliente por CPF e protocolo",
        "Painel comercial e módulo financeiro",
        "Academy com trilhas de treinamento",
        "Backup diário automático com restauração",
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        description:
          "Mensalidade por usuário contratado, mais implantação. Valor apresentado em proposta após diagnóstico.",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.siteUrl}/#perguntas`,
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}/#pagina`,
      url: siteConfig.siteUrl,
      name: `${siteConfig.productName} — ${hero.title}`,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${siteConfig.siteUrl}/#software` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main id="conteudo">
        <Hero />
        <BenefitStrip />
        <Problems />
        <Journey />
        <DemoSection />
        <Modules />
        <Workspaces />
        <Simulations />
        <Legal />
        <Integrations />
        <Portal />
        <Dashboards />
        <Academy />
        <Security />
        <Implementation />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
