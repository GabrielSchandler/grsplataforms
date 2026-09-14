"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { hero, nav, trial } from "@/content/site";
import { focusMensagens, focusNav } from "@/content/focus";
import {
  CONTACT_ANCHOR,
  primaryCtaHref,
  produtos,
  siteConfig,
  whatsappLink,
  type ProdutoId,
} from "@/lib/site-config";

/**
 * Cabeçalho do site, agora com dois produtos.
 *
 * O seletor "CRM · Focus" fica ao lado do logo, com os dois nomes à vista.
 * Com apenas dois produtos, esconder o Focus dentro de um menu suspenso seria
 * esconder justamente o que se quer mostrar — e dois links não custam
 * JavaScript nenhum. O resto do menu muda conforme o produto da página: nas
 * páginas do CRM, as cinco áreas; no Focus, as seções da própria página.
 */

/** Destaca o item do menu conforme a seção que está na tela. */
function useSecaoAtiva(ids: string[]) {
  const chave = ids.join(",");
  const [ativa, setAtiva] = useState<string | null>(null);

  useEffect(() => {
    if (!chave) return;

    const secoes = chave
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((no): no is HTMLElement => no !== null);

    if (secoes.length === 0) return;

    const naFaixa = new Set<string>();

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) naFaixa.add(entrada.target.id);
          else naFaixa.delete(entrada.target.id);
        }

        // Quando nenhuma seção do menu está na faixa central — no topo da
        // página, por exemplo —, ninguém fica marcado. Guardar o último aceso
        // deixaria um item destacado sem relação com o que está na tela.
        const primeira = secoes.find((secao) => naFaixa.has(secao.id));
        setAtiva(primeira?.id ?? null);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.3, 1] },
    );

    for (const secao of secoes) observador.observe(secao);
    return () => observador.disconnect();
  }, [chave]);

  return ativa;
}

function SeletorProduto({ atual, className = "" }: { atual: ProdutoId; className?: string }) {
  return (
    <div
      role="group"
      aria-label="Produtos NewSec"
      className={`flex items-center gap-0.5 rounded-lg border border-ink-800 bg-ink-900/70 p-0.5 ${className}`}
    >
      {produtos.map((produto) => {
        const ativo = produto.id === atual;

        return (
          <Link
            key={produto.id}
            href={produto.href}
            aria-current={ativo ? "true" : undefined}
            title={produto.descricao}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
              ativo ? "bg-ink-800 text-white" : "text-fog-400 hover:text-white"
            }`}
          >
            {produto.curto}
          </Link>
        );
      })}
    </div>
  );
}

export function Header({ produto = "crm" }: { produto?: ProdutoId }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();

  const ehFocus = produto === "focus";
  const links = ehFocus ? focusNav.links : nav.links;

  // `trailingSlash` deixa o caminho como "/comercial/"; a comparação ignora
  // a barra final para o item certo ficar marcado.
  const atual = pathname?.replace(/\/$/, "") || "/";

  const ancoras = useMemo(
    () => (ehFocus ? links.map((link) => link.href.replace("#", "")) : []),
    [ehFocus, links],
  );
  const secaoAtiva = useSecaoAtiva(ancoras);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
      // O hero tem o proprio CTA. Enquanto ele estiver na tela, o botao do
      // cabecalho seria a segunda vez que a mesma frase aparece na mesma
      // vista. Passado o hero, o cabecalho volta a ser a unica acao a vista.
      setPastHero(window.scrollY > 420);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ctaHref = ehFocus
    ? whatsappLink(focusMensagens.teste)
    : primaryCtaHref(hero.whatsappMessage);
  const ctaRotulo = ehFocus ? focusNav.cta : nav.cta;
  const inicio = ehFocus ? "/focus" : "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-ink-800 bg-ink-950/95 backdrop-blur"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link href={inicio} aria-label={`${siteConfig.brandName} — página inicial`}>
            <Logo />
          </Link>
          <SeletorProduto atual={produto} className="hidden lg:flex" />
        </div>

        <nav aria-label="Seções do site" className="hidden items-center gap-6 lg:flex">
          {links.map((link) => {
            const ativo = ehFocus ? link.href === `#${secaoAtiva}` : link.href === atual;

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
          {ehFocus ? (
            <a
              href={siteConfig.painelFocus}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-medium text-fog-300 transition-colors hover:text-white lg:inline-flex"
            >
              {focusNav.entrar}
            </a>
          ) : null}

          <a
            href={ctaHref}
            {...(ctaHref.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            aria-hidden={!pastHero}
            tabIndex={pastHero ? 0 : -1}
            className={`hidden rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:bg-brand-600 sm:inline-flex ${
              pastHero
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            {ctaRotulo}
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="inline-flex items-center justify-center rounded-lg border border-ink-700 p-2 text-white lg:hidden"
          >
            <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
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
          <div className="mb-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-fog-500">
              Produtos
            </p>
            <SeletorProduto atual={produto} />
          </div>

          <ul className="space-y-1 border-t border-ink-800 pt-3">
            {links.map((link) => (
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
                href={siteConfig.hasWhatsapp || siteConfig.agendaUrl ? ctaHref : CONTACT_ANCHOR}
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-brand-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                {ctaRotulo}
              </a>
            </li>
            <li>
              {ehFocus ? (
                <a
                  href={siteConfig.painelFocus}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg border border-ink-700 px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Entrar no painel
                </a>
              ) : (
                <a
                  href={whatsappLink(trial.whatsappMessage)}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg border border-ink-700 px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  {trial.cta}
                </a>
              )}
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
