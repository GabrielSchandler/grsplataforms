/**
 * Conteúdo da home. Todo o texto comercial da página inicial vive aqui.
 *
 * Divisão de trabalho entre as páginas: a home resume e encaminha; a
 * profundidade de cada área mora em src/content/areas.ts. Nada é repetido
 * nos dois lugares — conteúdo duplicado divide a força de busca e obriga a
 * manter a mesma frase em dois arquivos.
 *
 * Regra que vale para tudo abaixo: nenhuma afirmação sobre o produto entra
 * aqui sem existir no código do sistema. Nada de número inventado, prazo
 * que ninguém se comprometeu a cumprir ou selo de conformidade.
 */

import { areas } from "./areas";

export const nav = {
  links: [
    ...areas.map((area) => ({ label: area.navLabel, href: `/${area.slug}` })),
    { label: "Perguntas", href: "/#perguntas" },
  ],
  cta: "Agendar demonstração",
};

/**
 * Oferta do teste gratuito, em um lugar só. Ela aparece na primeira dobra, no
 * fim da demonstração, no FAQ, na conversão final e no menu do celular —
 * repetir o texto em cinco arquivos seria garantia de divergirem.
 *
 * O que não se afirma, por não estar confirmado no processo comercial:
 * liberação instantânea, dispensa de cartão, ou que todos os módulos estarão
 * disponíveis no período.
 */
export const trial = {
  title: "Teste grátis por 7 dias",
  cta: "Testar grátis por 7 dias",
  description:
    "Conheça a plataforma com a sua equipe antes de contratar. O ambiente de avaliação é liberado após o alinhamento inicial com o nosso comercial.",
  whatsappMessage:
    "Olá! Conheci a NewSec pelo site e gostaria de solicitar o teste gratuito de 7 dias para a minha empresa.",
};

export const hero = {
  eyebrow:
    "Sistema de operação para empresas de serviços com comercial e jurídico",
  // Testei contra a versão anterior ("Do primeiro lead ao acompanhamento
  // final..."): esta diz a mesma coisa em metade das palavras e sobrevive
  // melhor sobre a fotografia, onde linha longa disputa com a cena.
  title: "O CRM que conecta sua operação inteira.",
  // 33 palavras viravam sete linhas no celular e empurravam o CTA para 68%
  // da primeira dobra. Encurtado para 21: o que saiu ("gestão", "fluxo
  // conectado", "acompanhamento centralizado") ou repetia o eyebrow logo
  // acima, ou repetia o próprio título.
  subtitle:
    "Comercial, jurídico, financeiro e relacionamento com o cliente em um fluxo só, com documentos e automações no ambiente da sua empresa.",
  primaryCta: "Agendar demonstração",
  secondaryCta: "Testar grátis por 7 dias",
  tertiaryCta: "Explorar o sistema",
  // O argumento continua sendo "software testado em operação de verdade",
  // que é forte. O que saiu foi o segmento: dizer "revisão de juros" aqui
  // identifica a desenvolvedora como concorrente de quem está lendo.
  trustLine:
    "Nasceu dentro de uma operação de serviços real, com equipes comercial e jurídica usando o sistema todos os dias.",
  /**
   * Faixa de confiança da primeira dobra. Só entra aqui o que é verificável
   * no produto — nada de selo de certificação que a empresa não tem.
   *
   * Eram quatro. Saíram dois:
   *
   * - "Teste grátis por 7 dias" repetia, em texto morto, o botão que fica
   *   logo acima. Chip que repete o CTA não acrescenta confiança.
   * - "Demonstração com dados fictícios" é ressalva, não é benefício, e
   *   se defendia de uma dúvida que o visitante ainda não teve. A ressalva
   *   continua onde importa: no selo e na nota da própria seção de
   *   demonstração.
   *
   * Os chips ficam DEPOIS dos botões no DOM, então mexer neles não altera
   * a altura em que o CTA cai. Quem controla isso é o texto acima dele.
   */
  trustChips: [
    "Ambiente exclusivo da sua empresa",
    "Comercial, jurídico e financeiro conectados",
    "Contratos e relatórios gerados pelo próprio sistema",
  ],
  // As mensagens começam identificando a origem: na lista do WhatsApp o
  // comercial já vê que o contato veio do site da NewSec, não do
  // institucional da GRS.
  whatsappMessage:
    "NewSec (CRM) — vim pelo site e gostaria de agendar uma demonstração do sistema.",
};

export const benefitStrip = [
  {
    title: "Uma base só",
    description:
      "Lead, cliente, contrato, processo e pagamento no mesmo cadastro.",
  },
  {
    title: "Cada setor no seu lugar",
    description:
      "Áreas de trabalho separadas, com permissão por função e departamento.",
  },
  {
    title: "Histórico das operações relevantes",
    description:
      "Alterações e operações relevantes ficam registradas com data, responsável e contexto, facilitando auditorias e continuidade do atendimento.",
  },
  {
    title: "Com a sua marca",
    description:
      "O ambiente é configurado com o nome e o logotipo da sua empresa.",
  },
];

export const demoLabels = {
  eyebrow: "Ambiente demonstrativo",
  title: "Navegue pelo sistema aqui mesmo.",
  intro:
    "As telas abaixo reproduzem a interface do sistema, com dados fictícios. O tour guiado percorre o caminho completo de um cliente, do lead que cai na planilha ao número que a gestão lê no fim do mês. A exploração livre deixa você clicar por onde quiser.",
  badge: "Ambiente demonstrativo",
  note: "Nomes, CPFs e telefones são fictícios.",
  testAccess: {
    title: trial.title,
    description: trial.description,
    cta: trial.cta,
    ctaExternal: "Abrir ambiente de demonstração",
    whatsappMessage: trial.whatsappMessage,
  },
};

export const problems = {
  eyebrow: "O que costuma estar quebrado",
  title: "A operação não trava por falta de esforço. Trava nas emendas.",
  intro:
    "Quase toda empresa de serviços com pós-venda chega ao mesmo ponto: cada setor resolveu o próprio problema com a própria ferramenta, e o trabalho passou a ser costurar uma coisa na outra.",
  items: [
    {
      title: "A planilha de leads não conversa com o sistema",
      description:
        "Alguém copia linha por linha, cria o mesmo cliente duas vezes e só descobre quando dois consultores ligam para a mesma pessoa.",
    },
    {
      title: "Ninguém sabe onde o cliente parou",
      description:
        "O comercial fechou, o jurídico não recebeu, e responder ao cliente depende de perguntar em três grupos de WhatsApp.",
    },
    {
      title: "Contrato montado à mão",
      description:
        "Documento editado no Word a partir do último que ficou pronto, com nome trocado, valor antigo e nenhuma numeração que permita achá-lo depois.",
    },
    {
      title: "O cliente liga para saber do processo",
      description:
        "E a equipe interrompe o que está fazendo para procurar a informação em pasta, e-mail e conversa antiga.",
    },
    {
      title: "O financeiro vive de exportação",
      description:
        "Valor previsto num lugar, valor pago em outro, comissão calculada no fim do mês na base da memória.",
    },
    {
      title: "Treinamento que não escala",
      description:
        "Cada pessoa nova aprende olhando o colega do lado, e o método muda de mesa para mesa até ninguém saber qual é o certo.",
    },
  ],
};

export const journey = {
  eyebrow: "Jornada ponta a ponta",
  title: "O caminho que o cliente percorre, sem sair do sistema.",
  intro:
    "Cada etapa entrega a próxima já preenchida. Não há reentrada de dado, planilha intermediária nem cadastro refeito quando o cliente muda de setor.",
  phases: [
    {
      name: "Entrada do lead",
      description:
        "As planilhas do Google Sheets ficam conectadas, e a importação traz somente as linhas novas. O supervisor distribui manual ou igualmente, e o lead vira cadastro de cliente já no nome do consultor responsável.",
      href: "/comercial",
      screenshot: "distribuicao-leads",
      alt: "Tela de distribuição de leads com linhas novas importadas e carga por consultor",
    },
    {
      name: "Pré-venda e negociação",
      description:
        "A pré-venda anda pelo pipeline com o motivo de cada mudança registrado. Quando o caso pede, a simulação gera o relatório detalhado em PDF e a imagem-resumo, e os documentos seguem os templates cadastrados, com numeração própria.",
      href: "/comercial",
      screenshot: "pipeline",
      alt: "Pipeline comercial em Kanban, com o valor do contrato em cada card",
    },
    {
      name: "Jurídico",
      description:
        "Aprovado, o cliente entra na esteira sem recadastro, com o histórico junto. O jurídico controla etapa, documento esperado, responsável, e-mail e cobrança — e o que for liberado aparece no portal do cliente.",
      href: "/juridico",
      screenshot: "esteira-juridica",
      alt: "Esteira jurídica com etapas configuráveis e documentos esperados",
    },
    {
      name: "Gestão",
      description:
        "Os indicadores comerciais de meta e comissão se consolidam a partir dos pagamentos registrados nas pré-vendas, e o módulo financeiro organiza vendas, entradas, saídas e chargebacks em uma visão própria.",
      href: "/financeiro",
      screenshot: "painel-comercial",
      alt: "Painel comercial com meta, vendas, comissão e ranking de consultores",
    },
  ],
};

export const areasIndex = {
  eyebrow: "As cinco áreas",
  title: "O site tem a mesma divisão que o sistema.",
  intro:
    "Cada área é um conjunto de módulos, configurados conforme o pacote contratado. Entre na que interessa para a sua operação — o que não faz parte do pacote nem aparece na barra lateral da equipe.",
};

export const securityTeaser = {
  eyebrow: "Segurança e governança",
  title: "Dados isolados, histórico das operações e rotinas de backup.",
  intro:
    "Controles técnicos para apoiar governança, proteção e isolamento dos dados da sua empresa. Abaixo está o que existe implementado no sistema.",
  highlights: [
    {
      title: "Ambiente isolado",
      description:
        "Políticas de acesso e isolamento lógico dos dados, aplicados no banco e não somente na tela.",
    },
    {
      title: "Backup e restauração",
      description:
        "Rotinas de cópia e restauração conforme a configuração do ambiente e do pacote contratado.",
    },
    {
      title: "Rastro de quem fez o quê",
      description:
        "Alterações e operações relevantes ficam registradas no histórico de auditoria.",
    },
  ],
  cta: "Ver os controles em detalhe",
  href: "/gestao",
};

export const implementation = {
  eyebrow: "Implantação",
  title: "A equipe entra em operação assim que o ambiente é liberado.",
  intro:
    "O ambiente da empresa é liberado para o administrador da empresa, que cadastra os usuários e define os perfis. A migração de base anterior corre em paralelo, sem impedir ninguém de trabalhar.",
  steps: [
    {
      title: "Diagnóstico",
      description:
        "Entendemos como sua operação funciona hoje, quais módulos fazem sentido e o que existe de base para trazer.",
    },
    {
      title: "Liberação do ambiente",
      description:
        "O administrador da empresa recebe o acesso, cadastra os usuários, define perfis e configura a identidade visual do ambiente.",
    },
    {
      title: "Migração analisada caso a caso",
      description:
        "Importamos de planilhas e de sistemas anteriores quando há exportação disponível. Os dados passam por tratamento antes da carga, e o cronograma sai do diagnóstico — depende do que a sua base entrega.",
    },
    {
      title: "Treinamento e operação assistida",
      description:
        "As trilhas de treinamento ficam na Academy, dentro do sistema: Formação Comercial e Operação do CRM.",
    },
  ],
  support: {
    title: "Suporte",
    description:
      "Atendimento pelo WhatsApp em horário comercial, nas condições definidas em contrato.",
  },
  commercialModel: {
    title: "Modelo de contratação",
    description:
      "Mensalidade por usuário contratado, mais implantação. Os módulos seguem o pacote contratado, e o valor é apresentado na proposta depois do diagnóstico.",
  },
};

export const faq = {
  eyebrow: "Perguntas frequentes",
  title: "O que costumam perguntar antes de decidir.",
  intro: "As perguntas específicas de cada área estão na página da área.",
  items: [
    {
      question: "Preciso trocar tudo que já uso de uma vez?",
      answer:
        "Não. Os módulos são disponibilizados conforme o pacote contratado, então dá para começar pelo comercial e incluir jurídico, financeiro ou Academy depois. O que não faz parte dos módulos contratados nem aparece na barra lateral da equipe.",
    },
    {
      question: "Em quanto tempo minha equipe começa a usar?",
      answer:
        "Assim que o ambiente da empresa é liberado, o administrador da empresa cadastra os usuários e a equipe já opera — mesmo que a migração de base anterior ainda esteja em andamento. O prazo de liberação é definido no diagnóstico, porque depende do escopo contratado.",
    },
    {
      question: "Vocês migram os dados do meu sistema atual?",
      answer:
        "Sim, quando há exportação disponível. Importamos de planilhas e de sistemas anteriores, e os dados passam por tratamento antes de entrar. O prazo depende do que a sua base entrega, então ele é definido no diagnóstico e não antes.",
    },
    {
      question: "Como é a cobrança?",
      answer:
        "Mensalidade por usuário contratado, mais implantação. Como os módulos variam conforme o pacote contratado, o valor é apresentado na proposta, depois do diagnóstico.",
    },
    {
      question: "Consigo testar antes de contratar?",
      answer:
        "Sim. Após o alinhamento com o nosso comercial, podemos liberar um ambiente de avaliação gratuito por 7 dias, configurado para a empresa conhecer o sistema antes da contratação. Os módulos disponíveis no teste são definidos durante a configuração.",
    },
    {
      question: "Como funciona o suporte depois que entra no ar?",
      answer:
        "Atendimento pelo WhatsApp em horário comercial, nas condições e nos prazos definidos em contrato.",
    },
  ],
};

export const finalCta = {
  eyebrow: "Próximo passo",
  title: "Veja o sistema rodando com a sua operação em mente.",
  description:
    "Na demonstração passamos pelo caminho completo — entrada do lead, pré-venda, simulação, documento, esteira jurídica e painel — e avaliamos quais módulos fazem sentido para o seu tamanho.",
  formTitle: "Agendar demonstração",
  formDescription:
    "Preencha os campos e o envio abre o WhatsApp com a mensagem pronta para o nosso comercial.",
  consent:
    "Autorizo o contato comercial da NewSec sobre o sistema. Os dados preenchidos são enviados pelo seu próprio WhatsApp e não ficam armazenados neste site.",
  submit: "Enviar pelo WhatsApp",
  specialistCta: "Falar com um especialista",
  specialistMessage:
    "NewSec (CRM) — vim pelo site e gostaria de falar com um especialista sobre o sistema.",
};

export const footer = {
  description:
    "Sistema de operação ponta a ponta para empresas de serviços com comercial, jurídico e financeiro.",
  columns: [
    {
      title: "O sistema",
      links: areas.map((area) => ({
        label: area.navLabel,
        href: `/${area.slug}`,
      })),
    },
    {
      title: "Site",
      links: [
        { label: "Início", href: "/" },
        { label: "Ambiente demonstrativo", href: "/#demonstrativo" },
        { label: "Implantação", href: "/#implantacao" },
        { label: "Perguntas frequentes", href: "/#perguntas" },
        { label: "Política de privacidade", href: "/privacidade" },
      ],
    },
  ],
  disclaimer:
    "Desenvolvido com controles alinhados à proteção e à governança de dados. As telas exibidas nesta página são demonstrativas, construídas com dados fictícios.",
};
