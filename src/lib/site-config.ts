/**
 * Configuração do site. O que pode mudar por ambiente vem de variáveis
 * NEXT_PUBLIC_* (ver .env.example); o que é dado fixo da empresa fica como
 * padrão aqui, então o site mostra a identificação correta mesmo sem .env.
 *
 * Os dados da empresa foram tirados do site institucional já publicado
 * (GRS_INSTITUCIONAL2/lib/content.js) para que CNPJ, endereço e marca não
 * apareçam diferentes em dois sites da mesma empresa.
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
};

/** Linha comercial do CRM — separada da linha do institucional. */
const defaultWhatsapp = "5511982266789";

/** Só dígitos: wa.me não aceita máscara. */
const whatsappDigits = (raw.whatsapp || defaultWhatsapp).replace(/\D/g, "");

export const siteConfig = {
  productName: "GRS Plataforma",
  vendorName: "GRS Soluções",
  tagline: "Do primeiro lead ao acompanhamento final, toda a operação em um só lugar.",
  siteUrl: raw.siteUrl || "https://plataforma.grssolucao.com.br",
  email: raw.email || "planejamento@grssolucao.com.br",
  agendaUrl: raw.agendaUrl,
  demoUrl: raw.demoUrl,
  analyticsId: raw.analyticsId,
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

/** Endereço em uma linha, para rodapé e dados estruturados. */
export const addressLine = `${siteConfig.address.street} — ${siteConfig.address.district}, ${siteConfig.address.city}/${siteConfig.address.state} · CEP ${siteConfig.address.zip}`;

/** Âncora da seção de contato — destino de fallback e do menu. */
export const CONTACT_ANCHOR = "#demonstracao";

/**
 * Monta o link do WhatsApp com a mensagem já preenchida. Toda mensagem
 * começa identificando a origem, para o comercial reconhecer na lista que
 * o contato veio do site do CRM e não do institucional.
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
