/**
 * Motor do ambiente demonstrativo do NewSec Focus.
 *
 * Simula, dia a dia, a atividade de cada pessoa de `dados.ts` e agrega do
 * mesmo jeito que o painel agrega: por período, equipe, pessoa e estação. É
 * isto que deixa a réplica navegável de verdade — trocar para semana, voltar
 * para julho ou filtrar o Jurídico recalcula tudo, e os números continuam
 * fechando entre si.
 *
 * Duas regras que não podem ser quebradas aqui:
 *
 * 1. **Nada de relógio nem de sorteio.** O "agora" é fixo em `dados.ts` e a
 *    variação vem de um hash da chave (pessoa + dia + medida). O HTML gerado
 *    no build e o navegador do visitante calculam exatamente o mesmo número —
 *    senão a hidratação quebra (erro #418 do React).
 * 2. **As fórmulas de leitura são as do painel**: média por pessoa/dia sobre
 *    os dias com registro, índice como tempo produtivo sobre tempo
 *    classificado, aderência como tempo ativo sobre a jornada esperada.
 */

import {
  CORES_TIPO,
  PALETA_SERIES,
  type BucketSerie,
  type TipoCategoria,
} from "./formato";
import {
  AGORA_MINUTOS,
  APPS,
  EMPRESA,
  EQUIPES,
  FERIADOS,
  HOJE,
  PESOS,
  PESSOAS,
  type PerfilPessoa,
} from "./dados";

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
  /** Id do dispositivo é o nome da máquina — uma estação por pessoa. */
  dispositivoId: string | null;
};

/** Classificações feitas pelo visitante na própria rosca: alvo → categoria. */
export type Classificacoes = Record<string, TipoCategoria>;

export const ESCOPO_VAZIO: EscopoDemo = {
  equipeId: null,
  colaboradorId: null,
  dispositivoId: null,
};

export type Intervalo = {
  /** Dias desde 1970-01-01, em UTC. Início e fim inclusivos. */
  inicio: number;
  fim: number;
  bucket: BucketSerie;
  rotulo: string;
};

export type KpisDemo = {
  minutosRegistrados: number;
  minutosAtivos: number;
  minutosOciosos: number;
  minutosBloqueado: number;
  minutosProdutivos: number;
  minutosNeutros: number;
  minutosImprodutivos: number;
  minutosSemClassificar: number;
  teclas: number;
  cliques: number;
  rolagens: number;
  /** NULL quando nada foi classificado. Nunca exibir como 0% nem como 100%. */
  indice: number | null;
  colaboradores: number;
  dispositivos: number;
  diasComRegistro: number;
  topAplicacao: string | null;
  jornadaEsperada: number;
};

export type EscalaDemo = {
  temJanela: boolean;
  minutosAtivosEscala: number;
  indiceEscala: number | null;
  minutosAtivosExtra: number;
  indiceExtra: number | null;
  pessoasComExtra: number;
};

export type VariacaoDemo = {
  minutosAtivos: number | null;
  /** Diferença em pontos percentuais. */
  indice: number | null;
};

export type PontoSerie = {
  chave: string;
  rotulo: string;
  rotuloCompleto: string;
  ativo: number;
  ocioso: number;
  produtivo: number;
  neutro: number;
  improdutivo: number;
  indice: number | null;
};

export type FatiaDistribuicao = {
  nome: string;
  tipo: TipoCategoria | null;
  minutos: number;
  pessoas: number;
  cor: string;
};

export type LinhaEquipe = {
  equipeId: string;
  equipe: string;
  cor: string;
  pessoas: number;
  minutosAtivos: number;
  minutosOciosos: number;
  minutosProdutivos: number;
  minutosNeutros: number;
  minutosImprodutivos: number;
  indice: number | null;
  aderencia: number | null;
};

export type LinhaPessoa = {
  colaboradorId: string;
  colaborador: string;
  cargo: string;
  equipeId: string;
  equipe: string;
  diasComRegistro: number;
  minutosAtivos: number;
  minutosOciosos: number;
  minutosProdutivos: number;
  minutosNeutros: number;
  minutosImprodutivos: number;
  teclas: number;
  cliques: number;
  indice: number | null;
  aderencia: number | null;
};

export type LinhaHorasExtras = {
  colaboradorId: string;
  colaborador: string;
  cargo: string;
  equipeId: string;
  equipe: string;
  temJanelaDefinida: boolean;
  minutosExtras: number;
  diasComHoraExtra: number;
  minutosAtivosTotais: number;
  percentualExtra: number | null;
  janela: string;
};

export type LinhaDia = {
  dia: string;
  data: string;
  minutosAtivos: number;
  minutosOciosos: number;
  indice: number | null;
  primeiroSinal: string;
  ultimoSinal: string;
};

export type Recorte = {
  intervalo: Intervalo;
  kpis: KpisDemo;
  anterior: KpisDemo;
  variacao: VariacaoDemo;
  escala: EscalaDemo;
  serie: PontoSerie[];
  distribuicao: FatiaDistribuicao[];
  equipes: LinhaEquipe[];
  pessoas: LinhaPessoa[];
  horasExtras: LinhaHorasExtras[];
};

/* -------------------------------------------------------------------------
   Datas — tudo em dias inteiros desde 1970-01-01, em UTC.

   Sem fuso, sem horário de verão e sem `new Date()` de verdade: a réplica
   precisa dar o mesmo resultado no build e no navegador de quem visita.
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

function partes(dia: number) {
  const data = new Date(dia * DIA_MS);
  return {
    ano: data.getUTCFullYear(),
    mes: data.getUTCMonth() + 1,
    dia: data.getUTCDate(),
    semana: data.getUTCDay(),
  };
}

/** Aceita mês 0 e 13: `Date.UTC` vira o ano sozinho. */
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
const MESES_CURTOS = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];
const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);
const clamp = (valor: number, minimo: number, maximo: number) =>
  Math.min(maximo, Math.max(minimo, valor));

function rotuloDia(dia: number): string {
  if (dia === DIA_HOJE) return "Hoje";
  if (dia === DIA_HOJE - 1) return "Ontem";
  const p = partes(dia);
  return `${pad(p.dia)} de ${MESES[p.mes - 1]} de ${p.ano}`;
}

function rotuloIntervalo(inicio: number, fim: number): string {
  const a = partes(inicio);
  const b = partes(fim);
  const curto = (p: { dia: number; mes: number }) => `${pad(p.dia)}/${pad(p.mes)}`;
  if (a.ano === b.ano) return `${curto(a)} a ${curto(b)}/${a.ano}`;
  return `${curto(a)}/${a.ano} a ${curto(b)}/${b.ano}`;
}

/** Granularidade adequada ao tamanho da janela, como no painel. */
function bucketPara(inicio: number, fim: number): BucketSerie {
  const dias = fim - inicio + 1;
  if (dias <= 2) return "hour";
  if (dias <= 92) return "day";
  if (dias <= 400) return "week";
  return "month";
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

export function intervalo(periodo: PeriodoDemo): Intervalo {
  const dia = paraDia(periodo.ancora);
  const p = partes(dia);

  switch (periodo.preset) {
    case "dia":
      return { inicio: dia, fim: dia, bucket: "hour", rotulo: rotuloDia(dia) };
    case "semana": {
      // Semana começa na segunda: é como a operação enxerga a própria semana.
      const segunda = dia - ((p.semana + 6) % 7);
      return {
        inicio: segunda,
        fim: segunda + 6,
        bucket: "day",
        rotulo: `Semana de ${rotuloIntervalo(segunda, segunda + 6)}`,
      };
    }
    case "mes":
      return {
        inicio: diaDe(p.ano, p.mes, 1),
        fim: diaDe(p.ano, p.mes + 1, 1) - 1,
        bucket: "day",
        rotulo: capitalizar(`${MESES[p.mes - 1]} de ${p.ano}`),
      };
    case "ano":
      return {
        inicio: diaDe(p.ano, 1, 1),
        fim: diaDe(p.ano + 1, 1, 1) - 1,
        bucket: "month",
        rotulo: String(p.ano),
      };
    case "geral":
      return { inicio: DIA_INICIO, fim: DIA_HOJE, bucket: "month", rotulo: "Todo o período" };
    case "personalizado": {
      const a = paraDia(periodo.de ?? periodo.ancora);
      const b = paraDia(periodo.ate ?? periodo.ancora);
      const [inicio, fim] = a <= b ? [a, b] : [b, a];
      return { inicio, fim, bucket: bucketPara(inicio, fim), rotulo: rotuloIntervalo(inicio, fim) };
    }
  }
}

export function criarPeriodo(preset: Preset, atual?: PeriodoDemo): PeriodoDemo {
  if (preset !== "personalizado") return { preset, ancora: HOJE };

  const base = intervalo(atual ?? PERIODO_INICIAL);
  const fim = Math.min(base.fim, DIA_HOJE);
  return {
    preset,
    ancora: paraIso(base.inicio),
    de: paraIso(base.inicio),
    ate: paraIso(fim),
  };
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
      return {
        ...periodo,
        ancora: paraIso(de + salto),
        de: paraIso(de + salto),
        ate: paraIso(ate + salto),
      };
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

export function rotuloComparacao(periodo: PeriodoDemo): string {
  switch (periodo.preset) {
    case "dia":
      return "dia anterior";
    case "semana":
      return "semana anterior";
    case "mes":
      return "mês anterior";
    case "ano":
      return "ano anterior";
    default:
      return "período anterior";
  }
}

/** Data de um dia no formato curto, para o seletor personalizado. */
export function isoDoDia(dia: number): string {
  return paraIso(dia);
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
   Ferramentas por pessoa

   O tempo de cada categoria se reparte entre as ferramentas da equipe, e nem
   todo mundo usa todas: quem nunca abre o Instagram não aparece na fatia dele.
   ------------------------------------------------------------------------- */

const BASES = ["PRODUCTIVE", "NEUTRAL", "UNPRODUCTIVE", "SEM"] as const;
type BaseCategoria = (typeof BASES)[number];

/** Minutos por categoria de origem: produtivo, neutro, improdutivo, sem. */
type Cat4 = [number, number, number, number];

const TIPO_BASE: Record<string, TipoCategoria | null> = Object.fromEntries(
  APPS.map((app) => [app.alvo, app.tipo]),
);

const PROBABILIDADE_USO: Record<BaseCategoria, number> = {
  PRODUCTIVE: 0.95,
  NEUTRAL: 0.85,
  UNPRODUCTIVE: 0.62,
  SEM: 0.58,
};

type PesosPessoa = Record<BaseCategoria, [string, number][]>;

function pesosDaPessoa(pessoa: PerfilPessoa): PesosPessoa {
  const daEquipe = PESOS[pessoa.equipeId];
  const resultado = {} as PesosPessoa;

  for (const base of BASES) {
    const entradas = Object.entries(daEquipe[base]);
    // A primeira ferramenta da lista é a da rotina da equipe: essa todo mundo
    // usa. As demais entram conforme o perfil da pessoa.
    const usadas = entradas.filter(
      ([alvo], indice) =>
        indice === 0 || ruido(`${pessoa.id}|uso|${alvo}`) < PROBABILIDADE_USO[base],
    );
    const soma = usadas.reduce((total, [, peso]) => total + peso, 0) || 1;
    resultado[base] = usadas.map(([alvo, peso]) => [alvo, peso / soma]);
  }

  return resultado;
}

const PESOS_PESSOA: Record<string, PesosPessoa> = Object.fromEntries(
  PESSOAS.map((pessoa) => [pessoa.id, pesosDaPessoa(pessoa)]),
);

export const PESSOAS_POR_ID: Record<string, PerfilPessoa> = Object.fromEntries(
  PESSOAS.map((pessoa) => [pessoa.id, pessoa]),
);

export const EQUIPES_POR_ID = Object.fromEntries(EQUIPES.map((e) => [e.id, e]));

export function tipoDoApp(alvo: string, classificacoes: Classificacoes): TipoCategoria | null {
  return classificacoes[alvo] ?? TIPO_BASE[alvo] ?? null;
}

function indiceDoTipo(tipo: TipoCategoria | null): number {
  if (tipo === "PRODUCTIVE") return 0;
  if (tipo === "NEUTRAL") return 1;
  if (tipo === "UNPRODUCTIVE") return 2;
  return 3;
}

/**
 * Matriz que converte minutos por categoria de ORIGEM em minutos por
 * categoria EFETIVA — a de origem é fixa, a efetiva muda quando o visitante
 * classifica um aplicativo na rosca.
 */
function matrizes(classificacoes: Classificacoes): Record<string, number[][]> {
  const resultado: Record<string, number[][]> = {};

  for (const pessoa of PESSOAS) {
    const matriz = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    BASES.forEach((base, linha) => {
      for (const [alvo, peso] of PESOS_PESSOA[pessoa.id][base]) {
        matriz[linha][indiceDoTipo(tipoDoApp(alvo, classificacoes))] += peso;
      }
    });

    resultado[pessoa.id] = matriz;
  }

  return resultado;
}

function efetivar(base: Cat4, matriz: number[][]): Cat4 {
  const saida: Cat4 = [0, 0, 0, 0];
  for (let origem = 0; origem < 4; origem += 1) {
    if (base[origem] === 0) continue;
    for (let destino = 0; destino < 4; destino += 1) {
      saida[destino] += base[origem] * matriz[origem][destino];
    }
  }
  return saida;
}

/* -------------------------------------------------------------------------
   Simulação de um dia de uma pessoa
   ------------------------------------------------------------------------- */

export type DiaPessoa = {
  dia: number;
  ativo: number;
  ocioso: number;
  bloqueado: number;
  base: Cat4;
  extra: number;
  extraBase: Cat4;
  teclas: number;
  cliques: number;
  rolagens: number;
  entrada: number;
  saida: number;
};

/** Reparte um total inteiro em quatro partes, sem perder nem inventar minuto. */
function repartir(total: number, fracoes: number[]): Cat4 {
  const soma = fracoes.reduce((s, f) => s + f, 0) || 1;
  const brutos = fracoes.map((f) => (total * f) / soma);
  const inteiros = brutos.map((b) => Math.floor(b));
  let resto = total - inteiros.reduce((s, v) => s + v, 0);

  const ordem = brutos
    .map((bruto, indice) => ({ indice, sobra: bruto - Math.floor(bruto) }))
    .sort((a, b) => b.sobra - a.sobra);

  for (const { indice } of ordem) {
    if (resto <= 0) break;
    inteiros[indice] += 1;
    resto -= 1;
  }

  return [inteiros[0], inteiros[1], inteiros[2], inteiros[3]];
}

const cacheDias = new Map<string, DiaPessoa | null>();

export function simularDia(pessoa: PerfilPessoa, dia: number): DiaPessoa | null {
  const chave = `${pessoa.id}|${dia}`;
  const guardado = cacheDias.get(chave);
  if (guardado !== undefined) return guardado;

  const calculado = calcularDia(pessoa, dia, chave);
  cacheDias.set(chave, calculado);
  return calculado;
}

function calcularDia(pessoa: PerfilPessoa, dia: number, chave: string): DiaPessoa | null {
  if (dia < DIA_INICIO || dia > DIA_HOJE) return null;
  if (pessoa.paradaDesde && dia >= paraDia(pessoa.paradaDesde)) return null;

  const { semana, mes, dia: diaDoMes } = partes(dia);
  if (semana === 0 || DIAS_FERIADO.has(dia)) return null;

  const r = (medida: string) => ruido(`${chave}|${medida}`);

  let fator = 1;
  let entrada = pessoa.entrada + Math.round((r("entrada") - 0.5) * 24);

  if (semana === 6) {
    // Sábado é exceção de fechamento: só o último do mês, e só para quem
    // costuma pegar sábado. Espalhado, cada sábado entraria como "dia com
    // registro" no divisor da média por pessoa/dia — e três pessoas
    // trabalhando derrubariam o número da equipe inteira.
    if (!pessoa.sabado || diaDoMes < 22) return null;
    fator = 0.42;
    entrada = 9 * 60 + Math.round(r("entrada") * 40);
  } else if (dia !== DIA_HOJE && r("falta") < 0.03) {
    return null;
  }

  // A operação melhora devagar ao longo do ano — é o que faz o painel mostrar
  // ganho contra o mês anterior, como numa empresa que passou a se medir.
  const progresso = clamp((mes - 1) / 7, 0, 1);
  fator *= (0.88 + progresso * 0.12) * (1 + (r("volume") - 0.5) * 0.18);

  let ativo = Math.round(pessoa.media * fator);
  let ocioso = Math.round(ativo * pessoa.ocioso * (0.8 + r("ocioso") * 0.4));
  let bloqueado = semana === 6 ? 0 : 38 + Math.round(r("almoco") * 26);

  const permanencia = Math.round((ativo + ocioso + bloqueado) * 1.05);
  // Quem tem hábito de hora extra estica o dia depois da janela de expediente.
  const prolongamento = Math.round(ativo * pessoa.extra * (0.5 + r("extra")));
  let saida = entrada + permanencia;
  if (prolongamento > 0) saida = Math.max(saida, EMPRESA.janelaFim + prolongamento);

  // Hoje o dia ainda não terminou: o painel mostra o que já chegou.
  if (dia === DIA_HOJE) {
    const limite = pessoa.hojeAte ?? AGORA_MINUTOS;
    if (saida > limite) {
      const fracao = clamp((limite - entrada) / Math.max(1, saida - entrada), 0, 1);
      if (fracao <= 0.02) return null;
      ativo = Math.round(ativo * fracao);
      ocioso = Math.round(ocioso * fracao);
      bloqueado = limite > 13 * 60 ? bloqueado : Math.round(bloqueado * fracao);
      saida = limite;
    }
  }

  const densidade = ativo / Math.max(1, saida - entrada);
  const forat = Math.max(0, EMPRESA.janelaInicio - entrada) + Math.max(0, saida - EMPRESA.janelaFim);
  const extra = Math.min(ativo, Math.round(densidade * forat));

  const produtivo = clamp(
    pessoa.produtivo - 0.02 + progresso * 0.03 + (r("produtivo") - 0.5) * 0.06,
    0.2,
    0.9,
  );
  const neutro = clamp(pessoa.neutro + (r("neutro") - 0.5) * 0.04, 0.05, 0.4);
  const improdutivo = clamp(
    pessoa.improdutivo * (0.75 + r("improdutivo") * 0.5) * (1.12 - progresso * 0.2),
    0.005,
    0.4,
  );
  const semCategoria = Math.max(0.02, 1 - produtivo - neutro - improdutivo);

  const base = repartir(ativo, [produtivo, neutro, improdutivo, semCategoria]);
  // Fora do expediente rende menos: cai o produtivo, sobe o improdutivo.
  const extraBase = repartir(extra, [produtivo * 0.86, neutro, improdutivo * 1.6, semCategoria]);
  for (let i = 0; i < 4; i += 1) extraBase[i] = Math.min(extraBase[i], base[i]);

  const teclas = Math.round(ativo * pessoa.teclas * (0.85 + r("teclas") * 0.3));
  const cliques = Math.round(ativo * pessoa.cliques * (0.85 + r("cliques") * 0.3));

  return {
    dia,
    ativo,
    ocioso,
    bloqueado,
    base,
    extra,
    extraBase,
    teclas,
    cliques,
    rolagens: Math.round(cliques * (0.5 + r("rolagens") * 0.3)),
    entrada,
    saida,
  };
}

/** Hora a hora do dia, com a queda do almoço. Serve ao recorte "Dia". */
function porHora(dp: DiaPessoa, pessoaId: string) {
  const pesos: number[] = new Array(24).fill(0);

  for (let hora = 0; hora < 24; hora += 1) {
    const inicio = Math.max(dp.entrada, hora * 60);
    const fim = Math.min(dp.saida, hora * 60 + 60);
    if (fim <= inicio) continue;
    pesos[hora] = (fim - inicio) * (hora === 12 ? 0.3 : 1);
  }

  const soma = pesos.reduce((s, p) => s + p, 0) || 1;

  return pesos
    .map((peso, hora) => {
      const fracao = peso / soma;
      if (fracao === 0) return null;

      // O rendimento oscila: melhor de manhã, cai depois do almoço.
      const ritmo =
        1 +
        0.07 * Math.cos((hora - 10) / 2.2) +
        (ruido(`${pessoaId}|${dp.dia}|hora${hora}`) - 0.5) * 0.06;

      const produtivo = Math.max(0, dp.base[0] * fracao * ritmo);
      const sobra = dp.base[0] * fracao - produtivo;

      const base: Cat4 = [
        produtivo,
        dp.base[1] * fracao,
        Math.max(0, dp.base[2] * fracao + sobra),
        dp.base[3] * fracao,
      ];

      return { hora, ativo: dp.ativo * fracao, ocioso: dp.ocioso * fracao, base };
    })
    .filter((h): h is { hora: number; ativo: number; ocioso: number; base: Cat4 } => h !== null);
}

/* -------------------------------------------------------------------------
   Varredura: uma passada pelos dias, guardando tudo por pessoa
   ------------------------------------------------------------------------- */

type Balde = { chave: number; ativo: number; ocioso: number; efetivo: Cat4 };

type AcumuladoPessoa = {
  ativo: number;
  ocioso: number;
  bloqueado: number;
  base: Cat4;
  efetivo: Cat4;
  extra: number;
  extraEfetivo: Cat4;
  teclas: number;
  cliques: number;
  rolagens: number;
  dias: Set<number>;
  diasComExtra: number;
  baldes: Map<number, Balde>;
};

export type Varredura = {
  periodo: PeriodoDemo;
  intervalo: Intervalo;
  classificacoes: Classificacoes;
  atual: Map<string, AcumuladoPessoa>;
  anterior: Map<string, AcumuladoPessoa>;
};

function novoAcumulado(): AcumuladoPessoa {
  return {
    ativo: 0,
    ocioso: 0,
    bloqueado: 0,
    base: [0, 0, 0, 0],
    efetivo: [0, 0, 0, 0],
    extra: 0,
    extraEfetivo: [0, 0, 0, 0],
    teclas: 0,
    cliques: 0,
    rolagens: 0,
    dias: new Set<number>(),
    diasComExtra: 0,
    baldes: new Map<number, Balde>(),
  };
}

function chaveDoBalde(dia: number, bucket: BucketSerie): number {
  const p = partes(dia);
  switch (bucket) {
    case "day":
      return dia;
    case "week":
      return dia - ((p.semana + 6) % 7);
    case "month":
      return p.ano * 12 + (p.mes - 1);
    case "hour":
      return dia * 24;
  }
}

function somarBalde(
  baldes: Map<number, Balde>,
  chave: number,
  ativo: number,
  ocioso: number,
  efetivo: Cat4,
) {
  const atual = baldes.get(chave) ?? { chave, ativo: 0, ocioso: 0, efetivo: [0, 0, 0, 0] as Cat4 };
  atual.ativo += ativo;
  atual.ocioso += ocioso;
  for (let i = 0; i < 4; i += 1) atual.efetivo[i] += efetivo[i];
  baldes.set(chave, atual);
}

function varrerIntervalo(
  iv: Intervalo,
  matriz: Record<string, number[][]>,
  comSerie: boolean,
): Map<string, AcumuladoPessoa> {
  const porPessoa = new Map<string, AcumuladoPessoa>();
  const inicio = Math.max(iv.inicio, DIA_INICIO);
  const fim = Math.min(iv.fim, DIA_HOJE);

  for (let dia = inicio; dia <= fim; dia += 1) {
    for (const pessoa of PESSOAS) {
      const dp = simularDia(pessoa, dia);
      if (!dp) continue;

      const m = matriz[pessoa.id];
      const efetivo = efetivar(dp.base, m);

      let acumulado = porPessoa.get(pessoa.id);
      if (!acumulado) {
        acumulado = novoAcumulado();
        porPessoa.set(pessoa.id, acumulado);
      }

      acumulado.ativo += dp.ativo;
      acumulado.ocioso += dp.ocioso;
      acumulado.bloqueado += dp.bloqueado;
      acumulado.teclas += dp.teclas;
      acumulado.cliques += dp.cliques;
      acumulado.rolagens += dp.rolagens;
      acumulado.extra += dp.extra;
      if (dp.extra >= 5) acumulado.diasComExtra += 1;
      acumulado.dias.add(dia);

      const extraEfetivo = efetivar(dp.extraBase, m);
      for (let i = 0; i < 4; i += 1) {
        acumulado.base[i] += dp.base[i];
        acumulado.efetivo[i] += efetivo[i];
        acumulado.extraEfetivo[i] += extraEfetivo[i];
      }

      if (!comSerie) continue;

      if (iv.bucket === "hour") {
        for (const faixa of porHora(dp, pessoa.id)) {
          somarBalde(
            acumulado.baldes,
            dia * 24 + faixa.hora,
            faixa.ativo,
            faixa.ocioso,
            efetivar(faixa.base, m),
          );
        }
      } else {
        somarBalde(acumulado.baldes, chaveDoBalde(dia, iv.bucket), dp.ativo, dp.ocioso, efetivo);
      }
    }
  }

  return porPessoa;
}

/** Uma varredura serve a todas as telas: o escopo é aplicado depois, somando. */
export function varrer(periodo: PeriodoDemo, classificacoes: Classificacoes): Varredura {
  const matriz = matrizes(classificacoes);
  const iv = intervalo(periodo);

  const anterior =
    periodo.preset === "geral"
      ? new Map<string, AcumuladoPessoa>()
      : varrerIntervalo(intervalo(navegar(periodo, -1)), matriz, false);

  return {
    periodo,
    intervalo: iv,
    classificacoes,
    atual: varrerIntervalo(iv, matriz, true),
    anterior,
  };
}

/* -------------------------------------------------------------------------
   Leitura: do acumulado para o que cada tela mostra
   ------------------------------------------------------------------------- */

function pessoasDoEscopo(escopo: EscopoDemo): PerfilPessoa[] {
  return PESSOAS.filter((pessoa) => {
    if (escopo.equipeId && pessoa.equipeId !== escopo.equipeId) return false;
    if (escopo.colaboradorId && pessoa.id !== escopo.colaboradorId) return false;
    if (escopo.dispositivoId && pessoa.maquina !== escopo.dispositivoId) return false;
    return true;
  });
}

function indiceDe(efetivo: Cat4): number | null {
  const classificado = efetivo[0] + efetivo[1] + efetivo[2];
  if (classificado <= 0) return null;
  return (efetivo[0] / classificado) * 100;
}

const KPIS_VAZIOS: KpisDemo = {
  minutosRegistrados: 0,
  minutosAtivos: 0,
  minutosOciosos: 0,
  minutosBloqueado: 0,
  minutosProdutivos: 0,
  minutosNeutros: 0,
  minutosImprodutivos: 0,
  minutosSemClassificar: 0,
  teclas: 0,
  cliques: 0,
  rolagens: 0,
  indice: null,
  colaboradores: 0,
  dispositivos: 0,
  diasComRegistro: 0,
  topAplicacao: null,
  jornadaEsperada: 0,
};

function somarKpis(
  porPessoa: Map<string, AcumuladoPessoa>,
  pessoas: PerfilPessoa[],
  topAplicacao: string | null,
): KpisDemo {
  const kpis: KpisDemo = { ...KPIS_VAZIOS, topAplicacao };
  const dias = new Set<number>();

  for (const pessoa of pessoas) {
    const acumulado = porPessoa.get(pessoa.id);
    if (!acumulado || acumulado.ativo === 0) continue;

    kpis.minutosAtivos += acumulado.ativo;
    kpis.minutosOciosos += acumulado.ocioso;
    kpis.minutosBloqueado += acumulado.bloqueado;
    kpis.minutosProdutivos += acumulado.efetivo[0];
    kpis.minutosNeutros += acumulado.efetivo[1];
    kpis.minutosImprodutivos += acumulado.efetivo[2];
    kpis.minutosSemClassificar += acumulado.efetivo[3];
    kpis.teclas += acumulado.teclas;
    kpis.cliques += acumulado.cliques;
    kpis.rolagens += acumulado.rolagens;
    kpis.colaboradores += 1;
    kpis.dispositivos += 1;
    kpis.jornadaEsperada += acumulado.dias.size * EMPRESA.jornadaMinutos;
    for (const dia of acumulado.dias) dias.add(dia);
  }

  kpis.minutosRegistrados = kpis.minutosAtivos + kpis.minutosOciosos + kpis.minutosBloqueado;
  kpis.diasComRegistro = dias.size;
  kpis.indice = indiceDe([
    kpis.minutosProdutivos,
    kpis.minutosNeutros,
    kpis.minutosImprodutivos,
    kpis.minutosSemClassificar,
  ]);

  return kpis;
}

function montarEscala(
  porPessoa: Map<string, AcumuladoPessoa>,
  pessoas: PerfilPessoa[],
): EscalaDemo {
  let ativo = 0;
  let extra = 0;
  const dentro: Cat4 = [0, 0, 0, 0];
  const fora: Cat4 = [0, 0, 0, 0];
  let pessoasComExtra = 0;

  for (const pessoa of pessoas) {
    const acumulado = porPessoa.get(pessoa.id);
    if (!acumulado) continue;

    ativo += acumulado.ativo;
    extra += acumulado.extra;
    if (acumulado.extra >= 30) pessoasComExtra += 1;

    for (let i = 0; i < 4; i += 1) {
      dentro[i] += acumulado.efetivo[i] - acumulado.extraEfetivo[i];
      fora[i] += acumulado.extraEfetivo[i];
    }
  }

  return {
    temJanela: true,
    minutosAtivosEscala: ativo - extra,
    indiceEscala: indiceDe(dentro),
    minutosAtivosExtra: extra,
    indiceExtra: indiceDe(fora),
    pessoasComExtra,
  };
}

function montarSerie(iv: Intervalo, porPessoa: Map<string, AcumuladoPessoa>, pessoas: PerfilPessoa[]): PontoSerie[] {
  const juntos = new Map<number, Balde>();

  for (const pessoa of pessoas) {
    const acumulado = porPessoa.get(pessoa.id);
    if (!acumulado) continue;
    for (const balde of acumulado.baldes.values()) {
      somarBalde(juntos, balde.chave, balde.ativo, balde.ocioso, balde.efetivo);
    }
  }

  if (juntos.size === 0) return [];

  const chaves: number[] = [];
  const fim = Math.min(iv.fim, DIA_HOJE);

  if (iv.bucket === "hour") {
    const existentes = [...juntos.keys()];
    for (let dia = iv.inicio; dia <= fim; dia += 1) {
      const daqui = existentes.filter((c) => Math.floor(c / 24) === dia);
      if (daqui.length === 0) continue;
      const primeira = Math.min(7, ...daqui.map((c) => c % 24));
      const ultima = Math.max(...daqui.map((c) => c % 24));
      for (let hora = primeira; hora <= ultima; hora += 1) chaves.push(dia * 24 + hora);
    }
  } else {
    const vistas = new Set<number>();
    for (let dia = Math.max(iv.inicio, DIA_INICIO); dia <= fim; dia += 1) {
      const chave = chaveDoBalde(dia, iv.bucket);
      if (vistas.has(chave)) continue;
      vistas.add(chave);
      chaves.push(chave);
    }
  }

  return chaves.map((chave) => {
    const balde = juntos.get(chave);
    const efetivo = balde?.efetivo ?? ([0, 0, 0, 0] as Cat4);
    const rotulos = rotulosDoBalde(chave, iv.bucket);

    return {
      chave: String(chave),
      rotulo: rotulos.curto,
      rotuloCompleto: rotulos.completo,
      ativo: balde?.ativo ?? 0,
      ocioso: balde?.ocioso ?? 0,
      produtivo: efetivo[0],
      neutro: efetivo[1],
      improdutivo: efetivo[2],
      indice: balde ? indiceDe(efetivo) : null,
    };
  });
}

function rotulosDoBalde(chave: number, bucket: BucketSerie): { curto: string; completo: string } {
  if (bucket === "hour") {
    const dia = Math.floor(chave / 24);
    const hora = chave % 24;
    const p = partes(dia);
    return {
      curto: `${pad(hora)}h`,
      completo: `${pad(p.dia)}/${pad(p.mes)}, ${pad(hora)}h às ${pad((hora + 1) % 24)}h`,
    };
  }

  if (bucket === "month") {
    const ano = Math.floor(chave / 12);
    const mes = chave % 12;
    return {
      curto: `${pad(mes + 1)}/${String(ano).slice(2)}`,
      completo: `${MESES_CURTOS[mes]} de ${ano}`,
    };
  }

  const p = partes(chave);
  const curto = `${pad(p.dia)}/${pad(p.mes)}`;

  if (bucket === "week") {
    return { curto, completo: `semana de ${curto}/${p.ano}` };
  }

  return { curto, completo: `${DIAS_SEMANA[p.semana]}, ${curto}/${p.ano}` };
}

function montarDistribuicao(
  porPessoa: Map<string, AcumuladoPessoa>,
  pessoas: PerfilPessoa[],
  classificacoes: Classificacoes,
): FatiaDistribuicao[] {
  const minutos = new Map<string, number>();
  const quantos = new Map<string, number>();

  for (const pessoa of pessoas) {
    const acumulado = porPessoa.get(pessoa.id);
    if (!acumulado) continue;

    BASES.forEach((base, linha) => {
      const total = acumulado.base[linha];
      if (total <= 0) return;

      for (const [alvo, peso] of PESOS_PESSOA[pessoa.id][base]) {
        const parte = total * peso;
        if (parte < 1) continue;
        minutos.set(alvo, (minutos.get(alvo) ?? 0) + parte);
        quantos.set(alvo, (quantos.get(alvo) ?? 0) + 1);
      }
    });
  }

  return [...minutos.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([nome, total], indice) => {
      const tipo = tipoDoApp(nome, classificacoes);
      return {
        nome,
        tipo,
        minutos: Math.round(total),
        pessoas: quantos.get(nome) ?? 0,
        cor: tipo ? CORES_TIPO[tipo] : PALETA_SERIES[indice % PALETA_SERIES.length],
      };
    });
}

function montarEquipes(porPessoa: Map<string, AcumuladoPessoa>): LinhaEquipe[] {
  return EQUIPES.map((equipe) => {
    const linha: LinhaEquipe = {
      equipeId: equipe.id,
      equipe: equipe.nome,
      cor: equipe.cor,
      pessoas: 0,
      minutosAtivos: 0,
      minutosOciosos: 0,
      minutosProdutivos: 0,
      minutosNeutros: 0,
      minutosImprodutivos: 0,
      indice: null,
      aderencia: null,
    };

    let jornada = 0;
    const efetivo: Cat4 = [0, 0, 0, 0];

    for (const pessoa of PESSOAS) {
      if (pessoa.equipeId !== equipe.id) continue;
      const acumulado = porPessoa.get(pessoa.id);
      if (!acumulado || acumulado.ativo === 0) continue;

      linha.pessoas += 1;
      linha.minutosAtivos += acumulado.ativo;
      linha.minutosOciosos += acumulado.ocioso;
      jornada += acumulado.dias.size * EMPRESA.jornadaMinutos;
      for (let i = 0; i < 4; i += 1) efetivo[i] += acumulado.efetivo[i];
    }

    linha.minutosProdutivos = efetivo[0];
    linha.minutosNeutros = efetivo[1];
    linha.minutosImprodutivos = efetivo[2];
    linha.indice = indiceDe(efetivo);
    linha.aderencia = jornada > 0 ? (linha.minutosAtivos / jornada) * 100 : null;

    return linha;
  }).filter((linha) => linha.pessoas > 0);
}

function montarPessoas(
  porPessoa: Map<string, AcumuladoPessoa>,
  pessoas: PerfilPessoa[],
): LinhaPessoa[] {
  const linhas: LinhaPessoa[] = [];

  for (const pessoa of pessoas) {
    const acumulado = porPessoa.get(pessoa.id);
    if (!acumulado || acumulado.ativo === 0) continue;

    const jornada = acumulado.dias.size * EMPRESA.jornadaMinutos;

    linhas.push({
      colaboradorId: pessoa.id,
      colaborador: pessoa.nome,
      cargo: pessoa.cargo,
      equipeId: pessoa.equipeId,
      equipe: EQUIPES_POR_ID[pessoa.equipeId].nome,
      diasComRegistro: acumulado.dias.size,
      minutosAtivos: acumulado.ativo,
      minutosOciosos: acumulado.ocioso,
      minutosProdutivos: acumulado.efetivo[0],
      minutosNeutros: acumulado.efetivo[1],
      minutosImprodutivos: acumulado.efetivo[2],
      teclas: acumulado.teclas,
      cliques: acumulado.cliques,
      indice: indiceDe(acumulado.efetivo),
      aderencia: jornada > 0 ? (acumulado.ativo / jornada) * 100 : null,
    });
  }

  return linhas;
}

function montarHorasExtras(
  porPessoa: Map<string, AcumuladoPessoa>,
  pessoas: PerfilPessoa[],
): LinhaHorasExtras[] {
  const linhas: LinhaHorasExtras[] = [];

  for (const pessoa of pessoas) {
    const acumulado = porPessoa.get(pessoa.id);
    if (!acumulado || acumulado.ativo === 0) continue;

    linhas.push({
      colaboradorId: pessoa.id,
      colaborador: pessoa.nome,
      cargo: pessoa.cargo,
      equipeId: pessoa.equipeId,
      equipe: EQUIPES_POR_ID[pessoa.equipeId].nome,
      temJanelaDefinida: true,
      minutosExtras: acumulado.extra,
      diasComHoraExtra: acumulado.diasComExtra,
      minutosAtivosTotais: acumulado.ativo,
      percentualExtra: acumulado.ativo > 0 ? (acumulado.extra / acumulado.ativo) * 100 : null,
      janela: EMPRESA.janela,
    });
  }

  return linhas;
}

function variacaoPercentual(atual: number, anterior: number): number | null {
  if (anterior <= 0) return null;
  return Number((((atual - anterior) / anterior) * 100).toFixed(1));
}

export function montarRecorte(varredura: Varredura, escopo: EscopoDemo): Recorte {
  const pessoas = pessoasDoEscopo(escopo);
  const distribuicao = montarDistribuicao(varredura.atual, pessoas, varredura.classificacoes);

  const kpis = somarKpis(varredura.atual, pessoas, distribuicao[0]?.nome ?? null);
  const anterior = somarKpis(varredura.anterior, pessoas, null);

  // Pessoas e horas extras ignoram o recorte de pessoa: as duas telas são
  // listas, e o filtro que vale nelas é o de equipe.
  const pessoasDaEquipe = pessoasDoEscopo({ ...escopo, colaboradorId: null, dispositivoId: null });

  return {
    intervalo: varredura.intervalo,
    kpis,
    anterior,
    variacao: {
      minutosAtivos: variacaoPercentual(kpis.minutosAtivos, anterior.minutosAtivos),
      indice:
        kpis.indice === null || anterior.indice === null
          ? null
          : Number((kpis.indice - anterior.indice).toFixed(1)),
    },
    escala: montarEscala(varredura.atual, pessoas),
    serie: montarSerie(varredura.intervalo, varredura.atual, pessoas),
    distribuicao,
    equipes: montarEquipes(varredura.atual),
    pessoas: montarPessoas(varredura.atual, pessoasDaEquipe),
    horasExtras: montarHorasExtras(varredura.atual, pessoasDaEquipe),
  };
}

/** Dia a dia de uma pessoa — a tabela da tela de detalhe. */
export function diasDaPessoa(varredura: Varredura, pessoaId: string): LinhaDia[] {
  const pessoa = PESSOAS_POR_ID[pessoaId];
  if (!pessoa) return [];

  const matriz = matrizes(varredura.classificacoes)[pessoaId];
  const iv = varredura.intervalo;
  const linhas: LinhaDia[] = [];

  const hora = (minutos: number) => `${pad(Math.floor(minutos / 60))}:${pad(minutos % 60)}`;

  for (let dia = Math.max(iv.inicio, DIA_INICIO); dia <= Math.min(iv.fim, DIA_HOJE); dia += 1) {
    const dp = simularDia(pessoa, dia);
    if (!dp) continue;

    const p = partes(dia);
    linhas.push({
      dia: paraIso(dia),
      data: `${pad(p.dia)}/${pad(p.mes)}/${p.ano}`,
      minutosAtivos: dp.ativo,
      minutosOciosos: dp.ocioso,
      indice: indiceDe(efetivar(dp.base, matriz)),
      primeiroSinal: hora(dp.entrada),
      ultimoSinal: hora(dp.saida),
    });
  }

  return linhas;
}

/**
 * Resumo do recorte padrão (agosto, empresa inteira), calculado uma vez.
 *
 * Serve às peças da página que mostram um número solto do painel — o cartão
 * de "quanto a equipe trabalha", por exemplo. Antes esse número era digitado
 * à mão na seção, e bastava mexer no motor para a página passar a contradizer
 * a própria demonstração logo abaixo dela.
 */
export const RESUMO_PADRAO = (() => {
  const recorte = montarRecorte(varrer(PERIODO_INICIAL, {}), ESCOPO_VAZIO);
  const { kpis } = recorte;

  const divisor = kpis.colaboradores * kpis.diasComRegistro;
  const ativo =
    kpis.minutosProdutivos +
    kpis.minutosNeutros +
    kpis.minutosImprodutivos +
    kpis.minutosSemClassificar;

  const fatia = (minutos: number) => (ativo > 0 ? (minutos / ativo) * 100 : 0);

  return {
    mediaPessoaDia: divisor > 0 ? kpis.minutosAtivos / divisor : 0,
    indice: kpis.indice,
    composicao: [
      { cor: CORES_TIPO.PRODUCTIVE, parte: fatia(kpis.minutosProdutivos) },
      { cor: CORES_TIPO.NEUTRAL, parte: fatia(kpis.minutosNeutros) },
      { cor: CORES_TIPO.UNPRODUCTIVE, parte: fatia(kpis.minutosImprodutivos) },
      { cor: CORES_TIPO.SEM, parte: fatia(kpis.minutosSemClassificar) },
    ],
  };
})();
