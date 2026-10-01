/**
 * Formatação e paleta da réplica do NewSec Focus — sempre em pt-BR.
 *
 * Copiada de `newsecfocus/dashboard/lib/formato.ts` e `lib/cores-expediente.ts`,
 * com uma diferença deliberada: os números agrupados são montados à mão em vez
 * de pelo Intl.NumberFormat. O HTML desta página sai do build, e o ICU do Node
 * pode escrever o separador de um jeito diferente do navegador do visitante.
 * Texto diferente entre servidor e cliente é hidratação quebrada (erro #418 do
 * React), então aqui nada depende da versão do ICU.
 */

export type TipoCategoria = "PRODUCTIVE" | "NEUTRAL" | "UNPRODUCTIVE";

/** "7h 32m", "45m", "3h" — exatamente como o painel escreve. */
export function formatarDuracao(minutos: number): string {
  const total = Math.max(0, Math.round(minutos));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

/** "62%" quando é redondo, "10,8%" quando não é — sem ",0" sobrando. */
export function formatarPorcentagemEnxuta(valor: number | null): string {
  if (valor === null || Number.isNaN(valor)) return "—";
  const arredondado = Math.round(valor * 10) / 10;
  return Number.isInteger(arredondado)
    ? `${arredondado}%`
    : `${arredondado.toFixed(1).replace(".", ",")}%`;
}

export function formatarNumero(valor: number): string {
  const inteiro = Math.round(valor);
  const texto = String(Math.abs(inteiro)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${inteiro < 0 ? "-" : ""}${texto}`;
}

/** "+4,2 p.p." / "−3 p.p." para variação de índice. */
export function formatarPP(valor: number): string {
  const sinal = valor > 0 ? "+" : valor < 0 ? "−" : "";
  return `${sinal}${Math.abs(valor).toFixed(1).replace(".", ",").replace(/,0$/, "")} p.p.`;
}

/** Minuto do dia em "08:05". */
export function hhmm(minuto: number | null): string {
  if (minuto === null) return "—";
  const m = Math.round(minuto);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

// ----------------------------------------------------------------------------
//  Paleta única das fatias do expediente (lib/cores-expediente.ts)
// ----------------------------------------------------------------------------

export type FatiaExpediente =
  | "produtivos"
  | "neutros"
  | "improdutivos"
  | "semClassificar"
  | "ociosos"
  | "bloqueado"
  | "semDados";

export const CORES_EXPEDIENTE: Record<FatiaExpediente, string> = {
  produtivos: "#1f9fb2",
  neutros: "#3d5f8f",
  improdutivos: "#e0676b",
  semClassificar: "#a9c8e4",
  ociosos: "#f2c14e",
  bloqueado: "#a3acb8",
  semDados: "#dde3ea",
};

export const ROTULOS_EXPEDIENTE: Record<FatiaExpediente, string> = {
  produtivos: "Produtivo",
  neutros: "Neutro",
  improdutivos: "Improdutivo",
  semClassificar: "Sem classificação",
  ociosos: "Ocioso",
  bloqueado: "Bloqueado",
  // Expediente sem nenhum registro: máquina desligada, agente parado ou envio
  // atrasado. O banco não distingue os três, então o nome não finge que sabe.
  semDados: "Sem dados",
};

/** Do melhor ao ausente — ordem da barra e da legenda. */
export const ORDEM_EXPEDIENTE: FatiaExpediente[] = [
  "produtivos", "neutros", "improdutivos", "semClassificar", "ociosos", "bloqueado", "semDados",
];

export const CORES_CATEGORIA: Record<TipoCategoria | "SEM", string> = {
  PRODUCTIVE: CORES_EXPEDIENTE.produtivos,
  NEUTRAL: CORES_EXPEDIENTE.neutros,
  UNPRODUCTIVE: CORES_EXPEDIENTE.improdutivos,
  SEM: CORES_EXPEDIENTE.semClassificar,
};

export const ROTULOS_CATEGORIA: Record<TipoCategoria | "SEM", string> = {
  PRODUCTIVE: "Produtivo",
  NEUTRAL: "Neutro",
  UNPRODUCTIVE: "Improdutivo",
  SEM: "Sem classificação",
};

/** Junta classes condicionais. A réplica não precisa de tailwind-merge. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
