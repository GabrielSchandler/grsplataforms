"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { trial } from "@/content/site";
import { whatsappLink } from "@/lib/site-config";

/**
 * Barra fixa de contato no celular. Aparece depois que o visitante passa do
 * hero e some quando a seção de contato entra na tela — deixar as duas
 * chamadas visíveis ao mesmo tempo só cria concorrência entre elas.
 *
 * Some no desktop, onde o cabeçalho fixo já carrega o CTA.
 */
export function MobileCta({ message, rotulo = trial.cta, secoesSemBarra = [] }: {
  message: string;
  rotulo?: string;
  /** Mantém a demonstração e os botões do topo livres de sobreposição. */
  secoesSemBarra?: readonly string[];
}) {
  const [visible, setVisible] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const [secaoVisivel, setSecaoVisivel] = useState(false);
  const chaveSecoes = secoesSemBarra.join(",");

  useEffect(() => {
    if (!chaveSecoes) return;
    const visiveis = new Set<string>();
    const observador = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) visiveis.add(entrada.target.id);
        else visiveis.delete(entrada.target.id);
      }
      setSecaoVisivel(visiveis.size > 0);
    });
    for (const id of chaveSecoes.split(",")) {
      const secao = document.getElementById(id);
      if (secao) observador.observe(secao);
    }
    return () => observador.disconnect();
  }, [chaveSecoes]);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 620);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contato = document.getElementById("demonstracao");
    const observer = contato
      ? new IntersectionObserver(([entry]) => setAtContact(entry.isIntersecting), {
          rootMargin: "-20% 0px",
        })
      : null;

    if (contato && observer) {
      observer.observe(contato);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const href = whatsappLink(message);
  const showing = visible && !atContact && !secaoVisivel;

  return (
    <div
      data-barra-contato
      aria-hidden={!showing}
      // A folga inferior respeita a barra de gestos do aparelho.
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink-800 bg-ink-950/95 px-3 pt-3 backdrop-blur transition-transform duration-300 lg:hidden ${
        showing ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href={href}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        tabIndex={showing ? 0 : -1}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3.5 text-sm font-semibold text-white"
      >
        {rotulo}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </a>
    </div>
  );
}
