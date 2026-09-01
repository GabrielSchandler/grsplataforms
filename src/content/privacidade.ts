/**
 * Política de privacidade.
 *
 * O texto descreve o que este site faz de fato, e nada além disso. Como a
 * página é estática e o formulário abre o WhatsApp do próprio visitante,
 * não há coleta em servidor nosso — e a política diz isso em vez de repetir
 * fórmula genérica de site com banco de dados.
 *
 * Precisa de revisão jurídica antes de publicar, e do encarregado de dados
 * quando a empresa designar um.
 *
 * ⚠️ Esta é a única página do site que identifica a desenvolvedora. O
 * rodapé deixou de publicar CNPJ e endereço para não ligar a marca NewSec
 * à GRS Soluções, que atua no mesmo ramo do comprador — mas a LGPD exige
 * que o controlador dos dados seja identificável, e um site que esconde
 * isso por completo fica irregular. Se a NewSec for constituída como
 * empresa própria, esta seção passa a citá-la e o conflito desaparece.
 */

import { addressLine, siteConfig } from "@/lib/site-config";

export const privacidade = {
  title: "Política de privacidade",
  updatedAt: "12 de agosto de 2026",
  intro:
    "Esta página explica como os dados são tratados no site da NewSec. Ela trata apenas deste site — o sistema contratado tem controles próprios, descritos em contrato.",
  sections: [
    {
      title: "Quem é responsável",
      paragraphs: [
        `O tratamento dos dados descritos aqui é de responsabilidade de ${siteConfig.legalName}, CNPJ ${siteConfig.taxId}, com sede em ${addressLine}. A NewSec é a marca sob a qual o sistema é comercializado.`,
      ],
    },
    {
      title: "O que este site coleta",
      paragraphs: [
        "Este site é estático e não possui banco de dados nem servidor de aplicação próprio. O formulário de demonstração não envia nada para nós ao ser preenchido: ele monta uma mensagem com o que você digitou e abre o WhatsApp no seu próprio aparelho.",
        "Ou seja, os dados só chegam até nós se você efetivamente enviar a mensagem. A partir daí, eles existem na conversa de WhatsApp, e não em um cadastro deste site.",
      ],
    },
    {
      title: "Dados de navegação",
      paragraphs: [
        "Quando uma ferramenta de medição está configurada, ela registra dados de navegação como páginas vistas, origem do acesso, tipo de dispositivo e navegador, usando cookies próprios da ferramenta. Esses dados são usados para entender o desempenho da página, não para identificar você pessoalmente.",
        "A hospedagem também registra dados técnicos de acesso, como endereço IP e horário da requisição, pelo funcionamento normal de qualquer servidor web.",
      ],
    },
    {
      title: "Com quem os dados são compartilhados",
      paragraphs: [
        "Ao usar o botão de WhatsApp, a conversa passa a ser tratada também pela Meta, conforme as políticas do próprio WhatsApp. O mesmo vale para o serviço de agendamento, quando utilizado.",
        "Não vendemos dados e não os repassamos para terceiros com finalidade publicitária.",
      ],
    },
    {
      title: "Por quanto tempo os dados ficam conosco",
      paragraphs: [
        "As conversas comerciais são mantidas pelo tempo necessário ao atendimento e às obrigações legais aplicáveis. Encerrado o interesse comercial, os dados de contato podem ser eliminados a pedido.",
      ],
    },
    {
      title: "Seus direitos",
      paragraphs: [
        "A Lei Geral de Proteção de Dados (Lei 13.709/2018) garante a você, entre outros direitos, confirmar se tratamos dados seus, acessá-los, corrigir dados incompletos ou desatualizados, pedir anonimização ou eliminação, e revogar o consentimento dado.",
        "Para exercer qualquer um desses direitos, use o canal de contato indicado no rodapé do site. Responderemos no prazo previsto em lei.",
      ],
    },
    {
      title: "Alterações",
      paragraphs: [
        "Esta política pode ser atualizada quando o site mudar. A data da última atualização fica indicada no topo desta página.",
      ],
    },
  ],
};
