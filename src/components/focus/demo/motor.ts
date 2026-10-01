/**
 * Motor do ambiente demonstrativo do NewSec Focus.
 *
 * Monta, minuto a minuto, o dia de cada pessoa de `dados.ts` (trechos ativos,
 * ociosos e de tela bloqueada, cada trecho ativo num aplicativo ou site) e
 * agrega do mesmo jeito que o painel agrega. É isto que deixa a réplica
 * navegável de verdade — trocar para semana, voltar para agosto, filtrar o
 * Jurídico ou classificar um aplicativo recalcula tudo, e os números
 * continuam fechando entre si.
 *
 * Três regras que não podem ser quebradas aqui:
 *
 * 1. **Nada de relógio nem de sorteio.** O "agora" é fixo em `dados.ts` e a
 *    variação vem de um hash da chave (pessoa + dia + medida). O HTML gerado
 *    no build e o navegador do visitante calculam exatamente o mesmo número —
 *    senão a hidratação quebra (erro #418 do React).
 * 2. **A régua é a do painel** (newsecfocus `lib/produtividade.ts` e a
 *    migration 0036): índice = tempo produtivo ÷ expediente decorrido da
 *    escala (sem o intervalo, cortado no "agora"); a média da empresa e da
 *    equipe é a MÉDIA SIMPLES do % de cada pessoa; atividade fora da escala
 *    nunca entra no índice.
 * 3. **O comparativo é alinhado no relógio.** Às 16h40, "vs mês anterior"
 *    compara com o mês anterior até o mesmo ponto, e o dia compara com o
 *    último dia COM expediente (segunda compara com sexta).
 */

import { CORES_EXPEDIENTE, type TipoCategoria } from "./formato";
import {
  AGORA_MINUTOS,
  APPS,
  EMPRESA,
  EQUIPES,
  FERIADOS,
  HOJE,
  PESOS,
  PESSOAS,
  type BaseCategoria,
  type Escala,
  type PerfilPessoa,
} from "./dados";

/* -------------------------------------------------------------------------
   Limiares de leitura (newsecfocus `lib/regras.ts`)
   ------------------------------------------------------------------------- */

export const REGRAS = {
  /** Cobertura mínima para comparar dois períodos. */
  coberturaMinimaComparacao: 50,
  /** Variação de índice, em p.p., que vira ponto de atenção. */
  variacaoRelevantePp: 5,
  /** Pessoas com menos que isto de cobertura aparecem como dado incompleto. */
  coberturaBaixa: 50,
  /** Fora da escala abaixo disto, no período, é ruído. */
  minutosForaEscalaRelevante: 15,
  maxPontosAtencao: 3,
  coberturaMinimaPontoEvolucao: 50,
} as const;

/* -------------------------------------------------------------------------
   Tipos
   ------------------------------------------------------------------------- */

export type Preset = "dia" | "semana" | "mes" | "ano" | "geral" | "personalizado";

export type PeriodoDemo = {
  preset: Preset;
  /** Data de referência, AAAA-MM-DD. */
  ancora: string;
  /** Só no personalizado, intervalo inclusivo. */
  de?: string;
  ate?: string;
};

export type EscopoDemo = {
  equipeId: string | null;
  colaboradorId: string | null;
};

/** Classificações feitas pelo visitante: alvo → categoria. */
export type Classificacoes = Record<string, TipoCategoria>;

export const ESCOPO_VAZIO: EscopoDemo = { equipeId: null, colaboradorId: null };

export type Bucket = "hour" | "day" | "week" | "month";

export type Intervalo = {
  /** Dias desde 1970-01-01, em UTC. Início e fim inclusivos. */
  inicio: number;
  fim: number;
  bucket: Bucket;
  rotulo: string;
};

/** Uma janela de dias, com o último dia opcionalmente cortado num minuto. */
type Janela = { inicio: number; fim: number; corte: number | null };

export type Minutos = {
  expediente: number;
  registrados: number;
  ativos: number;
  produtivos: number;
  neutros: number;
  improdutivos: number;
  semClassificar: number;
  ociosos: number;
  bloqueado: number;
  semDados: number;
  ativosFora: number;
};

export type LinhaProdutividade = {
  colaboradorId: string;
  colaborador: string;
  cargo: string;
  equipeId: string;
  equipe: string;
  minutos: Minutos;
  indice: number | null;
  cobertura: number | null;
  diasComRegistro: number;
  diasComExpediente: number;
  primeiroMedio: number | null;
  ultimoMedio: number | null;
  /** Último registro do recorte: dia + minuto. */
  ultimoRegistro: { dia: number; minuto: number } | null;
};

export type Resumo = {
  pessoas: number;
  pessoasComRegistro: number;
  indiceMedio: number | null;
  cobertura: number | null;
  minutos: Minutos;
};

export type LinhaEquipe = {
  equipeId: string;
  equipe: string;
  pessoas: number;
  indice: number | null;
  cobertura: number | null;
  minutosAtivos: number;
  minutosForaEscala: number;
  variacao: number | null;
  minutos: Minutos;
};

export type PontoEvolucao = {
  chave: string;
  rotulo: string;
  rotuloCompleto: string;
  atual: number | null;
  anterior: number | null;
};

export type PontoAtividade = {
  chave: string;
  rotulo: string;
  rotuloCompleto: string;
  produtivo: number;
  neutro: number;
  improdutivo: number;
  sem: number;
  ocioso: number;
};

export type LinhaApp = {
  alvo: string;
  site: boolean;
  tipo: TipoCategoria | null;
  minutos: number;
  pessoas: number;
  dias: number;
};

export type PontoAtencao = {
  natureza: "dados" | "observacao";
  titulo: string;
  detalhe?: string;
  acao: { rotulo: string; tela: "aplicativos" | "pessoas" | "jornada" | "equipe" | "dispositivos"; equipeId?: string };
};

export type Recorte = {
  intervalo: Intervalo;
  /** "01 – 25 set. 2026": o intervalo que os números cobrem, cortado em hoje. */
  rotuloCurto: string;
  rotuloComparacao: string | null;
  linhas: LinhaProdutividade[];
  anteriores: LinhaProdutividade[] | null;
  resumo: Resumo;
  resumoAnterior: Resumo | null;
  variacao: number | null;
  fora: { minutos: number; pessoas: number };
  equipes: LinhaEquipe[];
  evolucao: { pontos: PontoEvolucao[]; descricao: string; temAnterior: boolean };
  atividade: { pontos: PontoAtividade[]; bucket: Bucket };
  apps: LinhaApp[];
  pontos: PontoAtencao[];
};

/* -------------------------------------------------------------------------
   Datas — tudo em dias inteiros desde 1970-01-01, em UTC.
   ------------------------------------------------------------------------- */

const DIA_MS = 86_400_000;
const pad = (n: number) => String(n).padStart(2, "0");

export function paraDia(iso: string): number {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return Math.round(Date.UTC(ano, mes - 1, dia) / DIA_MS);
}

export function paraIso(dia: number): string {
  const data = new Date(dia * DIA_MS);
  return `${data.getUTCFullYear()}-${pad(data.getUTCMonth() + 1)}-${pad(data.getUTCDate())}`;
}

export function partes(dia: number) {
  const data = new Date(dia * DIA_MS);
  return {
    ano: data.getUTCFullYear(),
    mes: data.getUTCMonth() + 1,
    dia: data.getUTCDate(),
    semana: data.getUTCDay(),
  };
}

function diaDe(ano: number, mes: number, dia: number): number {
  return Math.round(Date.UTC(ano, mes - 1, dia) / DIA_MS);
}

export const DIA_HOJE = paraDia(HOJE);
const DIA_INICIO = paraDia(EMPRESA.inicioUso);
const DIAS_FERIADO = new Set(FERIADOS.map(paraDia));

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
export const MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);
const clamp = (valor: number, minimo: number, maximo: number) => Math.min(maximo, Math.max(minimo, valor));

/** "25/09/2026". */
export function dataCurta(dia: number): string {
  const p = partes(dia);
  return `${pad(p.dia)}/${pad(p.mes)}/${p.ano}`;
}

/** "sex., 25/09". */
export function dataComSemana(dia: number): string {
  const p = partes(dia);
  return `${DIAS_SEMANA[p.semana]}., ${pad(p.dia)}/${pad(p.mes)}`;
}

/** Dia com expediente na escala: segunda a sexta, fora de feriado. */
export function temExpediente(dia: number): boolean {
  const { semana } = partes(dia);
  return semana >= 1 && semana <= 5 && !DIAS_FERIADO.has(dia);
}

export const PRESETS: { valor: Preset; rotulo: string }[] = [
  { valor: "dia", rotulo: "Dia" },
  { valor: "semana", rotulo: "Semana" },
  { valor: "mes", rotulo: "Mês" },
  { valor: "ano", rotulo: "Ano" },
  { valor: "geral", rotulo: "Geral" },
  { valor: "personalizado", rotulo: "Personalizado" },
];

export const PERIODO_INICIAL: PeriodoDemo = { preset: "mes", ancora: HOJE };

function bucketPara(inicio: number, fim: number): Bucket {
  const dias = fim - inicio + 1;
  if (dias <= 1) return "hour";
  if (dias <= 62) return "day";
  if (dias <= 400) return "week";
  return "month";
}

export function intervalo(periodo: PeriodoDemo): Intervalo {
  const dia = paraDia(periodo.ancora);
  const p = partes(dia);

  switch (periodo.preset) {
    case "dia":
      return { inicio: dia, fim: dia, bucket: "hour", rotulo: dataCurta(dia) };
    case "semana": {
      // Semana começa na segunda: é como a operação enxerga a própria semana.
      const segunda = dia - ((p.semana + 6) % 7);
      return { inicio: segunda, fim: segunda + 6, bucket: "day", rotulo: "Semana" };
    }
    case "mes":
      return {
        inicio: diaDe(p.ano, p.mes, 1),
        fim: diaDe(p.ano, p.mes + 1, 1) - 1,
        bucket: "day",
        rotulo: capitalizar(`${MESES[p.mes - 1]} de ${p.ano}`),
      };
    case "ano":
      return { inicio: diaDe(p.ano, 1, 1), fim: diaDe(p.ano + 1, 1, 1) - 1, bucket: "month", rotulo: String(p.ano) };
    case "geral":
      return { inicio: DIA_INICIO, fim: DIA_HOJE, bucket: "month", rotulo: "Todo o período" };
    case "personalizado": {
      const a = paraDia(periodo.de ?? periodo.ancora);
      const b = paraDia(periodo.ate ?? periodo.ancora);
      const [inicio, fim] = a <= b ? [a, b] : [b, a];
      return { inicio, fim, bucket: bucketPara(inicio, fim), rotulo: "Personalizado" };
    }
  }
}

export function criarPeriodo(preset: Preset, atual?: PeriodoDemo): PeriodoDemo {
  if (preset !== "personalizado") return { preset, ancora: HOJE };
  const base = intervalo(atual ?? PERIODO_INICIAL);
  const fim = Math.min(base.fim, DIA_HOJE);
  return { preset, ancora: paraIso(base.inicio), de: paraIso(Math.max(base.inicio, DIA_INICIO)), ate: paraIso(fim) };
}

export function navegar(periodo: PeriodoDemo, passo: 1 | -1): PeriodoDemo {
  const dia = paraDia(periodo.ancora);
  const p = partes(dia);

  switch (periodo.preset) {
    case "dia":
      return { ...periodo, ancora: paraIso(dia + passo) };
    case "semana":
      return { ...periodo, ancora: paraIso(dia + 7 * passo) };
    case "mes":
      return { ...periodo, ancora: paraIso(diaDe(p.ano, p.mes + passo, 1)) };
    case "ano":
      return { ...periodo, ancora: paraIso(diaDe(p.ano + passo, 1, 1)) };
    case "personalizado": {
      const de = paraDia(periodo.de ?? periodo.ancora);
      const ate = paraDia(periodo.ate ?? periodo.ancora);
      const salto = (ate - de + 1) * passo;
      return { ...periodo, ancora: paraIso(de + salto), de: paraIso(de + salto), ate: paraIso(ate + salto) };
    }
    default:
      return periodo;
  }
}

/** O período já alcança hoje? Se sim, a seta de avançar fica desligada. */
export function ehPeriodoAtual(periodo: PeriodoDemo): boolean {
  if (periodo.preset === "geral") return true;
  return intervalo(periodo).fim >= DIA_HOJE;
}

/** O período começa antes do primeiro dia com dado? A seta de voltar para ali. */
export function ehPrimeiroPeriodo(periodo: PeriodoDemo): boolean {
  if (periodo.preset === "geral") return true;
  return intervalo(periodo).inicio <= DIA_INICIO;
}

export const DIA_PRIMEIRO = DIA_INICIO;

/** "01 – 25 set. 2026", como o botão de período do painel. */
export function rotuloIntervaloCurto(periodo: PeriodoDemo): string {
  if (periodo.preset === "geral") return "Todo o período";
  const iv = intervalo(periodo);
  const a = partes(iv.inicio);
  const b = partes(Math.max(iv.inicio, Math.min(iv.fim, DIA_HOJE)));
  if (a.ano === b.ano && a.mes === b.mes && a.dia === b.dia) return `${pad(a.dia)} ${MESES_CURTOS[a.mes - 1]}. ${a.ano}`;
  if (a.ano === b.ano && a.mes === b.mes) return `${pad(a.dia)} – ${pad(b.dia)} ${MESES_CURTOS[a.mes - 1]}. ${a.ano}`;
  if (a.ano === b.ano) return `${pad(a.dia)} ${MESES_CURTOS[a.mes - 1]}. – ${pad(b.dia)} ${MESES_CURTOS[b.mes - 1]}. ${a.ano}`;
  return `${dataCurta(iv.inicio)} – ${dataCurta(Math.min(iv.fim, DIA_HOJE))}`;
}

/* -------------------------------------------------------------------------
   Variação determinística
   ------------------------------------------------------------------------- */

function hash(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i += 1) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Número entre 0 e 1, sempre o mesmo para a mesma chave. */
export function ruido(chave: string): number {
  let t = (hash(chave) + 0x6d2b79f5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/* -------------------------------------------------------------------------
   Pessoas, equipes e aplicativos
   ------------------------------------------------------------------------- */

export const PESSOAS_POR_ID: Record<string, PerfilPessoa> = Object.fromEntries(PESSOAS.map((p) => [p.id, p]));
export const EQUIPES_POR_ID = Object.fromEntries(EQUIPES.map((e) => [e.id, e]));
const INDICE_APP: Record<string, number> = Object.fromEntries(APPS.map((a, i) => [a.alvo, i]));

export function escalaDe(pessoa: PerfilPessoa): Escala {
  return EQUIPES_POR_ID[pessoa.equipeId].escala;
}

export function tipoDoApp(alvo: string, classificacoes: Classificacoes): TipoCategoria | null {
  if (alvo in classificacoes) return classificacoes[alvo];
  return APPS[INDICE_APP[alvo]]?.tipo ?? null;
}

const BASES: BaseCategoria[] = ["PRODUCTIVE", "NEUTRAL", "UNPRODUCTIVE", "SEM"];
const PROBABILIDADE_USO: Record<BaseCategoria, number> = { PRODUCTIVE: 0.95, NEUTRAL: 0.85, UNPRODUCTIVE: 0.62, SEM: 0.7 };

/**
 * Ferramentas de cada pessoa, por categoria de origem. Nem todo mundo usa
 * tudo: quem nunca abre o Instagram não aparece na fatia dele.
 */
const FERRAMENTAS: Record<string, Record<BaseCategoria, [number, number][]>> = Object.fromEntries(
  PESSOAS.map((pessoa) => {
    const daEquipe = PESOS[pessoa.equipeId];
    const porBase = {} as Record<BaseCategoria, [number, number][]>;
    for (const base of BASES) {
      const entradas = Object.entries(daEquipe[base]).filter(
        ([alvo], i) => i === 0 || ruido(`${pessoa.id}|uso|${alvo}`) < PROBABILIDADE_USO[base],
      );
      const soma = entradas.reduce((s, [, peso]) => s + peso, 0) || 1;
      porBase[base] = entradas.map(([alvo, peso]) => [INDICE_APP[alvo], peso / soma]);
    }
    return [pessoa.id, porBase];
  }),
);

function escolher<T>(itens: [T, number][], sorteio: number): T {
  let acumulado = 0;
  for (const [item, peso] of itens) {
    acumulado += peso;
    if (sorteio < acumulado) return item;
  }
  return itens[itens.length - 1][0];
}

/* -------------------------------------------------------------------------
   O dia de uma pessoa, minuto a minuto
   ------------------------------------------------------------------------- */

export type EstadoTrecho = "ATIVO" | "OCIOSO" | "BLOQUEADO";

/** Um trecho contínuo do dia. `app` é o índice em APPS (−1 fora de ATIVO). */
export type Trecho = { de: number; ate: number; estado: EstadoTrecho; app: number };

const cacheTrechos = new Map<string, Trecho[]>();

export function trechosDoDia(pessoa: PerfilPessoa, dia: number): Trecho[] {
  const chave = `${pessoa.id}|${dia}`;
  let trechos = cacheTrechos.get(chave);
  if (!trechos) {
    trechos = gerarDia(pessoa, dia);
    cacheTrechos.set(chave, trechos);
  }
  return trechos;
}

function gerarDia(pessoa: PerfilPessoa, dia: number): Trecho[] {
  if (dia < DIA_INICIO || dia > DIA_HOJE) return [];
  if (pessoa.desde && dia < paraDia(pessoa.desde)) return [];
  if (pessoa.paradaDesde && dia >= paraDia(pessoa.paradaDesde)) return [];

  const { semana, mes, dia: diaDoMes } = partes(dia);
  const r = (medida: string) => ruido(`${pessoa.id}|${dia}|${medida}`);
  const escala = escalaDe(pessoa);

  let entrada: number;
  let saida: number;
  let almoco: [number, number] | null;

  if (semana === 6) {
    // Sábado é exceção de fechamento, só o último do mês e só para quem
    // costuma pegar. Não há escala: tudo cai fora dela.
    if (!pessoa.sabado || diaDoMes < 22) return [];
    entrada = 9 * 60 + Math.round(r("entrada") * 40);
    saida = entrada + 150 + Math.round(r("saida") * 70);
    almoco = null;
  } else if (semana === 0 || DIAS_FERIADO.has(dia)) {
    return [];
  } else {
    if (dia !== DIA_HOJE && r("falta") < 0.025) return [];
    entrada = escala.inicio + pessoa.chegada + Math.round((r("entrada") - 0.5) * 24);
    // Quem tem hábito de ficar depois varia mais: tem dia que sai na hora.
    const extra = pessoa.saida > 20 ? pessoa.saida * (0.3 + r("saida") * 1.3) : pessoa.saida + (r("saida") - 0.5) * 20;
    saida = escala.fim + Math.round(extra);
    // Dia com consulta, reunião fora ou saída antecipada: o expediente tem
    // buraco sem dado, que é o que faz a cobertura real ficar abaixo de 100%.
    if (r("chegou-tarde") < 0.09) entrada += 50 + Math.round(r("quanto-tarde") * 110);
    if (r("saiu-cedo") < 0.06) saida = Math.min(saida, escala.fim - 40 - Math.round(r("quanto-cedo") * 120));
    const ini = escala.intervaloInicio + Math.round((r("almoco") - 0.4) * 14);
    almoco = [ini, ini + 56 + Math.round(r("almoco-dur") * 14)];
  }

  const limite = dia === DIA_HOJE ? (pessoa.hojeAte ?? AGORA_MINUTOS) : 24 * 60;
  saida = Math.min(saida, limite);
  if (saida - entrada < 20) return [];

  // A operação melhora devagar ao longo do ano — é o que faz o painel mostrar
  // ganho contra o mês anterior, como numa empresa que passou a se medir.
  const progresso = clamp((mes - 1) / 8, 0, 1);
  const pesoBase: [BaseCategoria, number][] = [
    ["PRODUCTIVE", pessoa.produtivo * (0.86 + progresso * 0.14) * (0.92 + r("produtivo") * 0.16)],
    ["NEUTRAL", pessoa.neutro * (0.9 + r("neutro") * 0.2)],
    ["UNPRODUCTIVE", pessoa.improdutivo * (1.15 - progresso * 0.25) * (0.75 + r("improdutivo") * 0.5)],
    ["SEM", pessoa.sem],
  ];
  const somaBase = pesoBase.reduce((s, [, p]) => s + p, 0);
  const bases: [BaseCategoria, number][] = pesoBase.map(([b, p]) => [b, p / somaBase]);
  const ociosoDia = pessoa.ocioso * (0.8 + r("ocioso") * 0.4);
  const ferramentas = FERRAMENTAS[pessoa.id];

  const trechos: Trecho[] = [];
  const preencher = (de: number, ate: number) => {
    let t = de;
    let n = 0;
    while (t < ate) {
      const rr = (m: string) => ruido(`${pessoa.id}|${dia}|${t}|${n}|${m}`);
      const sorteio = rr("estado");
      let estado: EstadoTrecho = "ATIVO";
      let duracao: number;
      if (sorteio < ociosoDia) {
        estado = "OCIOSO";
        duracao = 3 + Math.floor(rr("dur") * 13);
      } else if (sorteio < ociosoDia + 0.035) {
        estado = "BLOQUEADO";
        duracao = 4 + Math.floor(rr("dur") * 12);
      } else {
        duracao = 3 + Math.floor(rr("dur") * 30);
      }
      const fim = Math.min(ate, t + duracao);
      const app =
        estado === "ATIVO" ? escolher(ferramentas[escolher(bases, rr("base"))], rr("app")) : -1;
      const anterior = trechos[trechos.length - 1];
      if (anterior && anterior.ate === t && anterior.estado === estado && anterior.app === app) anterior.ate = fim;
      else trechos.push({ de: t, ate: fim, estado, app });
      t = fim;
      n += 1;
    }
  };

  if (almoco && almoco[0] < saida) {
    preencher(entrada, almoco[0]);
    // No almoço a tela fica bloqueada: é o que a estação de fato registra.
    const fimAlmoco = Math.min(almoco[1], saida);
    trechos.push({ de: almoco[0], ate: fimAlmoco, estado: "BLOQUEADO", app: -1 });
    if (fimAlmoco < saida) preencher(fimAlmoco, saida);
  } else {
    preencher(entrada, saida);
  }

  return trechos;
}

/* -------------------------------------------------------------------------
   Resumo de um dia de uma pessoa (independe da classificação)
   ------------------------------------------------------------------------- */

type ResumoDia = {
  expediente: number;
  registrados: number;
  ociosos: number;
  bloqueado: number;
  /** Minutos ativos por aplicativo dentro do expediente e fora da escala. */
  dentro: Float64Array;
  fora: Float64Array;
  primeiro: number | null;
  ultimo: number | null;
};

/** Minutos de [a, b) que caem dentro do expediente (escala sem intervalo, até o corte). */
function minutosNoExpediente(a: number, b: number, escala: Escala, corte: number): number {
  const parte = (x: number, y: number) => Math.max(0, Math.min(b, y, corte) - Math.max(a, x));
  return parte(escala.inicio, escala.intervaloInicio) + parte(escala.intervaloFim, escala.fim);
}

const cacheResumo = new Map<string, ResumoDia>();

function resumoDoDia(pessoa: PerfilPessoa, dia: number, corte: number | null): ResumoDia {
  const corteEfetivo = corte ?? (dia === DIA_HOJE ? AGORA_MINUTOS : 24 * 60);
  const chave = `${pessoa.id}|${dia}|${corteEfetivo}`;
  const guardado = cacheResumo.get(chave);
  if (guardado) return guardado;

  const escala = escalaDe(pessoa);
  const trabalha = temExpediente(dia) && dia >= DIA_INICIO && dia <= DIA_HOJE && !(pessoa.desde && dia < paraDia(pessoa.desde));
  const expediente = trabalha ? minutosNoExpediente(0, 24 * 60, escala, corteEfetivo) : 0;

  const resumo: ResumoDia = {
    expediente,
    registrados: 0,
    ociosos: 0,
    bloqueado: 0,
    dentro: new Float64Array(APPS.length),
    fora: new Float64Array(APPS.length),
    primeiro: null,
    ultimo: null,
  };

  for (const t of trechosDoDia(pessoa, dia)) {
    if (t.de >= corteEfetivo) break;
    const ate = Math.min(t.ate, corteEfetivo);
    resumo.primeiro = resumo.primeiro ?? t.de;
    resumo.ultimo = ate;
    const dentro = trabalha ? minutosNoExpediente(t.de, ate, escala, corteEfetivo) : 0;
    resumo.registrados += dentro;
    if (t.estado === "OCIOSO") resumo.ociosos += dentro;
    else if (t.estado === "BLOQUEADO") resumo.bloqueado += dentro;
    else {
      resumo.dentro[t.app] += dentro;
      // Fora da escala: antes do início ou depois do fim (o intervalo não conta).
      const foraDaEscala = trabalha
        ? Math.max(0, Math.min(ate, escala.inicio) - t.de) + Math.max(0, ate - Math.max(t.de, escala.fim))
        : ate - t.de;
      resumo.fora[t.app] += foraDaEscala;
    }
  }

  cacheResumo.set(chave, resumo);
  return resumo;
}

/* -------------------------------------------------------------------------
   Agregação por pessoa
   ------------------------------------------------------------------------- */

export const MINUTOS_VAZIOS: Minutos = {
  expediente: 0,
  registrados: 0,
  ativos: 0,
  produtivos: 0,
  neutros: 0,
  improdutivos: 0,
  semClassificar: 0,
  ociosos: 0,
  bloqueado: 0,
  semDados: 0,
  ativosFora: 0,
};

function somarMinutos(lista: Minutos[]): Minutos {
  const total = { ...MINUTOS_VAZIOS };
  for (const m of lista) for (const k of Object.keys(total) as (keyof Minutos)[]) total[k] += m[k];
  return total;
}

function tiposEfetivos(classificacoes: Classificacoes): (TipoCategoria | null)[] {
  return APPS.map((a) => tipoDoApp(a.alvo, classificacoes));
}

function pessoasDoEscopo(escopo: EscopoDemo): PerfilPessoa[] {
  return PESSOAS.filter(
    (p) => (!escopo.equipeId || p.equipeId === escopo.equipeId) && (!escopo.colaboradorId || p.id === escopo.colaboradorId),
  );
}

function linhaDaPessoa(pessoa: PerfilPessoa, janela: Janela, tipos: (TipoCategoria | null)[]): LinhaProdutividade {
  const m = { ...MINUTOS_VAZIOS };
  let diasComRegistro = 0;
  let diasComExpediente = 0;
  let somaPrimeiro = 0;
  let somaUltimo = 0;
  let ultimoRegistro: LinhaProdutividade["ultimoRegistro"] = null;

  const fim = Math.min(janela.fim, DIA_HOJE);
  for (let dia = Math.max(janela.inicio, DIA_INICIO); dia <= fim; dia += 1) {
    const r = resumoDoDia(pessoa, dia, dia === janela.fim ? janela.corte : null);
    m.expediente += r.expediente;
    m.registrados += r.registrados;
    m.ociosos += r.ociosos;
    m.bloqueado += r.bloqueado;
    for (let i = 0; i < APPS.length; i += 1) {
      const dentro = r.dentro[i];
      if (dentro > 0) {
        const tipo = tipos[i];
        if (tipo === "PRODUCTIVE") m.produtivos += dentro;
        else if (tipo === "NEUTRAL") m.neutros += dentro;
        else if (tipo === "UNPRODUCTIVE") m.improdutivos += dentro;
        else m.semClassificar += dentro;
      }
      m.ativosFora += r.fora[i];
    }
    if (r.expediente > 0) diasComExpediente += 1;
    if (r.primeiro !== null && r.ultimo !== null) {
      diasComRegistro += 1;
      somaPrimeiro += r.primeiro;
      somaUltimo += r.ultimo;
      ultimoRegistro = { dia, minuto: r.ultimo };
    }
  }

  m.ativos = m.produtivos + m.neutros + m.improdutivos + m.semClassificar;
  m.semDados = Math.max(0, m.expediente - m.registrados);

  return {
    colaboradorId: pessoa.id,
    colaborador: pessoa.nome,
    cargo: pessoa.cargo,
    equipeId: pessoa.equipeId,
    equipe: EQUIPES_POR_ID[pessoa.equipeId].nome,
    minutos: m,
    indice: m.expediente > 0 ? (m.produtivos / m.expediente) * 100 : null,
    cobertura: m.expediente > 0 ? (Math.min(m.registrados, m.expediente) / m.expediente) * 100 : null,
    diasComRegistro,
    diasComExpediente,
    primeiroMedio: diasComRegistro > 0 ? somaPrimeiro / diasComRegistro : null,
    ultimoMedio: diasComRegistro > 0 ? somaUltimo / diasComRegistro : null,
    ultimoRegistro,
  };
}

const media = (valores: (number | null)[]) => {
  const v = valores.filter((x): x is number => x !== null);
  return v.length === 0 ? null : v.reduce((s, x) => s + x, 0) / v.length;
};

/** Média simples por pessoa para o índice; somas para horas e cobertura. */
export function agregar(linhas: LinhaProdutividade[]): Resumo {
  const base = linhas.filter((l) => l.minutos.expediente > 0);
  const minutos = somarMinutos(linhas.map((l) => l.minutos));
  return {
    pessoas: base.length,
    pessoasComRegistro: linhas.filter((l) => l.diasComRegistro > 0).length,
    indiceMedio: media(base.map((l) => l.indice)),
    cobertura: minutos.expediente > 0 ? (Math.min(minutos.registrados, minutos.expediente) / minutos.expediente) * 100 : null,
    minutos,
  };
}

/** Variação em p.p. — ou NULL sem base: sem expediente ou cobertura baixa em um dos lados. */
export function compararIndice(atual: Resumo, anterior: Resumo | null): number | null {
  if (!anterior || atual.indiceMedio === null || anterior.indiceMedio === null) return null;
  const minima = REGRAS.coberturaMinimaComparacao;
  if ((atual.cobertura ?? 0) < minima || (anterior.cobertura ?? 0) < minima) return null;
  return Number((atual.indiceMedio - anterior.indiceMedio).toFixed(1));
}

/* -------------------------------------------------------------------------
   Janelas: atual e comparativo alinhado
   ------------------------------------------------------------------------- */

function janelaAtual(periodo: PeriodoDemo): Janela {
  const iv = intervalo(periodo);
  const fim = Math.min(iv.fim, DIA_HOJE);
  return { inicio: iv.inicio, fim, corte: fim === DIA_HOJE ? AGORA_MINUTOS : null };
}

function janelaComparativo(periodo: PeriodoDemo): (Janela & { rotulo: string }) | null {
  if (periodo.preset === "geral") return null;
  const atual = janelaAtual(periodo);
  if (atual.fim < atual.inicio) return null;

  if (periodo.preset === "dia") {
    let anterior = atual.inicio - 1;
    while (anterior >= DIA_INICIO && !temExpediente(anterior)) anterior -= 1;
    if (anterior < DIA_INICIO) return null;
    const p = partes(anterior);
    return { inicio: anterior, fim: anterior, corte: atual.corte, rotulo: `vs ${pad(p.dia)}/${pad(p.mes)}` };
  }

  const decorrido = atual.fim - atual.inicio;
  const prev =
    periodo.preset === "personalizado"
      ? { inicio: atual.inicio - (intervalo(periodo).fim - atual.inicio + 1), fim: atual.inicio - 1 }
      : intervalo(navegar(periodo, -1));
  const fimAlinhado = prev.inicio + decorrido;
  const rotulos: Record<string, string> = {
    semana: "vs semana anterior",
    mes: "vs mês anterior",
    ano: "vs ano anterior",
    personalizado: "vs período anterior",
  };
  return {
    inicio: prev.inicio,
    // Nunca passa do fim real do período anterior (mês curto x mês longo).
    fim: Math.min(prev.fim, fimAlinhado),
    corte: fimAlinhado <= prev.fim ? atual.corte : null,
    rotulo: rotulos[periodo.preset],
  };
}

/* -------------------------------------------------------------------------
   Equipes
   ------------------------------------------------------------------------- */

function agruparPorEquipe(linhas: LinhaProdutividade[]) {
  return EQUIPES.map((e) => ({ equipe: e, resumo: agregar(linhas.filter((l) => l.equipeId === e.id)) }))
    .filter((g) => g.resumo.pessoas > 0)
    .sort((a, b) => (b.resumo.indiceMedio ?? -1) - (a.resumo.indiceMedio ?? -1));
}

function compararEquipes(atual: LinhaProdutividade[], anterior: LinhaProdutividade[] | null): LinhaEquipe[] {
  const antes = new Map((anterior ? agruparPorEquipe(anterior) : []).map((g) => [g.equipe.id, g.resumo]));
  return agruparPorEquipe(atual).map((g) => ({
    equipeId: g.equipe.id,
    equipe: g.equipe.nome,
    pessoas: g.resumo.pessoas,
    indice: g.resumo.indiceMedio,
    cobertura: g.resumo.cobertura,
    minutosAtivos: g.resumo.minutos.ativos,
    minutosForaEscala: g.resumo.minutos.ativosFora,
    variacao: anterior ? compararIndice(g.resumo, antes.get(g.equipe.id) ?? null) : null,
    minutos: g.resumo.minutos,
  }));
}

/** Pessoas com a variação individual validada (mesma regra das equipes). */
export function variacaoDaPessoa(recorte: Recorte, colaboradorId: string): number | null {
  const atual = recorte.linhas.find((l) => l.colaboradorId === colaboradorId);
  const antes = recorte.anteriores?.find((l) => l.colaboradorId === colaboradorId);
  if (!atual || !antes) return null;
  return compararIndice(agregar([atual]), agregar([antes]));
}

function foraDaEscala(linhas: LinhaProdutividade[]) {
  const relevantes = linhas.filter((l) => l.minutos.ativosFora >= REGRAS.minutosForaEscalaRelevante);
  return { minutos: relevantes.reduce((s, l) => s + l.minutos.ativosFora, 0), pessoas: relevantes.length };
}

/* -------------------------------------------------------------------------
   Evolução do índice e atividade ao longo do período
   ------------------------------------------------------------------------- */

type BaldeEvolucao = "day" | "week" | "month";

function truncar(dia: number, balde: BaldeEvolucao): number {
  const p = partes(dia);
  if (balde === "month") return diaDe(p.ano, p.mes, 1);
  if (balde === "week") return dia - ((p.semana + 6) % 7);
  return dia;
}

function distancia(de: number, ate: number, balde: BaldeEvolucao): number {
  if (balde === "month") {
    const a = partes(de);
    const b = partes(ate);
    return (b.ano - a.ano) * 12 + (b.mes - a.mes);
  }
  return balde === "week" ? Math.round((ate - de) / 7) : ate - de;
}

function avancar(dia: number, n: number, balde: BaldeEvolucao): number {
  if (balde === "month") {
    const p = partes(dia);
    return diaDe(p.ano, p.mes + n, 1);
  }
  return dia + n * (balde === "week" ? 7 : 1);
}

function rotulosDoBalde(dia: number, balde: BaldeEvolucao): { curto: string; completo: string } {
  const p = partes(dia);
  if (balde === "month") {
    return { curto: `${MESES_CURTOS[p.mes - 1]}/${String(p.ano).slice(2)}`, completo: `${MESES[p.mes - 1]} de ${p.ano}` };
  }
  if (balde === "week") return { curto: `${pad(p.dia)}/${pad(p.mes)}`, completo: `semana de ${pad(p.dia)}/${pad(p.mes)}/${p.ano}` };
  return { curto: `${pad(p.dia)} ${MESES_CURTOS[p.mes - 1]}.`, completo: `${DIAS_SEMANA[p.semana]}, ${pad(p.dia)}/${pad(p.mes)}/${p.ano}` };
}

/** Índice de cada balde, média por pessoa — fora da linha se a cobertura for baixa. */
function serieIndice(
  pessoas: PerfilPessoa[],
  janela: Janela,
  balde: BaldeEvolucao,
  tipos: (TipoCategoria | null)[],
): Map<number, number | null> {
  const porBalde = new Map<number, number | null>();
  for (let inicio = truncar(janela.inicio, balde); inicio <= janela.fim; inicio = avancar(inicio, 1, balde)) {
    const fim = Math.min(janela.fim, avancar(inicio, 1, balde) - 1);
    const sub: Janela = { inicio: Math.max(inicio, janela.inicio), fim, corte: fim === janela.fim ? janela.corte : null };
    const resumo = agregar(pessoas.map((p) => linhaDaPessoa(p, sub, tipos)));
    const valido = (resumo.cobertura ?? 0) >= REGRAS.coberturaMinimaPontoEvolucao;
    porBalde.set(inicio, valido ? resumo.indiceMedio : null);
  }
  return porBalde;
}

function montarEvolucao(periodo: PeriodoDemo, pessoas: PerfilPessoa[], tipos: (TipoCategoria | null)[]) {
  const atual = janelaAtual(periodo);
  let janela: Janela;
  let anterior: Janela | null;
  let balde: BaldeEvolucao;
  let descricao: string;

  if (periodo.preset === "dia") {
    // Um dia sozinho não tem evolução: mostra os 14 dias até ele.
    janela = { inicio: atual.inicio - 13, fim: atual.fim, corte: atual.corte };
    anterior = { inicio: atual.inicio - 27, fim: atual.inicio - 14, corte: null };
    balde = "day";
    descricao = "Últimos 14 dias";
  } else if (periodo.preset === "geral") {
    const p = partes(DIA_HOJE);
    janela = { inicio: Math.max(DIA_INICIO, diaDe(p.ano, p.mes - 11, 1)), fim: atual.fim, corte: atual.corte };
    anterior = null;
    balde = "month";
    descricao = "Últimos 12 meses";
  } else {
    const iv = intervalo(periodo);
    const dias = iv.fim - iv.inicio + 1;
    balde = periodo.preset === "ano" ? "month" : dias <= 62 ? "day" : dias <= 400 ? "week" : "month";
    janela = atual;
    const prev =
      periodo.preset === "personalizado"
        ? { inicio: iv.inicio - dias, fim: iv.inicio - 1 }
        : intervalo(navegar(periodo, -1));
    anterior = { inicio: prev.inicio, fim: prev.fim, corte: null };
    descricao = balde === "day" ? "Dia a dia" : balde === "week" ? "Semana a semana" : "Mês a mês";
  }

  const inicioAtual = truncar(janela.inicio, balde);
  const limite = distancia(inicioAtual, truncar(janela.fim, balde), balde);
  const valoresAtual = serieIndice(pessoas, janela, balde, tipos);
  const valoresAnterior = anterior ? serieIndice(pessoas, anterior, balde, tipos) : null;
  const inicioAnterior = anterior ? truncar(anterior.inicio, balde) : 0;

  const pontos: PontoEvolucao[] = [];
  for (let n = 0; n <= limite; n += 1) {
    const dia = avancar(inicioAtual, n, balde);
    const r = rotulosDoBalde(dia, balde);
    pontos.push({
      chave: String(dia),
      rotulo: r.curto,
      rotuloCompleto: r.completo,
      atual: valoresAtual.get(dia) ?? null,
      anterior: valoresAnterior?.get(avancar(inicioAnterior, n, balde)) ?? null,
    });
  }

  return { pontos, descricao, temAnterior: !!anterior };
}

/** Horas por categoria em cada balde do período: hora a hora no dia, dia a dia no mês… */
function montarAtividade(periodo: PeriodoDemo, pessoas: PerfilPessoa[], tipos: (TipoCategoria | null)[]) {
  const iv = intervalo(periodo);
  const atual = janelaAtual(periodo);
  const bucket = iv.bucket;
  const pontos: PontoAtividade[] = [];

  const somar = (alvo: PontoAtividade, app: number, minutos: number) => {
    const tipo = tipos[app];
    if (tipo === "PRODUCTIVE") alvo.produtivo += minutos;
    else if (tipo === "NEUTRAL") alvo.neutro += minutos;
    else if (tipo === "UNPRODUCTIVE") alvo.improdutivo += minutos;
    else alvo.sem += minutos;
  };

  if (bucket === "hour") {
    const dia = atual.inicio;
    for (let hora = 7; hora <= 20; hora += 1) {
      pontos.push({
        chave: String(hora),
        rotulo: `${pad(hora)}h`,
        rotuloCompleto: `${pad(hora)}h às ${pad(hora + 1)}h`,
        produtivo: 0, neutro: 0, improdutivo: 0, sem: 0, ocioso: 0,
      });
    }
    for (const pessoa of pessoas) {
      for (const t of trechosDoDia(pessoa, dia)) {
        for (let hora = 7; hora <= 20; hora += 1) {
          const sobra = Math.max(0, Math.min(t.ate, hora * 60 + 60) - Math.max(t.de, hora * 60));
          if (sobra <= 0) continue;
          const ponto = pontos[hora - 7];
          if (t.estado === "OCIOSO") ponto.ocioso += sobra;
          else if (t.estado === "ATIVO") somar(ponto, t.app, sobra);
        }
      }
    }
    return { pontos, bucket };
  }

  const balde = bucket as BaldeEvolucao;
  for (let inicio = truncar(atual.inicio, balde); inicio <= atual.fim; inicio = avancar(inicio, 1, balde)) {
    const r = rotulosDoBalde(inicio, balde);
    const ponto: PontoAtividade = {
      chave: String(inicio), rotulo: r.curto, rotuloCompleto: r.completo,
      produtivo: 0, neutro: 0, improdutivo: 0, sem: 0, ocioso: 0,
    };
    const fim = Math.min(atual.fim, avancar(inicio, 1, balde) - 1);
    for (let dia = Math.max(inicio, DIA_INICIO); dia <= fim; dia += 1) {
      for (const pessoa of pessoas) {
        const resumo = resumoDoDia(pessoa, dia, null);
        ponto.ocioso += resumo.ociosos;
        for (let i = 0; i < APPS.length; i += 1) somar(ponto, i, resumo.dentro[i] + resumo.fora[i]);
      }
    }
    pontos.push(ponto);
  }
  return { pontos, bucket };
}

/* -------------------------------------------------------------------------
   Aplicativos e sites
   ------------------------------------------------------------------------- */

function montarApps(janela: Janela, pessoas: PerfilPessoa[], tipos: (TipoCategoria | null)[]): LinhaApp[] {
  const minutos = new Float64Array(APPS.length);
  const quem = APPS.map(() => new Set<string>());
  const dias = APPS.map(() => new Set<number>());

  for (const pessoa of pessoas) {
    for (let dia = Math.max(janela.inicio, DIA_INICIO); dia <= janela.fim; dia += 1) {
      const r = resumoDoDia(pessoa, dia, dia === janela.fim ? janela.corte : null);
      for (let i = 0; i < APPS.length; i += 1) {
        const total = r.dentro[i] + r.fora[i];
        if (total <= 0) continue;
        minutos[i] += total;
        quem[i].add(pessoa.id);
        dias[i].add(dia);
      }
    }
  }

  return APPS.map((app, i) => ({
    alvo: app.alvo,
    site: app.site,
    tipo: tipos[i],
    minutos: Math.round(minutos[i]),
    pessoas: quem[i].size,
    dias: dias[i].size,
  }))
    .filter((l) => l.minutos > 0)
    .sort((a, b) => b.minutos - a.minutos);
}

/* -------------------------------------------------------------------------
   Pontos de atenção (newsecfocus `lib/visao-geral.ts`)
   ------------------------------------------------------------------------- */

const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios);

function montarPontos(
  apps: LinhaApp[],
  pessoas: PerfilPessoa[],
  linhas: LinhaProdutividade[],
  equipes: LinhaEquipe[],
): PontoAtencao[] {
  const pontos: PontoAtencao[] = [];

  const semCategoria = apps.filter((a) => a.tipo === null);
  if (semCategoria.length > 0) {
    const minutos = linhas.reduce((s, l) => s + l.minutos.semClassificar, 0);
    pontos.push({
      natureza: "dados",
      titulo: `${semCategoria.length} ${plural(semCategoria.length, "aplicativo sem classificação", "aplicativos sem classificação")}`,
      detalhe: `${formatarHorasTexto(minutos)} fora do índice no período`,
      acao: { rotulo: "Revisar categorias", tela: "aplicativos" },
    });
  }

  const pendentes = pessoas.filter((p) => p.pendente);
  if (pendentes.length > 0) {
    pontos.push({
      natureza: "dados",
      titulo: `${pendentes.length} ${plural(pendentes.length, "pessoa com cadastro pendente", "pessoas com cadastro pendente")}`,
      detalhe: "Cadastro ainda não revisado por um administrador",
      acao: { rotulo: "Ver pessoas", tela: "pessoas" },
    });
  }

  const fora = foraDaEscala(linhas);
  if (fora.pessoas > 0) {
    const nomes =
      fora.pessoas <= 3
        ? linhas
            .filter((l) => l.minutos.ativosFora >= REGRAS.minutosForaEscalaRelevante)
            .sort((a, b) => b.minutos.ativosFora - a.minutos.ativosFora)
            .map((l) => `${l.colaborador} · ${formatarHorasTexto(l.minutos.ativosFora)}`)
            .join(" · ")
        : null;
    pontos.push({
      natureza: "observacao",
      titulo: `${fora.pessoas} ${plural(fora.pessoas, "pessoa com atividade fora da escala", "pessoas com atividade fora da escala")}`,
      detalhe: nomes ?? `${formatarHorasTexto(fora.minutos)} somadas · estimativa, não é marcação de ponto`,
      acao: { rotulo: "Ver jornada", tela: "jornada" },
    });
  }

  const maiorMudanca = equipes
    .filter((e) => e.variacao !== null && Math.abs(e.variacao) >= REGRAS.variacaoRelevantePp)
    .sort((a, b) => Math.abs(b.variacao!) - Math.abs(a.variacao!))[0];
  if (maiorMudanca) {
    const v = maiorMudanca.variacao!;
    pontos.push({
      natureza: "observacao",
      titulo: `${maiorMudanca.equipe}: ${v > 0 ? "+" : "−"}${Math.abs(v).toFixed(0)} p.p. no índice`,
      detalhe: "Comparado ao período anterior, com cobertura suficiente nos dois",
      acao: { rotulo: "Explorar equipe", tela: "equipe", equipeId: maiorMudanca.equipeId },
    });
  }

  return pontos.slice(0, REGRAS.maxPontosAtencao);
}

function formatarHorasTexto(minutos: number): string {
  const total = Math.max(0, Math.round(minutos));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${pad(m)}m`;
}

/* -------------------------------------------------------------------------
   O recorte que as telas leem
   ------------------------------------------------------------------------- */

export function montarRecorte(periodo: PeriodoDemo, escopo: EscopoDemo, classificacoes: Classificacoes): Recorte {
  const tipos = tiposEfetivos(classificacoes);
  const pessoas = pessoasDoEscopo(escopo);
  const atual = janelaAtual(periodo);
  const comparativo = janelaComparativo(periodo);

  const linhas = pessoas.map((p) => linhaDaPessoa(p, atual, tipos));
  const anteriores = comparativo ? pessoas.map((p) => linhaDaPessoa(p, comparativo, tipos)) : null;
  const resumo = agregar(linhas);
  const resumoAnterior = anteriores ? agregar(anteriores) : null;
  const equipes = compararEquipes(linhas, anteriores);
  const apps = montarApps(atual, pessoas, tipos);

  return {
    intervalo: intervalo(periodo),
    rotuloCurto: rotuloIntervaloCurto(periodo),
    rotuloComparacao: comparativo?.rotulo ?? null,
    linhas,
    anteriores,
    resumo,
    resumoAnterior,
    variacao: compararIndice(resumo, resumoAnterior),
    fora: foraDaEscala(linhas),
    equipes,
    evolucao: montarEvolucao(periodo, pessoas, tipos),
    atividade: montarAtividade(periodo, pessoas, tipos),
    apps,
    pontos: montarPontos(apps, pessoas, linhas, equipes),
  };
}

/* -------------------------------------------------------------------------
   Leituras de um dia (linha do tempo, sessões, jornada) e do ritmo
   ------------------------------------------------------------------------- */

export type EstadoLinha = "PRODUTIVO" | "NEUTRO" | "IMPRODUTIVO" | "SEM" | "OCIOSO" | "BLOQUEADO";

export type SegmentoLinha = { de: number; ate: number; estado: EstadoLinha; alvo: string | null };

function estadoDoTrecho(t: Trecho, tipos: (TipoCategoria | null)[]): EstadoLinha {
  if (t.estado === "OCIOSO") return "OCIOSO";
  if (t.estado === "BLOQUEADO") return "BLOQUEADO";
  const tipo = tipos[t.app];
  return tipo === "PRODUCTIVE" ? "PRODUTIVO" : tipo === "NEUTRAL" ? "NEUTRO" : tipo === "UNPRODUCTIVE" ? "IMPRODUTIVO" : "SEM";
}

/** O dia de uma pessoa, já com a categoria efetiva de cada trecho. */
export function linhaDoTempo(pessoaId: string, dia: number, classificacoes: Classificacoes): SegmentoLinha[] {
  const pessoa = PESSOAS_POR_ID[pessoaId];
  if (!pessoa) return [];
  const tipos = tiposEfetivos(classificacoes);
  return trechosDoDia(pessoa, dia).map((t) => ({
    de: t.de,
    ate: t.ate,
    estado: estadoDoTrecho(t, tipos),
    alvo: t.app >= 0 ? APPS[t.app].alvo : null,
  }));
}

/** Uma linha por dia do período para o histórico da pessoa. */
export function historicoDaPessoa(pessoaId: string, periodo: PeriodoDemo, classificacoes: Classificacoes) {
  const pessoa = PESSOAS_POR_ID[pessoaId];
  if (!pessoa) return [];
  const tipos = tiposEfetivos(classificacoes);
  const atual = janelaAtual(periodo);
  const linhas: { dia: number; trabalha: boolean; linha: LinhaProdutividade }[] = [];
  for (let dia = Math.max(atual.inicio, DIA_INICIO); dia <= atual.fim; dia += 1) {
    const linha = linhaDaPessoa(pessoa, { inicio: dia, fim: dia, corte: dia === atual.fim ? atual.corte : null }, tipos);
    if (linha.minutos.expediente === 0 && linha.diasComRegistro === 0) continue;
    linhas.push({ dia, trabalha: temExpediente(dia), linha });
  }
  return linhas.reverse();
}

/** Blocos de 15 min com registro de cada pessoa num dia (Comparativo de jornada). */
export function jornadaDoDia(dia: number, escopo: EscopoDemo) {
  return pessoasDoEscopo({ ...escopo, colaboradorId: null }).map((pessoa) => {
    const blocos = new Map<number, number>();
    let fora = 0;
    const escala = escalaDe(pessoa);
    const trabalha = temExpediente(dia) && !(pessoa.desde && dia < paraDia(pessoa.desde));
    const trechos = trechosDoDia(pessoa, dia);
    for (const t of trechos) {
      for (let b = Math.floor(t.de / 15) * 15; b < t.ate; b += 15) {
        const sobra = Math.min(t.ate, b + 15) - Math.max(t.de, b);
        if (sobra > 0) blocos.set(b, (blocos.get(b) ?? 0) + sobra);
      }
      if (t.estado === "ATIVO") {
        fora += trabalha
          ? Math.max(0, Math.min(t.ate, escala.inicio) - t.de) + Math.max(0, t.ate - Math.max(t.de, escala.fim))
          : t.ate - t.de;
      }
    }
    return {
      colaboradorId: pessoa.id,
      colaborador: pessoa.nome,
      trabalha,
      escala,
      blocos: [...blocos.entries()].sort((a, b) => a[0] - b[0]),
      primeiro: trechos[0]?.de ?? null,
      ultimo: trechos[trechos.length - 1]?.ate ?? null,
      fora,
    };
  });
}

/** Ritmo do período: tempo ativo e produtivo por hora e por dia da semana. */
export function ritmoDoPeriodo(periodo: PeriodoDemo, escopo: EscopoDemo, classificacoes: Classificacoes) {
  const tipos = tiposEfetivos(classificacoes);
  const atual = janelaAtual(periodo);
  const horas = Array.from({ length: 24 }, () => ({ ativo: 0, produtivo: 0 }));
  const mapa = Array.from({ length: 7 }, () => new Array<number>(24).fill(0));

  for (const pessoa of pessoasDoEscopo(escopo)) {
    for (let dia = Math.max(atual.inicio, DIA_INICIO); dia <= atual.fim; dia += 1) {
      const semana = (partes(dia).semana + 6) % 7;
      for (const t of trechosDoDia(pessoa, dia)) {
        if (t.estado !== "ATIVO") continue;
        for (let hora = Math.floor(t.de / 60); hora * 60 < t.ate; hora += 1) {
          const sobra = Math.min(t.ate, hora * 60 + 60) - Math.max(t.de, hora * 60);
          if (sobra <= 0) continue;
          horas[hora].ativo += sobra;
          if (tipos[t.app] === "PRODUCTIVE") horas[hora].produtivo += sobra;
          mapa[semana][hora] += sobra;
        }
      }
    }
  }
  return { horas, mapa };
}

/* -------------------------------------------------------------------------
   Resumo do recorte padrão, para as peças soltas da página
   ------------------------------------------------------------------------- */

/**
 * O recorte padrão (mês corrente, empresa inteira), calculado uma vez.
 *
 * Serve às peças da página que mostram um número solto do painel. Antes esse
 * número era digitado à mão na seção, e bastava mexer no motor para a página
 * passar a contradizer a própria demonstração logo abaixo dela.
 */
export const RESUMO_PADRAO = (() => {
  const recorte = montarRecorte(PERIODO_INICIAL, ESCOPO_VAZIO, {});
  const m = recorte.resumo.minutos;
  const total = m.expediente || 1;
  const maisFora = [...recorte.linhas].sort((a, b) => b.minutos.ativosFora - a.minutos.ativosFora)[0];
  return {
    indice: recorte.resumo.indiceMedio,
    expediente: m.expediente,
    semClassificacao: recorte.apps.filter((a) => a.tipo === null).length,
    maisFora: { nome: maisFora.colaborador, minutos: maisFora.minutos.ativosFora },
    composicao: (["produtivos", "neutros", "improdutivos", "semClassificar", "ociosos", "bloqueado", "semDados"] as const).map(
      (k) => ({ chave: k, cor: CORES_EXPEDIENTE[k], parte: (m[k] / total) * 100 }),
    ),
  };
})();
