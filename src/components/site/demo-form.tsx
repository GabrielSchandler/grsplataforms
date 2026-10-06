"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { chatFinal, chatMensagens } from "@/content/chat";
import { finalCta } from "@/content/site";
import { focusFinal, focusMensagens } from "@/content/focus";
import { siteConfig, whatsappLink, type ProdutoId } from "@/lib/site-config";

const fields = [
  { name: "nome", label: "Nome", type: "text", autoComplete: "name", required: true },
  { name: "empresa", label: "Empresa", type: "text", autoComplete: "organization", required: true },
  { name: "cargo", label: "Cargo", type: "text", autoComplete: "organization-title", required: true },
  { name: "telefone", label: "Telefone", type: "tel", autoComplete: "tel", required: true },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email", required: true },
] as const;

/**
 * Cada produto pergunta o tamanho da operação com a unidade que importa nele:
 * o CRM cobra por usuário, o Focus por estação monitorada, e no Chat o que
 * dimensiona a conversa é quantas pessoas atendem.
 */
const porProduto = {
  crm: {
    cabecalho: "NewSec (CRM) — pedido de demonstração pelo site.",
    rotuloTamanho: "Tamanho da equipe",
    campoTamanho: "Tamanho da equipe",
    opcoes: ["1 a 5", "6 a 15", "16 a 40", "41 a 100", "Mais de 100"],
    sufixo: "pessoas",
    consentimento: finalCta.consent,
    enviar: finalCta.submit,
  },
  focus: {
    cabecalho: focusMensagens.formulario,
    rotuloTamanho: "Quantos computadores",
    campoTamanho: "Computadores",
    opcoes: ["1 a 10", "11 a 25", "26 a 50", "51 a 100", "Mais de 100"],
    sufixo: "computadores",
    consentimento: focusFinal.consent,
    enviar: focusFinal.submit,
  },
  chat: {
    cabecalho: chatMensagens.formulario,
    rotuloTamanho: "Quantas pessoas atendem pelo WhatsApp",
    campoTamanho: "Atendentes",
    opcoes: ["1 a 3", "4 a 10", "11 a 25", "26 a 50", "Mais de 50"],
    sufixo: "atendentes",
    consentimento: chatFinal.consent,
    enviar: chatFinal.submit,
  },
} as const;

/**
 * O envio monta a mensagem e abre o WhatsApp do visitante. Não há backend,
 * então o formulário nunca exibe confirmação de recebimento — quem confirma
 * é a própria conversa que abre.
 */
export function DemoForm({ produto = "crm" }: { produto?: ProdutoId }) {
  const [blocked, setBlocked] = useState(false);
  const config = porProduto[produto];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!siteConfig.hasWhatsapp) {
      setBlocked(true);
      return;
    }

    const data = new FormData(event.currentTarget);
    const message = [
      config.cabecalho,
      "",
      `Nome: ${data.get("nome")}`,
      `Empresa: ${data.get("empresa")}`,
      `Cargo: ${data.get("cargo")}`,
      `Telefone: ${data.get("telefone")}`,
      `E-mail: ${data.get("email")}`,
      `${config.campoTamanho}: ${data.get("equipe")}`,
    ].join("\n");

    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.name === "email" ? "sm:col-span-2" : ""}>
            <label
              htmlFor={field.name}
              className="block text-xs font-semibold uppercase tracking-wide text-fog-400"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required={field.required}
              className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-[15px] text-white placeholder:text-fog-600 focus:border-brand-500 focus:outline-none"
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <label
            htmlFor="equipe"
            className="block text-xs font-semibold uppercase tracking-wide text-fog-400"
          >
            {config.rotuloTamanho}
          </label>
          <select
            id="equipe"
            name="equipe"
            required
            defaultValue=""
            className="mt-2 w-full rounded-lg border border-ink-700 bg-ink-900 px-3 py-2.5 text-[15px] text-white focus:border-brand-500 focus:outline-none"
          >
            <option value="" disabled>
              Selecione
            </option>
            {config.opcoes.map((size) => (
              <option key={size} value={size}>
                {size} {config.sufixo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <input
          id="consentimento"
          name="consentimento"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 rounded border-ink-700 bg-ink-900 accent-brand-500"
        />
        <label htmlFor="consentimento" className="text-[13px] leading-relaxed text-fog-400">
          {config.consentimento} Leia a{" "}
          <Link
            href="/privacidade"
            className="text-white underline underline-offset-4"
            onClick={(event) => event.stopPropagation()}
          >
            política de privacidade
          </Link>
          .
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        {config.enviar}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </button>

      {blocked ? (
        <p
          role="alert"
          className="rounded-lg border border-brand-500 bg-brand-500/10 px-3 py-2.5 text-[13px] text-white"
        >
          O número de WhatsApp ainda não foi configurado neste ambiente. Defina
          <code className="mx-1 rounded bg-ink-800 px-1 py-0.5 text-[12px]">
            NEXT_PUBLIC_WHATSAPP
          </code>
          antes de publicar.
        </p>
      ) : null}
    </form>
  );
}
