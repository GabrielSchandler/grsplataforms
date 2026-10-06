/**
 * Texto da página do NewSec Chat.
 *
 * Mesmo roteiro da página do Focus — gancho, dor, prova (a central
 * funcionando), benefício por tela, objeção resolvida, implantação, oferta,
 * dúvidas e chamada final — e a mesma regra do resto do site: nenhuma
 * afirmação sobre o produto entra aqui sem existir no código dele
 * (repositório `newsecchat`).
 *
 * O que este texto NÃO diz, e por quê:
 *
 * - **Que o envio usa a API oficial do WhatsApp.** Não usa: a conexão é por
 *   leitura de QR Code, como no WhatsApp Web. A página descreve como o número
 *   é conectado e não põe selo nenhum.
 * - **Que campanha não gera bloqueio.** Todo envio em massa pelo WhatsApp tem
 *   risco, e nenhuma ferramenta o elimina. O texto descreve os freios que
 *   existem (um envio por vez, intervalo sorteado, janela, limite diário,
 *   opt-out) e para aí.
 * - **Desempenho por atendente.** O produto mostra a carga atual de cada
 *   consultor (contagens), não uma análise de desempenho individual.
 * - **Volume.** Nenhum número de mensagens por dia, de clientes ou de
 *   conversas simultâneas: nada disso foi medido em operação.
 * - **Fornecedores.** Nada de nome de modelo de IA nem de provedor.
 * - **"Multiempresa"** e qualquer ligação com a empresa desenvolvedora.
 */

export const chatMensagens = {
  teste: "NewSec (Chat) — vim pelo site e gostaria de testar o Chat no atendimento da minha empresa.",
  especialista: "NewSec (Chat) — vim pelo site e gostaria de falar com um especialista sobre o Chat.",
  formulario: "NewSec (Chat) — pedido de teste pelo site.",
};

export const chatNav = {
  links: [
    { label: "A central", href: "#central" },
    { label: "A IA", href: "#ia" },
    { label: "Campanhas", href: "#campanhas" },
    { label: "Implantação", href: "#implantacao" },
    { label: "Perguntas", href: "#perguntas" },
  ],
  cta: "Pedir o teste",
};

export const chatHero = {
  eyebrow: "NewSec Chat · WhatsApp com IA e equipe",
  title: "Você paga por cada lead. Ele chama no WhatsApp e fica esperando.",
  subtitle:
    "No NewSec Chat, uma IA configurada com as regras da sua empresa responde na hora, entende o que a pessoa quer e entrega a conversa ao atendente certo, já com o resumo. Quando alguém assume, a IA sai de cena.",
  primaryCta: "Pedir o teste",
  secondaryCta: "Explorar a central",
  chips: ["A IA para quando alguém assume", "Vários números e equipes", "Campanhas com ritmo e limite"],
};

/** Os três pilares, logo abaixo da primeira dobra. */
export const chatPilares = [
  {
    titulo: "Atendimento com IA",
    texto: "Responde o primeiro contato, coleta os dados conversando e encaminha para a equipe certa.",
  },
  {
    titulo: "Equipe humana",
    texto: "Cada conversa tem dono. O atendente assume com o histórico e o resumo, e a supervisão vê quem está esperando.",
  },
  {
    titulo: "Campanhas",
    texto: "Mensagem com variáveis, no horário e no ritmo que você define. Respondeu, a IA retoma a conversa.",
  },
];

export const chatProblema = {
  eyebrow: "O que acontece hoje no seu WhatsApp",
  title: "Lead que espera compra de outro.",
  intro:
    "O anúncio funcionou, a pessoa chamou — e a venda se perde entre a mensagem que chega e a primeira resposta.",
  items: [
    {
      title: "O lead chama e ninguém vê",
      description:
        "A mensagem chega no celular de alguém que está em outra conversa, em reunião ou no almoço. Quando a resposta sai, a pessoa já falou com o concorrente.",
    },
    {
      title: "Fora do horário, o número fica mudo",
      description:
        "Quem escreve às 20h só recebe resposta no dia seguinte — sem saber se a mensagem chegou nem quando alguém volta.",
    },
    {
      title: "Toda conversa começa do zero",
      description:
        "O atendente pergunta de novo o nome, o que a pessoa quer e de onde veio, porque nada do primeiro contato ficou registrado.",
    },
    {
      title: "Ninguém sabe de quem é a conversa",
      description:
        "Um número, vários celulares: dois atendentes respondem o mesmo cliente, ou cada um acha que o outro respondeu.",
    },
    {
      title: "A gestão não enxerga a fila",
      description:
        "Quantos clientes estão esperando agora, há quanto tempo e com quem? Sem uma tela para isso, a resposta é ir de mesa em mesa.",
    },
    {
      title: "A campanha sai do celular de alguém",
      description:
        "Lista copiada, mensagem colada uma a uma, sem horário, sem limite e sem saber quem respondeu.",
    },
  ],
};

export const chatDemo = {
  eyebrow: "Ambiente demonstrativo",
  title: "A central, funcionando aqui mesmo.",
  intro:
    "Isto não é um vídeo. É a interface do Chat, com dados fictícios: troque de aba, abra uma conversa que a IA está atendendo e clique em Assumir e pausar IA para ver a passagem acontecer.",
};

export const chatTelas = {
  eyebrow: "O que cada tela responde",
  title: "Quatro perguntas que param de depender de memória.",
  intro: "Cada cartão abre a tela correspondente na demonstração acima.",
  cartoes: [
    {
      tela: "atendimento",
      pergunta: "De quem é esta conversa — e o que falta fazer?",
      resposta:
        "Três abas dizem com quem a conversa está: Meu atendimento, Equipe e IA. Os filtros dizem o que falta: Novos, que ninguém abriu, e Não respondidos, em que o cliente continua esperando.",
    },
    {
      tela: "supervisao",
      pergunta: "Quem está esperando agora?",
      resposta:
        "Conversas sem responsável, clientes aguardando, retornos vencidos e o que está com a IA, na mesma tela. O supervisor assume ou transfere dali mesmo.",
    },
    {
      tela: "ia",
      pergunta: "O que a IA pode dizer em nome da empresa?",
      resposta:
        "Você escreve quem ela é, o que a empresa faz, o que perguntar e o que nunca prometer. O que é editado fica em rascunho até alguém publicar.",
    },
    {
      tela: "campanhas",
      pergunta: "A campanha saiu no ritmo certo?",
      resposta:
        "Quantas foram enviadas hoje, quantas responderam, quem ficou de fora e por quê — com o horário, o intervalo e o limite que você definiu.",
    },
  ],
} as const;

export const chatIa = {
  eyebrow: "A inteligência artificial",
  title: "Uma IA que segue as regras da sua empresa — e sabe a hora de sair.",
  intro:
    "O medo de quem coloca IA no atendimento é sempre o mesmo: ela falar o que não devia, ou atropelar o atendente. O Chat foi desenhado em volta dessas duas preocupações.",
  itens: [
    {
      titulo: "Você escreve quem ela é",
      texto:
        "Nome, persona, tom de voz, primeira mensagem, o que a empresa faz, as perguntas a cobrir e as informações proibidas. Sem isso preenchido e publicado, a IA não atende.",
    },
    {
      titulo: "Coleta os dados conversando",
      texto:
        "Uma pergunta por vez, sem virar formulário. O que a pessoa responde fica na ficha do contato, junto de um resumo para quem assumir.",
    },
    {
      titulo: "Entende áudio",
      texto:
        "A mensagem de voz do cliente é transcrita: a IA responde ao que foi dito, e o atendente lê em vez de ouvir uma a uma.",
    },
    {
      titulo: "Encaminha para a equipe certa",
      texto:
        "Pelo assunto da conversa, a IA escolhe o departamento. Quando falta informação, ela não inventa: chama uma pessoa.",
    },
    {
      titulo: "Tem horário próprio",
      texto:
        "Você define em que dias e horas ela atende e o que dizer fora do expediente — o cliente fica sabendo quando alguém volta.",
    },
    {
      titulo: "Nada vai ao ar sem alguém publicar",
      texto:
        "Toda mudança na configuração nasce como rascunho e vira versão. A análise dos atendimentos sugere melhorias, mas quem aprova e publica é uma pessoa.",
    },
  ],
  passagem: {
    titulo: "IA e atendente nunca respondem juntos",
    texto:
      "Quando alguém da equipe assume, a IA para naquela conversa. A regra não fica só na tela: é aplicada no banco de dados, então uma resposta automática atrasada é descartada em vez de sair por cima da resposta do atendente. A IA só volta se alguém devolver a conversa para ela, de propósito.",
    etapas: [
      { rotulo: "IA em atendimento", texto: "Responde, coleta e resume." },
      { rotulo: "Precisa de um humano", texto: "Continua respondendo enquanto ninguém assume." },
      { rotulo: "Atendente assumiu", texto: "A IA para. O histórico e o resumo ficam." },
    ],
  },
};

export const chatCampanhas = {
  eyebrow: "Campanhas",
  title: "Disparo com a sua mensagem, no ritmo que você definir.",
  intro:
    "Campanha aqui não é apertar um botão e torcer. Cada envio sai um por vez, dentro das regras que você configurou — e quem responde volta para a central como conversa.",
  itens: [
    "Mensagem com variáveis, como o primeiro nome, e variações para teste A/B",
    "Intervalo sorteado entre um envio e outro, janela de horário, dias da semana e limite por dia",
    "Lista por etiqueta, por telefones colados ou com todos os contatos que aceitam campanha",
    "Quem pediu para não receber fica de fora, conferido na montagem e de novo na hora do envio",
    "Respondeu? A IA retoma a conversa com o histórico e qualifica o lead",
    "Leads de planilha do Google Sheets entram como contato sem duplicar linha",
  ],
  nota: {
    titulo: "Sobre o risco de bloqueio",
    texto:
      "Todo envio em quantidade pelo WhatsApp tem risco, e nenhuma ferramenta o elimina. O que o Chat faz é tirar a pressa do processo: um envio por vez, intervalo sorteado, horário e limite diário — e um aviso na própria tela quando o intervalo configurado fica curto demais.",
  },
};

export const chatImplantacao = {
  eyebrow: "Implantação",
  title: "Do QR Code à primeira conversa atendida.",
  intro:
    "Não há nada para instalar: a central abre no navegador, no computador e no celular.",
  passos: [
    {
      titulo: "Conectar o número",
      texto:
        "Cadastre o canal e leia o QR Code com o celular da empresa. A partir daí, tudo que chegar nesse número aparece na central.",
    },
    {
      titulo: "Montar as equipes",
      texto:
        "Crie os departamentos e convide os atendentes por link. Cada pessoa entra com o papel dela: atendente, supervisor ou administrador.",
    },
    {
      titulo: "Configurar a IA",
      texto:
        "Preencha o que a empresa faz, as perguntas do primeiro contato, o tom e o que ela não pode prometer. Publique a versão.",
    },
    {
      titulo: "Atender e acompanhar",
      texto:
        "A IA começa a responder, a equipe assume quando faz sentido e a supervisão acompanha as filas pela própria central.",
    },
  ],
  requisitos: [
    "Um número de WhatsApp da empresa, com o celular por perto para ler o QR Code",
    "Mais de um número e mais de uma equipe na mesma central",
    "No teste, a configuração da IA é feita junto com o nosso time",
  ],
};

export const chatOferta = {
  eyebrow: "Antes de decidir",
  title: "Veja a IA atendendo um contato da sua empresa.",
  texto:
    "No teste, conectamos um número, configuramos a IA com as regras do seu atendimento e a sua equipe usa a central com conversas de verdade.",
  inclui: [
    "Central ativa, com o nome da sua empresa",
    "Um número de WhatsApp conectado",
    "IA configurada com o que a sua empresa faz e o que perguntar no primeiro contato",
    "Equipes e atendentes cadastrados, cada um com o seu acesso",
  ],
  contratacao: {
    titulo: "Contratação",
    texto:
      "O teste é liberado depois de uma conversa rápida com o nosso comercial. O valor é apresentado na proposta, conforme o tamanho da sua operação de atendimento.",
  },
  cta: "Pedir o teste",
  ctaSecundario: "Falar com um especialista",
};

export const chatFaq = {
  eyebrow: "Perguntas frequentes",
  title: "O que perguntam antes de colocar IA no WhatsApp.",
  intro: "As respostas abaixo descrevem o que o sistema faz hoje, não o que está no plano.",
  itens: [
    {
      question: "A IA atende sozinha o tempo todo?",
      answer:
        "Ela atende até alguém da equipe assumir. Nesse momento ela para naquela conversa, e só volta se a conversa for devolvida para ela. Você também define os dias e horários em que ela atende.",
    },
    {
      question: "E se a IA não souber responder?",
      answer:
        "Ela passa a conversa para uma pessoa: é regra do produto não inventar quando falta informação. Você também escreve em que situações ela deve passar — pedido de proposta, reclamação, quando o cliente pedir — e define um limite de mensagens seguidas sem resposta. A conversa aparece para a equipe como precisando de um humano.",
    },
    {
      question: "Ela pode inventar preço ou prometer prazo?",
      answer:
        "Você escreve o que ela nunca deve prometer ou afirmar e quais informações são proibidas, e ela é instruída a passar para uma pessoa quando não tem a informação. Como qualquer IA, pode errar — por isso a configuração é versionada, a supervisão acompanha as conversas em andamento e qualquer pessoa da equipe pode assumir a qualquer momento.",
    },
    {
      question: "O cliente sabe que está falando com uma IA?",
      answer:
        "Toda mensagem sai assinada com o nome de quem respondeu — o nome que você deu à IA ou o do atendente. E, se o cliente perguntar diretamente se fala com uma pessoa ou com um sistema, a IA responde com honestidade e oferece um atendente: é regra do produto, não uma opção.",
    },
    {
      question: "Como o número é conectado?",
      answer:
        "Pela leitura de um QR Code com o celular da empresa, na tela de canais — do mesmo jeito que se conecta o WhatsApp num computador. Dá para conectar mais de um número.",
    },
    {
      question: "Funciona com áudio, foto e documento?",
      answer:
        "Funciona. A central recebe texto, imagem, áudio, vídeo e documento. O áudio toca na tela e vem transcrito, e o atendente grava e envia nota de voz sem sair da central.",
    },
    {
      question: "Dois atendentes podem responder o mesmo cliente?",
      answer:
        "Cada conversa tem um responsável. Quem não é o responsável enxerga a conversa conforme o papel, e a transferência entre pessoas e equipes mantém o histórico e fica registrada com o motivo.",
    },
    {
      question: "As campanhas podem bloquear meu número?",
      answer:
        "Podem — todo envio em quantidade pelo WhatsApp tem esse risco, e nenhuma ferramenta o elimina. O Chat reduz a exposição: envia um por vez, sorteia o intervalo entre os envios, respeita a janela de horário e o limite diário e deixa de fora quem pediu para não receber.",
    },
    {
      question: "Quem da equipe vê o quê?",
      answer:
        "Há quatro papéis: atendente, supervisor, administrador e proprietário. O atendente trabalha nas conversas dele e nas da equipe; a aba da IA, a supervisão e as campanhas são do supervisor para cima.",
    },
    {
      question: "Os dados da minha empresa ficam separados?",
      answer:
        "Ficam. O ambiente é exclusivo da sua empresa, com isolamento lógico aplicado no próprio banco de dados, e as ações relevantes ficam registradas em auditoria.",
    },
    {
      question: "Preciso do NewSec CRM para usar o Chat?",
      answer:
        "Não. O Chat funciona sozinho, em qualquer empresa que atende por WhatsApp. Quem usa o NewSec CRM já tem um atendimento por WhatsApp dentro dele; o Chat é a central completa, com configuração da IA pela própria empresa, supervisão e campanhas.",
    },
    {
      question: "Quanto custa?",
      answer:
        "O valor é apresentado na proposta, depois de uma conversa rápida sobre o tamanho da sua operação de atendimento.",
    },
  ],
};

export const chatFinal = {
  eyebrow: "Próximo passo",
  title: "Pare de perder o lead que já chamou.",
  description:
    "Conte quantas pessoas atendem pelo WhatsApp na sua empresa e de onde chegam os contatos. Respondemos com o teste e a proposta.",
  formTitle: "Pedir o teste",
  formDescription:
    "Preencha os campos e o envio abre o WhatsApp com a mensagem pronta para o nosso comercial.",
  consent:
    "Autorizo o contato comercial da NewSec sobre o Chat. Os dados preenchidos são enviados pelo seu próprio WhatsApp e não ficam armazenados neste site.",
  submit: "Enviar pelo WhatsApp",
  especialista: "Falar com um especialista",
};

export const chatMeta = {
  title: "NewSec Chat — atendimento por WhatsApp com IA, equipe e campanhas",
  description:
    "Central de atendimento por WhatsApp: a IA responde o primeiro contato com as regras da sua empresa, a equipe assume com o resumo e as campanhas saem no ritmo que você define. Peça o teste.",
  keywords: [
    "atendimento por WhatsApp com IA",
    "central de atendimento WhatsApp",
    "chatbot WhatsApp para empresas",
    "vários atendentes no mesmo WhatsApp",
    "disparo de campanha WhatsApp",
  ],
};
