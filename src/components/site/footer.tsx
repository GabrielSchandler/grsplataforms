import Link from "next/link";
import { footer } from "@/content/site";
import { addressLine, siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-semibold tracking-tight text-white">
                GRS
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-300">
                Plataforma
              </span>
            </div>
            <p className="measure mt-4 text-[14px] leading-relaxed text-fog-400">
              {footer.description}
            </p>
            <div className="mt-5 space-y-1.5">
              {siteConfig.email ? (
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block text-[14px] font-medium text-white underline-offset-4 hover:underline"
                >
                  {siteConfig.email}
                </a>
              ) : null}
              {/* Identificação completa publicada de propósito: em serviço de
                  ticket alto, CNPJ e endereço visíveis são sinal de confiança. */}
              <p className="text-[13px] leading-relaxed text-fog-400">{addressLine}</p>
            </div>
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-fog-500">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-[14px] text-fog-300 transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-ink-800 pt-8">
          <p className="measure text-[13px] leading-relaxed text-fog-500">{footer.disclaimer}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-[13px] text-fog-500">
              © {year} {siteConfig.legalName || siteConfig.vendorName}
              {siteConfig.taxId ? ` · CNPJ ${siteConfig.taxId}` : ""}
            </p>
            <Link
              href="/privacidade"
              className="text-[13px] text-fog-400 underline-offset-4 transition hover:text-white hover:underline"
            >
              Política de privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
