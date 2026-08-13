"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { whatsappLink } from "@/lib/site-config";

/**
 * Barra fixa de contato no celular. Aparece depois que o visitante passa do
 * hero e some quando a seção de contato entra na tela — deixar as duas
 * chamadas visíveis ao mesmo tempo só cria concorrência entre elas.
 *
 * Some no desktop, onde o cabeçalho fixo já carrega o CTA.
 */
export function MobileCta({ message }: { message: string }) {
  const [visible, setVisible] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 620);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contato = document.getElementById("demonstracao");
    const observer = contato
      ? new IntersectionObserver(
          ([entry]) => setAtContact(entry.isIntersecting),
          { rootMargin: "-20% 0px" },
        )
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
  const showing = visible && !atContact;

  return (
    <div
      aria-hidden={!showing}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-ink-800 bg-ink-950/95 p-3 backdrop-blur transition-transform duration-300 lg:hidden ${
        showing ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href={href}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        tabIndex={showing ? 0 : -1}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3.5 text-sm font-semibold text-white"
      >
        Agendar demonstração
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </a>
    </div>
  );
}
