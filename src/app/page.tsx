import { ScrollProgress } from "@/components/motion/motion";
import { Faq, FinalCta } from "@/components/sections/fim";
import { JourneyScroll } from "@/components/sections/journey-scroll";
import { Implementation, SecurityTeaser } from "@/components/sections/operacao";
import { AreasIndex, DemoSection } from "@/components/sections/produto";
import { BenefitStrip, Hero, Problems } from "@/components/sections/topo";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { MobileCta } from "@/components/site/mobile-cta";
import { areas } from "@/content/areas";
import { faq, hero } from "@/content/site";
import { siteConfig } from "@/lib/site-config";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.siteUrl}/#organizacao`,
      name: siteConfig.vendorName,
      url: siteConfig.siteUrl,
      description:
        "Desenvolvedora do NewSec, sistema de operação para empresas de serviços com comercial, jurídico e financeiro.",
      ...(siteConfig.email ? { email: siteConfig.email } : {}),
      /* Razão social, CNPJ e endereço saíram daqui junto com o rodapé: em
         dados estruturados eles são ainda mais fáceis de ler em massa do
         que no texto da página. A identificação do controlador exigida
         pela LGPD ficou em /privacidade. */
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
        "Sistema que reúne comercial, jurídico, financeiro, documentos, portal do cliente e trilhas de treinamento em um ambiente configurado com a identidade da empresa, com módulos conforme o pacote contratado e esteira jurídica configurável.",
      publisher: { "@id": `${siteConfig.siteUrl}/#organizacao` },
      featureList: [
        "Isolamento lógico dos dados, aplicado no banco de dados",
        "Distribuição de leads com importação incremental de planilhas",
        "Pipeline comercial em Kanban",
        "Simulações de veículo, imóvel e empréstimo com relatório em PDF e imagem-resumo gerados automaticamente",
        "Contratos e recibos a partir dos templates cadastrados, com variáveis",
        "Esteira jurídica configurável pela própria empresa",
        "Portal de acompanhamento do cliente por CPF e protocolo",
        "Painel comercial e módulo financeiro",
        "Academy com trilhas de treinamento",
        "Rotinas de backup e restauração conforme o ambiente contratado",
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        description:
          "Mensalidade por usuário contratado, mais implantação. Valor apresentado em proposta após diagnóstico.",
      },
      // As páginas de área são as partes documentadas do mesmo software.
      hasPart: areas.map((area) => ({
        "@type": "WebPage",
        "@id": `${siteConfig.siteUrl}/${area.slug}/#pagina`,
        name: area.metaTitle,
        url: `${siteConfig.siteUrl}/${area.slug}`,
      })),
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
      <ScrollProgress />
      <Header />
      <main id="conteudo">
        <Hero />
        <BenefitStrip />
        {/* O demo é o ativo mais forte da página: vem antes do argumento. */}
        <DemoSection />
        <Problems />
        <JourneyScroll />
        <AreasIndex />
        <SecurityTeaser />
        <Implementation />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileCta message={hero.whatsappMessage} />
    </>
  );
}
