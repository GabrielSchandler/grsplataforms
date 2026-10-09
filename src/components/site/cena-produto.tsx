/**
 * A cena do topo de cada produto: a tela no computador e, por cima dela, o
 * mesmo produto no celular.
 *
 * As duas são imagens, geradas por `npm run capture -- --hero` a partir das
 * réplicas em HTML (nunca por IA de imagem), com dados fictícios. Imagem e não
 * a réplica viva porque esta é a primeira dobra: ela precisa aparecer no
 * primeiro quadro, sem esperar JavaScript, e encolher junto com a tela sem
 * nenhum cálculo.
 *
 * A composição é a mesma nos três produtos, e o que muda é só o par de
 * imagens e a cor do brilho. O celular invade a janela de propósito: é a
 * sobreposição que diz "é o mesmo sistema, nos dois lugares".
 */

import { CenaMovimento } from "@/components/site/cena-movimento";

export type CenaId = "crm" | "focus" | "chat";

const cenas: Record<
  CenaId,
  { rotulo: string; brilho: string; contraluz: string; descricao: string }
> = {
  crm: {
    rotulo: "NewSec CRM",
    brilho: "rgba(82, 103, 245, 0.30)",
    contraluz: "rgba(110, 128, 255, 0.55)",
    descricao:
      "Painel comercial do NewSec CRM no computador e a tela de atendimento por WhatsApp no celular, com dados fictícios",
  },
  focus: {
    rotulo: "NewSec Focus",
    brilho: "rgba(34, 211, 238, 0.24)",
    contraluz: "rgba(64, 224, 245, 0.5)",
    descricao:
      "Visão geral do NewSec Focus no computador e o mesmo painel no celular, com dados fictícios",
  },
  chat: {
    rotulo: "NewSec Chat",
    brilho: "rgba(109, 74, 255, 0.28)",
    contraluz: "rgba(140, 110, 255, 0.55)",
    descricao:
      "Central de atendimento do NewSec Chat no computador e uma conversa aberta no celular, com dados fictícios",
  },
};

export function CenaProduto({ produto, className = "" }: { produto: CenaId; className?: string }) {
  return <Cena3D produto={produto} className={className} />;
}

/**
 * A cena, com volume.
 *
 * Luz: uma luz principal de cima e da esquerda (realce no aro de cima e na
 * borda esquerda, reflexo diagonal no vidro, tela um tom mais escura no canto
 * oposto) e uma contraluz na cor do produto, por trás e pela direita, que
 * descola os aparelhos do fundo preto.
 *
 * Sombra: a janela tem espessura (placas paralelas, em 3D) e sombra
 * longa; o celular, mais perto de quem olha, projeta sombra sobre a janela;
 * embaixo de tudo, uma sombra de contato segura a cena no "chão".
 *
 * Movimento (`CenaMovimento` + `.c3` em globals.css): ao abrir, a cena gira
 * até a pose de repouso; ao rolar, ela se endireita e o celular se descola,
 * subindo mais rápido que a janela; o reflexo corre pelo vidro. Com mouse, a
 * cena acompanha o ponteiro de leve.
 *
 * O efeito fica no objeto, nunca na tela: a imagem do sistema não recebe
 * filtro, desfoque nem distorção além da perspectiva — tem de continuar
 * legível. Sem JavaScript ou com movimento reduzido, a cena fica parada na
 * pose de repouso, com a mesma luz e sombra.
 */
function Cena3D({ produto, className }: { produto: CenaId; className: string }) {
  const cena = cenas[produto];

  return (
    <div
      data-demo="true"
      role="img"
      aria-label={cena.descricao}
      className={`cena-produto relative ${className}`}
      style={{ "--c3-contraluz": cena.contraluz } as React.CSSProperties}
    >
      {/* Brilho na cor do produto, atrás de tudo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[12%] -inset-y-[18%] rounded-full blur-[90px]"
        style={{ background: `radial-gradient(closest-side, ${cena.brilho}, transparent)` }}
      />

      <CenaMovimento className="c3">
        {/* Sombra de contato, fora do 3D: fica no "chão" e só abre e esmaece. */}
        <div aria-hidden="true" className="c3-chao" />

        <div className="c3-entrada">
          <div className="c3-palco">
            {/* A janela do computador, com espessura. */}
            <div className="c3-janela">
              <span aria-hidden="true" className="c3-fundo" />
              {/* Espessura: placas paralelas atrás da frente. */}
              <span aria-hidden="true" className="c3-placa" style={{ "--i": 1 } as React.CSSProperties} />
              <span aria-hidden="true" className="c3-placa" style={{ "--i": 2 } as React.CSSProperties} />
              <span aria-hidden="true" className="c3-placa" style={{ "--i": 3 } as React.CSSProperties} />
              <span aria-hidden="true" className="c3-placa" style={{ "--i": 4 } as React.CSSProperties} />
              <span aria-hidden="true" className="c3-placa" style={{ "--i": 5 } as React.CSSProperties} />

              <div className="c3-frente">
                <div className="flex h-8 items-center gap-1.5 border-b border-white/10 bg-ink-800 px-3.5 sm:h-9">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="mx-auto -translate-x-5 rounded-md bg-white/[0.06] px-3 py-0.5 text-[10px] font-medium tracking-wide text-fog-400 sm:text-[11px]">
                    {cena.rotulo}
                  </span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/img/hero/produto-${produto}.webp`}
                    alt=""
                    width={1600}
                    height={1000}
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-left-top"
                  />
                  {/* A sombra que o celular joga sobre a tela. */}
                  <span aria-hidden="true" className="c3-sombra-celular" />
                </div>

                {/* Luz sobre o vidro: tom, reflexo e aro. */}
                <span aria-hidden="true" className="c3-tom" />
                <span aria-hidden="true" className="c3-vidro">
                  <span className="c3-reflexo" />
                </span>
                <span aria-hidden="true" className="c3-aro" />
              </div>
            </div>

            {/* O celular, por cima do canto da janela e mais perto de quem olha. */}
            <div className="c3-celular-pos">
              <div className="c3-celular">

                <div className="c3-cel-corpo">
                  <span aria-hidden="true" className="c3-botao c3-botao-acao" />
                  <span aria-hidden="true" className="c3-botao c3-botao-vol1" />
                  <span aria-hidden="true" className="c3-botao c3-botao-vol2" />
                  <span aria-hidden="true" className="c3-botao c3-botao-lado" />

                  <div className="c3-cel-moldura">
                  <div className="c3-cel-tela">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/img/hero/produto-${produto}-celular.webp`}
                      alt=""
                      width={720}
                      height={1477}
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    {/* A câmera, sobre a tela. */}
                    <span className="absolute left-1/2 top-[1.6%] h-[2.4%] w-[26%] -translate-x-1/2 rounded-full bg-ink-950" />
                    <span aria-hidden="true" className="c3-vidro c3-vidro-cel">
                      <span className="c3-reflexo" />
                    </span>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CenaMovimento>
    </div>
  );
}
