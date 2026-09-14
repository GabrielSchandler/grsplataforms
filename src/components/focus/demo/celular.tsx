"use client";

import { useEffect, useState } from "react";
import { ALTURA_CELULAR, LARGURA_CELULAR } from "./casca";
import { PainelFocus } from "./painel-focus";

/**
 * Maquete do painel no celular: a mesma interface que o gestor instala no
 * telefone, dentro de uma moldura de aparelho.
 *
 * Só aparece no computador. Em tela estreita a demonstração principal já é a
 * versão de celular, e repetir a mesma coisa numa moldura seria peso sem
 * ganho — por isso a maquete só é montada quando há espaço para ela.
 */
export function MaqueteCelular() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const consulta = window.matchMedia("(min-width: 1024px)");
    const aoMudar = () => setMostrar(consulta.matches);

    aoMudar();
    consulta.addEventListener("change", aoMudar);
    return () => consulta.removeEventListener("change", aoMudar);
  }, []);

  return (
    <div
      className="relative mx-auto"
      style={{ width: LARGURA_CELULAR + 28, height: ALTURA_CELULAR + 28 }}
    >
      {mostrar ? (
        <div className="absolute inset-0 rounded-[46px] border border-ink-700 bg-ink-950 p-3.5 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          {/* Alto-falante: o detalhe que faz a moldura ser lida como aparelho. */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-5 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-ink-800"
          />
          <div className="h-full overflow-hidden rounded-[34px]">
            <PainelFocus layout="celular" sincronizarUrl={false} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
