/**
 * O que não depende do período escolhido: quem está fazendo o quê agora, as
 * estações e o último envio de cada uma, o diário de bordo e os registros
 * minuto a minuto.
 *
 * Tudo sai dos perfis de `dados.ts` e do "agora" fixo (sexta, 25/09/2026,
 * 16h40). Nada aqui lê o relógio: a réplica precisa desenhar igual no build
 * e no navegador.
 */

import { AGORA_MINUTOS, APPS, EMPRESA, EVENTOS, PESSOAS, type EstadoAgora, type EventoEstacao } from "./dados";
import { EQUIPES_POR_ID, escalaDe, ruido, tipoDoApp } from "./motor";
import type { TipoCategoria } from "./formato";

const pad = (n: number) => String(n).padStart(2, "0");

/** "16:39" → minutos atrás; "ontem 17:52" → idem, atravessando a meia-noite. */
function minutosDesde(rotulo: string): number {
  const ontem = rotulo.startsWith("ontem ");
  const [h, m] = rotulo.replace("ontem ", "").split(":").map(Number);
  const minuto = h * 60 + m;
  return ontem ? 24 * 60 - minuto + AGORA_MINUTOS : AGORA_MINUTOS - minuto;
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
  (a, b) => ORDEM_STATUS[a.status] - ORDEM_STATUS[b.status] || a.colaborador.localeCompare(b.colaborador, "pt-BR"),
);

/* ---------------------------------------------------------------- estações */

export type EstacaoDemo = {
  id: string;
  maquina: string;
  usuarioWindows: string;
  colaboradorId: string;
  colaborador: string;
  equipe: string;
  versao: string;
  ultimoEnvio: string;
  minutosSemEnvio: number;
  situacao: "RECENTE" | "ATRASADA";
  /** Só conta como problema se a escala da pessoa prevê expediente agora. */
  emExpedienteAgora: boolean;
};

export const ESTACOES: EstacaoDemo[] = PESSOAS.map((pessoa) => {
  const minutosSemEnvio = minutosDesde(pessoa.estacao.ultimoEnvio);
  const escala = escalaDe(pessoa);
  const emExpedienteAgora =
    AGORA_MINUTOS >= escala.inicio &&
    AGORA_MINUTOS < escala.fim &&
    !(AGORA_MINUTOS >= escala.intervaloInicio && AGORA_MINUTOS < escala.intervaloFim);
  return {
    id: pessoa.maquina,
    maquina: pessoa.maquina,
    usuarioWindows: pessoa.usuario,
    colaboradorId: pessoa.id,
    colaborador: pessoa.nome,
    equipe: EQUIPES_POR_ID[pessoa.equipeId].nome,
    versao: pessoa.estacao.versao,
    ultimoEnvio: pessoa.estacao.ultimoEnvio,
    minutosSemEnvio,
    situacao: minutosSemEnvio >= EMPRESA.limiarAtrasoMinutos ? "ATRASADA" : "RECENTE",
    emExpedienteAgora,
  } satisfies EstacaoDemo;
}).sort((a, b) => b.minutosSemEnvio - a.minutosSemEnvio);

/** As que pedem atenção: sem envio recente enquanto a escala prevê expediente. */
export const ATRASADAS = ESTACOES.filter((e) => e.situacao !== "RECENTE" && e.emExpedienteAgora);

/** Último envio de qualquer estação, para a nota do cabeçalho. */
export const ULTIMO_ENVIO = "16:39";

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
  hora: string;
  colaborador: string;
  maquina: string;
  alvo: string;
  titulo: string;
  estado: "ATIVO" | "OCIOSO" | "BLOQUEADO";
  tipo: TipoCategoria | null;
  teclas: number;
  cliques: number;
};

/**
 * Os últimos minutos recebidos: cada linha é um minuto de uma estação, o
 * detalhe por trás dos gráficos. Só a contagem de teclas e cliques — o agente
 * nunca guarda quais teclas.
 */
export const REGISTROS: RegistroDemo[] = (() => {
  const comSinal = PESSOAS.filter((pessoa) => pessoa.agora.estado !== "offline");
  const linhas: RegistroDemo[] = [];

  for (let recuo = 1; linhas.length < 40 && recuo < 30; recuo += 1) {
    const minuto = AGORA_MINUTOS - recuo;
    for (const pessoa of comSinal) {
      if (linhas.length >= 40) break;
      const r = (medida: string) => ruido(`${pessoa.id}|registro|${minuto}|${medida}`);
      const parado = pessoa.agora.estado === "ocioso" && recuo <= Number(/\d+/.exec(pessoa.agora.momento)?.[0] ?? 0);
      const bloqueado = !parado && r("bloqueio") < 0.03;
      const estado = bloqueado ? "BLOQUEADO" : parado ? "OCIOSO" : "ATIVO";
      const ativo = estado === "ATIVO";
      const alvo = pessoa.agora.dominio ?? pessoa.agora.processo;
      linhas.push({
        chave: `${pessoa.id}-${minuto}`,
        hora: `${pad(Math.floor(minuto / 60))}:${pad(minuto % 60)}`,
        colaborador: pessoa.nome,
        maquina: pessoa.maquina,
        alvo,
        titulo: pessoa.agora.titulo,
        estado,
        tipo: APPS.some((a) => a.alvo === alvo) ? tipoDoApp(alvo, {}) : null,
        teclas: ativo ? Math.round(pessoa.teclas * (0.4 + r("teclas") * 1.5)) : 0,
        cliques: ativo ? Math.round(pessoa.cliques * (0.4 + r("cliques") * 1.6)) : 0,
      });
    }
  }
  return linhas;
})();
