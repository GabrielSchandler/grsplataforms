"use client";

import { useState } from "react";
import {
  ArrowRightLeft,
  Bot,
  Check,
  FileSpreadsheet,
  MessageSquarePlus,
  Mic,
  Paperclip,
  RefreshCw,
  Search,
  SendHorizontal,
  StickyNote,
  UserCheck,
  Users,
  UsersRound,
} from "lucide-react";
import { BotaoTema, Screen } from "./chrome";
import { Pill, iniciais } from "./kit";
import { atendimento, chatInterno, type ConversaDemo, type MensagemDemo } from "./data";

/**
 * Atendimento por WhatsApp e chat interno, dentro do CRM.
 *
 * As duas telas ocupam a área inteira, sem o cabeçalho das outras: lista à
 * esquerda, conversa no meio. No Atendimento as abas e as conversas são
 * clicáveis de verdade — é a forma mais curta de mostrar o que a IA faz com o
 * contato novo e como a conversa chega à equipe.
 */

type AbaId = (typeof atendimento.abas)[number]["id"];

const tomDoEstado = {
  IA: "ia",
  "Em atendimento": "primary",
  "Aguardando atendente": "amber",
  "Aguardando cliente": "slate",
} as const;

function AvatarContato({ nome, grande = false }: { nome: string; grande?: boolean }) {
  // Contato que ainda não disse o nome aparece só com o telefone.
  const semNome = nome.startsWith("(");

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-ns-alt font-semibold text-ns-muted ${
        grande ? "h-10 w-10 text-[13px]" : "h-9 w-9 text-[12px]"
      }`}
    >
      {semNome ? "?" : iniciais(nome)}
    </span>
  );
}

function Mensagem({ mensagem }: { mensagem: MensagemDemo }) {
  if (mensagem.de === "sistema") {
    return (
      <p className="mx-auto rounded-full bg-ns-alt px-3 py-1 text-[10px] text-ns-muted">
        {mensagem.texto}
      </p>
    );
  }

  if (mensagem.de === "nota") {
    return (
      <div
        data-tour="nota-ia"
        className="self-stretch rounded-lg border border-dashed border-ns-warning/50 bg-ns-warning/10 px-3 py-2.5"
      >
        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-ns-warning">
          <StickyNote aria-hidden="true" className="h-3 w-3" />
          Nota interna — nunca vai para o cliente
        </p>
        <p className="mt-1.5 whitespace-pre-line text-[11px] leading-relaxed text-ns-text">
          {mensagem.texto}
        </p>
      </div>
    );
  }

  const doCliente = mensagem.de === "cliente";
  const daIa = mensagem.de === "ia";

  return (
    <div className={`max-w-[82%] ${doCliente ? "self-start" : "self-end"}`}>
      <div
        className={`rounded-xl px-3 py-2 text-[12px] leading-relaxed text-ns-text ${
          doCliente ? "bg-ns-alt" : daIa ? "bg-ns-ia/12" : "bg-ns-primary/12"
        }`}
      >
        {mensagem.autor ? (
          <span className={`mr-1 font-semibold ${daIa ? "text-ns-ia" : "text-ns-primary"}`}>
            {mensagem.autor}:
          </span>
        ) : null}
        {mensagem.texto}
      </div>
      <p className={`mt-0.5 text-[10px] text-ns-muted ${doCliente ? "" : "text-right"}`}>{mensagem.hora}</p>
    </div>
  );
}

export function AtendimentoWhatsApp() {
  const [aba, setAba] = useState<AbaId>("meus");
  const lista: ConversaDemo[] = atendimento.conversas[aba];
  const [abertaId, setAbertaId] = useState(lista[0].id);
  const aberta = lista.find((conversa) => conversa.id === abertaId) ?? lista[0];
  const comIa = aberta.estado === "IA";

  function trocarAba(proxima: AbaId) {
    setAba(proxima);
    setAbertaId(atendimento.conversas[proxima][0].id);
  }

  return (
    <Screen workspace="Comercial" active="Atendimento WhatsApp" title="Atendimento" semMoldura>
      <div className="flex min-h-0 flex-1 bg-ns-surface">
        {/* Lista: de quem é a conversa e o que falta fazer. */}
        <div className="flex w-[250px] shrink-0 flex-col border-r border-ns-border">
          <div className="space-y-2.5 px-3 pb-3 pt-3.5">
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold leading-tight text-ns-text">Atendimento</h3>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-ns-muted">
                  <RefreshCw aria-hidden="true" className="h-2.5 w-2.5" />
                  Atualizado às 14:41
                </p>
              </div>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-ns-primary px-2.5 text-[12px] font-medium text-white">
                <MessageSquarePlus aria-hidden="true" className="h-3.5 w-3.5" />
                Nova
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-ns-border bg-ns-bg px-2.5 py-2">
              <Search aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ns-muted" />
              <span className="truncate text-[12px] text-ns-muted">Buscar por nome ou telefone</span>
            </div>

            <div
              role="tablist"
              aria-label="De quem é a conversa"
              className="grid grid-cols-3 gap-1 rounded-xl bg-ns-alt p-1"
            >
              {atendimento.abas.map((item) => {
                const ativa = item.id === aba;

                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={ativa}
                    onClick={() => trocarAba(item.id)}
                    className={`flex cursor-pointer items-center justify-center gap-1 rounded-lg px-1.5 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ns-primary ${
                      ativa ? "bg-ns-surface text-ns-text shadow-sm" : "text-ns-muted hover:text-ns-text"
                    }`}
                  >
                    {item.id === "ia" ? <Bot aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                    {item.rotulo}
                    <span
                      className={`rounded-full px-1.5 text-[10px] font-semibold ${
                        ativa ? "bg-ns-primary/12 text-ns-primary" : "bg-ns-border/70 text-ns-muted"
                      }`}
                    >
                      {item.total}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Na aba da IA não há "lida" nem "respondida": ninguém da equipe assumiu ainda. */}
            {aba === "ia" ? (
              <p className="text-[10px] leading-snug text-ns-muted">
                Contatos novos ficam aqui, com a IA, até alguém assumir ou transferir.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {atendimento.filtros.map((filtro, indice) => (
                  <span
                    key={filtro.rotulo}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                      indice === 0
                        ? "border-ns-primary/40 bg-ns-primary/10 text-ns-primary"
                        : "border-ns-border text-ns-muted"
                    }`}
                  >
                    {filtro.rotulo}
                    {aba === "meus" ? <span className="opacity-70">{filtro.total}</span> : null}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 border-t border-ns-border">
            {lista.map((conversa) => {
              const ativa = conversa.id === aberta.id;

              return (
                <button
                  key={conversa.id}
                  type="button"
                  onClick={() => setAbertaId(conversa.id)}
                  aria-current={ativa ? "true" : undefined}
                  className={`flex w-full cursor-pointer gap-2.5 border-b border-ns-border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ns-primary ${
                    ativa ? "bg-ns-primary/[0.09]" : "hover:bg-ns-alt/60"
                  }`}
                >
                  <AvatarContato nome={conversa.nome} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span
                        className={`truncate text-[12px] text-ns-text ${
                          conversa.naoLidas ? "font-bold" : "font-semibold"
                        }`}
                      >
                        {conversa.nome}
                      </span>
                      <span className="shrink-0 text-[10px] text-ns-muted">{conversa.quando}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-ns-muted">{conversa.previa}</span>
                    <span className="mt-1 flex items-center justify-between gap-2">
                      {conversa.selo === "IA" ? (
                        <Pill tone="ia">
                          <Bot aria-hidden="true" className="h-3 w-3" />
                          IA atendendo
                        </Pill>
                      ) : conversa.selo ? (
                        <Pill tone="success">{conversa.selo}</Pill>
                      ) : (
                        <span className="truncate text-[10px] text-ns-muted">{conversa.responsavel}</span>
                      )}
                      {conversa.naoLidas ? (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-ns-primary px-1 text-[10px] font-semibold text-white">
                          {conversa.naoLidas}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversa aberta. */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2.5 border-b border-ns-border px-4 py-2.5">
            <AvatarContato nome={aberta.nome} grande />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ns-text">{aberta.nome}</p>
              <p className="truncate text-[11px] text-ns-muted">
                {aberta.telefone} · {atendimento.canal}
              </p>
            </div>
            {comIa ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-ns-primary px-2.5 py-1.5 text-[11px] font-semibold text-white">
                <UserCheck aria-hidden="true" className="h-3.5 w-3.5" />
                Assumir
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-ns-border px-2.5 py-1.5 text-[11px] font-semibold text-ns-text">
              <ArrowRightLeft aria-hidden="true" className="h-3.5 w-3.5" />
              Transferir
            </span>
            {comIa ? null : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-ns-border px-2.5 py-1.5 text-[11px] font-semibold text-ns-text">
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
                Concluir
              </span>
            )}
            <BotaoTema />
          </div>

          {/* `key` refaz a entrada das mensagens a cada conversa aberta. */}
          <div key={aberta.id} className="swap-in flex flex-1 flex-col justify-end gap-2 bg-ns-bg px-4 py-4">
            {aberta.mensagens.map((mensagem, indice) => (
              <Mensagem key={indice} mensagem={mensagem} />
            ))}
          </div>

          <div className="border-t border-ns-border px-4 py-3">
            {comIa ? (
              <p className="flex items-center gap-2 rounded-lg bg-ns-ia/10 px-3 py-2 text-[11px] leading-snug text-ns-ia">
                <Bot aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                A IA está respondendo. Quando alguém assume a conversa, ela para.
              </p>
            ) : (
              <>
                <div className="flex gap-3 text-[11px] font-semibold">
                  <span className="border-b-2 border-ns-primary pb-1 text-ns-primary">Mensagem</span>
                  <span className="pb-1 text-ns-muted">Nota interna</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Paperclip aria-hidden="true" className="h-4 w-4 shrink-0 text-ns-muted" />
                  <span className="min-w-0 flex-1 truncate rounded-xl border border-ns-border bg-ns-bg px-3 py-2 text-[12px] text-ns-muted">
                    Digite uma mensagem...
                  </span>
                  <Mic aria-hidden="true" className="h-4 w-4 shrink-0 text-ns-muted" />
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ns-primary text-white">
                    <SendHorizontal aria-hidden="true" className="h-4 w-4" />
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ficha do atendimento. */}
        <div className="w-[188px] shrink-0 border-l border-ns-border px-3.5 py-4">
          <h4 className="text-[10px] font-semibold uppercase text-ns-muted">Atendimento</h4>
          <dl className="mt-2">
            {[
              ["Status", <Pill key="status" tone={tomDoEstado[aberta.estado]}>{aberta.estado}</Pill>],
              ["Equipe", "Comercial"],
              ["Responsável", aberta.responsavel],
              ["Canal", atendimento.canal],
              ["Última atividade", aberta.quando === "Ontem" ? "Ontem" : `Hoje, ${aberta.quando}`],
            ].map(([rotulo, valor]) => (
              <div key={String(rotulo)} className="border-b border-ns-border py-2 last:border-0">
                <dt className="text-[10px] text-ns-muted">{rotulo}</dt>
                <dd className="mt-0.5 text-[12px] text-ns-text">{valor}</dd>
              </div>
            ))}
          </dl>

          <h4 className="mt-4 text-[10px] font-semibold uppercase text-ns-muted">Cliente no CRM</h4>
          {comIa ? (
            <p className="mt-2 text-[11px] leading-snug text-ns-muted">
              Ainda sem cadastro vinculado.
            </p>
          ) : (
            <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-ns-primary">
              <Users aria-hidden="true" className="h-3.5 w-3.5" />
              Abrir cadastro
            </p>
          )}
        </div>
      </div>
    </Screen>
  );
}

export function ChatInterno() {
  const { aberta } = chatInterno;

  return (
    <Screen workspace="Comercial" active="Chat interno" title="Chat interno" semMoldura>
      <div className="flex min-h-0 flex-1 bg-ns-surface">
        <div className="flex w-[250px] shrink-0 flex-col border-r border-ns-border">
          <div className="space-y-2.5 px-3 pb-3 pt-3.5">
            <div className="flex items-center gap-2">
              <h3 className="min-w-0 flex-1 whitespace-nowrap text-[15px] font-semibold text-ns-text">Chat interno</h3>
              <span className="rounded-lg border border-ns-border px-1.5 py-1 text-[10px] font-semibold text-ns-text">
                + Conversa
              </span>
              <span className="rounded-lg border border-ns-border px-1.5 py-1 text-[10px] font-semibold text-ns-text">
                Grupo
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-ns-border bg-ns-bg px-2.5 py-2">
              <Search aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ns-muted" />
              <span className="truncate text-[12px] text-ns-muted">Buscar conversa ou pessoa...</span>
            </div>
          </div>

          <div className="flex-1 border-t border-ns-border">
            {chatInterno.conversas.map((conversa, indice) => (
              <div
                key={conversa.nome}
                className={`flex gap-2.5 border-b border-ns-border px-3 py-2.5 ${
                  indice === 0 ? "bg-ns-primary/[0.09]" : ""
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ns-primary/12 text-[12px] font-semibold text-ns-primary">
                  {conversa.grupo ? (
                    <UsersRound aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    iniciais(conversa.nome.replace(/^Dra?\. /, ""))
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[12px] font-semibold text-ns-text">{conversa.nome}</span>
                    <span className="shrink-0 text-[10px] text-ns-muted">{conversa.quando}</span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] text-ns-muted">{conversa.previa}</span>
                    {conversa.naoLidas ? (
                      <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-ns-primary px-1 text-[10px] font-semibold text-white">
                        {conversa.naoLidas}
                      </span>
                    ) : null}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2.5 border-b border-ns-border px-4 py-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ns-primary/12 text-ns-primary">
              <UsersRound aria-hidden="true" className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ns-text">{aberta.nome}</p>
              <p className="text-[11px] text-ns-muted">{aberta.participantes} participantes</p>
            </div>
            <Search aria-hidden="true" className="h-4 w-4 text-ns-muted" />
            <BotaoTema />
          </div>

          <div className="flex flex-1 flex-col justify-end gap-2.5 bg-ns-bg px-4 py-4">
            {aberta.mensagens.map((mensagem) => {
              const minha = mensagem.autor === "Você";

              return (
                <div key={mensagem.hora} className={`max-w-[78%] ${minha ? "self-end" : "self-start"}`}>
                  {minha ? null : (
                    <p className="mb-0.5 text-[10px] font-semibold text-ns-primary">{mensagem.autor}</p>
                  )}
                  <div
                    className={`rounded-xl px-3 py-2 text-[12px] leading-relaxed text-ns-text ${
                      minha ? "bg-ns-primary/12" : "bg-ns-surface"
                    }`}
                  >
                    {"citando" in mensagem && mensagem.citando ? (
                      <p className="mb-1.5 border-l-2 border-ns-primary pl-2 text-[11px] text-ns-muted">
                        {mensagem.citando}
                      </p>
                    ) : null}
                    {mensagem.texto}
                    {"arquivo" in mensagem && mensagem.arquivo ? (
                      <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-ns-border px-2 py-1.5 text-[11px] font-medium">
                        <FileSpreadsheet aria-hidden="true" className="h-3.5 w-3.5 text-ns-success" />
                        {mensagem.arquivo}
                      </span>
                    ) : null}
                  </div>
                  <p className={`mt-0.5 text-[10px] text-ns-muted ${minha ? "text-right" : ""}`}>
                    {mensagem.hora}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 border-t border-ns-border px-4 py-3">
            <Paperclip aria-hidden="true" className="h-4 w-4 shrink-0 text-ns-muted" />
            <span className="min-w-0 flex-1 truncate rounded-xl border border-ns-border bg-ns-bg px-3 py-2 text-[12px] text-ns-muted">
              Mensagem
            </span>
            <Mic aria-hidden="true" className="h-4 w-4 shrink-0 text-ns-muted" />
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ns-primary text-white">
              <SendHorizontal aria-hidden="true" className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Screen>
  );
}
