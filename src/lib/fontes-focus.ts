import { Inter, JetBrains_Mono } from "next/font/google";

/**
 * As fontes do painel do Focus.
 *
 * A réplica precisa delas para ser fiel: o painel usa Inter no texto e
 * JetBrains Mono em nome de processo e domínio, que precisam de largura fixa
 * para alinhar em lista. A marca do site continua em Sora — estas duas só
 * valem dentro da réplica, e só são carregadas nas páginas que a mostram.
 */

export const fonteFocus = Inter({
  subsets: ["latin"],
  variable: "--fonte-foco",
  display: "swap",
});

export const fonteFocusMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--fonte-foco-mono",
  display: "swap",
  // Aparece em poucos lugares (versão do agente, hora do diário): não vale
  // disputar a fila de carregamento com a fonte da marca.
  preload: false,
});
