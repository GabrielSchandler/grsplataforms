import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` no navegador, `useEffect` na renderização do servidor.
 *
 * Existe para resolver um conflito específico entre duas coisas que este
 * site quer ao mesmo tempo:
 *
 * 1. Estado que vem da URL (`?passo=14`, `?tela=esteira-juridica`) precisa
 *    valer já na primeira pintura, senão o visitante vê a etapa 1 piscar
 *    antes da etapa que ele pediu.
 * 2. O HTML é gerado no build, sem saber a URL do visitante. Ler
 *    `window.location` durante a renderização faz o cliente desenhar algo
 *    diferente do que o servidor gerou — é hidratação quebrada, o erro
 *    #418 do React, e a página inteira volta a renderizar do zero.
 *
 * `useLayoutEffect` roda depois da hidratação e antes da pintura: o
 * servidor e o cliente desenham a mesma coisa na primeira passada, e a
 * correção pela URL entra sem o olho perceber. `useEffect` no servidor
 * evita o aviso do React durante o build, onde efeito de layout não roda.
 */
export const useAntesDaPintura =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
