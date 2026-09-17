/**
 * Dados do ambiente demonstrativo do NewSec Focus. Tudo aqui é fictício,
 * por decisão: nenhuma tela deste site sai de captura de produção.
 *
 * A empresa é a mesma "SuaEmpresa" das telas do CRM. Não é acaso: o
 * comprador do Focus mais provável hoje é quem já usa o CRM, e ver a mesma
 * empresa nos dois produtos conta essa história sem precisar dizer.
 *
 * O que está aqui é só o perfil de cada pessoa. Os números do painel saem do
 * gerador em `motor.ts`, que simula dia a dia a partir destes perfis — por
 * isso tudo fecha entre si: a soma das pessoas é a da equipe, a da equipe é
 * a da empresa, e o índice da rosca é o mesmo do cartão.
 *
 * Convenções:
 * - Nenhuma instituição financeira real aparece.
 * - E-mail fictício num domínio que não existe (.demo).
 * - Títulos de janela já higienizados, como o agente grava: e-mail vira
 *   [email], sequência de seis dígitos ou mais vira ######, e aplicativo de
 *   mensagem fica sem título.
 */

import type { TipoCategoria } from "./formato";

export const EMPRESA = {
  nome: "SuaEmpresa",
  plano: "essencial",
  maxDispositivos: 25,
  retencaoDias: 90,
  /** Jornada diária padrão, em minutos (8h). Base da aderência. */
  jornadaMinutos: 480,
  /** Janela de expediente esperada — o que passa dela é hora extra. */
  janela: "09:00–18:00",
  janelaInicio: 9 * 60,
  janelaFim: 18 * 60,
  /** Primeiro dia com dado: a empresa começou a usar o Focus em janeiro. */
  inicioUso: "2026-01-05",
} as const;

export const USUARIO = {
  nome: "Renata Lima",
  email: "renata@ativa-assessoria.demo",
  papel: "Proprietário",
} as const;

/**
 * O "agora" do ambiente demonstrativo: sexta-feira, 28/08/2026, 16h40.
 * Fixo de propósito — relógio de verdade aqui faria o HTML do build divergir
 * do que o navegador desenha, e a demonstração envelheceria sozinha.
 */
export const HOJE = "2026-08-28";
export const AGORA_MINUTOS = 16 * 60 + 40;

/** Feriados nacionais de 2026 até agosto: o gráfico cai nesses dias, como cairia. */
export const FERIADOS = [
  "2026-01-01",
  "2026-02-16",
  "2026-02-17",
  "2026-04-03",
  "2026-04-21",
  "2026-05-01",
  "2026-06-04",
];

export type EquipeDemo = { id: string; nome: string; cor: string };

export const EQUIPES: EquipeDemo[] = [
  { id: "comercial", nome: "Comercial", cor: "#22d3ee" },
  { id: "atendimento", nome: "Atendimento", cor: "#a78bfa" },
  { id: "backoffice", nome: "Backoffice", cor: "#34d399" },
  { id: "juridico", nome: "Jurídico", cor: "#fbbf24" },
];

export type EstadoAgora = "ativo" | "ocioso" | "offline";

export type PerfilPessoa = {
  id: string;
  nome: string;
  cargo: string;
  equipeId: string;
  usuario: string;
  maquina: string;
  /** Minutos ativos num dia útil típico. */
  media: number;
  /** Frações do tempo ativo por categoria de origem. O resto fica sem categoria. */
  produtivo: number;
  neutro: number;
  improdutivo: number;
  /** Tempo ocioso, como fração do ativo. */
  ocioso: number;
  /** Fração do tempo ativo que cai fora da janela de expediente. */
  extra: number;
  /** Teclas e cliques por minuto ativo — só a contagem, como o agente. */
  teclas: number;
  cliques: number;
  /** Trabalha alguns sábados. */
  sabado?: boolean;
  /** Minuto do dia em que costuma começar. */
  entrada: number;
  /** Hoje a estação saiu antes (desligou cedo). */
  hojeAte?: number;
  /** A partir deste dia a estação não envia mais nada (agente parado). */
  paradaDesde?: string;
  /** O que a pessoa está fazendo agora, para "Atividade agora". */
  agora: {
    estado: EstadoAgora;
    processo: string;
    dominio: string | null;
    titulo: string;
    momento: string;
  };
  /** Situação da estação na tela de Dispositivos. */
  estacao: { sincronizou: string; versao: string };
};

const h = (hora: number, minuto: number) => hora * 60 + minuto;

export const PESSOAS: PerfilPessoa[] = [
  {
    id: "p01", nome: "Marina Vasques", cargo: "Supervisora comercial", equipeId: "comercial",
    usuario: "marina.vasques", maquina: "COM-01",
    media: 438, produtivo: 0.66, neutro: 0.18, improdutivo: 0.05, ocioso: 0.11, extra: 0.07,
    teclas: 9.5, cliques: 3.1, entrada: h(8, 41),
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "web.whatsapp.com", titulo: "(3) WhatsApp", momento: "agora" },
    estacao: { sincronizou: "agora", versao: "1.6.0" },
  },
  {
    id: "p02", nome: "Rafael Otoni", cargo: "Consultor comercial", equipeId: "comercial",
    usuario: "rafael.otoni", maquina: "COM-02",
    media: 421, produtivo: 0.64, neutro: 0.17, improdutivo: 0.07, ocioso: 0.12, extra: 0.05,
    teclas: 11.2, cliques: 3.4, entrada: h(8, 55),
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "docs.google.com", titulo: "Retornos da semana - Planilhas Google", momento: "agora" },
    estacao: { sincronizou: "há 1 min", versao: "1.6.0" },
  },
  {
    id: "p03", nome: "Camila Prado", cargo: "Consultora comercial", equipeId: "comercial",
    usuario: "camila.prado", maquina: "COM-03",
    media: 407, produtivo: 0.67, neutro: 0.16, improdutivo: 0.06, ocioso: 0.1, extra: 0.04,
    teclas: 10.1, cliques: 3.0, entrada: h(8, 50),
    agora: { estado: "ativo", processo: "EXCEL.EXE", dominio: null, titulo: "Comissões agosto.xlsx - Excel", momento: "agora" },
    estacao: { sincronizou: "há 2 min", versao: "1.6.0" },
  },
  {
    id: "p04", nome: "Diego Antunes", cargo: "Consultor comercial", equipeId: "comercial",
    usuario: "diego.antunes", maquina: "COM-04",
    media: 462, produtivo: 0.61, neutro: 0.18, improdutivo: 0.09, ocioso: 0.09, extra: 0.29,
    teclas: 12.4, cliques: 3.8, sabado: true, entrada: h(8, 18),
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "mail.google.com", titulo: "Caixa de entrada (12) - [email] - Gmail", momento: "agora" },
    estacao: { sincronizou: "agora", versao: "1.6.0" },
  },
  {
    id: "p05", nome: "Larissa Nunes", cargo: "Consultora comercial", equipeId: "comercial",
    usuario: "larissa.nunes", maquina: "COM-05",
    media: 384, produtivo: 0.63, neutro: 0.19, improdutivo: 0.08, ocioso: 0.15, extra: 0.03,
    teclas: 9.1, cliques: 2.9, entrada: h(9, 2),
    agora: { estado: "ocioso", processo: "WhatsApp.exe", dominio: null, titulo: "(titulo nao coletado)", momento: "há 6 min" },
    estacao: { sincronizou: "há 3 min", versao: "1.6.0" },
  },
  {
    id: "p06", nome: "Bruno Kawano", cargo: "Consultor comercial", equipeId: "comercial",
    usuario: "bruno.kawano", maquina: "COM-06",
    media: 351, produtivo: 0.52, neutro: 0.2, improdutivo: 0.16, ocioso: 0.19, extra: 0.02,
    teclas: 8.2, cliques: 3.2, entrada: h(9, 8),
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "youtube.com", titulo: "Tabela dinâmica do zero - YouTube", momento: "agora" },
    estacao: { sincronizou: "há 1 min", versao: "1.6.0" },
  },
  {
    id: "p07", nome: "Patrícia Leme", cargo: "Coordenadora de atendimento", equipeId: "atendimento",
    usuario: "patricia.leme", maquina: "ATD-01",
    media: 429, produtivo: 0.63, neutro: 0.22, improdutivo: 0.05, ocioso: 0.1, extra: 0.09,
    teclas: 10.8, cliques: 3.3, entrada: h(8, 44),
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "meet.google.com", titulo: "Meet - Alinhamento do atendimento", momento: "agora" },
    estacao: { sincronizou: "agora", versao: "1.6.0" },
  },
  {
    id: "p08", nome: "Thiago Moura", cargo: "Atendente", equipeId: "atendimento",
    usuario: "thiago.moura", maquina: "ATD-02",
    media: 408, produtivo: 0.66, neutro: 0.17, improdutivo: 0.07, ocioso: 0.12, extra: 0.04,
    teclas: 13.6, cliques: 2.8, entrada: h(8, 58),
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "web.whatsapp.com", titulo: "(8) WhatsApp", momento: "agora" },
    estacao: { sincronizou: "há 2 min", versao: "1.6.0" },
  },
  {
    id: "p09", nome: "Juliana Ferraz", cargo: "Atendente", equipeId: "atendimento",
    usuario: "juliana.ferraz", maquina: "ATD-03",
    media: 431, produtivo: 0.69, neutro: 0.15, improdutivo: 0.05, ocioso: 0.09, extra: 0.06,
    teclas: 14.1, cliques: 2.7, entrada: h(8, 49),
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "mail.google.com", titulo: "Protocolo ###### - [email] - Gmail", momento: "há 1 min" },
    estacao: { sincronizou: "há 1 min", versao: "1.6.0" },
  },
  {
    id: "p10", nome: "Eduardo Sá", cargo: "Atendente", equipeId: "atendimento",
    usuario: "eduardo.sa", maquina: "ATD-04",
    media: 392, produtivo: 0.62, neutro: 0.18, improdutivo: 0.09, ocioso: 0.14, extra: 0.03,
    teclas: 12.2, cliques: 2.9, entrada: h(9, 5), hojeAte: h(14, 38),
    agora: { estado: "offline", processo: "chrome.exe", dominio: "web.whatsapp.com", titulo: "WhatsApp", momento: "há 2 h" },
    estacao: { sincronizou: "há 2 h", versao: "1.6.0" },
  },
  {
    id: "p11", nome: "Aline Couto", cargo: "Atendente", equipeId: "atendimento",
    usuario: "aline.couto", maquina: "ATD-05",
    media: 415, produtivo: 0.65, neutro: 0.18, improdutivo: 0.06, ocioso: 0.11, extra: 0.05,
    teclas: 13.0, cliques: 2.6, entrada: h(8, 53),
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "docs.google.com", titulo: "Roteiro de atendimento - Documentos Google", momento: "agora" },
    estacao: { sincronizou: "agora", versao: "1.6.0" },
  },
  {
    id: "p12", nome: "Gustavo Reis", cargo: "Analista de backoffice", equipeId: "backoffice",
    usuario: "gustavo.reis", maquina: "BKO-01",
    media: 447, produtivo: 0.62, neutro: 0.16, improdutivo: 0.05, ocioso: 0.08, extra: 0.14,
    teclas: 8.8, cliques: 4.4, sabado: true, entrada: h(8, 30),
    agora: { estado: "ativo", processo: "anydesk.exe", dominio: null, titulo: "AnyDesk", momento: "agora" },
    estacao: { sincronizou: "há 1 min", versao: "1.6.0" },
  },
  {
    id: "p13", nome: "Fernanda Lopes", cargo: "Analista de backoffice", equipeId: "backoffice",
    usuario: "fernanda.lopes", maquina: "BKO-02",
    media: 426, produtivo: 0.66, neutro: 0.15, improdutivo: 0.05, ocioso: 0.1, extra: 0.06,
    teclas: 9.3, cliques: 4.1, entrada: h(8, 47),
    agora: { estado: "ativo", processo: "EXCEL.EXE", dominio: null, titulo: "Conciliação agosto.xlsx - Excel", momento: "agora" },
    estacao: { sincronizou: "há 2 min", versao: "1.6.0" },
  },
  {
    id: "p14", nome: "Vitor Paes", cargo: "Assistente administrativo", equipeId: "backoffice",
    usuario: "vitor.paes", maquina: "BKO-03",
    media: 389, produtivo: 0.58, neutro: 0.19, improdutivo: 0.09, ocioso: 0.13, extra: 0.03,
    teclas: 7.9, cliques: 4.0, entrada: h(9, 1), paradaDesde: "2026-08-28",
    agora: { estado: "offline", processo: "explorer.exe", dominio: null, titulo: "Downloads", momento: "há 1 d" },
    estacao: { sincronizou: "há 1 d", versao: "1.5.0" },
  },
  {
    id: "p15", nome: "Sônia Albuquerque", cargo: "Analista financeira", equipeId: "backoffice",
    usuario: "sonia.albuquerque", maquina: "BKO-04",
    media: 436, produtivo: 0.68, neutro: 0.15, improdutivo: 0.04, ocioso: 0.09, extra: 0.08,
    teclas: 9.6, cliques: 4.2, entrada: h(8, 39),
    agora: { estado: "ocioso", processo: "chrome.exe", dominio: "gov.br", titulo: "Emissão de guias - gov.br", momento: "há 12 min" },
    estacao: { sincronizou: "agora", versao: "1.6.0" },
  },
  {
    id: "p16", nome: "Helena Castro", cargo: "Advogada", equipeId: "juridico",
    usuario: "helena.castro", maquina: "JUR-01",
    media: 452, produtivo: 0.67, neutro: 0.17, improdutivo: 0.04, ocioso: 0.08, extra: 0.18,
    teclas: 11.5, cliques: 3.0, sabado: true, entrada: h(8, 33),
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "pje.jus.br", titulo: "Painel do advogado - PJe", momento: "agora" },
    estacao: { sincronizou: "agora", versao: "1.6.0" },
  },
  {
    id: "p17", nome: "Rodrigo Tavares", cargo: "Advogado", equipeId: "juridico",
    usuario: "rodrigo.tavares", maquina: "JUR-02",
    media: 428, produtivo: 0.65, neutro: 0.17, improdutivo: 0.06, ocioso: 0.1, extra: 0.07,
    teclas: 10.9, cliques: 2.9, entrada: h(8, 46),
    agora: { estado: "ativo", processo: "WINWORD.EXE", dominio: null, titulo: "Contrato de prestação de serviços.docx - Word", momento: "agora" },
    estacao: { sincronizou: "há 1 min", versao: "1.6.0" },
  },
  {
    id: "p18", nome: "Lívia Martins", cargo: "Assistente jurídica", equipeId: "juridico",
    usuario: "livia.martins", maquina: "JUR-03",
    media: 411, produtivo: 0.64, neutro: 0.19, improdutivo: 0.06, ocioso: 0.12, extra: 0.04,
    teclas: 9.4, cliques: 3.3, entrada: h(8, 57),
    agora: { estado: "ativo", processo: "Acrobat.exe", dominio: null, titulo: "Procuração assinada.pdf - Adobe Acrobat", momento: "agora" },
    estacao: { sincronizou: "há 2 min", versao: "1.6.0" },
  },
];

/**
 * Aplicativos e sites do ambiente, com a categoria que a empresa definiu.
 * Os dois sem categoria existem de propósito: é classificando um deles na
 * própria rosca que o visitante vê o índice mudar.
 */
export type AppDemo = { alvo: string; tipo: TipoCategoria | null };

export const APPS: AppDemo[] = [
  { alvo: "web.whatsapp.com", tipo: "PRODUCTIVE" },
  { alvo: "EXCEL.EXE", tipo: "PRODUCTIVE" },
  { alvo: "mail.google.com", tipo: "PRODUCTIVE" },
  { alvo: "docs.google.com", tipo: "PRODUCTIVE" },
  { alvo: "WINWORD.EXE", tipo: "PRODUCTIVE" },
  { alvo: "Acrobat.exe", tipo: "PRODUCTIVE" },
  { alvo: "pje.jus.br", tipo: "PRODUCTIVE" },
  { alvo: "gov.br", tipo: "PRODUCTIVE" },
  { alvo: "meet.google.com", tipo: "NEUTRAL" },
  { alvo: "explorer.exe", tipo: "NEUTRAL" },
  { alvo: "ms-teams.exe", tipo: "NEUTRAL" },
  { alvo: "calendar.google.com", tipo: "NEUTRAL" },
  { alvo: "youtube.com", tipo: "UNPRODUCTIVE" },
  { alvo: "instagram.com", tipo: "UNPRODUCTIVE" },
  { alvo: "anydesk.exe", tipo: null },
  { alvo: "notepad.exe", tipo: null },
];

/** Categorias oferecidas na classificação, como o catálogo padrão do produto. */
export const CATEGORIAS: { id: TipoCategoria; nome: string }[] = [
  { id: "PRODUCTIVE", nome: "Produtivo" },
  { id: "NEUTRAL", nome: "Neutro" },
  { id: "UNPRODUCTIVE", nome: "Improdutivo" },
];

type BaseCategoria = "PRODUCTIVE" | "NEUTRAL" | "UNPRODUCTIVE" | "SEM";

/**
 * Como o tempo de cada categoria se divide entre as ferramentas, por equipe.
 * O comercial vive no WhatsApp; o backoffice, no Excel; o jurídico, no PJe e
 * no Word. Os pesos são normalizados no motor.
 */
export const PESOS: Record<string, Record<BaseCategoria, Record<string, number>>> = {
  comercial: {
    PRODUCTIVE: {
      "web.whatsapp.com": 0.41, "docs.google.com": 0.2, "mail.google.com": 0.16,
      "EXCEL.EXE": 0.14, "Acrobat.exe": 0.06, "WINWORD.EXE": 0.03,
    },
    NEUTRAL: { "meet.google.com": 0.34, "explorer.exe": 0.3, "calendar.google.com": 0.2, "ms-teams.exe": 0.16 },
    UNPRODUCTIVE: { "youtube.com": 0.52, "instagram.com": 0.48 },
    SEM: { "notepad.exe": 0.6, "anydesk.exe": 0.4 },
  },
  atendimento: {
    PRODUCTIVE: {
      "web.whatsapp.com": 0.52, "mail.google.com": 0.22, "docs.google.com": 0.12,
      "EXCEL.EXE": 0.08, "Acrobat.exe": 0.06,
    },
    NEUTRAL: { "meet.google.com": 0.28, "explorer.exe": 0.32, "calendar.google.com": 0.14, "ms-teams.exe": 0.26 },
    UNPRODUCTIVE: { "instagram.com": 0.56, "youtube.com": 0.44 },
    SEM: { "anydesk.exe": 0.62, "notepad.exe": 0.38 },
  },
  backoffice: {
    PRODUCTIVE: {
      "EXCEL.EXE": 0.38, "mail.google.com": 0.14, "gov.br": 0.14, "docs.google.com": 0.12,
      "Acrobat.exe": 0.12, "WINWORD.EXE": 0.1,
    },
    NEUTRAL: { "explorer.exe": 0.46, "ms-teams.exe": 0.24, "meet.google.com": 0.18, "calendar.google.com": 0.12 },
    UNPRODUCTIVE: { "youtube.com": 0.6, "instagram.com": 0.4 },
    SEM: { "anydesk.exe": 0.84, "notepad.exe": 0.16 },
  },
  juridico: {
    PRODUCTIVE: {
      "pje.jus.br": 0.3, "WINWORD.EXE": 0.26, "Acrobat.exe": 0.18, "mail.google.com": 0.14,
      "docs.google.com": 0.12,
    },
    NEUTRAL: { "explorer.exe": 0.36, "meet.google.com": 0.3, "calendar.google.com": 0.2, "ms-teams.exe": 0.14 },
    UNPRODUCTIVE: { "youtube.com": 0.55, "instagram.com": 0.45 },
    SEM: { "notepad.exe": 0.78, "anydesk.exe": 0.22 },
  },
};

/** Linha do tempo das estações (tela de Dispositivos), mais recente primeiro. */
export type TipoEventoEstacao =
  | "AGENTE_INICIADO"
  | "AGENTE_PARADO"
  | "SUSPENSA"
  | "RETOMADA"
  | "DESLIGANDO"
  | "BLOQUEADA"
  | "DESBLOQUEADA";

export type EventoEstacao = {
  id: number;
  dia: "Hoje" | "Ontem" | string;
  hora: string;
  maquina: string;
  tipo: TipoEventoEstacao;
};

export const EVENTOS: EventoEstacao[] = [
  { id: 1, dia: "Hoje", hora: "16:21", maquina: "JUR-01", tipo: "DESBLOQUEADA" },
  { id: 2, dia: "Hoje", hora: "16:02", maquina: "JUR-01", tipo: "BLOQUEADA" },
  { id: 3, dia: "Hoje", hora: "14:38", maquina: "ATD-04", tipo: "DESLIGANDO" },
  { id: 4, dia: "Hoje", hora: "13:07", maquina: "ATD-02", tipo: "DESBLOQUEADA" },
  { id: 5, dia: "Hoje", hora: "12:04", maquina: "ATD-02", tipo: "BLOQUEADA" },
  { id: 6, dia: "Hoje", hora: "08:58", maquina: "ATD-02", tipo: "AGENTE_INICIADO" },
  { id: 7, dia: "Hoje", hora: "08:41", maquina: "COM-01", tipo: "AGENTE_INICIADO" },
  { id: 8, dia: "Hoje", hora: "08:18", maquina: "COM-04", tipo: "AGENTE_INICIADO" },
  { id: 9, dia: "Ontem", hora: "20:12", maquina: "COM-04", tipo: "DESLIGANDO" },
  { id: 10, dia: "Ontem", hora: "18:44", maquina: "BKO-01", tipo: "SUSPENSA" },
  { id: 11, dia: "Ontem", hora: "18:06", maquina: "COM-01", tipo: "DESLIGANDO" },
  { id: 12, dia: "Ontem", hora: "17:32", maquina: "BKO-03", tipo: "AGENTE_PARADO" },
  { id: 13, dia: "Ontem", hora: "13:02", maquina: "COM-03", tipo: "DESBLOQUEADA" },
  { id: 14, dia: "Ontem", hora: "12:10", maquina: "COM-03", tipo: "BLOQUEADA" },
  { id: 15, dia: "Ontem", hora: "08:47", maquina: "JUR-02", tipo: "AGENTE_INICIADO" },
  { id: 16, dia: "qua., 26 de ago.", hora: "19:55", maquina: "JUR-01", tipo: "DESLIGANDO" },
  { id: 17, dia: "qua., 26 de ago.", hora: "18:09", maquina: "ATD-01", tipo: "DESLIGANDO" },
  { id: 18, dia: "qua., 26 de ago.", hora: "08:40", maquina: "BKO-01", tipo: "RETOMADA" },
];
