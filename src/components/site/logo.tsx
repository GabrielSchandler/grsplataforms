/**
 * Marca NewSec.
 *
 * O símbolo é um "N" isométrico: duas hastes em paralelogramo e uma fita
 * vermelha na diagonal, com filete claro correndo por dentro. Ele foi
 * redesenhado em vetor a partir da identidade de referência — a marca
 * original nasceu como imagem raster, e imagem raster não escala para o
 * favicon de 32px nem mantém borda limpa em tela de alta densidade.
 *
 * As hastes usam `currentColor` de propósito: sobre fundo escuro a marca é
 * branca, sobre fundo claro é preta, e o vermelho da fita não muda nunca.
 * Assim o mesmo componente serve cabeçalho, rodapé e material impresso sem
 * um segundo arquivo de logo negativo para manter em sincronia.
 */

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <polygon points="6,30 34,14 34,104 6,120" />
        <polygon points="66,16 94,0 94,90 66,106" />
      </g>
      <path
        d="M 20 18 L 80 98"
        stroke="#E31B23"
        strokeWidth="25"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 31 31 L 69 85"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Assinatura completa: símbolo + nome. O descritor ("Sistemas · Sites ·
 * Automação") fica de fora no site — aqui a marca vende um produto só, e
 * repetir as três frentes no cabeçalho desvia do objetivo da página.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 text-white ${className}`}>
      <LogoMark className="h-7 w-auto" />
      <span className="text-lg font-extrabold uppercase tracking-[0.02em]">
        NewSec
      </span>
    </span>
  );
}
