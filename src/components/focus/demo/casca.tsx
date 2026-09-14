"use client";

import { useState } from "react";
import {
  Activity,
  AlarmClockCheck,
  AppWindow,
  ChevronRight,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  MonitorSmartphone,
  MoreHorizontal,
  PlugZap,
  ScrollText,
  UserRound,
  UserSquare2,
  Users,
  X,
} from "lucide-react";
import { EMPRESA, USUARIO } from "./dados";
import { useFocus, type TelaId } from "./estado";
import { cn } from "./formato";
import { TelaFocus } from "./telas";
import { ESTACAO_PARADA } from "./vivo";

/**
 * A casca do painel do Focus: barra lateral, barra de topo e a área de
 * conteúdo, que rola por dentro como numa janela de aplicativo. No celular,
 * as abas de baixo — o mesmo desenho do painel instalado no telefone.
 *
 * A raiz leva `data-demo`: a auditoria de contraste do site não se aplica
 * aqui, porque estas cores são as do produto, não as da página.
 */

export const LARGURA_DESKTOP = 1200;
export const ALTURA_DESKTOP = 764;
export const LARGURA_CELULAR = 390;
export const ALTURA_CELULAR = 712;

type ItemMenu = { id: TelaId; rotulo: string; Icone: typeof LayoutDashboard };

const MENU: ItemMenu[] = [
  { id: "visao", rotulo: "Visão geral", Icone: LayoutDashboard },
  { id: "equipes", rotulo: "Equipes", Icone: Users },
  { id: "pessoas", rotulo: "Pessoas", Icone: UserSquare2 },
  { id: "aplicativos", rotulo: "Aplicativos", Icone: AppWindow },
  { id: "dispositivos", rotulo: "Dispositivos", Icone: MonitorSmartphone },
  { id: "horas-extras", rotulo: "Horas extras", Icone: AlarmClockCheck },
  { id: "registros", rotulo: "Registros", Icone: ScrollText },
  { id: "relatorios", rotulo: "Relatórios", Icone: FileSpreadsheet },
];

/** As quatro abas do celular: o que o gestor abre para ver como está o time. */
const ABAS_CELULAR: TelaId[] = ["visao", "pessoas", "equipes", "horas-extras"];

function estaAtivo(tela: TelaId, item: TelaId): boolean {
  if (item === "pessoas") return tela === "pessoas" || tela === "pessoa";
  return tela === item;
}

export function CascaFocus() {
  const { layout } = useFocus();
  return layout === "celular" ? <CascaCelular /> : <CascaDesktop />;
}

function CascaDesktop() {
  const { tela } = useFocus();

  return (
    <div
      data-demo="true"
      className="foco-app relative flex overflow-hidden bg-foco-fundo"
      style={{ height: ALTURA_DESKTOP }}
    >
      <div aria-hidden="true" className="foco-aurora" />
      <BarraLateral />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <BarraTopo />
        <main
          data-rolagem="true"
          className="foco-rolagem flex-1 space-y-4 overflow-y-auto p-6"
        >
          <AvisoEstacaoParada />
          <TelaFocus id={tela} />
        </main>
      </div>

      <Nota />
    </div>
  );
}

function CascaCelular() {
  const { tela } = useFocus();

  return (
    <div
      data-demo="true"
      className="foco-app relative flex flex-col overflow-hidden bg-foco-fundo"
      style={{ height: ALTURA_CELULAR }}
    >
      <div aria-hidden="true" className="foco-aurora" />
      <BarraTopo />

      <main data-rolagem="true" className="foco-rolagem flex-1 space-y-4 overflow-y-auto p-4 pb-20">
        <AvisoEstacaoParada />
        <TelaFocus id={tela} />
      </main>

      <NavegacaoInferior />
      <Nota />
    </div>
  );
}

function BarraLateral() {
  const { tela, abrirTela, navegavel } = useFocus();

  return (
    <aside
      className="relative flex w-60 shrink-0 flex-col border-r border-foco-borda bg-foco-suave/60"
      data-tour="menu"
    >
      <div className="flex items-center gap-2.5 px-6 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-cyan-400 to-violet-500 foco-glow">
          <Activity aria-hidden="true" className="h-5 w-5 text-slate-950" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-100">NewSec</p>
          <p className="text-xs text-slate-500">Focus</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2" aria-label="Telas do painel">
        {MENU.map(({ id, rotulo, Icone }) => {
          const ativo = estaAtivo(tela, id);
          const classe = cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            ativo
              ? "bg-cyan-500/10 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.2)]"
              : "text-slate-400",
          );

          if (!navegavel) {
            return (
              <span key={id} className={classe}>
                <Icone aria-hidden="true" className="h-4 w-4 shrink-0" />
                {rotulo}
              </span>
            );
          }

          return (
            <button
              key={id}
              type="button"
              onClick={() => abrirTela(id)}
              aria-current={ativo ? "page" : undefined}
              className={cn(classe, !ativo && "hover:bg-slate-800/50 hover:text-slate-200")}
            >
              <Icone aria-hidden="true" className="h-4 w-4 shrink-0" />
              {rotulo}
            </button>
          );
        })}
      </nav>

      {/* O painel traz aqui uma frase sobre a coleta. Na réplica ela diz o que
          o agente faz, sem selo de conformidade — a regra do site vale também
          para o texto que aparece dentro da tela demonstrativa. */}
      <div className="border-t border-foco-borda px-6 py-4">
        <p className="text-xs leading-relaxed text-slate-600">
          Coleta só metadados de uso. Sem conteúdo digitado nem captura de tela.
        </p>
      </div>
    </aside>
  );
}

function BarraTopo() {
  const { layout } = useFocus();
  const iniciais = USUARIO.nome.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-foco-borda bg-foco-fundo/80">
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {layout === "celular" ? (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-cyan-400 to-violet-500 foco-glow">
              <Activity aria-hidden="true" className="h-[18px] w-[18px] text-slate-950" />
            </span>
          ) : null}
          <div className="min-w-0 leading-tight">
            <h2 className="truncate text-base font-semibold text-slate-100">{EMPRESA.nome}</h2>
            <p className="truncate text-xs text-slate-500">
              {USUARIO.papel} · plano {EMPRESA.plano}
            </p>
          </div>
        </div>

        {layout === "desktop" ? (
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-2 rounded-lg border border-foco-borda bg-foco-suave px-2.5 py-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-xs font-medium text-cyan-200">
                {iniciais}
              </span>
              <span className="max-w-[180px] truncate text-xs text-slate-400">{USUARIO.email}</span>
            </span>

            <span className="inline-flex h-8 items-center gap-2 rounded-lg border border-foco-borda px-3 text-xs font-medium text-slate-200">
              <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
              Sair
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
}

/**
 * O aviso mais importante do produto: a máquina que parou de enviar. A tela
 * continua bonita com os números de ontem enquanto a coleta está morta.
 */
function AvisoEstacaoParada() {
  const { avisoFechado, fecharAviso, abrirTela } = useFocus();
  if (avisoFechado || !ESTACAO_PARADA) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-foco border border-amber-500/30 bg-amber-500/10 px-4 py-3">
      <PlugZap aria-hidden="true" className="h-5 w-5 shrink-0 text-amber-400" />
      <p className="min-w-0 flex-1 text-sm text-amber-100">
        <strong>1 estação parou de enviar</strong> — <strong>{ESTACAO_PARADA.maquina}</strong> não
        sincroniza {ESTACAO_PARADA.sincronizou}. O tempo dessa máquina não entra nos números até
        ela voltar.
      </p>
      <button
        type="button"
        onClick={() => abrirTela("dispositivos")}
        className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-medium text-slate-950"
      >
        Ver estações
      </button>
      <button
        type="button"
        onClick={fecharAviso}
        aria-label="Dispensar aviso"
        className="shrink-0 rounded-md p-1 text-amber-300/70"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
}

function NavegacaoInferior() {
  const { tela, abrirTela } = useFocus();
  const [aberto, setAberto] = useState(false);

  const abas = ABAS_CELULAR.map((id) => MENU.find((item) => item.id === id)!).filter(Boolean);
  const restantes = MENU.filter((item) => !ABAS_CELULAR.includes(item.id));
  const algumRestante = restantes.some((item) => estaAtivo(tela, item.id));

  return (
    <>
      <nav
        aria-label="Navegação do painel"
        className="absolute inset-x-0 bottom-0 z-40 border-t border-foco-borda bg-foco-fundo/90"
      >
        <div className="flex items-stretch">
          {abas.map(({ id, rotulo, Icone }) => {
            const ativo = estaAtivo(tela, id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => abrirTela(id)}
                aria-current={ativo ? "page" : undefined}
                className="relative flex flex-1 flex-col items-center gap-1 px-1 pb-2 pt-2.5"
              >
                <span
                  className={cn(
                    "absolute inset-x-4 top-0 h-0.5 rounded-full transition-opacity",
                    ativo
                      ? "bg-gradient-to-r from-cyan-400 to-violet-400 opacity-100"
                      : "opacity-0",
                  )}
                />
                <Icone
                  aria-hidden="true"
                  className={cn("h-[22px] w-[22px]", ativo ? "text-cyan-300" : "text-slate-500")}
                />
                <span
                  className={cn(
                    "max-w-full truncate text-[10px] font-medium leading-none",
                    ativo ? "text-cyan-300" : "text-slate-500",
                  )}
                >
                  {rotulo}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setAberto(true)}
            aria-expanded={aberto}
            className="relative flex flex-1 flex-col items-center gap-1 px-1 pb-2 pt-2.5"
          >
            <span
              className={cn(
                "absolute inset-x-4 top-0 h-0.5 rounded-full transition-opacity",
                algumRestante
                  ? "bg-gradient-to-r from-cyan-400 to-violet-400 opacity-100"
                  : "opacity-0",
              )}
            />
            <MoreHorizontal
              aria-hidden="true"
              className={cn("h-[22px] w-[22px]", algumRestante ? "text-cyan-300" : "text-slate-500")}
            />
            <span
              className={cn(
                "text-[10px] font-medium leading-none",
                algumRestante ? "text-cyan-300" : "text-slate-500",
              )}
            >
              Mais
            </span>
          </button>
        </div>
      </nav>

      {aberto ? (
        <div className="absolute inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setAberto(false)}
            className="absolute inset-0 bg-slate-950/70"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mais opções"
            className="absolute inset-x-0 bottom-0 max-h-[85%] overflow-y-auto rounded-t-3xl border-t border-foco-borda bg-foco-cartao"
          >
            <div className="sticky top-0 z-10 flex justify-center bg-foco-cartao pb-1 pt-3">
              <span className="h-1 w-10 rounded-full bg-slate-700" />
            </div>

            <div className="flex items-start justify-between gap-3 px-5 pb-4 pt-1">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br from-cyan-500/30 to-violet-500/30 text-sm font-semibold text-cyan-200">
                  {USUARIO.nome.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{USUARIO.nome}</p>
                  <p className="truncate text-xs text-slate-500">
                    {USUARIO.papel} · {EMPRESA.nome}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAberto(false)}
                aria-label="Fechar"
                className="shrink-0 rounded-lg p-2 text-slate-400"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <nav className="border-t border-foco-borda px-3 py-2">
              {restantes.map(({ id, rotulo, Icone }) => {
                const ativo = estaAtivo(tela, id);
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      abrirTela(id);
                      setAberto(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3.5 rounded-[12px] px-3 py-3.5 text-sm transition-colors",
                      ativo ? "bg-cyan-500/10 text-cyan-300" : "text-slate-300",
                    )}
                  >
                    <Icone aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
                    <span className="flex-1 text-left">{rotulo}</span>
                    <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-600" />
                  </button>
                );
              })}
            </nav>

            <nav className="border-t border-foco-borda px-3 py-2">
              <span className="flex w-full items-center gap-3.5 rounded-[12px] px-3 py-3.5 text-sm text-slate-300">
                <UserRound aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1 text-left">Minha conta</span>
                <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-600" />
              </span>
              <span className="flex w-full items-center gap-3.5 rounded-[12px] px-3 py-3.5 text-sm text-rose-300">
                <LogOut aria-hidden="true" className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1 text-left">Sair da conta</span>
              </span>
            </nav>

            <div className="border-t border-foco-borda px-5 py-4">
              <p className="text-xs leading-relaxed text-slate-600">
                Coleta só metadados de uso. Sem conteúdo digitado nem captura de tela.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** Recado curto do ambiente demonstrativo — o que o sistema faria de verdade. */
function Nota() {
  const { nota } = useFocus();
  if (!nota) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-50 flex justify-center px-6">
      <p className="foco-entra max-w-md rounded-lg border border-foco-borda bg-foco-cartao px-4 py-2.5 text-center text-xs text-slate-300 foco-glow">
        {nota}
      </p>
    </div>
  );
}
