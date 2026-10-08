import { Bell, Bot, Menu, MessageSquarePlus, Moon, RefreshCw, Search } from "lucide-react";
import { atendimento } from "./data";
import { Pill, iniciais } from "./kit";

/**
 * O CRM no celular: a tela de Atendimento como ela aparece em tela estreita.
 *
 * No produto, abaixo de `md` a barra lateral vira uma gaveta aberta pelo botão
 * de menu, e o atendimento mostra uma coisa por vez — primeiro a lista, depois
 * a conversa. Esta é a lista, com as mesmas conversas fictícias da réplica
 * grande. Serve só para a imagem do topo da home (rota de captura), por isso
 * não tem estado nem clique.
 */
export function CelularCrm() {
  const lista = [...atendimento.conversas.meus, ...atendimento.conversas.ia].slice(0, 7);

  return (
    <div
      data-demo="true"
      data-tema="claro"
      className="crm-app flex h-full w-full flex-col bg-ns-surface text-ns-text"
    >
      {/* Barra do topo: menu, avisos, tema e a conta. */}
      <div className="flex items-center gap-2 border-b border-ns-border px-3 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ns-border text-ns-text">
          <Menu aria-hidden="true" className="h-[18px] w-[18px]" />
        </span>
        <span className="text-[19px] font-bold leading-none tracking-[-0.6px] text-ns-text">newsec</span>
        <span className="ml-auto flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-ns-border bg-ns-alt text-ns-muted">
            <Bell aria-hidden="true" className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ns-primary px-1 text-[10px] font-semibold text-white">
              3
            </span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-ns-border bg-ns-alt text-ns-muted">
            <Moon aria-hidden="true" className="h-4 w-4" />
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ns-primary/15 text-[11px] font-semibold text-ns-primary">
            MV
          </span>
        </span>
      </div>

      <div className="space-y-3 px-4 pb-3 pt-4">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-[20px] font-semibold leading-tight">Atendimento</h3>
            <p className="mt-1 flex items-center gap-1 text-[12px] text-ns-muted">
              <RefreshCw aria-hidden="true" className="h-3 w-3" />
              Atualizado às 14:41
            </p>
          </div>
          <span className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-ns-primary px-3.5 text-[14px] font-medium text-white">
            <MessageSquarePlus aria-hidden="true" className="h-4 w-4" />
            Nova
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-ns-border bg-ns-bg px-3 py-2.5">
          <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-ns-muted" />
          <span className="truncate text-[14px] text-ns-muted">Buscar por nome ou telefone</span>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-xl bg-ns-alt p-1">
          {atendimento.abas.map((aba) => {
            const ativa = aba.id === "meus";

            return (
              <span
                key={aba.id}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[14px] font-medium ${
                  ativa ? "bg-ns-surface text-ns-text shadow-sm" : "text-ns-muted"
                }`}
              >
                {aba.id === "ia" ? <Bot aria-hidden="true" className="h-4 w-4" /> : null}
                {aba.rotulo}
                <span
                  className={`rounded-full px-1.5 text-[11px] font-semibold ${
                    ativa ? "bg-ns-primary/12 text-ns-primary" : "bg-ns-border/70 text-ns-muted"
                  }`}
                >
                  {aba.total}
                </span>
              </span>
            );
          })}
        </div>

        <div className="flex gap-1.5 overflow-hidden">
          {atendimento.filtros.map((filtro, indice) => (
            <span
              key={filtro.rotulo}
              className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium ${
                indice === 0
                  ? "border-ns-primary/40 bg-ns-primary/10 text-ns-primary"
                  : "border-ns-border text-ns-muted"
              }`}
            >
              {filtro.rotulo}
              <span className="opacity-70">{filtro.total}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden border-t border-ns-border">
        {lista.map((conversa) => {
          const semNome = conversa.nome.startsWith("(");
          const naoLidas = "naoLidas" in conversa ? conversa.naoLidas : undefined;
          const selo = "selo" in conversa ? conversa.selo : undefined;

          return (
            <div key={conversa.id} className="flex gap-3 border-b border-ns-border px-4 py-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ns-alt text-[14px] font-semibold text-ns-muted">
                {semNome ? "?" : iniciais(conversa.nome)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className={`truncate text-[15px] ${naoLidas ? "font-bold" : "font-semibold"}`}>
                    {conversa.nome}
                  </span>
                  <span className="shrink-0 text-[12px] text-ns-muted">{conversa.quando}</span>
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-ns-muted">{conversa.previa}</span>
                <span className="mt-1.5 flex items-center justify-between gap-2">
                  {selo === "IA" ? (
                    <Pill tone="ia">
                      <Bot aria-hidden="true" className="h-3 w-3" />
                      IA atendendo
                    </Pill>
                  ) : selo ? (
                    <Pill tone="success">{selo}</Pill>
                  ) : (
                    <span className="truncate text-[12px] text-ns-muted">{conversa.responsavel}</span>
                  )}
                  {naoLidas ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ns-primary px-1.5 text-[11px] font-semibold text-white">
                      {naoLidas}
                    </span>
                  ) : null}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
