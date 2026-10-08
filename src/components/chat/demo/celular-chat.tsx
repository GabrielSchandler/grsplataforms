import { ArrowLeft, Mic, Paperclip, SendHorizontal, Sparkles } from "lucide-react";
import { carla, empresaChat } from "./dados";

/**
 * O Chat no celular: a conversa aberta, como aparece em tela estreita.
 *
 * No produto, abaixo de 768px a central mostra a lista ou a conversa, uma de
 * cada vez, e o menu vira gaveta. Esta é a conversa da Carla ainda com a IA —
 * o mesmo momento da demonstração, com o botão "Assumir e pausar IA" à mão.
 * Serve só para a imagem do topo da página (rota de captura): sem estado.
 */
export function CelularChat() {
  return (
    <div data-demo="true" className="chat-app flex h-full w-full flex-col bg-white text-chat-tinta-900">
      <div className="flex items-center gap-3 border-b border-chat-bruma-200 px-3 py-3">
        <ArrowLeft aria-hidden="true" className="h-5 w-5 shrink-0 text-chat-tinta-700" />
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6f869c] text-[13px] font-semibold text-white">
          CM
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-semibold text-chat-tinta-950">{carla.nome}</span>
          <span className="block truncate text-[12px] text-chat-bruma-600">
            {carla.telefone} · {empresaChat.canal}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2 bg-chat-ia-50 px-3 py-2.5 text-[13px] text-chat-ia-700">
        <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1 leading-snug">Assistente IA em atendimento</span>
        <span className="inline-flex min-h-9 shrink-0 items-center rounded bg-chat-produto-700 px-3 text-[13px] font-medium text-white">
          Assumir e pausar IA
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 overflow-hidden bg-chat-tela px-3 py-4">
        {carla.mensagens.map((balao, indice) =>
          balao.de === "sistema" ? null : (
            <div
              key={indice}
              className={`max-w-[90%] rounded-lg px-3 py-2.5 text-[15px] leading-relaxed ${
                balao.de === "contato"
                  ? "self-start bg-white text-chat-tinta-900 shadow-[0_1px_0_rgba(16,36,56,0.06)]"
                  : "self-end bg-chat-ia-50 text-chat-ia-700"
              }`}
            >
              {balao.autor ? <strong className="font-semibold">{balao.autor}: </strong> : null}
              {balao.texto}
              <span className="ml-2 text-[11px] opacity-60">{balao.hora}</span>
            </div>
          ),
        )}
      </div>

      <div className="border-t border-chat-bruma-200 px-3 py-3">
        <div className="flex items-center gap-5 text-[13px]">
          <span className="border-b-2 border-chat-produto-500 pb-1 font-semibold text-chat-produto-800">
            Mensagem
          </span>
          <span className="pb-1 text-chat-tinta-700">Nota interna</span>
          <span className="ml-auto pb-1 text-[12px] text-chat-bruma-600">Respostas rápidas</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2.5">
          <span className="min-w-0 flex-1 truncate rounded border border-chat-bruma-200 px-3 py-2.5 text-[15px] text-chat-bruma-600">
            Escreva para Carla…
          </span>
          <Paperclip aria-hidden="true" className="h-5 w-5 shrink-0 text-chat-bruma-600" />
          <Mic aria-hidden="true" className="h-5 w-5 shrink-0 text-chat-bruma-600" />
          <span className="flex h-10 w-11 shrink-0 items-center justify-center rounded bg-chat-produto-700 text-white">
            <SendHorizontal aria-hidden="true" className="h-[18px] w-[18px]" />
          </span>
        </div>
      </div>
    </div>
  );
}
