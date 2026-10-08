/**
 * Texto da página do NewSec Focus.
 *
 * Página de venda, não de manual. A ordem segue o roteiro clássico de oferta:
 * gancho (hero) → dor (o que o gestor não está vendo) → prova (números e o
 * próprio painel funcionando) → benefício concreto por tela → objeção de
 * privacidade resolvida → fricção de implantação removida → oferta → dúvidas
 * → chamada final. Cada seção existe para vencer uma hesitação específica de
 * quem está lendo, não para descrever a arquitetura do sistema.
 *
 * Mesma regra do resto do site: nenhuma afirmação sobre o produto entra aqui
 * sem existir no código. Em particular, três coisas que este texto NAO diz,
 * e por quê:
 *
 * - **"Em conformidade com a LGPD" / "tudo dentro da LGPD".** É selo, e a
 *   NewSec não tem selo nenhum — nem auditoria, nem certificação. ⚠️ Essa
 *   frase chegou a entrar no subtítulo do hero (commit `be27b44`, 15/09) e
 *   foi corrigida no mesmo dia: a página descreve o que o agente coleta e o
 *   que não coleta (comportamento verificável), e deixa a base legal onde
 *   ela mora — na decisão da empresa cliente com o jurídico dela.
 * - **"Nem a NewSec vê seus dados".** Era verdade até a migration 0007 do
 *   produto e deixou de ser. Não pode voltar em material de venda.
 * - **Qualquer garantia sobre resultado trabalhista** (evitar processo,
 *   reduzir turnover). O texto fala do CUSTO do problema, nunca promete que
 *   o software resolve a consequência legal ou de retenção de alguém.
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
  eyebrow: "NewSec Focus · visibilidade da equipe",
  title: "Você paga 8 horas de trabalho por dia. Vê quantas de verdade?",
  subtitle:
    "O NewSec Focus mostra, pessoa por pessoa e equipe por equipe, para onde o tempo da sua operação está indo — sem invadir a privacidade de quem você acompanha.",
  primaryCta: "Testar no seu time",
  secondaryCta: "Explorar o painel",
  chips: ["Sem captura de tela", "Sem registro do que é digitado", "Líder vê só a própria equipe"],
};

/**
 * A seção de dor, logo depois do gancho. Mesmo formato validado na home do
 * CRM (seis situações concretas, numeradas): o leitor precisa se reconhecer
 * na primeira linha, antes de qualquer número ou tela aparecer.
 */
export const focusProblema = {
  eyebrow: "O que a gestão não está vendo",
  title: "Sua equipe não rende pouco por falta de esforço. Rende pouco pelo que ninguém está vendo.",
  intro:
    "Nenhuma das situações abaixo aparece na planilha de ponto. Todas aparecem na conta no fim do mês.",
  items: [
    {
      title: "A folha de pagamento fecha no escuro",
      description:
        "Todo mês é a mesma conta: quem cumpriu a jornada, quem ficou perto e quem esticou o horário sem ninguém perceber.",
    },
    {
      title: "Todo mundo parece ocupado. Ninguém sabe em quê",
      description:
        "A tela aberta não diz nada sobre o que está sendo feito nela — e perguntar direto raramente traz a resposta inteira.",
    },
    {
      title: "O atraso muda de explicação a cada pergunta",
      description:
        "Um prazo estoura, o cliente cobra, e a causa muda conforme quem você pergunta dentro da equipe.",
    },
    {
      title: "Duas pessoas fazem o trabalho de cinco",
      description:
        "E é bem provável que você nem saiba quais duas — porque volume de trabalho parece igual até alguém medir.",
    },
    {
      title: "A sobrecarga só aparece no pedido de demissão",
      description:
        "Quando alguém avisa que está no limite, geralmente já é tarde para reter — e cedo demais para você ter percebido antes.",
    },
    {
      title: "O sistema caro que ninguém sabe se é usado",
      description:
        "A empresa paga licença, treina a equipe, e descobre meses depois que metade ainda trabalha do jeito antigo.",
    },
  ],
};

/**
 * Faixa de números logo após a dor: a primeira prova de que existe resposta.
 * Os quatro são verificáveis no produto — os dois zeros são o argumento mais
 * forte da página, porque respondem ao medo que toda gestão tem antes de
 * instalar algo assim: "isso vai virar espionagem?".
 */
export const focusNumeros = [
  {
    valor: 1,
    sufixo: " min",
    titulo: "Nada passa despercebido",
    texto: "Cada minuto de cada estação é registrado — não é a média do dia, é o que aconteceu de verdade, hora a hora.",
  },
  {
    valor: 0,
    titulo: "Zero espionagem visual",
    texto: "Nenhuma captura de tela é gerada, guardada ou enviada. A equipe trabalha, você mede — ninguém é fotografado.",
  },
  {
    valor: 0,
    titulo: "O que é digitado continua seu",
    texto: "O agente conta quantas teclas foram pressionadas. Nunca quais. Mensagens e senhas ficam fora do alcance.",
  },
  {
    valor: 2,
    prefixo: "~",
    sufixo: " min",
    titulo: "Visibilidade quase instantânea",
    texto: "Instalou, apareceu. A estação sai da sua lista de dúvidas e entra no painel em poucos minutos.",
  },
];

export const focusDemo = {
  eyebrow: "Ambiente demonstrativo",
  title: "O painel que substitui o achismo por dado.",
  intro:
    "Isto não é um print. É o sistema, com dados fictícios de uma empresa de 19 pessoas em quatro equipes. Clique, filtre, mude o período, classifique um aplicativo — é exatamente isto que a sua operação vai mostrar em poucos dias.",
};

export const focusRespostas = {
  eyebrow: "O que muda na segunda-feira",
  title: "As perguntas que a gestão para de responder no achismo.",
  intro:
    "Cada cartão abre a tela correspondente na demonstração acima. São as mesmas telas que a sua equipe vai usar.",
  cartoes: [
    {
      tela: "visao",
      pergunta: "Quanto do expediente vira trabalho?",
      resposta:
        "Troque a sensação pelo número. O tempo em ferramentas produtivas dividido pelo expediente previsto na escala — e, ao lado, para onde foi o resto: tempo parado, tela bloqueada, máquina sem dado.",
    },
    {
      tela: "equipes",
      pergunta: "Qual equipe rende mais — e em quê?",
      resposta:
        "Equipe por equipe, com o índice médio por pessoa — um time de três se compara com um de dez — e a composição do expediente de cada uma, lado a lado.",
    },
    {
      tela: "pessoas",
      pergunta: "Como foi o dia de cada pessoa?",
      resposta:
        "A linha do tempo mostra o dia hora a hora: o que foi tempo produtivo, o que ficou parado, quando a tela estava bloqueada e quando a máquina estava desligada. Ao lado, os aplicativos mais usados e o histórico dos outros dias.",
    },
    {
      tela: "aplicativos",
      pergunta: "O sistema que a empresa paga está sendo usado?",
      resposta:
        "Pare de pagar licença para ferramenta que ninguém abre. Veja o que cada equipe realmente usa — e o que virou custo esquecido.",
    },
    {
      tela: "jornada",
      pergunta: "Quem está estendendo o dia?",
      resposta:
        "A escala de cada pessoa ao lado da atividade registrada, dentro e fora dela. Veja sobrecarga antes que vire pedido de demissão — sem transformar o painel em relógio de ponto.",
    },
    {
      tela: "dispositivos",
      pergunta: "Aquela máquina parou?",
      resposta:
        "Saiba em minutos, não em dias, quando uma estação some do radar — antes que vire uma semana inteira de dados perdidos.",
    },
    {
      tela: "relatorios",
      pergunta: "Preciso levar isso para a diretoria.",
      resposta:
        "Quatro relatórios em XLSX ou CSV, com os mesmos filtros e critérios do painel — prontos para a reunião de amanhã, não montados às pressas na noite anterior.",
    },
  ],
} as const;

export const focusCelular = {
  eyebrow: "No bolso de quem decide",
  title: "O painel que cabe no seu bolso.",
  intro:
    "Você não está sempre na frente do computador. A visibilidade sobre a sua equipe também não devia depender disso.",
  itens: [
    "Instalação pelo navegador, sem passar por loja de aplicativos",
    "Mesmo login e exatamente os mesmos números do computador",
    "Período e filtros a um toque, na folha que sobe do rodapé",
  ],
  nota: "A maquete ao lado é a interface de verdade, com os mesmos dados fictícios da demonstração.",
};

/**
 * A objeção de privacidade, resolvida antes de virar obstáculo. Condensado
 * de propósito: quem quer o detalhe técnico completo encontra no FAQ — aqui
 * o objetivo é uma coisa só, tirar o medo de "isso vai virar espionagem" do
 * caminho da decisão.
 */
export const focusColeta = {
  eyebrow: "A objeção que todo gestor tem",
  title: "Monitorar sem virar vilão.",
  intro:
    "Projeto de monitoramento não fracassa por falta de tecnologia. Fracassa quando a equipe se sente vigiada e para de confiar na liderança. O Focus foi desenhado para nunca chegar perto dessa linha.",
  pratica: {
    titulo: "Na prática",
    itens: [
      "Ninguém lê o que sua equipe escreve — nem mensagem, nem e-mail, nem documento.",
      "Nenhuma tela é fotografada ou gravada, em nenhum momento.",
      "A equipe sabe que está sendo acompanhada: um aviso na própria estação garante isso, sem letra miúda.",
      "Cada liderança vê apenas a própria equipe — a regra vale no banco de dados, não só na tela.",
    ],
  },
  aviso: {
    titulo: "Ninguém é vigiado às escondidas",
    texto:
      "Por padrão, a estação mostra um aviso sempre visível, com um resumo do que é e não é coletado. Isso não é só transparência — é o que evita que o monitoramento vire motivo de desconfiança dentro da equipe.",
    nota: "A empresa pode ajustar esse aviso em Administração — quem decide como comunicar a mudança é você, não a NewSec.",
  },
  legal: {
    titulo: "E a LGPD?",
    texto:
      "O Focus foi desenhado para coletar o mínimo necessário e deixar isso visível para quem é acompanhado — o que facilita, e não complica, a conversa com o seu jurídico. A base legal do monitoramento e a política interna continuam sendo decisão da sua empresa.",
  },
};

export const focusImplantacao = {
  eyebrow: "Implantação",
  title: "Instala rápido. Aparece na hora.",
  intro:
    "Não tem servidor para montar, nem treinamento de uma semana. O agente vai na estação, o painel abre no navegador — e o primeiro número chega em poucos minutos.",
  passos: [
    {
      titulo: "Instalação em cada computador",
      texto:
        "O instalador guiado pede o código da sua empresa, o nome da pessoa e o departamento. Requer Windows 10 ou 11 e permissão de administrador.",
    },
    {
      titulo: "A estação aparece no painel",
      texto:
        "Poucos minutos depois, já com o nome e o departamento escolhidos na instalação. Não é preciso cadastrar ninguém antes.",
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

export const focusOferta = {
  eyebrow: "Sem risco, sem letra miúda",
  title: "Veja os números da sua própria equipe antes de decidir qualquer coisa.",
  texto:
    "Esqueça demonstração genérica. No teste, o Focus roda nas primeiras estações da sua empresa — em poucos dias, o painel mostra a sua operação, não um exemplo.",
  inclui: [
    "Painel ativo para a sua empresa, com o seu nome",
    "Nosso time acompanha a instalação nas primeiras estações — você não configura nada sozinho",
    "Classificação de produtividade já aplicada, para o índice valer desde o primeiro dia",
    "Escala de expediente configurada por equipe, que é a régua do índice e do que fica fora da escala",
  ],
  contratacao: {
    titulo: "Contratação",
    texto:
      "Por número de estações monitoradas. O valor é apresentado na proposta, depois de entendermos o tamanho da sua operação.",
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
      question: "Minha equipe vai desconfiar disso?",
      answer:
        "É a reação mais comum quando o monitoramento é malfeito. O Focus foi desenhado para reduzir esse risco: a estação avisa que está sendo acompanhada, nenhum conteúdo é lido, e o que chega ao painel é padrão de uso — não uma gravação de cada segundo da pessoa. Como a mudança é comunicada para a equipe continua sendo o fator que mais pesa na aceitação, e essa decisão é sua, não do sistema.",
    },
    {
      question: "Por que o índice de produtividade parece baixo?",
      answer:
        "Porque a régua é o expediente inteiro previsto na escala, não só o tempo em que a máquina estava em uso. Tela bloqueada, tempo parado e máquina desligada dentro do expediente contam contra, e o tempo em ferramentas que a empresa classificou como neutras não conta a favor. O número mostra quanto do expediente pago virou trabalho em ferramenta produtiva — não é nota de desempenho.",
    },
    {
      question: "Quem decide o que conta como produtivo?",
      answer:
        "A sua empresa. Os aplicativos e sites que as estações usaram aparecem numa lista em Administração, e você classifica cada um como produtivo, neutro ou improdutivo. O que ainda não foi classificado fica fora do índice, e o painel avisa quantos estão nessa situação.",
    },
    {
      question: "E quem trabalha em horário diferente do resto da empresa?",
      answer:
        "A escala de expediente tem três níveis: a padrão da empresa, a de uma equipe e a de uma pessoa, cada uma com entrada, saída e intervalo por dia da semana. Vale sempre a mais específica, então o plantão de sábado ou o turno da tarde é medido contra o horário dele, não contra o da empresa.",
    },
    {
      question: "Isso vira controle de ponto?",
      answer:
        "Não. O painel mostra a atividade fora da escala para dar contexto ao uso da estação, mas avisa na própria tela que isso não é marcação de ponto nem banco de horas. Primeiro e último registro não confirmam chegada nem saída, e ausência de registro não é falta.",
    },
    {
      question: "O Focus substitui uma conversa de avaliação de desempenho?",
      answer:
        "Não. O Focus mostra padrão de uso do tempo — não substitui a conversa entre gestor e colaborador sobre entrega, contexto ou resultado. Ele é o ponto de partida de uma decisão bem informada, não o substituto dela.",
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
  title: "Chega de decidir no escuro.",
  description:
    "Diga quantos computadores a sua operação tem e o que você mais precisa enxergar primeiro. Respondemos pelo WhatsApp com o teste e a proposta.",
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
    "Veja quanto do expediente vira trabalho, o uso de aplicativos e a atividade fora da escala, por pessoa, equipe e período. Agente para Windows, sem captura de tela e sem registrar o que é digitado. Teste com o seu time.",
  keywords: [
    "software de monitoramento de funcionários",
    "monitoramento de produtividade",
    "controle de produtividade da equipe",
    "monitoramento de computadores da empresa",
    "relatório de horas extras da equipe",
  ],
};
