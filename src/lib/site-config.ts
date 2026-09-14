/**
 * Configuração do site. O que pode mudar por ambiente vem de variáveis
 * NEXT_PUBLIC_* (ver .env.example); o que é dado fixo fica como padrão
 * aqui, então o site funciona mesmo sem .env.
 *
 * ## Por que a marca do site não é a marca de quem desenvolve
 *
 * O sistema é desenvolvido pela GRS Soluções, que atua em revisão de juros.
 * O público comprador deste site inclui empresas do mesmo ramo — ou seja,
 * concorrente direto de quem desenvolve. Um comprador que percebe estar
 * contratando software de um concorrente desiste antes da demonstração.
 * Por isso o produto é vendido sob a marca própria NewSec, e o site não
 * exibe a identificação da desenvolvedora.
 *
 * `legalName`, `taxId` e `address` continuam existindo abaixo, mas são
 * consumidos SÓ pela página de privacidade: a LGPD exige que o controlador
 * dos dados seja identificável, e omitir isso do site inteiro não é opção
 * legal. O rodapé e os dados estruturados não os publicam mais.
 */

const raw = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  email: process.env.NEXT_PUBLIC_EMAIL_COMERCIAL ?? "",
  agendaUrl: process.env.NEXT_PUBLIC_AGENDA_URL ?? "",
  demoUrl: process.env.NEXT_PUBLIC_DEMO_URL ?? "",
  analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "",
  legalName: process.env.NEXT_PUBLIC_RAZAO_SOCIAL ?? "",
  taxId: process.env.NEXT_PUBLIC_CNPJ ?? "",
  painelFocus: process.env.NEXT_PUBLIC_PAINEL_FOCUS ?? "",
};

/**
 * Os produtos vendidos sob a marca NewSec.
 *
 * Até 09/2026 marca e produto eram a mesma palavra: "NewSec" queria dizer o
 * CRM. Com o Focus, a marca passa a ser a casa e cada produto ganha nome
 * próprio — é o que permite uma página nova sem tirar o CRM do lugar.
 */
export const produtos = [
  {
    id: "crm",
    nome: "NewSec CRM",
    curto: "CRM",
    href: "/",
    descricao: "Comercial, jurídico, financeiro e documentos no mesmo sistema.",
  },
  {
    id: "focus",
    nome: "NewSec Focus",
    curto: "Focus",
    href: "/focus",
    descricao: "Produtividade da equipe nas estações Windows, por pessoa e por equipe.",
  },
] as const;

export type ProdutoId = (typeof produtos)[number]["id"];

/**
 * Linha comercial do CRM.
 *
 * ⚠️ Este é o MESMO número do site institucional da GRS. O perfil comercial
 * dele no WhatsApp aparece como GRS Soluções, então um lead que salvar o
 * contato descobre a desenvolvedora no primeiro contato — o que anula o
 * motivo de existir a marca NewSec. Trocar por uma linha própria antes de
 * publicar, e sobrescrever aqui ou via NEXT_PUBLIC_WHATSAPP.
 */
const defaultWhatsapp = "5511963322546";

/** Só dígitos: wa.me não aceita máscara. */
const whatsappDigits = (raw.whatsapp || defaultWhatsapp).replace(/\D/g, "");

export const siteConfig = {
  /** A marca, que agora abriga mais de um produto. */
  brandName: "NewSec",
  /** O produto desta home. O Focus tem página e nome próprios. */
  productName: "NewSec CRM",
  vendorName: "NewSec",
  /** Onde o cliente do Focus entra no painel dele. */
  painelFocus: raw.painelFocus || "https://newsecfocus.vercel.app",
  tagline: "Do primeiro lead ao acompanhamento final, toda a operação em um só lugar.",
  /**
   * Domínio de produção, confirmado em 01/09/2026. Entra no canonical, no
   * Open Graph e no sitemap.
   *
   * Manter o `www`: é a forma que responde no ar. Canonical em host
   * diferente do que serve a página divide o sinal entre dois endereços.
   *
   * Vale como padrão do código, e não só como variável da Vercel, porque
   * um build sem a variável definida voltaria a publicar o endereço
   * errado — foi o que aconteceu no primeiro deploy.
   */
  siteUrl: raw.siteUrl || "https://www.newsec.com.br",
  /** ⚠️ PENDENTE: e-mail no domínio da NewSec. Vazio esconde a linha. */
  email: raw.email,
  agendaUrl: raw.agendaUrl,
  demoUrl: raw.demoUrl,
  analyticsId: raw.analyticsId,
  /* Identificação legal — só a página de privacidade usa. Ver o cabeçalho. */
  legalName: raw.legalName || "GRS Soluções",
  taxId: raw.taxId || "63.562.890/0001-45",
  address: {
    street: "R. Evangelina, 321",
    district: "Vila Carrão",
    city: "São Paulo",
    state: "SP",
    zip: "03421-000",
  },
  hasWhatsapp: whatsappDigits.length > 0,
} as const;

/** Endereço em uma linha. Usado apenas na página de privacidade. */
export const addressLine = `${siteConfig.address.street} — ${siteConfig.address.district}, ${siteConfig.address.city}/${siteConfig.address.state} · CEP ${siteConfig.address.zip}`;

/** Âncora da seção de contato — destino de fallback e do menu. */
export const CONTACT_ANCHOR = "#demonstracao";

/**
 * Monta o link do WhatsApp com a mensagem já preenchida. Toda mensagem
 * começa identificando a origem, para o comercial reconhecer na lista que
 * o contato veio do site da NewSec e não do institucional da GRS.
 */
export function whatsappLink(message: string): string {
  if (!whatsappDigits) {
    return CONTACT_ANCHOR;
  }

  return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
}

/** Destino do CTA principal: agenda quando existe, WhatsApp caso contrário. */
export function primaryCtaHref(message: string): string {
  return siteConfig.agendaUrl || whatsappLink(message);
}
