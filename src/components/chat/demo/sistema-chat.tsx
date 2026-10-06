"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronsLeft,
  Clock3,
  Forward,
  Info,
  Megaphone,
  MessageSquare,
  Mic,
  MousePointerClick,
  Paperclip,
  Search,
  SendHorizontal,
  Sparkles,
  TriangleAlert,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { ScaledStage } from "@/components/demo/scaled-stage";
import {
  agente,
  aposAssumir,
  campanha,
  carla,
  contagensChat,
  conversasChat,
  empresaChat,
  supervisao,
  type BalaoChat,
  type ConversaChat,
  type TomSelo,
} from "./dados";

/**
 * Réplica navegável do NewSec Chat.
 *
 * Quatro telas, as que sustentam a promessa da página: o Atendimento (com as
 * abas Meu atendimento · Equipe · IA), a Supervisão, a configuração do
 * Assistente IA e uma campanha em andamento. O menu lista só o que foi
 * construído aqui — item que não abre nada frustra mais do que a lista curta.
 *
 * O gesto central do produto funciona de verdade: clicar em "Assumir e pausar
 * IA" tira a conversa da aba IA, põe em Meu atendimento e a IA para.
 */

export type TelaChat = "atendimento" | "supervisao" | "ia" | "campanhas";
type Escopo = "meu" | "equipe" | "ia";

const LARGURA = 1120;

const menu: { id: TelaChat; rotulo: string; Icone: LucideIcon }[] = [
  { id: "atendimento", rotulo: "Atendimento", Icone: MessageSquare },
  { id: "supervisao", rotulo: "Supervisão", Icone: BarChart3 },
  { id: "ia", rotulo: "Assistente IA", Icone: Sparkles },
  { id: "campanhas", rotulo: "Campanhas", Icone: Megaphone },
];

/** Evento que os cartões da página disparam para abrir uma tela da réplica. */
const EVENTO = "newsec-chat:tela";

export function abrirTelaDoChat(tela: TelaChat) {
  window.dispatchEvent(new CustomEvent<TelaChat>(EVENTO, { detail: tela }));
  document.getElementById("central")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const tomSelo: Record<TomSelo, string> = {
  produto: "bg-chat-produto-50 text-chat-produto-800",
  alerta: "bg-chat-alerta-100 text-chat-alerta-700",
  ia: "bg-chat-ia-50 text-chat-ia-700",
  neutro: "bg-chat-bruma-100 text-chat-tinta-700",
  marca: "bg-[#fff0f2] text-[#a92234]",
  sucesso: "bg-chat-sucesso-100 text-chat-sucesso-700",
};

function Selo({ tom, children }: { tom: TomSelo; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${tomSelo[tom]}`}
    >
      {children}
    </span>
  );
}

function iniciais(nome: string) {
  return nome
    .split(" ")
    .map((parte) => parte[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ nome, pequeno = false }: { nome: string; pequeno?: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#6f869c] font-semibold text-white ${
        pequeno ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-[12px]"
      }`}
    >
      {iniciais(nome)}
    </span>
  );
}

const botaoPrimario =
  "inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded bg-chat-produto-700 px-3 text-[12px] font-medium text-white transition-colors hover:bg-chat-produto-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chat-produto-500 focus-visible:ring-offset-2";
const botaoLink =
  "inline-flex min-h-8 items-center justify-center gap-1.5 rounded border border-chat-produto-500 bg-white px-3 text-[12px] font-medium text-chat-produto-800";
const superficie = "rounded-lg border border-chat-bruma-200 bg-white p-4";

export function SistemaChat() {
  const [tela, setTela] = useState<TelaChat>("atendimento");
  const [assumida, setAssumida] = useState(false);
  const [escopo, setEscopo] = useState<Escopo>("ia");
  const [abertaId, setAbertaId] = useState("carla");

  // Os cartões da página abrem a tela correspondente sem recarregar nada.
  useEffect(() => {
    const aoPedir = (evento: Event) => setTela((evento as CustomEvent<TelaChat>).detail);
    window.addEventListener(EVENTO, aoPedir);
    return () => window.removeEventListener(EVENTO, aoPedir);
  }, []);

  const carlaAtual: ConversaChat = assumida
    ? {
        ...carla,
        ultimo: aposAssumir[1].texto,
        quem: "Marina",
        ha: "agora",
        selo: { texto: "Em atendimento", tom: "produto" },
        responsavel: empresaChat.usuario,
        mensagens: [...carla.mensagens, ...aposAssumir],
      }
    : carla;

  const listas: Record<Escopo, ConversaChat[]> = {
    meu: assumida ? [carlaAtual, ...conversasChat.meu] : conversasChat.meu,
    equipe: conversasChat.equipe,
    ia: assumida ? conversasChat.ia.slice(1) : conversasChat.ia,
  };
  const contagens = assumida
    ? { meu: contagensChat.meu + 1, equipe: contagensChat.equipe + 1, ia: contagensChat.ia - 1 }
    : contagensChat;

  function trocarEscopo(proximo: Escopo) {
    setEscopo(proximo);
    setAbertaId(listas[proximo][0].id);
  }

  function assumir() {
    setAssumida(true);
    setEscopo("meu");
    setAbertaId("carla");
  }

  function recomecar() {
    setAssumida(false);
    setEscopo("ia");
    setAbertaId("carla");
  }

  const lista = listas[escopo];
  const aberta = lista.find((conversa) => conversa.id === abertaId) ?? lista[0];

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-ink-700 bg-ink-900 p-2">
        <ScaledStage largura={LARGURA}>
          <div
            data-demo="true"
            className="chat-app flex h-[700px] overflow-hidden rounded border border-chat-bruma-200 bg-chat-tela"
          >
            <aside className="flex w-[168px] shrink-0 flex-col bg-chat-tinta-850 text-white">
              <div className="px-5 pb-6 pt-5">
                <strong className="block text-[27px] font-bold leading-none tracking-[-1.5px]">newsec</strong>
                <span className="mt-1 block text-[11px] font-semibold tracking-[1px] text-[#86abbf]">CHAT</span>
              </div>
              <nav aria-label="Telas do Chat" className="flex-1 px-2">
                {menu.map(({ id, rotulo, Icone }) => {
                  const ativo = id === tela;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTela(id)}
                      aria-current={ativo ? "page" : undefined}
                      className={`mb-1 flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-md border-l-[3px] px-2.5 py-2 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00ccf2] ${
                        ativo
                          ? "border-[#00ccf2] bg-[#07607e] font-semibold"
                          : "border-transparent hover:bg-white/10"
                      }`}
                    >
                      <Icone aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
                      {rotulo}
                    </button>
                  );
                })}
              </nav>
              <p className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-[11px] text-slate-300">
                <ChevronsLeft aria-hidden="true" className="h-4 w-4" />
                Recolher menu
              </p>
              <div className="flex items-center gap-2 border-t border-white/10 px-3 py-3.5">
                <Avatar nome={empresaChat.usuario} pequeno />
                <span className="min-w-0">
                  <span className="block truncate text-[11px]">{empresaChat.usuario}</span>
                  <span className="block truncate text-[10px] text-slate-300">
                    {empresaChat.papel} · {empresaChat.nome}
                  </span>
                </span>
              </div>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
              <header className="flex h-[50px] shrink-0 items-center justify-between gap-3 border-b border-chat-bruma-200 bg-white px-5 text-[13px]">
                <span className="flex items-center gap-2 text-chat-tinta-700">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#16835d]" />
                  {empresaChat.canal} conectado
                </span>
                <span className="inline-flex items-center gap-1.5 rounded border border-chat-bruma-300 px-2 py-1 text-[11px] font-medium text-chat-bruma-600">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-chat-bruma-300" />
                  Ambiente demonstrativo
                </span>
              </header>

              {/* `key` refaz a entrada a cada troca de tela. */}
              <div key={tela} className="chat-entra min-h-0 flex-1 overflow-hidden">
                {tela === "atendimento" ? (
                  <TelaAtendimento
                    escopo={escopo}
                    contagens={contagens}
                    lista={lista}
                    aberta={aberta}
                    assumida={assumida}
                    aoTrocarEscopo={trocarEscopo}
                    aoAbrir={setAbertaId}
                    aoAssumir={assumir}
                  />
                ) : tela === "supervisao" ? (
                  <TelaSupervisao aoAbrirAtendimento={() => setTela("atendimento")} />
                ) : tela === "ia" ? (
                  <TelaAgente />
                ) : (
                  <TelaCampanha />
                )}
              </div>
            </div>
          </div>
        </ScaledStage>
      </div>

      <p className="mt-3 flex flex-wrap items-start gap-x-2 gap-y-1 text-[12px] leading-relaxed text-fog-500">
        <MousePointerClick aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-300" />
        <span>
          Clique no menu, nas abas e em <strong className="font-semibold text-fog-300">Assumir e pausar IA</strong>.
          Ambiente demonstrativo, com nomes e telefones fictícios.
        </span>
        {assumida ? (
          <button
            type="button"
            onClick={recomecar}
            className="cursor-pointer font-semibold text-brand-300 underline-offset-4 hover:underline"
          >
            Devolver a conversa para a IA
          </button>
        ) : null}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Atendimento
   ------------------------------------------------------------------------- */

const abas: { id: Escopo; rotulo: string; ajuda: string }[] = [
  { id: "meu", rotulo: "Meu atendimento", ajuda: "Conversas atribuídas a você, em atendimento humano." },
  {
    id: "equipe",
    rotulo: "Equipe",
    ajuda: "Todo o atendimento humano, de todos os consultores e também o que ainda está sem responsável.",
  },
  {
    id: "ia",
    rotulo: "IA",
    ajuda: "Conversas que o assistente de IA está atendendo agora. Ninguém da equipe é responsável por elas.",
  },
];

function Balao({ balao }: { balao: BalaoChat }) {
  if (balao.de === "sistema") {
    return (
      <p className="mx-auto rounded-lg bg-chat-bruma-200 px-3 py-1.5 text-center text-[11px] text-chat-tinta-700">
        {balao.texto}
      </p>
    );
  }

  const classe =
    balao.de === "contato"
      ? "self-start bg-chat-bruma-100 text-chat-tinta-900"
      : balao.de === "ia"
        ? "self-end bg-chat-ia-50 text-chat-ia-700"
        : "self-end bg-chat-produto-50 text-chat-tinta-900";

  return (
    <div className={`max-w-[78%] rounded-lg px-3 py-2 text-[13px] leading-relaxed ${classe}`}>
      {/* Toda mensagem sai assinada com o nome de quem respondeu. */}
      {balao.autor ? <strong className="font-semibold">{balao.autor}: </strong> : null}
      {balao.texto}
      <span className="ml-2 text-[10px] opacity-60">{balao.hora}</span>
    </div>
  );
}

function TelaAtendimento({
  escopo,
  contagens,
  lista,
  aberta,
  assumida,
  aoTrocarEscopo,
  aoAbrir,
  aoAssumir,
}: {
  escopo: Escopo;
  contagens: Record<Escopo, number>;
  lista: ConversaChat[];
  aberta: ConversaChat;
  assumida: boolean;
  aoTrocarEscopo: (escopo: Escopo) => void;
  aoAbrir: (id: string) => void;
  aoAssumir: () => void;
}) {
  const comIa = escopo === "ia";
  const filtros = comIa
    ? [["Todas", contagens.ia], ["Com falha", 0]]
    : escopo === "meu"
      ? [["Novos", 1], ["Não respondidos", 1], ["Todos", contagens.meu]]
      : [["Novos", 4], ["Não respondidos", 4], ["Todos", contagens.equipe]];
  const ativo = filtros.length - (comIa ? 2 : 1);

  return (
    <div className="flex h-full bg-white">
      <div className="flex w-[292px] shrink-0 flex-col border-r border-chat-bruma-200">
        <div className="px-3 pt-3">
          <h3 className="mb-2 text-[17px] font-semibold text-chat-tinta-950">Atendimento</h3>

          <div role="tablist" aria-label="De quem são as conversas" className="grid grid-cols-3 gap-1 rounded-lg bg-chat-bruma-50 p-1">
            {abas.map((aba) => {
              const ativa = aba.id === escopo;

              return (
                <button
                  key={aba.id}
                  type="button"
                  role="tab"
                  aria-selected={ativa}
                  onClick={() => aoTrocarEscopo(aba.id)}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border px-1 py-1.5 text-center text-[11px] font-medium leading-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chat-produto-500 ${
                    ativa
                      ? "border-chat-produto-500 bg-chat-produto-50 text-chat-produto-800"
                      : "border-transparent text-chat-tinta-700 hover:bg-chat-bruma-100"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {aba.id === "ia" ? <Bot aria-hidden="true" className="h-3 w-3" /> : null}
                    {aba.rotulo}
                  </span>
                  <strong className="text-[15px] font-semibold leading-none">{contagens[aba.id]}</strong>
                </button>
              );
            })}
          </div>

          <p className="mb-2.5 mt-2 min-h-[42px] text-[11px] leading-snug text-chat-bruma-600">
            {abas.find((aba) => aba.id === escopo)?.ajuda}
          </p>

          <div className="flex h-8 items-center gap-2 rounded border border-chat-bruma-200 px-2.5">
            <Search aria-hidden="true" className="h-3.5 w-3.5 text-chat-bruma-600" />
            <span className="text-[12px] text-chat-bruma-600">Buscar nome ou telefone</span>
          </div>

          <div className="my-2.5 flex justify-between gap-1.5">
            {filtros.map(([rotulo, total], indice) => (
              <span
                key={rotulo}
                className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2 py-1.5 text-[11px] font-medium ${
                  indice === ativo
                    ? "border-chat-produto-700 bg-chat-produto-700 text-white"
                    : "border-chat-bruma-200 bg-chat-bruma-50 text-chat-tinta-700"
                }`}
              >
                {rotulo}
                <span className="rounded bg-black/5 px-1 text-[10px]">{total}</span>
              </span>
            ))}
          </div>
        </div>

        <ul className="min-h-0 flex-1 overflow-hidden">
          {lista.map((conversa) => {
            const ativa = conversa.id === aberta.id;

            return (
              <li key={conversa.id}>
                <button
                  type="button"
                  onClick={() => aoAbrir(conversa.id)}
                  aria-current={ativa ? "true" : undefined}
                  className={`mx-1.5 flex w-[calc(100%-12px)] cursor-pointer gap-2.5 rounded-md border px-2.5 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chat-produto-500 ${
                    ativa ? "border-chat-produto-500 bg-chat-produto-50" : "border-transparent hover:bg-chat-bruma-50"
                  }`}
                >
                  <Avatar nome={conversa.nome} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-1">
                      <span className={`truncate text-[12px] ${conversa.naoLidas ? "font-bold" : "font-semibold"}`}>
                        {conversa.nome}
                      </span>
                      <Selo tom={conversa.selo.tom}>{conversa.selo.texto}</Selo>
                    </span>
                    <span className="my-0.5 block truncate text-[12px] text-chat-tinta-700">{conversa.ultimo}</span>
                    <span className="flex items-center justify-between text-[10px] text-chat-bruma-600">
                      <span>
                        {conversa.quem} · {conversa.ha}
                      </span>
                      {conversa.naoLidas ? (
                        <span className="rounded-full bg-chat-produto-700 px-1.5 py-0.5 text-white">
                          {conversa.naoLidas}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2.5 border-b border-chat-bruma-200 px-4 py-2.5">
          <Avatar nome={aberta.nome} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-chat-tinta-950">{aberta.nome}</p>
            <p className="truncate text-[11px] text-chat-bruma-600">
              {aberta.telefone} · {empresaChat.canal}
            </p>
          </div>
          <span className={botaoLink}>
            <Forward aria-hidden="true" className="h-3.5 w-3.5" />
            Transferir
          </span>
          {comIa ? null : (
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded bg-chat-produto-700 px-3 text-[12px] font-medium text-white">
              <Check aria-hidden="true" className="h-3.5 w-3.5" />
              Concluir
            </span>
          )}
        </div>

        {comIa ? (
          <div className="flex items-center gap-2 bg-chat-ia-50 px-4 py-2 text-[12px] text-chat-ia-700">
            <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1">Assistente IA em atendimento</span>
            {aberta.id === "carla" ? (
              <button type="button" onClick={aoAssumir} className={botaoPrimario}>
                Assumir e pausar IA
              </button>
            ) : null}
          </div>
        ) : assumida && aberta.id === "carla" ? (
          <p className="flex items-center gap-2 bg-chat-produto-50 px-4 py-2 text-[12px] text-chat-produto-800">
            <Info aria-hidden="true" className="h-4 w-4 shrink-0" />
            Atendimento humano · a IA só retoma após uma ação explícita.
          </p>
        ) : null}

        <div key={aberta.id + String(aberta.mensagens.length)} className="chat-entra flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-4 py-3">
          {aberta.mensagens.map((balao, indice) => (
            <Balao key={indice} balao={balao} />
          ))}
        </div>

        <div className="border-t border-chat-bruma-200 px-4 py-2.5">
          <div className="flex items-center gap-4 text-[12px]">
            <span className="border-b-2 border-chat-produto-500 pb-1 font-semibold text-chat-produto-800">Mensagem</span>
            <span className="pb-1 text-chat-tinta-700">Nota interna</span>
            <span className="ml-auto pb-1 text-[11px] text-chat-bruma-600">Respostas rápidas</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate rounded border border-chat-bruma-200 px-3 py-2 text-[13px] text-chat-bruma-600">
              Escreva para {aberta.nome.split(" ")[0]}…
            </span>
            <Paperclip aria-hidden="true" className="h-4 w-4 shrink-0 text-chat-bruma-600" />
            <Mic aria-hidden="true" className="h-4 w-4 shrink-0 text-chat-bruma-600" />
            <span className="flex h-8 w-9 shrink-0 items-center justify-center rounded bg-chat-produto-700 text-white">
              <SendHorizontal aria-hidden="true" className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      <div className="w-[238px] shrink-0 overflow-hidden border-l border-chat-bruma-200 px-4 py-3.5">
        <h4 className="text-[13px] font-semibold text-chat-tinta-950">Contexto do contato</h4>

        <dl className="mt-3 space-y-1.5 text-[12px]">
          {[
            ["Responsável", aberta.responsavel],
            ["Departamento", aberta.equipe],
            ["Canal", empresaChat.canal],
            ["Origem", aberta.origem],
          ].map(([rotulo, valor]) => (
            <div key={rotulo} className="flex justify-between gap-2">
              <dt className="shrink-0 text-chat-bruma-600">{rotulo}</dt>
              <dd className="min-w-0 text-right text-chat-tinta-900">{valor}</dd>
            </div>
          ))}
        </dl>

        {aberta.etiquetas.length ? (
          <>
            <h5 className="mt-4 text-[12px] font-semibold text-chat-tinta-950">Etiquetas</h5>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {aberta.etiquetas.map((etiqueta) => (
                <Selo key={etiqueta} tom="produto">
                  {etiqueta}
                </Selo>
              ))}
            </div>
          </>
        ) : null}

        {aberta.coletados.length ? (
          <>
            <h5 className="mt-4 text-[12px] font-semibold text-chat-tinta-950">Dados coletados</h5>
            <dl className="mt-1.5 space-y-1 text-[12px]">
              {aberta.coletados.map(([rotulo, valor]) => (
                <div key={rotulo} className="flex justify-between gap-2">
                  <dt className="text-chat-bruma-600">{rotulo}</dt>
                  <dd className="text-right text-chat-tinta-900">{valor}</dd>
                </div>
              ))}
            </dl>
          </>
        ) : null}

        {aberta.resumo ? (
          <>
            <h5 className="mt-4 flex items-center gap-1 text-[12px] font-semibold text-chat-ia-700">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Resumo da IA
            </h5>
            <p className="mt-1.5 rounded bg-chat-bruma-50 p-2.5 text-[12px] leading-relaxed text-chat-tinta-900">
              {aberta.resumo}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Supervisão
   ------------------------------------------------------------------------- */

const iconesMetricas = [UserRound, Clock3, TriangleAlert, Sparkles];

function TelaSupervisao({ aoAbrirAtendimento }: { aoAbrirAtendimento: () => void }) {
  return (
    <div className="foco-rolagem h-full overflow-y-auto p-4">
      <h3 className="text-[17px] font-semibold text-chat-tinta-950">Supervisão da operação</h3>
      <p className="text-[12px] text-chat-bruma-600">Acompanhe as filas e distribua os atendimentos.</p>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {supervisao.metricas.map((metrica, indice) => {
          const Icone = iconesMetricas[indice];

          return (
            <div key={metrica.rotulo} className="flex items-center gap-3 rounded-lg border border-chat-bruma-200 bg-white p-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tomSelo[metrica.tom]}`}>
                <Icone aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[12px] text-chat-bruma-600">{metrica.rotulo}</p>
                <p className="text-[23px] font-semibold leading-tight text-chat-tinta-950">{metrica.valor}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="my-3 flex items-center gap-2 rounded border border-[#f9cb83] bg-chat-alerta-100/60 px-3 py-2 text-[12px] text-chat-alerta-700">
        <TriangleAlert aria-hidden="true" className="h-4 w-4 shrink-0" />
        {supervisao.metricas[0].valor} conversas aguardam atribuição
        <span className="ml-auto underline">Distribuir agora →</span>
      </p>

      <div className="grid grid-cols-[minmax(0,1fr)_286px] gap-3">
        <div className="min-w-0 space-y-3">
          <section className={superficie}>
            <h4 className="mb-2.5 text-[14px] font-semibold text-chat-tinta-950">Fila que precisa de atenção</h4>
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="bg-chat-bruma-50 text-chat-tinta-700">
                  {["Contato", "Equipe", "Responsável", "Situação", "Espera"].map((coluna) => (
                    <th key={coluna} className="border-b border-chat-bruma-200 px-2.5 py-2 font-medium">
                      {coluna}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {supervisao.fila.map((linha, indice) => (
                  <tr key={linha.nome} className={indice === 0 ? "bg-chat-produto-50" : ""}>
                    <td className="border-b border-chat-bruma-100 px-2.5 py-2">
                      <span className="flex items-center gap-2">
                        <Avatar nome={linha.nome} pequeno />
                        <span className="font-semibold text-chat-tinta-950">{linha.nome}</span>
                      </span>
                    </td>
                    <td className="border-b border-chat-bruma-100 px-2.5 py-2">{linha.equipe}</td>
                    <td className="border-b border-chat-bruma-100 px-2.5 py-2">{linha.responsavel}</td>
                    <td className="border-b border-chat-bruma-100 px-2.5 py-2">
                      <Selo tom={linha.selo.tom}>{linha.selo.texto}</Selo>
                    </td>
                    <td
                      className={`border-b border-chat-bruma-100 px-2.5 py-2 ${
                        linha.vencida ? "font-semibold text-[#a92234]" : ""
                      }`}
                    >
                      {linha.espera}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className={superficie}>
            <h4 className="text-[14px] font-semibold text-chat-tinta-950">Carga por consultor</h4>
            <p className="mb-2.5 text-[11px] text-chat-bruma-600">Contagens atuais; sem estimativa de capacidade.</p>
            <table className="w-full border-collapse text-left text-[12px]">
              <thead>
                <tr className="bg-chat-bruma-50 text-chat-tinta-700">
                  {["Consultor", "Abertas", "Para responder", "Vencidos"].map((coluna) => (
                    <th key={coluna} className="border-b border-chat-bruma-200 px-2.5 py-2 font-medium">
                      {coluna}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {supervisao.carga.map((linha) => (
                  <tr key={linha.nome}>
                    <td className="border-b border-chat-bruma-100 px-2.5 py-1.5">
                      <span className="flex items-center gap-2">
                        <Avatar nome={linha.nome} pequeno />
                        <span className="font-semibold text-chat-tinta-950">{linha.nome}</span>
                      </span>
                    </td>
                    <td className="border-b border-chat-bruma-100 px-2.5 py-1.5">{linha.abertas}</td>
                    <td className="border-b border-chat-bruma-100 px-2.5 py-1.5">{linha.responder}</td>
                    <td className="border-b border-chat-bruma-100 px-2.5 py-1.5">{linha.vencidos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <aside className={`${superficie} self-start`}>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-[14px] font-semibold text-chat-tinta-950">Atendimento em foco</h4>
            <Selo tom="ia">
              <Sparkles aria-hidden="true" className="h-3 w-3" />
              IA ativa
            </Selo>
          </div>
          <span className="flex items-center gap-2.5">
            <Avatar nome="Lívia Couto" />
            <span>
              <span className="block text-[12px] font-semibold text-chat-tinta-950">Lívia Couto</span>
              <span className="block text-[11px] text-chat-bruma-600">{empresaChat.canal}</span>
            </span>
          </span>
          <div className="my-3 space-y-2 border-y border-chat-bruma-200 py-3">
            <div className="rounded bg-chat-bruma-100 p-2 text-[12px] leading-relaxed">
              <span className="mb-0.5 block text-[10px] text-chat-bruma-600">Lívia Couto · 13:44</span>
              Quero cancelar e ninguém me responde.
            </div>
            <div className="rounded bg-chat-ia-50 p-2 text-[12px] leading-relaxed text-chat-ia-700">
              <span className="mb-0.5 block text-[10px] text-chat-bruma-600">{empresaChat.ia} · 13:44</span>
              Entendi, Lívia. Vou chamar uma pessoa da equipe para cuidar disso com você.
            </div>
          </div>
          <span className={`${botaoPrimario} w-full cursor-default`}>Assumir e pausar IA</span>
          <span className={`${botaoLink} mt-2 w-full`}>Transferir para equipe</span>
          <button
            type="button"
            onClick={aoAbrirAtendimento}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 text-[12px] text-chat-produto-800 hover:underline"
          >
            Abrir conversa completa
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
          <p className="mt-3 flex gap-2 border-t border-chat-bruma-200 pt-3 text-[11px] text-chat-bruma-600">
            <Info aria-hidden="true" className="h-4 w-4 shrink-0" />
            A IA só retoma após uma ação explícita.
          </p>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Assistente IA — configuração
   ------------------------------------------------------------------------- */

function TelaAgente() {
  return (
    <div className="foco-rolagem h-full overflow-y-auto p-4">
      <h3 className="text-[17px] font-semibold text-chat-tinta-950">Assistente IA</h3>
      <p className="text-[12px] text-chat-bruma-600">O que a IA sabe, como fala e quando passa para uma pessoa.</p>

      <div className="mt-2 flex gap-1 border-b border-chat-bruma-200">
        {["Monitoramento", "Configuração", "Versões", "Análise"].map((aba) => (
          <span
            key={aba}
            className={`border-b-2 px-4 py-2.5 text-[12px] ${
              aba === "Configuração"
                ? "border-chat-produto-500 font-semibold text-chat-produto-800"
                : "border-transparent text-chat-tinta-700"
            }`}
          >
            {aba}
          </span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_264px] gap-3">
        <div className="grid min-w-0 grid-cols-2 gap-3">
          {agente.blocos.map((bloco) => (
            <section key={bloco.titulo} className={superficie}>
              <h4 className="mb-2.5 text-[13px] font-semibold text-chat-tinta-950">{bloco.titulo}</h4>
              <div className="space-y-2">
                {bloco.campos.map(([rotulo, valor]) => (
                  <div key={rotulo}>
                    <p className="text-[11px] font-medium text-chat-tinta-700">{rotulo}</p>
                    <p className="mt-0.5 rounded border border-chat-bruma-200 bg-white px-2.5 py-1.5 text-[12px] leading-snug text-chat-tinta-900">
                      {valor}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="space-y-3">
          <section className={superficie}>
            <h4 className="text-[13px] font-semibold text-chat-tinta-950">Versões</h4>
            <div className="mt-2.5 flex items-center justify-between gap-2 text-[12px]">
              <span>Versão {agente.versao.publicada}</span>
              <Selo tom="sucesso">Publicada · no ar</Selo>
            </div>
            <div className="mt-2 flex items-center justify-between gap-2 text-[12px]">
              <span>Versão {agente.versao.rascunho}</span>
              <Selo tom="alerta">Rascunho</Selo>
            </div>
            <span className={`${botaoPrimario} mt-3 w-full cursor-default`}>Publicar versão {agente.versao.rascunho}</span>
            <p className="mt-3 flex gap-2 border-t border-chat-bruma-200 pt-3 text-[11px] leading-snug text-chat-bruma-600">
              <Info aria-hidden="true" className="h-4 w-4 shrink-0" />
              O que você edita fica em rascunho. A IA só passa a usar depois que alguém publica.
            </p>
          </section>

          <section className={superficie}>
            <h4 className="text-[13px] font-semibold text-chat-tinta-950">Horário de atendimento</h4>
            <p className="mt-2 text-[12px] text-chat-tinta-900">{agente.horario}</p>
            <p className="mt-2.5 text-[11px] font-medium text-chat-tinta-700">O que dizer fora do horário</p>
            <p className="mt-0.5 rounded border border-chat-bruma-200 px-2.5 py-1.5 text-[12px] leading-snug text-chat-tinta-900">
              {agente.foraDoHorario}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Campanha
   ------------------------------------------------------------------------- */

function TelaCampanha() {
  const [variacao, setVariacao] = useState<"A" | "B">("A");
  const feito = Math.round((campanha.hoje.enviadas / campanha.hoje.limite) * 100);

  return (
    <div className="foco-rolagem h-full overflow-y-auto p-4">
      <div className="flex items-center gap-3">
        <Megaphone aria-hidden="true" className="h-5 w-5 text-chat-produto-700" />
        <h3 className="text-[17px] font-semibold text-chat-tinta-950">{campanha.nome}</h3>
        <Selo tom="sucesso">{campanha.situacao}</Selo>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {campanha.metricas.map(([rotulo, valor]) => (
          <div key={rotulo} className="rounded-lg border border-chat-bruma-200 bg-white p-3">
            <p className="text-[12px] text-chat-bruma-600">{rotulo}</p>
            <p className="text-[23px] font-semibold leading-tight text-chat-tinta-950">{valor}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-3">
        <div className="space-y-3">
          <section className={superficie}>
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <h4 className="text-[13px] font-semibold text-chat-tinta-950">Mensagem</h4>
              <div role="tablist" aria-label="Variação da mensagem" className="flex gap-1">
                {(["A", "B"] as const).map((letra) => (
                  <button
                    key={letra}
                    type="button"
                    role="tab"
                    aria-selected={letra === variacao}
                    onClick={() => setVariacao(letra)}
                    className={`cursor-pointer rounded border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chat-produto-500 ${
                      letra === variacao
                        ? "border-chat-produto-500 bg-chat-produto-50 text-chat-produto-800"
                        : "border-chat-bruma-200 text-chat-tinta-700 hover:bg-chat-bruma-50"
                    }`}
                  >
                    Variação {letra}
                  </button>
                ))}
              </div>
            </div>
            <p className="min-h-[58px] rounded bg-chat-bruma-50 p-3 text-[13px] leading-relaxed text-chat-tinta-900">
              {campanha.variacoes[variacao]}
            </p>
            <p className="mt-2 text-[11px] text-chat-bruma-600">
              Cada contato recebe sempre a mesma variação. Sem valor para a variável, o contato é ignorado.
            </p>
          </section>

          <section className={superficie}>
            <h4 className="mb-2.5 text-[13px] font-semibold text-chat-tinta-950">Ritmo e horário</h4>
            <dl className="space-y-1.5 text-[12px]">
              {campanha.regras.map(([rotulo, valor]) => (
                <div key={rotulo} className="flex justify-between gap-2">
                  <dt className="text-chat-bruma-600">{rotulo}</dt>
                  <dd className="font-medium text-chat-tinta-900">{valor}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 flex justify-between text-[11px] text-chat-bruma-600">
              <span>Enviadas hoje</span>
              <span className="font-semibold text-chat-tinta-900">
                {campanha.hoje.enviadas} de {campanha.hoje.limite}
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-chat-bruma-100">
              <div className="h-full rounded-full bg-chat-produto-700" style={{ width: `${feito}%` }} />
            </div>
          </section>
        </div>

        <section className={`${superficie} self-start`}>
          <h4 className="mb-2.5 text-[13px] font-semibold text-chat-tinta-950">Destinatários</h4>
          <table className="w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className="bg-chat-bruma-50 text-chat-tinta-700">
                {["Contato", "Situação", "Enviado", "Observação"].map((coluna) => (
                  <th key={coluna} className="border-b border-chat-bruma-200 px-2.5 py-2 font-medium">
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campanha.destinatarios.map((linha) => (
                <tr key={linha.nome}>
                  <td className="border-b border-chat-bruma-100 px-2.5 py-2 font-semibold text-chat-tinta-950">
                    {linha.nome}
                  </td>
                  <td className="border-b border-chat-bruma-100 px-2.5 py-2">
                    <Selo tom={linha.tom}>{linha.situacao}</Selo>
                  </td>
                  <td className="border-b border-chat-bruma-100 px-2.5 py-2 text-chat-bruma-600">{linha.hora}</td>
                  <td className="border-b border-chat-bruma-100 px-2.5 py-2 text-chat-tinta-700">
                    {linha.obs === "IA retomou a conversa" ? (
                      <span className="inline-flex items-center gap-1 text-chat-ia-700">
                        <Sparkles aria-hidden="true" className="h-3 w-3" />
                        {linha.obs}
                      </span>
                    ) : (
                      linha.obs
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
