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

export const hero = {
  eyebrow: "Sistema de operação para empresas de serviços com comercial e jurídico",
  // Testei contra a versão anterior ("Do primeiro lead ao acompanhamento
  // final..."): esta diz a mesma coisa em metade das palavras e sobrevive
  // melhor sobre a fotografia, onde linha longa disputa com a cena.
  title: "O CRM que conecta sua operação inteira.",
  subtitle:
    "Comercial, jurídico, financeiro, gestão e relacionamento com o cliente em um único fluxo, com documentos, automações e acompanhamento em tempo real — no seu domínio e com a sua marca.",
  primaryCta: "Agendar uma demonstração",
  secondaryCta: "Explorar o sistema",
  trustLine:
    "Nasceu e roda dentro de uma operação real de revisão de juros, com equipe comercial e jurídico próprios.",
  // As mensagens começam identificando a origem: na lista do WhatsApp o
  // comercial já vê que o contato veio do site do CRM, não do institucional.
  whatsappMessage:
    "GRS Plataforma (CRM) — vim pelo site e gostaria de agendar uma demonstração do sistema.",
};

export const benefitStrip = [
  {
    title: "Uma base só",
    description: "Lead, cliente, contrato, processo e pagamento no mesmo cadastro.",
  },
  {
    title: "Cada setor no seu lugar",
    description: "Áreas de trabalho separadas, com permissão por função e departamento.",
  },
  {
    title: "Rastro de tudo",
    description: "Linha do tempo por cliente, com autor, data e documento de cada passo.",
  },
  {
    title: "Com a sua marca",
    description: "O sistema exibe a logo e o nome da sua empresa, não os nossos.",
  },
];

export const demoLabels = {
  eyebrow: "Ambiente demonstrativo",
  title: "Navegue pelo sistema aqui mesmo.",
  intro:
    "As telas abaixo reproduzem a interface do sistema com dados fictícios. Troque de módulo para ver como cada área trabalha.",
  badge: "Ambiente demonstrativo",
  note: "Nomes, CPFs e telefones são fictícios.",
  testAccess: {
    title: "Quer testar com a sua própria equipe?",
    description:
      "Depois da conversa com o comercial, liberamos um acesso de avaliação com a sua empresa configurada, para a equipe usar de verdade antes de decidir.",
    cta: "Pedir acesso de avaliação",
    ctaExternal: "Abrir ambiente de demonstração",
    whatsappMessage:
      "GRS Plataforma (CRM) — vim pelo site e gostaria de um acesso de avaliação do sistema.",
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
        "A pré-venda anda pelo pipeline com o motivo de cada mudança registrado. Quando o caso pede, a simulação gera o relatório em PDF e a imagem-resumo na hora, e os documentos saem de template com numeração própria.",
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
        "Metas, comissões, caixa, produtividade e histórico se consolidam a partir do que a equipe já registrou, sem ninguém parar para alimentar relatório.",
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
  title: "Separação de dados, rastro e cópia fora do banco.",
  intro:
    "Desenvolvido com controles alinhados à proteção e à governança de dados. Sem promessa de conformidade absoluta e sem selo que não temos.",
  highlights: [
    {
      title: "Arquitetura multiempresa",
      description:
        "Políticas de acesso e isolamento lógico por empresa, aplicados no banco e não somente na tela.",
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
  title: "Sua equipe começa a usar em menos de 24 horas.",
  intro:
    "O acesso do supervisor é liberado em menos de um dia útil, e é ele mesmo quem cria os usuários da equipe. A migração de base anterior corre em paralelo, sem impedir ninguém de trabalhar.",
  steps: [
    {
      title: "Diagnóstico",
      description:
        "Entendemos como sua operação funciona hoje, quais módulos fazem sentido e o que existe de base para trazer.",
    },
    {
      title: "Ambiente liberado em menos de 24h",
      description:
        "O supervisor recebe o acesso, cadastra a equipe, sobe a logo da empresa e já começa a operar.",
    },
    {
      title: "Migração analisada caso a caso",
      description:
        "Importamos de planilhas e de sistemas anteriores quando há exportação disponível. Os dados passam por tratamento antes da carga, e o cronograma sai do diagnóstico — depende do que a sua base entrega.",
    },
    {
      title: "Treinamento e operação assistida",
      description:
        "As videoaulas ficam na Academy dentro do sistema: Formação Comercial GRS e Operação do CRM GRS.",
    },
  ],
  support: {
    title: "Suporte",
    description: "Atendimento pelo WhatsApp em horário comercial, todos os dias.",
  },
  commercialModel: {
    title: "Modelo de contratação",
    description:
      "Mensalidade por usuário contratado, mais implantação. Os módulos são escolhidos por empresa, e o valor é apresentado na proposta depois do diagnóstico.",
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
        "Não. Você escolhe quais módulos entram, então dá para começar pelo comercial e ligar jurídico, financeiro ou Academy depois. O que não foi contratado nem aparece na barra lateral da equipe.",
    },
    {
      question: "Em quanto tempo minha equipe começa a usar?",
      answer:
        "O acesso do supervisor sai em menos de 24 horas, e é ele quem cria os usuários dele. A partir daí a equipe já opera, mesmo que a migração de base anterior ainda esteja em andamento.",
    },
    {
      question: "Vocês migram os dados do meu sistema atual?",
      answer:
        "Sim, quando há exportação disponível. Importamos de planilhas e de sistemas anteriores, e os dados passam por tratamento antes de entrar. O prazo depende do que a sua base entrega, então ele é definido no diagnóstico e não antes.",
    },
    {
      question: "Como é a cobrança?",
      answer:
        "Mensalidade por usuário contratado, mais implantação. Como os módulos variam por empresa, o valor é apresentado na proposta, depois do diagnóstico.",
    },
    {
      question: "Consigo testar antes de contratar?",
      answer:
        "Consegue. Além do ambiente demonstrativo aberto nesta página, liberamos um acesso de avaliação com a sua empresa já configurada depois da conversa com o comercial — assim a equipe usa o sistema de verdade antes de decidir.",
    },
    {
      question: "Como funciona o suporte depois que entra no ar?",
      answer:
        "Atendimento pelo WhatsApp em horário comercial, todos os dias.",
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
    "Autorizo o contato comercial da GRS Soluções sobre a GRS Plataforma. Os dados preenchidos são enviados pelo seu próprio WhatsApp e não ficam armazenados neste site.",
  submit: "Enviar pelo WhatsApp",
  specialistCta: "Falar com um especialista",
  specialistMessage:
    "GRS Plataforma (CRM) — vim pelo site e gostaria de falar com um especialista sobre o sistema.",
};

export const footer = {
  description:
    "Sistema de operação ponta a ponta para empresas de serviços com comercial, jurídico e financeiro. Desenvolvido e operado pela GRS Soluções.",
  columns: [
    {
      title: "O sistema",
      links: areas.map((area) => ({ label: area.navLabel, href: `/${area.slug}` })),
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
