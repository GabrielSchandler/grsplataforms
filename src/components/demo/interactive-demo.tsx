"use client";

import { useRef, useState } from "react";
import { DemoNavContext } from "./chrome";
import { demoScreens } from "./registry";
import { navToScreen } from "./screen-map";

/**
 * Demo navegável embutido na página. Roda 100% no cliente, sem backend e
 * sem nenhum dado real — as telas são as mesmas usadas para gerar as
 * imagens estáticas, então não existe versão "de marketing" divergente.
 */
export function InteractiveDemo() {
  const [activeId, setActiveId] = useState(demoScreens[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);

  const active = demoScreens.find((screen) => screen.id === activeId) ?? demoScreens[0];
  const ActiveScreen = active.component;

  function moveFocus(direction: 1 | -1) {
    const index = demoScreens.findIndex((screen) => screen.id === activeId);
    const next = (index + direction + demoScreens.length) % demoScreens.length;
    setActiveId(demoScreens[next].id);
    const buttons = tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']");
    buttons?.[next]?.focus();
  }

  return (
    <div>
      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Telas do sistema"
        className="scroll-x -mx-4 flex gap-1.5 px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            moveFocus(1);
          }

          if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveFocus(-1);
          }
        }}
      >
        {demoScreens.map((screen) => {
          const isActive = screen.id === activeId;

          return (
            <button
              key={screen.id}
              type="button"
              role="tab"
              id={`tab-${screen.id}`}
              aria-selected={isActive}
              aria-controls={`painel-${screen.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(screen.id)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-ink-700 bg-ink-900 text-fog-300 hover:border-fog-600 hover:text-white"
              }`}
            >
              {screen.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-fog-400">{active.caption}</p>

      <div
        role="tabpanel"
        id={`painel-${active.id}`}
        aria-labelledby={`tab-${active.id}`}
        tabIndex={0}
        className="scroll-x mt-4 rounded-lg border border-ink-700 bg-ink-900 p-2"
      >
        <div className="min-w-[1040px] overflow-hidden rounded border border-slate-200">
          <DemoNavContext.Provider
            value={{
              // A barra lateral também navega aqui, e não só nas páginas de
              // área: sidebar clicável em um lugar e morta em outro confunde.
              onSelect: (label) => {
                const destino = navToScreen[label];
                if (destino && demoScreens.some((tela) => tela.id === destino)) {
                  setActiveId(destino);
                }
              },
            }}
          >
            <ActiveScreen />
          </DemoNavContext.Provider>
        </div>
      </div>

      <p className="mt-3 text-xs text-fog-500">
        Ambiente demonstrativo. Nomes, CPFs e telefones são fictícios, e a esteira jurídica
        exibida é um exemplo — cada empresa monta a própria.
      </p>
    </div>
  );
}
