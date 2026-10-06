/**
 * Dados da réplica do NewSec Chat. Tudo fictício: empresa, atendentes,
 * contatos e telefones (em faixa inexistente).
 *
 * A história é uma só, do começo ao fim da página: a Carla chega por um
 * anúncio, a IA atende e coleta o que precisa, e a Marina assume com o resumo
 * na mão. Os números das telas conferem entre si — as 14 conversas "Com IA"
 * da Supervisão são as 14 da aba IA do Atendimento, e as 128 mensagens
 * enviadas da campanha são as mesmas nos indicadores e na barra do dia.
 */

export const empresaChat = {
  nome: "SuaEmpresa",
  usuario: "Marina Vasques",
  papel: "Supervisora",
  canal: "WhatsApp Vendas",
  ia: "Ana",
};

export type TomSelo = "produto" | "alerta" | "ia" | "neutro" | "marca" | "sucesso";

export type BalaoChat = {
  de: "contato" | "ia" | "humano" | "sistema";
  autor?: string;
  hora?: string;
  texto: string;
};

export type ConversaChat = {
  id: string;
  nome: string;
  telefone: string;
  ultimo: string;
  quem: string;
  ha: string;
  naoLidas?: number;
  selo: { texto: string; tom: TomSelo };
  equipe: string;
  responsavel: string;
  origem: string;
  etiquetas: string[];
  coletados: [string, string][];
  resumo: string;
  mensagens: BalaoChat[];
};

/** A conversa que a página inteira acompanha. */
export const carla: ConversaChat = {
  id: "carla",
  nome: "Carla Mendes",
  telefone: "(11) 90000-0318",
  ultimo: "Pode ser hoje à tarde?",
  quem: "Cliente",
  ha: "há 1 min",
  selo: { texto: "Com IA", tom: "ia" },
  equipe: "Comercial",
  responsavel: "Sem responsável",
  origem: "Anúncio · formulário",
  etiquetas: ["Novo lead", "Plano Empresa"],
  coletados: [
    ["Nome", "Carla Mendes"],
    ["Interesse", "Plano Empresa"],
    ["Tamanho da equipe", "12 pessoas"],
  ],
  resumo:
    "Chegou pelo anúncio. Quer o plano Empresa para 12 pessoas do comercial e pediu proposta e prazo de implantação.",
  mensagens: [
    { de: "contato", hora: "14:02", texto: "Oi! Vi o anúncio de vocês. Quanto custa o plano para empresa?" },
    { de: "ia", autor: "Ana", hora: "14:02", texto: "Oi, Carla! Te ajudo agora. Quantas pessoas vão usar?" },
    { de: "contato", hora: "14:03", texto: "Somos 12 no comercial." },
    {
      de: "ia",
      autor: "Ana",
      hora: "14:03",
      texto: "Perfeito. Para 12 pessoas, o plano Empresa é o indicado. Quer receber a proposta com o prazo de implantação?",
    },
    { de: "contato", hora: "14:04", texto: "Quero, sim. Pode ser hoje à tarde?" },
  ],
};

/** O que entra na conversa quando alguém da equipe assume. */
export const aposAssumir: BalaoChat[] = [
  { de: "sistema", texto: "Marina assumiu a conversa · IA pausada" },
  {
    de: "humano",
    autor: "Marina",
    hora: "14:06",
    texto: "Oi, Carla! Já vi tudo aqui. Te envio a proposta para 12 pessoas ainda hoje.",
  },
];

const base = { equipe: "Comercial", origem: "Contato direto", etiquetas: [] as string[], coletados: [] as [string, string][], resumo: "" };

export const conversasChat: Record<"meu" | "equipe" | "ia", ConversaChat[]> = {
  meu: [
    {
      ...base,
      id: "joao",
      nome: "João Almeida",
      telefone: "(11) 90000-0742",
      ultimo: "Quero falar com um consultor",
      quem: "Cliente",
      ha: "há 8 min",
      naoLidas: 2,
      selo: { texto: "Novo", tom: "produto" },
      responsavel: "Marina Vasques",
      mensagens: [
        { de: "contato", hora: "13:56", texto: "Boa tarde. Quero falar com um consultor." },
        { de: "contato", hora: "13:57", texto: "É sobre a renovação do contrato." },
      ],
    },
    {
      ...base,
      id: "roberto",
      nome: "Roberto Lima",
      telefone: "(21) 90000-0155",
      ultimo: "Enviei a proposta para análise.",
      quem: "Marina",
      ha: "há 1 dia",
      selo: { texto: "Retorno vencido", tom: "marca" },
      responsavel: "Marina Vasques",
      mensagens: [
        { de: "humano", autor: "Marina", hora: "Ontem", texto: "Roberto, enviei a proposta para análise." },
      ],
    },
    {
      ...base,
      id: "ana-p",
      nome: "Ana Pereira",
      telefone: "(31) 90000-0466",
      ultimo: "Conseguiu avaliar a proposta?",
      quem: "Marina",
      ha: "há 2 h",
      selo: { texto: "Aguardando o cliente", tom: "neutro" },
      responsavel: "Marina Vasques",
      mensagens: [
        { de: "humano", autor: "Marina", hora: "12:10", texto: "Ana, conseguiu avaliar a proposta?" },
      ],
    },
  ],
  equipe: [
    {
      ...base,
      id: "ricardo",
      nome: "Ricardo Oliveira",
      telefone: "(41) 90000-0829",
      ultimo: "Preciso da segunda via do boleto.",
      quem: "Cliente",
      ha: "há 7 min",
      naoLidas: 1,
      selo: { texto: "Responder", tom: "alerta" },
      equipe: "Financeiro",
      responsavel: "Fernanda Reis",
      mensagens: [{ de: "contato", hora: "13:57", texto: "Preciso da segunda via do boleto." }],
    },
    {
      ...base,
      id: "paulo",
      nome: "Paulo Santos",
      telefone: "(51) 90000-0273",
      ultimo: "Retorno às 15h, combinado.",
      quem: "Bruno",
      ha: "há 4 h",
      selo: { texto: "Retorno às 15h", tom: "neutro" },
      responsavel: "Bruno Paiva",
      mensagens: [{ de: "humano", autor: "Bruno", hora: "10:02", texto: "Retorno às 15h, combinado." }],
    },
    {
      ...base,
      id: "livia",
      nome: "Lívia Couto",
      telefone: "(11) 90000-0934",
      ultimo: "Alguém pode me atender?",
      quem: "Cliente",
      ha: "há 18 min",
      naoLidas: 3,
      selo: { texto: "IA pediu um humano", tom: "alerta" },
      responsavel: "Sem responsável",
      mensagens: [
        { de: "contato", hora: "13:44", texto: "Quero cancelar e ninguém me responde." },
        { de: "ia", autor: "Ana", hora: "13:44", texto: "Entendi, Lívia. Vou chamar uma pessoa da equipe para cuidar disso com você." },
        { de: "contato", hora: "13:46", texto: "Alguém pode me atender?" },
      ],
    },
  ],
  ia: [
    carla,
    {
      ...base,
      id: "rafael",
      nome: "Rafael Souza",
      telefone: "(11) 90000-0561",
      ultimo: "Atendemos de segunda a sexta, das 8h às 18h.",
      quem: "IA",
      ha: "há 2 min",
      selo: { texto: "Com IA", tom: "ia" },
      responsavel: "Sem responsável",
      mensagens: [
        { de: "contato", hora: "14:01", texto: "Vocês atendem no sábado?" },
        { de: "ia", autor: "Ana", hora: "14:01", texto: "Atendemos de segunda a sexta, das 8h às 18h. Posso adiantar o seu atendimento por aqui?" },
      ],
    },
    {
      ...base,
      id: "juliana",
      nome: "Juliana Pires",
      telefone: "(19) 90000-0688",
      ultimo: "Quero ver os planos",
      quem: "Cliente",
      ha: "há 3 min",
      selo: { texto: "Com IA", tom: "ia" },
      responsavel: "Sem responsável",
      origem: "Campanha · Retomada de leads de julho",
      mensagens: [
        { de: "humano", autor: "Campanha", hora: "13:58", texto: "Oi, Juliana, tudo bem? Ainda faz sentido a gente conversar esta semana?" },
        { de: "contato", hora: "14:00", texto: "Oi! Faz sentido, sim. Quero ver os planos." },
        { de: "ia", autor: "Ana", hora: "14:00", texto: "Que bom, Juliana! É para você ou para uma equipe?" },
      ],
    },
  ],
};

export const contagensChat = { meu: 5, equipe: 24, ia: 14 };

export const supervisao = {
  metricas: [
    { rotulo: "Sem responsável", valor: 3, tom: "neutro" as const },
    { rotulo: "Clientes aguardando", valor: 8, tom: "alerta" as const },
    { rotulo: "Retornos vencidos", valor: 6, tom: "marca" as const },
    { rotulo: "Com IA", valor: 14, tom: "ia" as const },
  ],
  fila: [
    { nome: "Lívia Couto", equipe: "Comercial", responsavel: "Sem responsável", selo: { texto: "IA pediu um humano", tom: "alerta" as const }, espera: "18 min", vencida: true },
    { nome: "João Almeida", equipe: "Comercial", responsavel: "Marina Vasques", selo: { texto: "Novo", tom: "produto" as const }, espera: "8 min", vencida: false },
    { nome: "Ricardo Oliveira", equipe: "Financeiro", responsavel: "Fernanda Reis", selo: { texto: "Responder", tom: "alerta" as const }, espera: "7 min", vencida: false },
    { nome: "Roberto Lima", equipe: "Comercial", responsavel: "Marina Vasques", selo: { texto: "Retorno vencido", tom: "marca" as const }, espera: "1 dia", vencida: true },
  ],
  carga: [
    { nome: "Marina Vasques", abertas: 5, responder: 2, vencidos: 1 },
    { nome: "Bruno Paiva", abertas: 10, responder: 4, vencidos: 3 },
    { nome: "Fernanda Reis", abertas: 6, responder: 2, vencidos: 2 },
  ],
};

/** Configuração do agente: os mesmos blocos do editor do produto. */
export const agente = {
  versao: { publicada: 6, rascunho: 7 },
  blocos: [
    {
      titulo: "Quem é a IA",
      campos: [
        ["Persona", "Atendente do primeiro contato. Apresenta-se pelo nome da empresa."],
        ["Nome de exibição", "Ana"],
        ["Primeira mensagem", "Olá! Aqui é a Ana, da SuaEmpresa. Como posso ajudar?"],
        ["Tom de voz", "Cordial, direto e profissional. Frases curtas, sem gíria."],
      ],
    },
    {
      titulo: "O que a empresa faz",
      campos: [
        ["Serviços", "Planos Essencial e Empresa, com implantação acompanhada."],
        ["Base de conhecimento", "Formas de pagamento, prazo de implantação, horário de suporte."],
      ],
    },
    {
      titulo: "Como ela conduz a conversa",
      campos: [
        ["Objetivos", "Entender o interesse e o tamanho da equipe antes de passar ao comercial."],
        ["Perguntas a cobrir", "Nome · interesse · quantas pessoas vão usar"],
      ],
    },
    {
      titulo: "Regras da empresa",
      campos: [
        ["Limitações", "Não informar preço fechado nem prometer desconto ou prazo."],
        ["Quando passar para uma pessoa", "Pedido de proposta, reclamação, cancelamento ou quando o cliente pedir."],
      ],
    },
  ],
  horario: "Segunda a sexta, das 8h às 18h",
  foraDoHorario: "Nosso atendimento funciona de segunda a sexta, das 8h às 18h.",
} as const;

export const campanha = {
  nome: "Retomada de leads de julho",
  situacao: "Enviando",
  metricas: [
    ["Total na lista", "640"],
    ["Enviadas", "128"],
    ["Respostas", "21"],
    ["Falhas e ignorados", "4"],
  ],
  variacoes: {
    A: "Olá, {{primeiro_nome}}! Aqui é da SuaEmpresa. Você chegou a avaliar a nossa proposta?",
    B: "Oi, {{primeiro_nome}}, tudo bem? Ainda faz sentido a gente conversar esta semana?",
  },
  regras: [
    ["Horário", "Seg a sex · 9h–18h"],
    ["Intervalo entre envios", "45 a 90 s"],
    ["Limite por dia", "200"],
  ],
  hoje: { enviadas: 128, limite: 200 },
  destinatarios: [
    { nome: "Juliana Pires", situacao: "Respondeu", tom: "sucesso" as const, hora: "13:58", obs: "IA retomou a conversa" },
    { nome: "Rafael Souza", situacao: "Enviado", tom: "produto" as const, hora: "13:57", obs: "Variação B" },
    { nome: "Bruno Teles", situacao: "Enviado", tom: "produto" as const, hora: "13:55", obs: "Variação A" },
    { nome: "Aline Farias", situacao: "Ignorado", tom: "neutro" as const, hora: "—", obs: "Fora de campanhas (opt-out)" },
    { nome: "Diego Moura", situacao: "Na fila", tom: "neutro" as const, hora: "—", obs: "Próximo envio" },
  ],
};
