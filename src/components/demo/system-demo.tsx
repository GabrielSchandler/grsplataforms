"use client";

import { useState } from "react";
import { Compass, Route } from "lucide-react";
import { GuidedTour } from "./guided-tour";
import { InteractiveDemo } from "./interactive-demo";

/**
 * Os dois jeitos de conhecer o sistema na home.
 *
 * O tour vem primeiro por padrão: quem chega frio não sabe o que procurar, e
 * um roteiro converte melhor que uma tela em branco esperando um clique. Quem
 * quiser bisbilhotar troca para a exploração livre.
 */
export function SystemDemo() {
  const [modo, setModo] = useState<"tour" | "livre">("tour");

  const modos = [
    { id: "tour" as const, label: "Tour guiado", icone: Route },
    { id: "livre" as const, label: "Exploração livre", icone: Compass },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Modo de demonstração" className="flex flex-wrap gap-1.5">
        {modos.map((item) => {
          const ativo = modo === item.id;
          const Icone = item.icone;

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={ativo}
              onClick={() => setModo(item.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                ativo
                  ? "border-brand-500 bg-brand-500 text-white"
                  : "border-ink-700 bg-ink-900 text-fog-300 hover:border-fog-600 hover:text-white"
              }`}
            >
              <Icone aria-hidden="true" className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">{modo === "tour" ? <GuidedTour /> : <InteractiveDemo />}</div>
    </div>
  );
}
