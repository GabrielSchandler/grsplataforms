/**
 * Texto da página do NewSec Focus.
 *
 * Mesma regra do resto do site: nenhuma afirmação sobre o produto entra aqui
 * sem existir no código do sistema. Em particular, três coisas que este texto
 * NÃO diz, e por quê:
 *
 * - **"Em conformidade com a LGPD".** É selo, e a NewSec não tem selo nenhum.
 *   A página descreve o que o agente coleta e o que não coleta, e deixa a base
 *   legal onde ela mora: na decisão da empresa cliente com o jurídico dela.
 * - **"Nem a NewSec vê seus dados".** Era verdade até a migration 0007 do
 *   produto e deixou de ser. Não pode voltar em material de venda.
 * - **"Nome de contatos e arquivos abertos não são coletados".** O título da
 *   janela é registrado (com e-mails e números longos removidos), e título de
 *   janela costuma trazer nome de arquivo. A seção de coleta diz isso.
 */

export const focusMensagens = {
  teste: "NewSec (Focus) — vim pelo site e gostaria de testar o Focus com a minha equipe.",
  especialista: "NewSec (Focus) — vim pelo site e gostaria de falar com um especialista sobre o Focus.",
  demonstracao: "NewSec (Focus) — vim pelo site e gostaria de ver uma demonstração do Focus.",
  formulario: "NewSec (Focus) — pedido de teste pelo site.",
};

export const focusNav = {
  links: [
    { label: "O painel", href: "#painel" },
    { label: "O que coleta", href: "#coleta" },
    { label: "Implantação", href: "#implantacao" },
    { label: "Perguntas", href: "#perguntas" },
  ],
  cta: "Testar no seu time",
  entrar: "Entrar",
};

export const focusHero = {
  eyebrow: "NewSec Focus · produtividade da equipe",
  title: "Veja para onde vai o tempo da sua equipe, sem ler o que ela escreve.",
  subtitle:
    "Um agente instalado em cada computador Windows registra, minuto a minuto, o aplicativo em uso e se a pessoa está ativa ou parada. O painel mostra por pessoa, equipe e período — no computador e no celular.",
  primaryCta: "Testar no seu time",
  secondaryCta: "Explorar o painel",
  chips: ["Sem captura de tela", "Sem registro do que é digitado", "Líder vê só a própria equipe"],
  trustLine:
    "Do mesmo time que faz o NewSec CRM, o sistema que conecta comercial, jurídico e financeiro.",
};

/**
 * Faixa de números. Os quatro são verificáveis no produto: um registro por
 * minuto, nenhuma captura de tela, nenhuma tecla identificada e o tempo que a
 * estação leva para aparecer no painel depois da instalação.
 */
export const focusNumeros = [
  {
    valor: 1,
    sufixo: " min",
    titulo: "de granularidade",
    texto: "Cada estação registra o que aconteceu em cada minuto de uso.",
  },
  {
    valor: 0,
    titulo: "capturas de tela",
    texto: "O agente não fotografa nem grava a tela. Não existe essa função no código.",
  },
  {
    valor: 0,
    titulo: "teclas identificadas",
    texto: "Conta quantas teclas foram pressionadas, nunca quais. O código da tecla é descartado.",
  },
  {
    valor: 2,
    prefixo: "~",
    sufixo: " min",
    titulo: "da instalação ao painel",
    texto: "A pessoa aparece sozinha, já com o nome e o departamento escolhidos na instalação.",
  },
];

export const focusDemo = {
  eyebrow: "Ambiente demonstrativo",
  title: "O Focus funcionando, aqui na página.",
  intro:
    "Esta é a interface do sistema, com dados fictícios de uma empresa de 18 pessoas em quatro equipes. O tour mostra o que o gestor passa a enxergar. Na exploração livre, troque o período, filtre por equipe, ordene a tabela, abra uma pessoa — e classifique um aplicativo para ver o índice mudar na hora.",
};

export const focusRespostas = {
  eyebrow: "O que muda na segunda-feira",
  title: "As perguntas que a gestão para de responder no achismo.",
  intro:
    "Cada cartão abre a tela correspondente na demonstração acima. São as mesmas telas que a sua equipe vai usar.",
  cartoes: [
    {
      tela: "visao",
      pergunta: "Quanto a equipe trabalha, de verdade?",
      resposta:
        "Média de tempo ativo por pessoa e por dia, comparável entre equipes de tamanhos diferentes e entre meses de durações diferentes. Com o ocioso e a tela bloqueada à parte.",
    },
    {
      tela: "equipes",
      pergunta: "Qual equipe rende mais — e em quê?",
      resposta:
        "Tempo produtivo, neutro e improdutivo lado a lado, equipe por equipe, com aderência à jornada esperada.",
    },
    {
      tela: "aplicativos",
      pergunta: "O sistema que a empresa paga está sendo usado?",
      resposta:
        "Cada aplicativo e site com o tempo em primeiro plano e a categoria que a sua empresa definiu. O que ainda não tem categoria fica visível para ser classificado.",
    },
    {
      tela: "horas-extras",
      pergunta: "Quem está passando da jornada?",
      resposta:
        "Atividade fora da janela de expediente, por pessoa, com faixa de risco. Sobrecarga aparece antes de virar pedido de demissão.",
    },
    {
      tela: "dispositivos",
      pergunta: "Aquela máquina parou?",
      resposta:
        "Aviso no topo do painel quando uma estação deixa de enviar, e o diário de quando cada uma ligou, bloqueou a tela, hibernou e desligou.",
    },
    {
      tela: "relatorios",
      pergunta: "Preciso levar isso para a diretoria.",
      resposta:
        "Quatro relatórios em XLSX ou CSV, com o mesmo recorte de período e de equipe que está na tela.",
    },
  ],
} as const;

export const focusCelular = {
  eyebrow: "No bolso de quem decide",
  title: "O mesmo painel, instalado no celular.",
  intro:
    "O painel se instala na tela inicial pelo próprio navegador e abre sem a barra de endereço, como um aplicativo. As quatro abas de baixo são as que a gestão mais abre.",
  itens: [
    "Instalação pelo navegador, sem passar por loja de aplicativos",
    "Mesmo login e exatamente os mesmos números do computador",
    "Período e filtros a um toque, na folha que sobe do rodapé",
  ],
  nota: "A maquete ao lado é a interface de verdade, com os mesmos dados fictícios da demonstração.",
};

export const focusColeta = {
  eyebrow: "O que é coletado",
  title: "Mede o uso do computador. Não lê o que a pessoa faz nele.",
  intro:
    "O agente registra metadados de uso, uma vez por minuto. Abaixo está exatamente o que ele guarda — e o que ele não guarda. Cada linha corresponde a uma parte do código do agente, não a uma promessa comercial.",
  registra: {
    titulo: "O que o Focus registra",
    itens: [
      "O aplicativo em primeiro plano, como chrome.exe ou EXCEL.EXE",
      "O domínio do site aberto, como portal.gov.br — sem o endereço completo",
      "O título da janela, com e-mails e números longos removidos",
      "Se a pessoa estava ativa, ociosa ou com a tela bloqueada naquele minuto",
      "A quantidade de teclas, cliques e rolagens — apenas o total",
    ],
  },
  nunca: {
    titulo: "O que o Focus não registra",
    itens: [
      "O que é digitado: o código da tecla é descartado dentro do próprio agente",
      "Captura de tela, foto ou gravação — a função não existe no agente",
      "O endereço completo das páginas visitadas, nem o caminho, nem a busca",
      "O título das janelas de WhatsApp, Telegram, Signal, Discord, Slack e cofres de senha",
    ],
  },
  higienizacao: {
    titulo: "Um título de janela, antes e depois",
    antes: "Pedido 48213377 - maria.souza@exemplo.com.br - Gmail - Google Chrome",
    depois: "Pedido ###### - [email] - Gmail",
    dominio: "mail.google.com",
    nota: "O nome do navegador sai, o e-mail vira [email] e qualquer sequência de seis dígitos ou mais vira ######. O resto do título permanece — por isso a página diz que o Focus registra o título da janela, e não que ignora tudo o que está nela.",
  },
  aviso: {
    titulo: "A pessoa monitorada sabe",
    texto:
      "Por padrão, cada estação mostra um ícone na barra de tarefas com o menu “O que é coletado?”. A empresa também pode limitar a coleta ao horário de trabalho e escolher quais aplicativos têm o título omitido.",
    nota: "Esses ajustes ficam em Administração, no painel: quem configura é a empresa cliente, não a NewSec.",
  },
  legal: {
    titulo: "E a LGPD?",
    texto:
      "O Focus foi desenhado para coletar o mínimo e deixar isso visível para quem é acompanhado. A base legal do monitoramento e a política interna são decisões da sua empresa, com o jurídico dela — nós entregamos a descrição técnica do que o sistema faz para essa conversa acontecer com informação.",
  },
};

export const focusImplantacao = {
  eyebrow: "Implantação",
  title: "Da instalação ao primeiro número, sem servidor na sua empresa.",
  intro:
    "O agente vai nas estações, o painel abre no navegador. Não há nada para hospedar, manter ou atualizar do seu lado.",
  passos: [
    {
      titulo: "Instalação em cada computador",
      texto:
        "O instalador guiado pede o código da sua empresa, o nome da pessoa e o departamento. Requer Windows 10 ou 11 e permissão de administrador.",
    },
    {
      titulo: "A estação aparece no painel",
      texto:
        "Cerca de dois minutos depois, já com o nome e o departamento escolhidos na instalação. Não é preciso cadastrar ninguém antes.",
    },
    {
      titulo: "O agente se atualiza sozinho",
      texto: "Versões novas chegam às estações sem reinstalar nada e sem passar de máquina em máquina.",
    },
    {
      titulo: "Sem internet, nada se perde",
      texto:
        "O que ainda não foi enviado fica guardado na própria estação, em banco cifrado, por até 14 dias — e segue quando a conexão volta.",
    },
  ],
  fluxo: {
    origem: { titulo: "Estação Windows", texto: "Agente registra um minuto por vez" },
    meio: { titulo: "Envio cifrado", texto: "Lotes por conexão segura, sem conteúdo" },
    destino: { titulo: "Painel", texto: "No navegador e no celular" },
  },
  requisitos: [
    "Windows 10 ou 11, com permissão de administrador para instalar",
    "Nenhum servidor, banco ou máquina virtual do lado da empresa",
    "No teste, a instalação é acompanhada pelo nosso time",
  ],
};

export const focusAcessos = {
  eyebrow: "Quem vê o quê",
  title: "Cada gestor enxerga o que precisa — e só isso.",
  intro:
    "O alcance de cada perfil não é uma tela escondida: é regra aplicada no banco de dados, o que significa que nem trocando o endereço se enxerga o que não é para enxergar.",
  papeis: [
    {
      nome: "Proprietário e gestor",
      texto:
        "Enxergam a empresa inteira e administram equipes, pessoas, classificação de aplicativos e as opções do agente.",
    },
    {
      nome: "Líder de equipe",
      texto:
        "Enxerga apenas a própria equipe. A restrição é aplicada no banco, não apenas escondida na interface.",
    },
    {
      nome: "Visualização",
      texto: "Consulta os números do recorte permitido, sem alterar configuração nenhuma.",
    },
  ],
};

export const focusOferta = {
  eyebrow: "Como começar",
  title: "Teste com a sua equipe antes de contratar.",
  texto:
    "Liberamos o painel para a sua empresa e acompanhamos a instalação nas primeiras estações. Em poucos dias você está lendo os números do seu próprio time — não os de uma apresentação.",
  inclui: [
    "Painel liberado para a sua empresa, com o seu nome",
    "Instalação acompanhada pelo nosso time nas primeiras estações",
    "Catálogo de classificação já aplicado, para o índice começar a valer desde o primeiro dia",
    "Ajuste da janela de expediente, que é o que liga o acompanhamento de horas extras",
  ],
  contratacao: {
    titulo: "Contratação",
    texto:
      "Por número de estações monitoradas. O valor é apresentado na proposta, depois de uma conversa rápida sobre o tamanho da operação.",
  },
  cta: "Testar no seu time",
  ctaSecundario: "Falar com um especialista",
};

export const focusFaq = {
  eyebrow: "Perguntas frequentes",
  title: "O que perguntam antes de instalar.",
  intro: "As respostas abaixo descrevem o que o sistema faz hoje, não o que está no plano.",
  itens: [
    {
      question: "O colaborador fica sabendo que a estação é monitorada?",
      answer:
        "Por padrão, sim: cada estação mostra um ícone na barra de tarefas, com um menu que explica o que é coletado. A empresa pode ajustar essa configuração, e como a equipe é comunicada faz parte da política interna de cada empresa.",
    },
    {
      question: "Vocês veem o que a pessoa digita, ou a tela dela?",
      answer:
        "Não. O agente conta quantas teclas e cliques aconteceram no minuto, sem registrar quais — o código da tecla é descartado dentro do próprio agente. E não existe captura de tela no sistema: nenhuma imagem é gerada, enviada ou guardada.",
    },
    {
      question: "O Focus registra os sites acessados?",
      answer:
        "Registra o domínio, como portal.gov.br, sem o endereço completo, sem o caminho e sem o que foi buscado. O título da janela também é registrado, com e-mails substituídos por [email] e sequências de seis dígitos ou mais por ######.",
    },
    {
      question: "E as conversas de WhatsApp?",
      answer:
        "No WhatsApp instalado no computador — e também em Telegram, Signal, Discord, Slack e cofres de senha como KeePass, 1Password e Bitwarden — nem o título da janela é registrado: fica apenas o aplicativo e se havia atividade. No WhatsApp Web, aberto no navegador, entra o domínio web.whatsapp.com e o título da aba.",
    },
    {
      question: "Funciona com a equipe em home office?",
      answer:
        "Funciona, desde que a estação tenha internet em algum momento. Sem conexão, os registros ficam guardados na própria máquina, em banco cifrado, e são enviados quando a rede volta.",
    },
    {
      question: "Funciona em Mac ou Linux?",
      answer: "Não. O agente é para Windows 10 e 11. O painel abre em qualquer navegador.",
    },
    {
      question: "Precisa de servidor na empresa?",
      answer:
        "Não. O agente envia para a nuvem e o painel abre no navegador e no celular. Não há nada para instalar, manter ou atualizar em servidor do seu lado.",
    },
    {
      question: "O líder de equipe enxerga a empresa toda?",
      answer:
        "Não. O líder enxerga apenas a própria equipe, e essa restrição é aplicada no banco de dados, não na interface.",
    },
    {
      question: "Por quanto tempo os dados ficam guardados?",
      answer:
        "A atividade minuto a minuto fica disponível pelo prazo de retenção definido para a sua empresa. Depois disso permanece o consolidado por dia, por pessoa e por aplicativo, que é o que alimenta os gráficos de períodos longos.",
    },
    {
      question: "Preciso usar o NewSec CRM para usar o Focus?",
      answer:
        "Não. O Focus funciona sozinho, em qualquer empresa com equipe trabalhando em computador Windows, com ou sem outro sistema.",
    },
    {
      question: "Quanto custa?",
      answer:
        "A contratação é por número de estações monitoradas, e o valor é apresentado na proposta depois de uma conversa rápida sobre o tamanho da operação.",
    },
  ],
};

export const focusFinal = {
  eyebrow: "Próximo passo",
  title: "Veja o Focus com a sua equipe em mente.",
  description:
    "Conte quantos computadores a sua operação tem e o que você precisa enxergar. Respondemos pelo WhatsApp com o teste e a proposta.",
  formTitle: "Pedir o teste",
  formDescription:
    "Preencha os campos e o envio abre o WhatsApp com a mensagem pronta para o nosso comercial.",
  consent:
    "Autorizo o contato comercial da NewSec sobre o Focus. Os dados preenchidos são enviados pelo seu próprio WhatsApp e não ficam armazenados neste site.",
  submit: "Enviar pelo WhatsApp",
  especialista: "Falar com um especialista",
};

export const focusMeta = {
  title: "NewSec Focus — monitoramento de produtividade da equipe",
  description:
    "Veja o tempo ativo, o uso de aplicativos e as horas extras da sua equipe por pessoa, equipe e período. Agente para Windows, sem captura de tela e sem registrar o que é digitado. Teste com o seu time.",
  keywords: [
    "software de monitoramento de funcionários",
    "monitoramento de produtividade",
    "controle de produtividade da equipe",
    "monitoramento de computadores da empresa",
    "relatório de horas extras da equipe",
  ],
};
