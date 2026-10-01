"use client";

import { useState } from "react";
import {
  BarChart2,
  Building2,
  Clock,
  House,
  Info,
  LayoutGrid,
  LogOut,
  MoreHorizontal,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { EMPRESA, USUARIO } from "./dados";
import { useFocus, type TelaId } from "./estado";
import { cn } from "./formato";
import { iniciais } from "./kit";
import { TelaAplicativos } from "./tela-aplicativos";
import { TelaDispositivos } from "./tela-dispositivos";
import { TelaEquipe, TelaEquipes } from "./tela-equipes";
import { TelaJornada } from "./tela-jornada";
import { TelaPessoa, TelaPessoas } from "./tela-pessoas";
import { TelaRelatorios } from "./tela-relatorios";
import { TelaVisao } from "./tela-visao";

/**
 * A casca do painel do Focus: barra lateral azul-marinho (o único bloco
 * escuro da tela), barra de topo com a empresa e a área de conteúdo, que rola
 * por dentro como numa janela de aplicativo. No celular, as abas de baixo —
 * três fixas e o "Mais", o mesmo desenho do painel instalado no telefone.
 *
 * A raiz leva `data-demo`: a auditoria de contraste do site não se aplica
 * aqui, porque estas cores são as do produto, não as da página.
 */

export const LARGURA_DESKTOP = 1240;
export const ALTURA_DESKTOP = 780;
export const LARGURA_CELULAR = 390;
export const ALTURA_CELULAR = 740;

type ItemMenu = { id: TelaId; rotulo: string; Icone: typeof House };

/** O menu do painel desde 16/09/2026 (newsecfocus `lib/menu.ts`). */
const MENU: ItemMenu[] = [
  { id: "visao", rotulo: "Visão geral", Icone: House },
  { id: "equipes", rotulo: "Equipes", Icone: Users },
  { id: "pessoas", rotulo: "Pessoas", Icone: User },
  { id: "aplicativos", rotulo: "Aplicativos e sites", Icone: LayoutGrid },
  { id: "jornada", rotulo: "Jornada", Icone: Clock },
  { id: "relatorios", rotulo: "Relatórios", Icone: BarChart2 },
];

/** As abas fixas do celular: o que o gestor abre para ver como está o time. */
const ABAS_CELULAR: TelaId[] = ["visao", "pessoas", "equipes"];

function estaAtivo(tela: TelaId, item: TelaId): boolean {
  if (item === "pessoas") return tela === "pessoas" || tela === "pessoa";
  if (item === "equipes") return tela === "equipes" || tela === "equipe";
  return tela === item;
}

export function TelaFocus({ id }: { id: TelaId }) {
  switch (id) {
    case "visao":
      return <TelaVisao />;
    case "equipes":
      return <TelaEquipes />;
    case "equipe":
      return <TelaEquipe />;
    case "pessoas":
      return <TelaPessoas />;
    case "pessoa":
      return <TelaPessoa />;
    case "aplicativos":
      return <TelaAplicativos />;
    case "jornada":
      return <TelaJornada />;
    case "relatorios":
      return <TelaRelatorios />;
    case "dispositivos":
      return <TelaDispositivos />;
  }
}

export function CascaFocus() {
  const { layout } = useFocus();
  return layout === "celular" ? <CascaCelular /> : <CascaDesktop />;
}

function CascaDesktop() {
  const { tela, pessoaId, equipeId } = useFocus();

  return (
    <div data-demo="true" className="foco-app relative flex overflow-hidden bg-foco-fundo" style={{ height: ALTURA_DESKTOP }}>
      <BarraLateral />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <BarraTopo />
        <main data-rolagem="true" className="foco-rolagem flex-1 overflow-y-auto p-6">
          <div key={`${tela}-${pessoaId}-${equipeId}`} className="foco-entra">
            <TelaFocus id={tela} />
          </div>
        </main>
      </div>
      <Nota />
    </div>
  );
}

function CascaCelular() {
  const { tela, pessoaId, equipeId } = useFocus();

  return (
    <div data-demo="true" className="foco-app relative flex flex-col overflow-hidden bg-foco-fundo" style={{ height: ALTURA_CELULAR }}>
      <BarraTopo />
      <main data-rolagem="true" className="foco-rolagem flex-1 overflow-y-auto p-4 pb-24">
        <div key={`${tela}-${pessoaId}-${equipeId}`} className="foco-entra">
          <TelaFocus id={tela} />
        </div>
      </main>
      <NavegacaoInferior />
      <Nota />
    </div>
  );
}

/** Símbolo NewSec + "FOCUS", como `components/marca.tsx` do painel. */
function MarcaFocus() {
  return (
    <span className="flex items-center gap-2.5 text-white">
      <LogoMark className="h-8 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-extrabold uppercase tracking-[0.02em]">NewSec</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300">Focus</span>
      </span>
    </span>
  );
}

function BarraLateral() {
  const { tela, abrirTela, navegavel } = useFocus();

  const item = (m: ItemMenu) => {
    const ativo = estaAtivo(tela, m.id);
    return (
      <li key={m.id}>
        <button
          type="button"
          tabIndex={navegavel ? undefined : -1}
          aria-current={ativo ? "page" : undefined}
          onClick={() => navegavel && abrirTela(m.id)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors",
            ativo ? "bg-foco-marinho-ativo font-medium text-white" : "text-foco-marinho-texto hover:bg-white/5 hover:text-white",
          )}
        >
          <m.Icone aria-hidden="true" className={cn("h-5 w-5 shrink-0", ativo ? "text-cyan-300" : "text-foco-marinho-texto/80")} strokeWidth={1.75} />
          {m.rotulo}
        </button>
      </li>
    );
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-foco-marinho text-white">
      <div className="px-6 pb-6 pt-5">
        <MarcaFocus />
      </div>
      <nav aria-label="Navegação do painel" className="flex flex-1 flex-col px-3">
        <ul className="flex flex-col gap-1">{MENU.map(item)}</ul>
        <ul className="mt-auto flex flex-col gap-1 pb-3">
          <li>
            <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] text-foco-marinho-texto/70" title="Escalas, equipes, classificação e acessos — fora da demonstração">
              <Settings aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.75} />
              Administração
            </span>
          </li>
        </ul>
      </nav>
      <div className="mx-4 flex items-center gap-3 border-t border-foco-marinho-borda px-1 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-500/60 text-[12px] font-semibold text-white">
          {iniciais(USUARIO.nome)}
        </span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[13px] font-medium text-white">{USUARIO.nome}</span>
          <span className="block truncate text-[11.5px] text-foco-marinho-texto">{USUARIO.papel}</span>
        </span>
        <LogOut aria-hidden="true" className="h-4 w-4 shrink-0 text-foco-marinho-texto" />
      </div>
    </aside>
  );
}

/** Faixa do topo: de quem são os números (a empresa) e quem está olhando. */
function BarraTopo() {
  const { layout } = useFocus();
  const celular = layout === "celular";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-foco-borda bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        {celular && <LogoMark className="h-7 w-auto shrink-0 text-foco-tinta" />}
        <div className={cn("flex min-w-0 items-center gap-2.5 rounded-lg", !celular && "h-10 border border-foco-borda px-3")}>
          {!celular && <Building2 aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-slate-600" />}
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[14px] font-medium text-slate-900">{EMPRESA.nome}</p>
            {celular && <p className="truncate text-[11px] text-slate-500">{USUARIO.papel}</p>}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden items-center rounded-full border border-foco-acao/20 bg-foco-acao-suave px-3 py-1 text-[11.5px] font-medium text-foco-acao sm:inline-flex">
          Ambiente demonstrativo
        </span>
        {!celular && (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-500 text-[12px] font-semibold text-white">
            {iniciais(USUARIO.nome)}
          </span>
        )}
      </div>
    </header>
  );
}

function NavegacaoInferior() {
  const { tela, abrirTela, navegavel } = useFocus();
  const [mais, setMais] = useState(false);
  const fixas = MENU.filter((m) => ABAS_CELULAR.includes(m.id));
  const resto = MENU.filter((m) => !ABAS_CELULAR.includes(m.id));
  const maisAtivo = resto.some((m) => estaAtivo(tela, m.id)) || tela === "dispositivos";

  return (
    <>
      {mais && (
        <div className="absolute inset-0 z-20 flex flex-col justify-end bg-slate-900/40" onClick={() => setMais(false)}>
          <div className="rounded-t-2xl bg-white p-4 pb-24" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[14px] font-semibold text-slate-900">Mais</p>
              <button type="button" aria-label="Fechar" onClick={() => setMais(false)} className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-1">
              {resto.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => {
                      abrirTela(m.id);
                      setMais(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[14px]",
                      estaAtivo(tela, m.id) ? "bg-foco-acao-suave font-medium text-foco-acao" : "text-slate-700 hover:bg-slate-50",
                    )}
                  >
                    <m.Icone aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
                    {m.rotulo}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <nav aria-label="Navegação do painel" className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-foco-borda bg-white pb-2 pt-1.5">
        {fixas.map((m) => {
          const ativo = estaAtivo(tela, m.id);
          return (
            <button
              key={m.id}
              type="button"
              tabIndex={navegavel ? undefined : -1}
              onClick={() => navegavel && abrirTela(m.id)}
              className={cn("flex flex-col items-center gap-1 py-1 text-[11px]", ativo ? "font-medium text-foco-acao" : "text-slate-500")}
            >
              <m.Icone aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
              {m.rotulo}
            </button>
          );
        })}
        <button
          type="button"
          tabIndex={navegavel ? undefined : -1}
          onClick={() => navegavel && setMais(true)}
          className={cn("flex flex-col items-center gap-1 py-1 text-[11px]", maisAtivo ? "font-medium text-foco-acao" : "text-slate-500")}
        >
          <MoreHorizontal aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
          Mais
        </button>
      </nav>
    </>
  );
}

/** Recado curto quando o visitante aciona algo que, no painel, faria mais. */
function Nota() {
  const { nota } = useFocus();
  if (!nota) return null;
  return (
    <div role="status" className="pointer-events-none absolute inset-x-0 bottom-20 z-40 flex justify-center px-4">
      <p className="foco-entra flex max-w-md items-start gap-2 rounded-lg bg-foco-tinta px-4 py-3 text-[12.5px] leading-relaxed text-white shadow-lg">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
        {nota}
      </p>
    </div>
  );
}
