/**
 * O que não depende do período escolhido: quem está fazendo o quê agora, as
 * estações, o diário de bordo e a atividade minuto a minuto.
 *
 * Tudo sai dos perfis de `dados.ts` e do "agora" fixo (sexta, 28/08/2026,
 * 16h40). Nada aqui lê o relógio: a réplica precisa desenhar igual no build
 * e no navegador.
 */

import { AGORA_MINUTOS, EVENTOS, HOJE, PESSOAS, type EstadoAgora, type EventoEstacao } from "./dados";
import { EQUIPES_POR_ID, ruido } from "./motor";

const pad = (n: number) => String(n).padStart(2, "0");

/** "há 12 min" → 12. Serve para ordenar sem inventar carimbo de tempo. */
export function minutosDoRotulo(rotulo: string): number {
  if (rotulo === "agora") return 0;
  const partes = /^há (\d+) (min|h|d)$/.exec(rotulo);
  if (!partes) return 0;
  const valor = Number(partes[1]);
  if (partes[2] === "min") return valor;
  if (partes[2] === "h") return valor * 60;
  return valor * 1440;
}

/* ----------------------------------------------------------- atividade agora */

export type LinhaTempoReal = {
  colaboradorId: string;
  colaborador: string;
  equipe: string;
  maquina: string;
  processo: string;
  dominio: string | null;
  tituloJanela: string;
  momento: string;
  status: EstadoAgora;
};

const ORDEM_STATUS: Record<EstadoAgora, number> = { ativo: 0, ocioso: 1, offline: 2 };

export const TEMPO_REAL: LinhaTempoReal[] = PESSOAS.map((pessoa) => ({
  colaboradorId: pessoa.id,
  colaborador: pessoa.nome,
  equipe: EQUIPES_POR_ID[pessoa.equipeId].nome,
  maquina: pessoa.maquina,
  processo: pessoa.agora.processo,
  dominio: pessoa.agora.dominio,
  tituloJanela: pessoa.agora.titulo,
  momento: pessoa.agora.momento,
  status: pessoa.agora.estado,
})).sort(
  (a, b) =>
    ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status] ||
    minutosDoRotulo(a.momento) - minutosDoRotulo(b.momento) ||
    a.colaborador.localeCompare(b.colaborador, "pt-BR"),
);

export const COM_SINAL = TEMPO_REAL.filter((linha) => linha.status !== "offline").length;

/* ---------------------------------------------------------------- estações */

export type DispositivoDemo = {
  id: string;
  maquina: string;
  usuario: string;
  online: boolean;
  /** Estação parada é diferente de offline: não dá sinal há mais de um dia. */
  parada: boolean;
  versao: string;
  sincronizou: string;
  minutosAtras: number;
};

export const DISPOSITIVOS: DispositivoDemo[] = PESSOAS.map((pessoa) => {
  const minutosAtras = minutosDoRotulo(pessoa.estacao.sincronizou);
  return {
    id: pessoa.maquina,
    maquina: pessoa.maquina,
    usuario: pessoa.usuario,
    online: pessoa.agora.estado !== "offline",
    parada: minutosAtras >= 24 * 60,
    versao: pessoa.estacao.versao,
    sincronizou: pessoa.estacao.sincronizou,
    minutosAtras,
  };
}).sort((a, b) => a.minutosAtras - b.minutosAtras);

export const ESTACOES_ONLINE = DISPOSITIVOS.filter((d) => d.online).length;
export const ESTACAO_PARADA = DISPOSITIVOS.find((d) => d.parada) ?? null;

/* ------------------------------------------------------------ diário de bordo */

export type GrupoEventos = { titulo: string; eventos: EventoEstacao[] };

export const GRUPOS_EVENTOS: GrupoEventos[] = (() => {
  const grupos: GrupoEventos[] = [];
  for (const evento of EVENTOS) {
    const atual = grupos[grupos.length - 1];
    if (atual && atual.titulo === evento.dia) atual.eventos.push(evento);
    else grupos.push({ titulo: evento.dia, eventos: [evento] });
  }
  return grupos;
})();

/* --------------------------------------------------- registros minuto a minuto */

export type RegistroDemo = {
  chave: string;
  data: string;
  hora: string;
  colaborador: string;
  equipe: string;
  maquina: string;
  processo: string;
  dominio: string | null;
  titulo: string;
  estado: "ATIVO" | "OCIOSO" | "BLOQUEADO";
  teclas: number;
  cliques: number;
  segundosAtivos: number;
};

/**
 * Cem linhas, que é o tamanho de página do painel. Cada linha é um minuto de
 * uma estação: o detalhe por trás dos gráficos.
 */
export const REGISTROS: RegistroDemo[] = (() => {
  const [, mes, dia] = HOJE.split("-");
  const data = `${dia}/${mes}`;
  const comSinal = PESSOAS.filter((pessoa) => pessoa.agora.estado !== "offline");
  const linhas: RegistroDemo[] = [];

  for (let recuo = 1; linhas.length < 100 && recuo < 60; recuo += 1) {
    const minuto = AGORA_MINUTOS - recuo;

    for (const pessoa of comSinal) {
      if (linhas.length >= 100) break;

      const r = (medida: string) => ruido(`${pessoa.id}|registro|${minuto}|${medida}`);
      const paradoAgora =
        pessoa.agora.estado === "ocioso" && recuo <= minutosDoRotulo(pessoa.agora.momento);
      const bloqueado = !paradoAgora && r("bloqueio") < 0.035;
      const estado = bloqueado ? "BLOQUEADO" : paradoAgora ? "OCIOSO" : "ATIVO";
      const ativo = estado === "ATIVO";

      linhas.push({
        chave: `${pessoa.id}-${minuto}`,
        data,
        hora: `${pad(Math.floor(minuto / 60))}:${pad(minuto % 60)}`,
        colaborador: pessoa.nome,
        equipe: EQUIPES_POR_ID[pessoa.equipeId].nome,
        maquina: pessoa.maquina,
        processo: pessoa.agora.processo,
        dominio: pessoa.agora.dominio,
        titulo: pessoa.agora.titulo,
        estado,
        teclas: ativo ? Math.round(pessoa.teclas * (0.4 + r("teclas") * 1.5)) : 0,
        cliques: ativo ? Math.round(pessoa.cliques * (0.4 + r("cliques") * 1.6)) : 0,
        segundosAtivos: ativo ? 24 + Math.round(r("segundos") * 36) : 0,
      });
    }
  }

  return linhas;
})();
