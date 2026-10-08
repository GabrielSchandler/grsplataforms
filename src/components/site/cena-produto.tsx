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

export type CenaId = "crm" | "focus" | "chat";

const cenas: Record<CenaId, { rotulo: string; brilho: string; descricao: string }> = {
  crm: {
    rotulo: "NewSec CRM",
    brilho: "rgba(82, 103, 245, 0.30)",
    descricao:
      "Painel comercial do NewSec CRM no computador e a tela de atendimento por WhatsApp no celular, com dados fictícios",
  },
  focus: {
    rotulo: "NewSec Focus",
    brilho: "rgba(34, 211, 238, 0.24)",
    descricao:
      "Visão geral do NewSec Focus no computador e o mesmo painel no celular, com dados fictícios",
  },
  chat: {
    rotulo: "NewSec Chat",
    brilho: "rgba(109, 74, 255, 0.28)",
    descricao:
      "Central de atendimento do NewSec Chat no computador e uma conversa aberta no celular, com dados fictícios",
  },
};

export function CenaProduto({ produto, className = "" }: { produto: CenaId; className?: string }) {
  const cena = cenas[produto];

  return (
    // data-demo: peça de produto, fora da auditoria de contraste do site.
    <div
      data-demo="true"
      role="img"
      aria-label={cena.descricao}
      className={`cena-produto relative ${className}`}
    >
      {/* Brilho na cor do produto, atrás de tudo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-[12%] -inset-y-[18%] rounded-full blur-[90px]"
        style={{ background: `radial-gradient(closest-side, ${cena.brilho}, transparent)` }}
      />

      {/* A janela do computador. */}
      <div className="cena-janela relative overflow-hidden rounded-xl border border-white/10 bg-ink-900 shadow-[0_50px_140px_rgba(0,0,0,0.7)]">
        <div className="flex h-8 items-center gap-1.5 border-b border-white/10 bg-ink-800/80 px-3.5 sm:h-9">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="mx-auto -translate-x-5 rounded-md bg-white/[0.06] px-3 py-0.5 text-[10px] font-medium tracking-wide text-fog-400 sm:text-[11px]">
            {cena.rotulo}
          </span>
        </div>
        <div className="relative aspect-[16/10] bg-white">
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
        </div>
      </div>

      {/* O celular, por cima do canto da janela. */}
      <div className="cena-celular absolute left-[-7%] top-[20%] w-[31%] lg:bottom-[-9%] lg:left-[-5%] lg:top-auto lg:w-[25%]">
        <div className="relative rounded-[13%/6.2%] border border-white/15 bg-ink-950 p-[4.5%] shadow-[0_30px_80px_rgba(0,0,0,0.75)]">
          <div className="relative aspect-[390/800] overflow-hidden rounded-[10%/4.9%] bg-white">
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
          </div>
        </div>
      </div>
    </div>
  );
}
