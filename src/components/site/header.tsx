"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { hero, nav, trial } from "@/content/site";
import {
  CONTACT_ANCHOR,
  primaryCtaHref,
  siteConfig,
  whatsappLink,
} from "@/lib/site-config";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // `trailingSlash` deixa o caminho como "/comercial/"; a comparação ignora
  // a barra final para o item certo ficar marcado.
  const atual = pathname?.replace(/\/$/, "") || "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ctaHref = primaryCtaHref(hero.whatsappMessage);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-ink-800 bg-ink-950/95 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            GRS
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
            Plataforma
          </span>
        </Link>

        <nav
          aria-label="Páginas do site"
          className="hidden items-center gap-6 lg:flex"
        >
          {nav.links.map((link) => {
            const ativo = link.href === atual;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={ativo ? "page" : undefined}
                className={`relative text-sm font-medium transition-colors ${
                  ativo ? "text-white" : "text-fog-300 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-brand-500 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    ativo ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={ctaHref}
            {...(ctaHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="hidden rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 sm:inline-flex"
          >
            {nav.cta}
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="inline-flex items-center justify-center rounded-lg border border-ink-700 p-2 text-white lg:hidden"
          >
            <span className="sr-only">
              {open ? "Fechar menu" : "Abrir menu"}
            </span>
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="menu-mobile"
          aria-label="Menu"
          className="border-t border-ink-800 bg-ink-950 px-5 py-4 lg:hidden"
        >
          <ul className="space-y-1">
            {nav.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-fog-300 hover:bg-ink-900 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <a
                href={
                  siteConfig.hasWhatsapp || siteConfig.agendaUrl
                    ? ctaHref
                    : CONTACT_ANCHOR
                }
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-brand-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                {nav.cta}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(trial.whatsappMessage)}
                onClick={() => setOpen(false)}
                className="block rounded-lg border border-ink-700 px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                {trial.cta}
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
