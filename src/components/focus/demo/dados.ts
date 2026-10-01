/**
 * Dados do ambiente demonstrativo do NewSec Focus. Tudo aqui é fictício,
 * por decisão: nenhuma tela deste site sai de captura de produção.
 *
 * A empresa é a mesma "SuaEmpresa" das telas do CRM. Não é acaso: o
 * comprador do Focus mais provável hoje é quem já usa o CRM, e ver a mesma
 * empresa nos dois produtos conta essa história sem precisar dizer.
 *
 * O que está aqui é só o perfil de cada pessoa e a escala de cada equipe. Os
 * números do painel saem do gerador em `motor.ts`, que monta o dia de cada
 * pessoa minuto a minuto a partir destes perfis — por isso tudo fecha entre
 * si: a soma das pessoas é a da equipe, a da equipe é a da empresa, e o
 * índice do cartão é o mesmo da tabela.
 *
 * ⚠️ A régua é a do painel desde 16/09/2026: tempo produtivo ÷ EXPEDIENTE
 * (escala menos intervalo). Desligado, bloqueado e ocioso dentro do
 * expediente puxam o número para baixo, e por isso operações reais ficam em
 * 12–47% — 50% já é um time muito bom. Os perfis foram calibrados para cair
 * nessa faixa; um índice de 80% aqui faria o produto parecer "quebrado"
 * depois de instalado.
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
  fuso: "America/Sao_Paulo",
  maxDispositivos: 25,
  /** Minutos sem envio a partir dos quais a estação conta como atrasada. */
  limiarAtrasoMinutos: 25,
  /** Primeiro dia com dado: a empresa começou a usar o Focus em janeiro. */
  inicioUso: "2026-01-05",
} as const;

export const USUARIO = {
  nome: "Renata Lima",
  email: "renata@suaempresa.demo",
  papel: "Proprietário",
} as const;

/**
 * O "agora" do ambiente demonstrativo: sexta-feira, 25/09/2026, 16h40.
 * Fixo de propósito — relógio de verdade aqui faria o HTML do build divergir
 * do que o navegador desenha, e a demonstração envelheceria sozinha.
 */
export const HOJE = "2026-09-25";
export const AGORA_MINUTOS = 16 * 60 + 40;
/** Última consolidação dos agregados (o painel roda a cada 10 min). */
export const CONSOLIDADO_MINUTOS = 16 * 60 + 30;

/** Feriados nacionais de 2026 até setembro: o gráfico pula esses dias, como pularia. */
export const FERIADOS = [
  "2026-01-01",
  "2026-02-16",
  "2026-02-17",
  "2026-04-03",
  "2026-04-21",
  "2026-05-01",
  "2026-06-04",
  "2026-09-07",
];

/**
 * Escala de expediente, de segunda a sexta. O expediente é a escala MENOS o
 * intervalo: é contra ele que o índice e a cobertura são medidos, e o que cai
 * fora dele é "fora da escala" (nunca entra no índice).
 */
export type Escala = { inicio: number; fim: number; intervaloInicio: number; intervaloFim: number };

const h = (hora: number, minuto = 0) => hora * 60 + minuto;

export type EquipeDemo = { id: string; nome: string; escala: Escala };

export const EQUIPES: EquipeDemo[] = [
  { id: "comercial", nome: "Comercial", escala: { inicio: h(9), fim: h(18), intervaloInicio: h(12), intervaloFim: h(13) } },
  { id: "atendimento", nome: "Atendimento", escala: { inicio: h(8), fim: h(17), intervaloInicio: h(12), intervaloFim: h(13) } },
  { id: "backoffice", nome: "Backoffice", escala: { inicio: h(9), fim: h(18), intervaloInicio: h(12), intervaloFim: h(13) } },
  { id: "juridico", nome: "Jurídico", escala: { inicio: h(9), fim: h(18), intervaloInicio: h(12, 30), intervaloFim: h(13, 30) } },
];

export type EstadoAgora = "ativo" | "ocioso" | "offline";

export type PerfilPessoa = {
  id: string;
  nome: string;
  cargo: string;
  equipeId: string;
  usuario: string;
  maquina: string;
  /**
   * Como o tempo ATIVO se divide, em frações: produtivo, neutro, improdutivo
   * e sem classificação. O índice sai daqui multiplicado pelo quanto do
   * expediente a pessoa fica ativa.
   */
  produtivo: number;
  neutro: number;
  improdutivo: number;
  sem: number;
  /** Chance de cada trecho do dia ser ocioso (sem teclado e mouse). */
  ocioso: number;
  /** Minutos que costuma chegar antes (negativo) ou depois do início da escala. */
  chegada: number;
  /** Minutos que costuma ficar depois do fim da escala (positivo) ou sair antes. */
  saida: number;
  /** Teclas e cliques por minuto ativo — só a contagem, como o agente. */
  teclas: number;
  cliques: number;
  /** Trabalha o último sábado do mês (fechamento). Conta como fora da escala. */
  sabado?: boolean;
  /** Hoje a estação desligou mais cedo. */
  hojeAte?: number;
  /** A partir deste dia a estação não envia mais nada (agente parado). */
  paradaDesde?: string;
  /** Primeiro dia com registro (estação instalada depois do início). */
  desde?: string;
  /** Cadastro ainda não revisado por um administrador. */
  pendente?: boolean;
  /** O que a pessoa está fazendo agora, para "Atividade agora". */
  agora: {
    estado: EstadoAgora;
    processo: string;
    dominio: string | null;
    titulo: string;
    momento: string;
  };
  /** Situação da estação na tela de Dispositivos. */
  estacao: { ultimoEnvio: string; versao: string };
};

export const PESSOAS: PerfilPessoa[] = [
  {
    id: "p01", nome: "Marina Vasques", cargo: "Supervisora comercial", equipeId: "comercial",
    usuario: "marina.vasques", maquina: "COM-01",
    produtivo: 0.4, neutro: 0.27, improdutivo: 0.07, sem: 0.08, ocioso: 0.13, chegada: -14, saida: 12,
    teclas: 9.5, cliques: 3.1,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "web.whatsapp.com", titulo: "(3) WhatsApp", momento: "agora" },
    estacao: { ultimoEnvio: "16:39", versao: "1.6.0" },
  },
  {
    id: "p02", nome: "Rafael Otoni", cargo: "Consultor comercial", equipeId: "comercial",
    usuario: "rafael.otoni", maquina: "COM-02",
    produtivo: 0.36, neutro: 0.26, improdutivo: 0.11, sem: 0.08, ocioso: 0.17, chegada: 4, saida: 2,
    teclas: 11.2, cliques: 3.4,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "docs.google.com", titulo: "Retornos da semana - Planilhas Google", momento: "agora" },
    estacao: { ultimoEnvio: "16:38", versao: "1.6.0" },
  },
  {
    id: "p03", nome: "Camila Prado", cargo: "Consultora comercial", equipeId: "comercial",
    usuario: "camila.prado", maquina: "COM-03",
    produtivo: 0.38, neutro: 0.25, improdutivo: 0.08, sem: 0.07, ocioso: 0.14, chegada: 2, saida: -4,
    teclas: 10.1, cliques: 3.0,
    agora: { estado: "ativo", processo: "EXCEL.EXE", dominio: null, titulo: "Comissões setembro.xlsx - Excel", momento: "agora" },
    estacao: { ultimoEnvio: "16:37", versao: "1.6.0" },
  },
  {
    id: "p04", nome: "Diego Antunes", cargo: "Consultor comercial", equipeId: "comercial",
    usuario: "diego.antunes", maquina: "COM-04",
    produtivo: 0.37, neutro: 0.25, improdutivo: 0.14, sem: 0.07, ocioso: 0.12, chegada: -38, saida: 95,
    teclas: 12.4, cliques: 3.8, sabado: true,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "mail.google.com", titulo: "Caixa de entrada (12) - [email] - Gmail", momento: "agora" },
    estacao: { ultimoEnvio: "16:39", versao: "1.6.0" },
  },
  {
    id: "p05", nome: "Larissa Nunes", cargo: "Consultora comercial", equipeId: "comercial",
    usuario: "larissa.nunes", maquina: "COM-05",
    produtivo: 0.32, neutro: 0.26, improdutivo: 0.14, sem: 0.08, ocioso: 0.22, chegada: 12, saida: -8,
    teclas: 9.1, cliques: 2.9,
    agora: { estado: "ocioso", processo: "WhatsApp.exe", dominio: null, titulo: "(título não coletado)", momento: "há 6 min" },
    estacao: { ultimoEnvio: "16:36", versao: "1.6.0" },
  },
  {
    id: "p06", nome: "Bruno Kawano", cargo: "Consultor comercial", equipeId: "comercial",
    usuario: "bruno.kawano", maquina: "COM-06",
    produtivo: 0.25, neutro: 0.24, improdutivo: 0.28, sem: 0.08, ocioso: 0.28, chegada: 18, saida: -12,
    teclas: 8.2, cliques: 3.2,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "youtube.com", titulo: "Tabela dinâmica do zero - YouTube", momento: "agora" },
    estacao: { ultimoEnvio: "16:38", versao: "1.6.0" },
  },
  {
    id: "p07", nome: "Patrícia Leme", cargo: "Coordenadora de atendimento", equipeId: "atendimento",
    usuario: "patricia.leme", maquina: "ATD-01",
    produtivo: 0.36, neutro: 0.31, improdutivo: 0.07, sem: 0.07, ocioso: 0.14, chegada: -10, saida: 22,
    teclas: 10.8, cliques: 3.3,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "meet.google.com", titulo: "Meet - Alinhamento do atendimento", momento: "agora" },
    estacao: { ultimoEnvio: "16:39", versao: "1.6.0" },
  },
  {
    id: "p08", nome: "Thiago Moura", cargo: "Atendente", equipeId: "atendimento",
    usuario: "thiago.moura", maquina: "ATD-02",
    produtivo: 0.4, neutro: 0.25, improdutivo: 0.1, sem: 0.07, ocioso: 0.17, chegada: 5, saida: 0,
    teclas: 13.6, cliques: 2.8,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "web.whatsapp.com", titulo: "(8) WhatsApp", momento: "agora" },
    estacao: { ultimoEnvio: "16:38", versao: "1.6.0" },
  },
  {
    id: "p09", nome: "Juliana Ferraz", cargo: "Atendente", equipeId: "atendimento",
    usuario: "juliana.ferraz", maquina: "ATD-03",
    produtivo: 0.41, neutro: 0.25, improdutivo: 0.07, sem: 0.07, ocioso: 0.12, chegada: -4, saida: 4,
    teclas: 14.1, cliques: 2.7,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "mail.google.com", titulo: "Protocolo ###### - [email] - Gmail", momento: "há 1 min" },
    estacao: { ultimoEnvio: "16:39", versao: "1.6.0" },
  },
  {
    id: "p10", nome: "Eduardo Sá", cargo: "Atendente", equipeId: "atendimento",
    usuario: "eduardo.sa", maquina: "ATD-04",
    produtivo: 0.34, neutro: 0.26, improdutivo: 0.13, sem: 0.07, ocioso: 0.2, chegada: 9, saida: -5, hojeAte: h(14, 38),
    teclas: 12.2, cliques: 2.9,
    agora: { estado: "offline", processo: "chrome.exe", dominio: "web.whatsapp.com", titulo: "WhatsApp", momento: "há 2 h" },
    estacao: { ultimoEnvio: "14:38", versao: "1.6.0" },
  },
  {
    id: "p11", nome: "Aline Couto", cargo: "Atendente", equipeId: "atendimento",
    usuario: "aline.couto", maquina: "ATD-05",
    produtivo: 0.38, neutro: 0.26, improdutivo: 0.08, sem: 0.07, ocioso: 0.16, chegada: 1, saida: 1,
    teclas: 13.0, cliques: 2.6,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "docs.google.com", titulo: "Roteiro de atendimento - Documentos Google", momento: "agora" },
    estacao: { ultimoEnvio: "16:37", versao: "1.6.0" },
  },
  {
    id: "p19", nome: "Paulo Henrique", cargo: "Atendente", equipeId: "atendimento",
    usuario: "paulo.henrique", maquina: "ATD-06",
    produtivo: 0.34, neutro: 0.26, improdutivo: 0.1, sem: 0.09, ocioso: 0.19, chegada: 6, saida: 0,
    teclas: 11.8, cliques: 2.8, desde: "2026-09-21", pendente: true,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "web.whatsapp.com", titulo: "(2) WhatsApp", momento: "agora" },
    estacao: { ultimoEnvio: "16:38", versao: "1.6.0" },
  },
  {
    id: "p12", nome: "Gustavo Reis", cargo: "Analista de backoffice", equipeId: "backoffice",
    usuario: "gustavo.reis", maquina: "BKO-01",
    produtivo: 0.36, neutro: 0.24, improdutivo: 0.07, sem: 0.18, ocioso: 0.12, chegada: -26, saida: 48,
    teclas: 8.8, cliques: 4.4, sabado: true,
    agora: { estado: "ativo", processo: "anydesk.exe", dominio: null, titulo: "AnyDesk", momento: "agora" },
    estacao: { ultimoEnvio: "16:38", versao: "1.6.0" },
  },
  {
    id: "p13", nome: "Fernanda Lopes", cargo: "Analista de backoffice", equipeId: "backoffice",
    usuario: "fernanda.lopes", maquina: "BKO-02",
    produtivo: 0.4, neutro: 0.24, improdutivo: 0.07, sem: 0.08, ocioso: 0.14, chegada: -6, saida: 10,
    teclas: 9.3, cliques: 4.1,
    agora: { estado: "ativo", processo: "EXCEL.EXE", dominio: null, titulo: "Conciliação setembro.xlsx - Excel", momento: "agora" },
    estacao: { ultimoEnvio: "16:37", versao: "1.6.0" },
  },
  {
    id: "p14", nome: "Vitor Paes", cargo: "Assistente administrativo", equipeId: "backoffice",
    usuario: "vitor.paes", maquina: "BKO-03",
    produtivo: 0.3, neutro: 0.26, improdutivo: 0.14, sem: 0.08, ocioso: 0.19, chegada: 8, saida: -6, paradaDesde: "2026-09-25",
    teclas: 7.9, cliques: 4.0,
    agora: { estado: "offline", processo: "explorer.exe", dominio: null, titulo: "Downloads", momento: "ontem" },
    estacao: { ultimoEnvio: "ontem 17:52", versao: "1.5.0" },
  },
  {
    id: "p15", nome: "Sônia Albuquerque", cargo: "Analista financeira", equipeId: "backoffice",
    usuario: "sonia.albuquerque", maquina: "BKO-04",
    produtivo: 0.41, neutro: 0.25, improdutivo: 0.06, sem: 0.07, ocioso: 0.13, chegada: -12, saida: 14,
    teclas: 9.6, cliques: 4.2,
    agora: { estado: "ocioso", processo: "chrome.exe", dominio: "gov.br", titulo: "Emissão de guias - gov.br", momento: "há 12 min" },
    estacao: { ultimoEnvio: "16:39", versao: "1.6.0" },
  },
  {
    id: "p16", nome: "Helena Castro", cargo: "Advogada", equipeId: "juridico",
    usuario: "helena.castro", maquina: "JUR-01",
    produtivo: 0.41, neutro: 0.27, improdutivo: 0.06, sem: 0.07, ocioso: 0.12, chegada: -18, saida: 70,
    teclas: 11.5, cliques: 3.0, sabado: true,
    agora: { estado: "ativo", processo: "chrome.exe", dominio: "pje.jus.br", titulo: "Painel do advogado - PJe", momento: "agora" },
    estacao: { ultimoEnvio: "16:39", versao: "1.6.0" },
  },
  {
    id: "p17", nome: "Rodrigo Tavares", cargo: "Advogado", equipeId: "juridico",
    usuario: "rodrigo.tavares", maquina: "JUR-02",
    produtivo: 0.39, neutro: 0.25, improdutivo: 0.08, sem: 0.07, ocioso: 0.14, chegada: -2, saida: 8,
    teclas: 10.9, cliques: 2.9,
    agora: { estado: "ativo", processo: "WINWORD.EXE", dominio: null, titulo: "Contrato de prestação de serviços.docx - Word", momento: "agora" },
    estacao: { ultimoEnvio: "16:38", versao: "1.6.0" },
  },
  {
    id: "p18", nome: "Lívia Martins", cargo: "Assistente jurídica", equipeId: "juridico",
    usuario: "livia.martins", maquina: "JUR-03",
    produtivo: 0.36, neutro: 0.26, improdutivo: 0.08, sem: 0.08, ocioso: 0.17, chegada: 6, saida: -2,
    teclas: 9.4, cliques: 3.3,
    agora: { estado: "ativo", processo: "Acrobat.exe", dominio: null, titulo: "Procuração assinada.pdf - Adobe Acrobat", momento: "agora" },
    estacao: { ultimoEnvio: "16:37", versao: "1.6.0" },
  },
];

/**
 * Aplicativos e sites do ambiente, com a categoria que a empresa definiu.
 * Os sem categoria existem de propósito: é classificando um deles em
 * Aplicativos e sites que o visitante vê o índice da empresa mudar.
 */
export type AppDemo = { alvo: string; site: boolean; tipo: TipoCategoria | null };

export const APPS: AppDemo[] = [
  { alvo: "web.whatsapp.com", site: true, tipo: "PRODUCTIVE" },
  { alvo: "EXCEL.EXE", site: false, tipo: "PRODUCTIVE" },
  { alvo: "mail.google.com", site: true, tipo: "PRODUCTIVE" },
  { alvo: "docs.google.com", site: true, tipo: "PRODUCTIVE" },
  { alvo: "WINWORD.EXE", site: false, tipo: "PRODUCTIVE" },
  { alvo: "Acrobat.exe", site: false, tipo: "PRODUCTIVE" },
  { alvo: "pje.jus.br", site: true, tipo: "PRODUCTIVE" },
  { alvo: "gov.br", site: true, tipo: "PRODUCTIVE" },
  { alvo: "WhatsApp.exe", site: false, tipo: "PRODUCTIVE" },
  { alvo: "meet.google.com", site: true, tipo: "NEUTRAL" },
  { alvo: "explorer.exe", site: false, tipo: "NEUTRAL" },
  { alvo: "ms-teams.exe", site: false, tipo: "NEUTRAL" },
  { alvo: "calendar.google.com", site: true, tipo: "NEUTRAL" },
  { alvo: "youtube.com", site: true, tipo: "UNPRODUCTIVE" },
  { alvo: "instagram.com", site: true, tipo: "UNPRODUCTIVE" },
  { alvo: "anydesk.exe", site: false, tipo: null },
  { alvo: "notepad.exe", site: false, tipo: null },
  { alvo: "canva.com", site: true, tipo: null },
];

/** Categorias oferecidas na classificação, como o catálogo padrão do produto. */
export const CATEGORIAS: { id: TipoCategoria; nome: string }[] = [
  { id: "PRODUCTIVE", nome: "Produtivo" },
  { id: "NEUTRAL", nome: "Neutro" },
  { id: "UNPRODUCTIVE", nome: "Improdutivo" },
];

export type BaseCategoria = "PRODUCTIVE" | "NEUTRAL" | "UNPRODUCTIVE" | "SEM";

/**
 * Como o tempo de cada categoria se divide entre as ferramentas, por equipe.
 * O comercial vive no WhatsApp; o backoffice, no Excel; o jurídico, no PJe e
 * no Word. Os pesos são normalizados no motor.
 */
export const PESOS: Record<string, Record<BaseCategoria, Record<string, number>>> = {
  comercial: {
    PRODUCTIVE: {
      "web.whatsapp.com": 0.36, "docs.google.com": 0.2, "mail.google.com": 0.16,
      "EXCEL.EXE": 0.14, "WhatsApp.exe": 0.06, "Acrobat.exe": 0.05, "WINWORD.EXE": 0.03,
    },
    NEUTRAL: { "meet.google.com": 0.3, "ms-teams.exe": 0.28, "calendar.google.com": 0.22, "explorer.exe": 0.2 },
    UNPRODUCTIVE: { "youtube.com": 0.52, "instagram.com": 0.48 },
    SEM: { "canva.com": 0.5, "notepad.exe": 0.3, "anydesk.exe": 0.2 },
  },
  atendimento: {
    PRODUCTIVE: {
      "web.whatsapp.com": 0.46, "mail.google.com": 0.22, "docs.google.com": 0.12,
      "WhatsApp.exe": 0.08, "EXCEL.EXE": 0.07, "Acrobat.exe": 0.05,
    },
    NEUTRAL: { "ms-teams.exe": 0.3, "explorer.exe": 0.26, "meet.google.com": 0.24, "calendar.google.com": 0.2 },
    UNPRODUCTIVE: { "instagram.com": 0.56, "youtube.com": 0.44 },
    SEM: { "anydesk.exe": 0.55, "notepad.exe": 0.3, "canva.com": 0.15 },
  },
  backoffice: {
    PRODUCTIVE: {
      "EXCEL.EXE": 0.38, "mail.google.com": 0.14, "gov.br": 0.14, "docs.google.com": 0.12,
      "Acrobat.exe": 0.12, "WINWORD.EXE": 0.1,
    },
    NEUTRAL: { "explorer.exe": 0.36, "ms-teams.exe": 0.3, "meet.google.com": 0.2, "calendar.google.com": 0.14 },
    UNPRODUCTIVE: { "youtube.com": 0.6, "instagram.com": 0.4 },
    SEM: { "anydesk.exe": 0.84, "notepad.exe": 0.16 },
  },
  juridico: {
    PRODUCTIVE: {
      "pje.jus.br": 0.3, "WINWORD.EXE": 0.26, "Acrobat.exe": 0.18, "mail.google.com": 0.14,
      "docs.google.com": 0.12,
    },
    NEUTRAL: { "calendar.google.com": 0.3, "meet.google.com": 0.28, "explorer.exe": 0.26, "ms-teams.exe": 0.16 },
    UNPRODUCTIVE: { "youtube.com": 0.55, "instagram.com": 0.45 },
    SEM: { "notepad.exe": 0.7, "canva.com": 0.18, "anydesk.exe": 0.12 },
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
  dia: string;
  hora: string;
  maquina: string;
  tipo: TipoEventoEstacao;
};

export const EVENTOS: EventoEstacao[] = [
  { id: 1, dia: "Hoje", hora: "16:21", maquina: "JUR-01", tipo: "DESBLOQUEADA" },
  { id: 2, dia: "Hoje", hora: "16:02", maquina: "JUR-01", tipo: "BLOQUEADA" },
  { id: 3, dia: "Hoje", hora: "14:38", maquina: "ATD-04", tipo: "DESLIGANDO" },
  { id: 4, dia: "Hoje", hora: "13:04", maquina: "ATD-02", tipo: "DESBLOQUEADA" },
  { id: 5, dia: "Hoje", hora: "12:02", maquina: "ATD-02", tipo: "BLOQUEADA" },
  { id: 6, dia: "Hoje", hora: "08:05", maquina: "ATD-02", tipo: "AGENTE_INICIADO" },
  { id: 7, dia: "Hoje", hora: "08:46", maquina: "COM-01", tipo: "AGENTE_INICIADO" },
  { id: 8, dia: "Hoje", hora: "08:22", maquina: "COM-04", tipo: "AGENTE_INICIADO" },
  { id: 9, dia: "Ontem", hora: "19:41", maquina: "COM-04", tipo: "DESLIGANDO" },
  { id: 10, dia: "Ontem", hora: "18:44", maquina: "BKO-01", tipo: "SUSPENSA" },
  { id: 11, dia: "Ontem", hora: "18:12", maquina: "COM-01", tipo: "DESLIGANDO" },
  { id: 12, dia: "Ontem", hora: "17:52", maquina: "BKO-03", tipo: "AGENTE_PARADO" },
  { id: 13, dia: "Ontem", hora: "13:02", maquina: "COM-03", tipo: "DESBLOQUEADA" },
  { id: 14, dia: "Ontem", hora: "12:04", maquina: "COM-03", tipo: "BLOQUEADA" },
  { id: 15, dia: "Ontem", hora: "08:58", maquina: "JUR-02", tipo: "AGENTE_INICIADO" },
  { id: 16, dia: "qua., 23 de set.", hora: "19:12", maquina: "JUR-01", tipo: "DESLIGANDO" },
  { id: 17, dia: "qua., 23 de set.", hora: "17:22", maquina: "ATD-01", tipo: "DESLIGANDO" },
  { id: 18, dia: "qua., 23 de set.", hora: "08:34", maquina: "BKO-01", tipo: "RETOMADA" },
];
