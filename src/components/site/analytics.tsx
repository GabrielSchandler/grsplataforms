import Script from "next/script";
import { siteConfig } from "@/lib/site-config";

/**
 * Medição (GA4). Só entra no HTML quando NEXT_PUBLIC_ANALYTICS_ID está
 * definido — sem a variável, o site não carrega script de terceiro nenhum
 * e não grava cookie.
 *
 * Atenção antes de ligar: cookie de medição não é essencial ao
 * funcionamento do site, então a LGPD pede consentimento do visitante.
 * Este projeto não traz banner de consentimento — se a medição for
 * ativada, esse componente precisa ser construído antes.
 */
export function Analytics() {
  if (!siteConfig.analyticsId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${siteConfig.analyticsId}');
        `}
      </Script>
    </>
  );
}
