import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { footer } from "@/content/site";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="mx-auto w-full max-w-6xl px-5 pb-28 pt-16 sm:px-8 lg:pb-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="measure mt-4 text-[14px] leading-relaxed text-fog-400">
              {footer.description}
            </p>
            {/* Só o e-mail. CNPJ e endereço saíram do rodapé: eles
                identificam a desenvolvedora, e o comprador deste site é do
                mesmo ramo dela. A identificação do controlador dos dados,
                que a LGPD exige, ficou na página de privacidade. */}
            {siteConfig.email ? (
              <div className="mt-5">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block text-[14px] font-medium text-white underline-offset-4 hover:underline"
                >
                  {siteConfig.email}
                </a>
              </div>
            ) : null}
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-fog-500">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-fog-300 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
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
              © {year} {siteConfig.vendorName}
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
