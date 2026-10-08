import type { ReactNode } from "react";
import { CenaProduto, type CenaId } from "@/components/site/cena-produto";
import { Eyebrow } from "@/components/site/primitives";

/**
 * Primeira dobra dos três produtos.
 *
 * Uma estrutura só para CRM, Focus e Chat: o texto à esquerda, a cena do
 * produto (computador + celular) à direita, e a seção inteira com a altura da
 * tela. O que muda de um produto para outro é o texto, as chamadas e o fundo.
 *
 * - `min-h-[100svh]`: a dobra ocupa a tela inteira. `svh`, e não `vh`, para a
 *   barra de endereço do celular não empurrar o fim da seção para fora.
 * - No computador a cena passa da borda direita de propósito: uma tela
 *   cortada pela janela lê como "tem mais sistema aqui", e sobra largura para
 *   o texto.
 * - No celular a cena vem depois das chamadas e o aparelho sobe para o topo
 *   da janela, para aparecer já no primeiro quadro. Os botões ficam lado a
 *   lado quando cabem e quebram sozinhos quando não cabem.
 * - A linha de confiança só aparece em tela alta: num notebook de 768px ela
 *   empurrava o fim da dobra para fora da tela.
 * - A cascata de entrada é CSS puro (`hero-in`): nada aqui espera JavaScript.
 */
export function TopoProduto({
  produto,
  eyebrow,
  titulo,
  subtitulo,
  acoes,
  garantias = [],
  nota,
  fundo,
}: {
  produto: CenaId;
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  /** Os botões da dobra, na ordem de importância. */
  acoes: ReactNode;
  /** Afirmações curtas e verificáveis no produto. */
  garantias?: readonly string[];
  /** Linha de confiança, abaixo das garantias. */
  nota?: string;
  /** Camadas de fundo, atrás de tudo. */
  fundo?: ReactNode;
}) {
  return (
    <section id="topo" className="relative isolate overflow-hidden bg-ink-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {fundo}
      </div>

      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[82rem] content-center items-center gap-y-9 px-5 pb-14 pt-[8.75rem] sm:gap-y-11 sm:px-8 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.14fr)] lg:gap-x-14 lg:pb-14 lg:pt-28 xl:gap-x-20">
        <div className="max-w-xl">
          <div className="hero-in">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>

          <div className="hero-in" style={{ "--delay": "70ms" } as React.CSSProperties}>
            <h1 className="font-display mt-5 text-[2.1rem] leading-[1.07] font-semibold text-balance text-white sm:mt-6 sm:text-5xl lg:text-[3.05rem] xl:text-[3.5rem]">
              {titulo}
            </h1>
          </div>

          <div className="hero-in" style={{ "--delay": "150ms" } as React.CSSProperties}>
            <p className="measure mt-4 text-[15px] leading-relaxed text-fog-300 sm:mt-6 sm:text-lg">
              {subtitulo}
            </p>
          </div>

          <div className="hero-in" style={{ "--delay": "220ms" } as React.CSSProperties}>
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-9">
              {acoes}
            </div>
          </div>

          {garantias.length > 0 ? (
            <div className="hero-in hidden lg:block" style={{ "--delay": "260ms" } as React.CSSProperties}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {garantias.map((garantia) => (
                  <li
                    key={garantia}
                    className="rounded border border-ink-700 bg-ink-900/60 px-2.5 py-1 text-[12px] text-fog-300"
                  >
                    {garantia}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {nota ? (
            <div
              className="hero-in hidden [@media(min-width:1280px)_and_(min-height:860px)]:block"
              style={{ "--delay": "330ms" } as React.CSSProperties}
            >
              <p className="mt-6 flex max-w-md items-start gap-2.5 text-[13px] leading-relaxed text-fog-500">
                <span aria-hidden="true" className="mt-[0.62em] h-px w-5 shrink-0 bg-brand-500" />
                {nota}
              </p>
            </div>
          ) : null}
        </div>

        <div className="hero-in" style={{ "--delay": "300ms" } as React.CSSProperties}>
          <CenaProduto
            produto={produto}
            className="ml-[7%] mr-[-9%] sm:mx-auto sm:max-w-[38rem] lg:mx-0 lg:mr-[-22%] lg:max-w-none xl:mr-[-14%] 2xl:mr-[-6%]"
          />
        </div>
      </div>
    </section>
  );
}

/** Botão principal da dobra: vermelho, com a varredura de luz. */
export function AcaoPrincipal({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="sweep inline-flex min-h-[3.25rem] min-w-max flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-500 px-3 py-3.5 text-sm font-semibold text-white sm:flex-none sm:px-6"
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  );
}

/** Botão secundário: contorno. */
export function AcaoSecundaria({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex min-h-[3.25rem] min-w-max flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-ink-700 bg-ink-950/40 px-3 py-3.5 text-sm font-semibold text-white transition-colors hover:border-fog-600 sm:flex-none sm:px-6"
    >
      {children}
    </a>
  );
}
