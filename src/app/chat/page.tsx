import type { Metadata } from "next";
import {
  FaixaPilares,
  HeroChat,
  SecaoCampanhas,
  SecaoCentral,
  SecaoChamadaFinalChat,
  SecaoIa,
  SecaoImplantacaoChat,
  SecaoOfertaChat,
  SecaoPerguntasChat,
  SecaoRotina,
  SecaoProblemaChat,
  SecaoTelas,
} from "@/components/chat/secoes";
import { ScrollProgress } from "@/components/motion/motion";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { MobileCta } from "@/components/site/mobile-cta";
import { chatFaq, chatMensagens, chatMeta, chatNav } from "@/content/chat";
import { siteConfig } from "@/lib/site-config";

/**
 * Página do NewSec Chat, o terceiro produto da casa.
 *
 * Entra ao lado do CRM e do Focus, com título, descrição e dados estruturados
 * próprios: disputa a busca por "atendimento por WhatsApp com IA", que não é
 * a de nenhum dos outros dois.
 */

export const metadata: Metadata = {
  // Absoluto: o nome do produto já abre o título.
  title: { absolute: chatMeta.title },
  description: chatMeta.description,
  keywords: chatMeta.keywords,
  alternates: { canonical: "/chat" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${siteConfig.siteUrl}/chat`,
    siteName: siteConfig.brandName,
    title: chatMeta.title,
    description: chatMeta.description,
    images: [
      {
        url: "/og-chat.png",
        width: 1200,
        height: 630,
        alt: "NewSec Chat — central de atendimento por WhatsApp em ambiente demonstrativo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: chatMeta.title,
    description: chatMeta.description,
    images: ["/og-chat.png"],
  },
};

const dadosEstruturados = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.siteUrl}/chat/#software`,
      name: "NewSec Chat",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Atendimento por WhatsApp",
      operatingSystem: "Navegador web",
      url: `${siteConfig.siteUrl}/chat`,
      inLanguage: "pt-BR",
      description:
        "Central de atendimento por WhatsApp com inteligência artificial configurada pela própria empresa, atendimento humano com passagem controlada e campanhas com ritmo, horário e limite diário.",
      publisher: { "@id": `${siteConfig.siteUrl}/#organizacao` },
      // Cada item existe no produto. Nada aqui é promessa de próxima versão.
      featureList: [
        "Caixa de entrada com abas Meu atendimento, Equipe e IA, e filtros de conversas novas e não respondidas",
        "Assistente de IA com persona, tom, perguntas e limitações definidos pela empresa",
        "Configuração da IA versionada, com rascunho e publicação",
        "A IA para de responder quando um atendente assume a conversa",
        "Transcrição das mensagens de áudio recebidas",
        "Assumir, transferir, concluir, reabrir e devolver a conversa para a IA",
        "Notas internas, respostas rápidas e nota de voz gravada na própria central",
        "Supervisão das filas, com conversas sem responsável e clientes aguardando",
        "Retornos agendados, meta de resposta em horário útil e relatórios de atendimento por equipe",
        "Campanhas com variáveis, variações A/B, janela de horário, intervalo entre envios e limite diário",
        "Importação de leads de planilha do Google Sheets sem duplicar",
        "Mais de um número de WhatsApp e mais de uma equipe na mesma central",
        "Papéis de atendente, supervisor, administrador e proprietário",
      ],
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        description: "Valor apresentado em proposta, conforme o tamanho da operação de atendimento.",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.siteUrl}/chat/#perguntas`,
      mainEntity: chatFaq.itens.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${siteConfig.siteUrl}/chat/#trilha`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteConfig.brandName, item: siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: "NewSec Chat", item: `${siteConfig.siteUrl}/chat` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${siteConfig.siteUrl}/chat/#pagina`,
      url: `${siteConfig.siteUrl}/chat`,
      name: chatMeta.title,
      description: chatMeta.description,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${siteConfig.siteUrl}/chat/#software` },
    },
  ],
};

export default function PaginaChat() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}
      />
      <ScrollProgress />
      <Header produto="chat" />
      <main id="conteudo">
        <HeroChat />
        <FaixaPilares />
        <SecaoProblemaChat />
        {/* A central funcionando vem antes do argumento, como nas outras páginas. */}
        <SecaoCentral />
        <SecaoTelas />
        <SecaoIa />
        <SecaoCampanhas />
        <SecaoRotina />
        <SecaoImplantacaoChat />
        <SecaoOfertaChat />
        <SecaoPerguntasChat />
        <SecaoChamadaFinalChat />
      </main>
      <Footer />
      <MobileCta message={chatMensagens.teste} rotulo={chatNav.cta} secoesSemBarra={["topo", "central"]} />
    </>
  );
}
